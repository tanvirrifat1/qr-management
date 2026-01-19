import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Order } from '../order/order.model';
import { stripe } from '../../../shared/stripe';
import { IPayment } from './payment.interface';
import Stripe from 'stripe';
import { Payment } from './payment.model';
import { Types } from 'mongoose';
import { sendNotifications } from '../../../helpers/notificationHelper';
import { Wallet } from '../wallet/wallet.model';
import { SellerWallet } from '../sellerWallet/sellerWallet.model';

const createCheckoutSessionService = async (payload: IPayment) => {
  const orders = await Order.find({
    _id: { $in: payload.orderId },
  });

  if (!orders.length) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Orders not found');
  }

  const lineItems = orders.map(order => {
    const totalPrice = order.price;

    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: `Order ID #${order.orderId}`,
        },
        unit_amount: totalPrice * 100,
      },
      quantity: 1,
    };
  });

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: 'payment',
    customer_email: payload.email,
    success_url: 'https://holybot.ai/paymentsuccess',
    cancel_url: 'https://holybot.ai/paymentFail',
    metadata: {
      userId: payload.userId.toString(),
      orderIds: JSON.stringify(orders.map(o => o._id)),
      sellerId: JSON.stringify(orders.map(o => o.sellerId)),
      type: 'payment',
    },
  });

  return session.url;
};

const handleStripeWebhookService = async (event: Stripe.Event) => {
  switch (event.type) {
    case 'checkout.session.async_payment_failed': {
      const session = event.data.object as Stripe.Checkout.Session;

      await Payment.findOneAndUpdate(
        { transactionId: session.payment_intent },
        { status: 'failed' },
      );

      break;
    }

    default:
      console.log(`Unhandled payment event: ${event.type}`);
  }
};

export const handlePaymentSuccess = async (event: Stripe.Event) => {
  try {
    const session = event.data.object as Stripe.Checkout.Session;

    // 🔐 Only handle one-time payments
    if (session.mode !== 'payment') return;

    const metadata = session.metadata;

    if (!metadata?.userId || !metadata?.orderIds) {
      throw new Error('Missing required metadata');
    }

    const userId = metadata.userId;
    const orderIds: string[] = JSON.parse(metadata.orderIds);

    const amountTotal = (session.amount_total ?? 0) / 100;
    const email = session.customer_email || '';
    const transactionId = session.payment_intent as string;

    // 🛑 Idempotency check
    const existingPayment = await Payment.findOne({ transactionId });
    if (existingPayment) return;

    // 1️⃣ Fetch orders with seller & price
    const orders = await Order.find({
      _id: { $in: orderIds },
    }).select('price sellerId');

    if (!orders.length) {
      throw new Error('Orders not found');
    }

    // 2️⃣ Group amount per seller
    const sellerAmountMap: Record<string, number> = {};

    for (const order of orders) {
      const seller = order.sellerId.toString();

      if (!sellerAmountMap[seller]) {
        sellerAmountMap[seller] = 0;
      }

      sellerAmountMap[seller] += order.price;
    }

    // 3️⃣ Save payment record
    const payment = new Payment({
      amount: amountTotal,
      userId: new Types.ObjectId(userId),
      orderId: orderIds.map(id => new Types.ObjectId(id)),
      sellerId: Object.keys(sellerAmountMap).map(id => new Types.ObjectId(id)),
      email,
      transactionId,
      status: 'completed',
    });

    await payment.save();

    if (payment.status === 'completed') {
      const orders = await Order.find({
        _id: { $in: payment.orderId },
      }).select('sellerId price');

      const PLATFORM_FEE = 0.15; // 15%

      const sellerWalletData = orders.map(order => {
        const netAmount = Number((order.price * (1 - PLATFORM_FEE)).toFixed(2));

        return {
          sellerId: order.sellerId,
          paymentId: payment._id,
          amount: netAmount,
        };
      });

      await SellerWallet.insertMany(sellerWalletData);
    }

    // 4️⃣ Update wallet seller-wise
    // for (const sellerId in sellerAmountMap) {
    //   const sellerAmount = sellerAmountMap[sellerId];

    //   await Wallet.findOneAndUpdate(
    //     { userId: sellerId },
    //     { $inc: { balance: sellerAmount } },
    //     {
    //       new: true,
    //       upsert: true,
    //       setDefaultsOnInsert: true,
    //     }
    //   );

    //   await sendNotifications({
    //     receiver: sellerId,
    //     text: `Payment received: $${sellerAmount}`,
    //   });
    // }

    for (const sellerId in sellerAmountMap) {
      const grossAmount = sellerAmountMap[sellerId];

      // ✂️ 15% platform fee
      const platformFee = (grossAmount * 15) / 100;
      const netAmount = grossAmount - platformFee;

      await Wallet.findOneAndUpdate(
        { userId: sellerId },
        { $inc: { balance: netAmount } },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      );

      await sendNotifications({
        receiver: sellerId,
        text: `Payment received: $${netAmount} (15% platform fee deducted)`,
      });
    }

    // 5️⃣ Mark orders as paid
    await Order.updateMany(
      { _id: { $in: orderIds } },
      {
        $set: {
          paymentStatus: 'paid',
        },
      },
    );
  } catch (error) {
    console.log(error);
  }
};

