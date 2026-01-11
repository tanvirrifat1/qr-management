import Stripe from 'stripe';
import { stripe } from './stripe';
import { Types } from 'mongoose';
import { User } from '../app/modules/user/user.model';
import ApiError from '../errors/ApiError';
import { StatusCodes } from 'http-status-codes';
import { Subscription } from '../app/modules/subscription/subscription.model';
import { sendNotifications } from '../helpers/notificationHelper';
import { BecameASeller } from '../app/modules/becameASeller/becameASeller.model';

// const handleCheckoutSessionCompleted = async (
//   session: Stripe.Checkout.Session
// ) => {
//   const { amount_total, metadata, payment_intent, payment_status } = session;

//   if (payment_status !== 'paid') {
//     throw new ApiError(StatusCodes.BAD_REQUEST, 'Payment failed');
//   }

//   const userId = metadata?.userId as string;
//   const packageId = metadata?.packageId as string;
//   const products = JSON.parse(metadata?.products || '[]');
//   const email = session.customer_email || '';
//   const amountTotal = (amount_total ?? 0) / 100;
//   const subscription = await stripe.subscriptions.retrieve(
//     session.subscription as string
//   );

//   const startDate = new Date(subscription.start_date * 1000);
//   const endDate = new Date(subscription.current_period_end * 1000);
//   const interval = subscription.items.data[0]?.plan?.interval as string;
//   const status = payment_status === 'paid' ? 'Completed' : 'Pending';

//   const existingSubscription: any = await Subscription.findOne({
//     userId: userId,
//   });

//   const becomeASeller = session.metadata?.becomeASellerId as string;

//   if (session.payment_status === 'paid' && becomeASeller) {
//     await BecameASeller.findByIdAndUpdate(becomeASeller, {
//       $set: {
//         isPayment: true,
//       },
//     });
//   }

//   if (existingSubscription) {
//     existingSubscription.amount = amountTotal;
//     existingSubscription.package = new Types.ObjectId(packageId);
//     existingSubscription.products = products;
//     existingSubscription.email = email;
//     existingSubscription.transactionId = payment_intent;
//     existingSubscription.startDate = startDate;
//     existingSubscription.endDate = endDate;
//     existingSubscription.status = status;
//     existingSubscription.subscriptionId = session.subscription;
//     existingSubscription.stripeCustomerId = session.customer as string;
//     existingSubscription.time = interval;

//     await existingSubscription.save();
//   } else {
//     const paymentRecord = new Subscription({
//       amount: amountTotal,
//       userId: new Types.ObjectId(userId),
//       packageId: new Types.ObjectId(packageId),
//       email,
//       transactionId: payment_intent,
//       startDate,
//       endDate,
//       status,
//       subscriptionId: session.subscription,
//       stripeCustomerId: session.customer as string,
//       time: interval,
//     });

//     await paymentRecord.save();
//   }
// };

const handleCheckoutSessionCompleted = async (
  session: Stripe.Checkout.Session
) => {
  try {
    const {
      amount_total,
      metadata,
      payment_intent,
      payment_status,
      subscription: subscriptionId,
    } = session;

    // ----- Validate Payment -----
    if (payment_status !== 'paid') {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Payment failed');
    }

    // ----- Extract Metadata -----
    const userId = metadata?.userId;
    const packageId = metadata?.packageId;
    const becomeASellerId = metadata?.becomeASellerId;
    const products = JSON.parse(metadata?.products || '[]');

    const email = session.customer_email || '';
    const amountTotal = (amount_total ?? 0) / 100;

    // ----- Retrieve Subscription from Stripe -----
    const stripeSub = await stripe.subscriptions.retrieve(
      subscriptionId as string
    );
    const startDate = new Date(stripeSub.start_date * 1000);
    const endDate = new Date(stripeSub.current_period_end * 1000);
    const interval = stripeSub.items.data[0]?.plan?.interval;
    const status = 'Completed';

    // ----- If "Become A Seller" Payment -----
    if (becomeASellerId) {
      await BecameASeller.findByIdAndUpdate(becomeASellerId, {
        $set: { isPayment: true },
      });
    }

    // ----- Prepare Common Payload -----
    const payload = {
      amount: amountTotal,
      packageId: new Types.ObjectId(packageId),
      products,
      email,
      transactionId: payment_intent,
      startDate,
      endDate,
      status,
      subscriptionId,
      stripeCustomerId: session.customer as string,
      time: interval,
    };

    // ----- Check Existing Subscription -----
    const existing = await Subscription.findOne({ userId });

    if (existing) {
      Object.assign(existing, payload);
      await existing.save();
      return existing;
    }

    // ----- Create New Subscription -----
    const newSubscription = new Subscription({
      ...payload,
      userId: new Types.ObjectId(userId),
    });

    await newSubscription.save();
    return newSubscription;
  } catch (error) {
    console.log(error);
  }
};

const handleInvoicePaymentSucceeded = async (invoice: Stripe.Invoice) => {
  const subscription = await Subscription.findOne({
    subscriptionId: invoice.subscription,
  });

  if (subscription) {
    subscription.status = 'Completed';
    await subscription.save();
  }

  const user = await User.findById(subscription?.userId);
  await User.findByIdAndUpdate(user?._id, {
    $set: { subscription: true },
  });

  if (user) {
    const result = await User.findById(user._id);
    const data = {
      text: `Payment received for user, ${result?.firstName} `,
      type: 'ADMIN',
    };

    await sendNotifications(data);
  }
};

const handleInvoicePaymentFailed = async (invoice: Stripe.Invoice) => {
  const subscription = await Subscription.findOne({
    subscriptionId: invoice.subscription,
  });

  if (subscription) {
    subscription.status = 'expired';
    await subscription.save();
  }

  const user = await User.findById(subscription?.userId);
  if (user) {
    await User.findByIdAndUpdate(user._id, {
      $set: { subscription: false },
    });
  }
};

const handleAsyncPaymentFailed = async (session: Stripe.Checkout.Session) => {
  const payment = await Subscription.findOne({
    stripeCustomerId: session.customer as string,
  });
  if (payment) {
    payment.status = 'Failed';
    await payment.save();
  }
};

const handleSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
  const existingSubscription = await Subscription.findOne({
    subscriptionId: subscription.id,
  });

  if (existingSubscription) {
    existingSubscription.status = 'expired';
    await existingSubscription.save();

    const user = await User.findById(existingSubscription.userId);
    if (user) {
      await User.findByIdAndUpdate(user._id, {
        $set: { subscription: false },
      });
    }
  }
};

export const WebhookService = {
  handleCheckoutSessionCompleted,
  handleInvoicePaymentSucceeded,
  handleInvoicePaymentFailed,
  handleAsyncPaymentFailed,
  handleSubscriptionDeleted,
};