/////////////////

// const handleStripeWebhookService = async (event: Stripe.Event) => {
//   switch (event.type) {
//     case 'checkout.session.completed': {
//       const session = event.data.object as Stripe.Checkout.Session;

//       // 🔐 Only handle one-time payments
//       if (session.mode !== 'payment') return;

//       const metadata = session.metadata;

//       if (!metadata?.userId || !metadata?.orderIds) {
//         throw new Error('Missing required metadata');
//       }

//       const userId = metadata.userId;
//       const orderIds: string[] = JSON.parse(metadata.orderIds);

//       const amountTotal = (session.amount_total ?? 0) / 100;
//       const email = session.customer_email || '';
//       const transactionId = session.payment_intent as string;

//       // 🛑 Idempotency check
//       const existingPayment = await Payment.findOne({ transactionId });
//       if (existingPayment) return;

//       // 1️⃣ Fetch orders with seller & price
//       const orders = await Order.find({
//         _id: { $in: orderIds },
//       }).select('price sellerId');

//       if (!orders.length) {
//         throw new Error('Orders not found');
//       }

//       // 2️⃣ Group amount per seller
//       const sellerAmountMap: Record<string, number> = {};

//       for (const order of orders) {
//         const seller = order.sellerId.toString();

//         if (!sellerAmountMap[seller]) {
//           sellerAmountMap[seller] = 0;
//         }

//         sellerAmountMap[seller] += order.price;
//       }

//       // 3️⃣ Save payment record
//       const payment = new Payment({
//         amount: amountTotal,
//         userId: new Types.ObjectId(userId),
//         orderId: orderIds.map(id => new Types.ObjectId(id)),
//         sellerId: Object.keys(sellerAmountMap).map(
//           id => new Types.ObjectId(id)
//         ),
//         email,
//         transactionId,
//         status: 'completed',
//       });

//       await payment.save();

//       // 4️⃣ Update wallet seller-wise
//       for (const sellerId in sellerAmountMap) {
//         const sellerAmount = sellerAmountMap[sellerId];

//         await Wallet.findOneAndUpdate(
//           { userId: sellerId },
//           { $inc: { balance: sellerAmount } },
//           {
//             new: true,
//             upsert: true,
//             setDefaultsOnInsert: true,
//           }
//         );

//         await sendNotifications({
//           receiver: sellerId,
//           text: `Payment received: $${sellerAmount}`,
//         });
//       }

//       // 5️⃣ Mark orders as paid
//       await Order.updateMany(
//         { _id: { $in: orderIds } },
//         {
//           $set: {
//             paymentStatus: 'paid',
//           },
//         }
//       );

//       break;
//     }

//     case 'checkout.session.async_payment_failed': {
//       const session = event.data.object as Stripe.Checkout.Session;

//       if (session.payment_intent) {
//         await Payment.findOneAndUpdate(
//           { transactionId: session.payment_intent },
//           { status: 'failed' }
//         );
//       }

//       break;
//     }

//     default:
//       console.log(`Unhandled Stripe event: ${event.type}`);
//   }
// };

export const PaymentService = {
  createCheckoutSessionService,
  handleStripeWebhookService,
};

// export const handlePaymentSuccess = async (event: Stripe.Event) => {
//   try {
//     const session = event.data.object as Stripe.Checkout.Session;

//     // 🔐 ONLY handle one-time payments
//     if (session.mode !== 'payment') return;

//     const metadata = session.metadata;

//     if (!metadata?.userId) {
//       throw new Error('Missing userId in metadata');
//     }

//     const userId = metadata.userId;
//     const orderIds: string[] = metadata.orderIds
//       ? JSON.parse(metadata.orderIds)
//       : [];

//     const sellerId: string[] = metadata.sellerId
//       ? JSON.parse(metadata.sellerId)
//       : [];

//     const amountTotal = (session.amount_total ?? 0) / 100;
//     const email = session.customer_email || '';

//     // 🛑 Idempotency check (VERY IMPORTANT)
//     const existingPayment = await Payment.findOne({
//       transactionId: session.payment_intent,
//     });

//     if (existingPayment) return;

//     const payment = new Payment({
//       amount: amountTotal,
//       userId: new Types.ObjectId(userId),
//       orderId: orderIds.map(o => new Types.ObjectId(o)),
//       sellerId: sellerId.map(o => new Types.ObjectId(o)),
//       email,
//       transactionId: session.payment_intent,
//       status: 'completed',
//     });

//     await payment.save();

//     for (const seller of sellerId) {
//       await sendNotifications({
//         text: `Payment received for seller, ${seller}`,
//         receiver: seller,
//       });

//       await Wallet.findOneAndUpdate(
//         { userId: seller }, // find by userId
//         { $inc: { balance: amountTotal } }, // add balance
//         {
//           new: true,
//           upsert: true, // 👉 create if not exists
//           setDefaultsOnInsert: true, // apply schema defaults
//         }
//       );
//     }

//     if (orderIds.length) {
//       // ✅ Mark orders as paid
//       await Order.updateMany(
//         { _id: { $in: orderIds } },
//         {
//           $set: {
//             paymentStatus: 'paid',
//           },
//         }
//       );
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };
