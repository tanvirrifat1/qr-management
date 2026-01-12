import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Product } from '../product/product.model';
import { IOrder } from './order.interface';
import { Order } from './order.model';
import { sendNotifications } from '../../../helpers/notificationHelper';
import { User } from '../user/user.model';
import { generateOrderId } from './order.constant';
import { Types } from 'mongoose';

// const createOrder = async (payload: IOrder) => {
//   // Fetch all product IDs
//   const productIds = payload.items.map(i => i.productId);

//   // Fetch product details
//   const products = await Product.find({ _id: { $in: productIds } }).select(
//     'title userId'
//   );

//   if (products.length !== productIds.length) {
//     throw new ApiError(
//       StatusCodes.BAD_REQUEST,
//       'One or more products not found'
//     );
//   }

//   // Fetch user info
//   const user = await User.findById(payload.userId).select('firstName lastName');
//   if (!user) {
//     throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
//   }

//   const createdOrders = [];

//   // LOOP THROUGH ALL ITEMS AND CREATE INDIVIDUAL ORDERS
//   for (const singleItem of payload.items) {
//     const orderProduct = products.find(
//       p => p._id.toString() === singleItem.productId
//     );

//     if (!orderProduct) continue;

//     const orderData = {
//       userId: payload.userId,
//       items: [singleItem], // only one item
//       orderId: generateOrderId(),

//       // Common data
//       deliveryStatus: payload.deliveryStatus,
//       paymentStatus: payload.paymentStatus,
//       firstName: user.firstName,
//       lastName: user.lastName,
//       streetName: payload.streetName,
//       area: payload.area,
//       city: payload.city,
//       zip: payload.zip,
//       state: payload.state,
//       country: payload.country,
//       billingAddress: payload.billingAddress,
//     };

//     // Create order
//     const order = await Order.create(orderData);
//     createdOrders.push(order);

//     // Send notification
//     await sendNotifications({
//       text: `Product ${orderProduct.title} has been ordered`,
//       receiver: orderProduct.userId,
//     });
//   }

//   return createdOrders; // returns all created order documents
// };

const createOrder = async (payload: any) => {
  const productIds = payload.items.map((i: any) => i.productId);

  const products = await Product.find({
    _id: { $in: productIds },
  }).select('title userId');

  if (products.length !== productIds.length) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'One or more products not found'
    );
  }

  const user = await User.findById(payload.userId).select('firstName lastName');

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const createdOrders = [];

  for (const item of payload.items) {
    const product = products.find(p => p._id.toString() === item.productId);

    if (!product) continue;

    const orderData = {
      userId: payload.userId,
      size: item.size,
      color: item.color,

      // 🔥 Item specific
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      sellerId: item.sellerId,

      // 🔥 Common fields
      orderId: generateOrderId(),
      paymentStatus: payload.paymentStatus || 'pending',
      deliveryStatus: payload.deliveryStatus || 'placed',

      firstName: user.firstName,
      lastName: user.lastName,
      streetName: payload.streetName,
      area: payload.area,
      city: payload.city,
      zip: payload.zip,
      state: payload.state,
      country: payload.country,
      billingAddress: payload.billingAddress,
    };

    const order = await Order.create(orderData);
    createdOrders.push(order);

    await sendNotifications({
      text: `Product ${product.title} has been ordered`,
      receiver: product.userId,
    });
  }

  return createdOrders;
};

// const getAllOrderforBuyer = async (
//   userId: string,
//   query: Record<string, unknown>
// ) => {
//   const {
//     searchTerm,
//     period,
//     startDate,
//     endDate,
//     page = '1',
//     limit = '10',
//     ...filters
//   } = query;

//   const conditions: any[] = [{ userId }];

//   // Search term
//   if (searchTerm) {
//     conditions.push({
//       $or: [
//         { paymentStatus: { $regex: searchTerm as string, $options: 'i' } },
//         { deliveryStatus: { $regex: searchTerm as string, $options: 'i' } },
//       ],
//     });
//   }

//   // ⭐ DATE FILTER LOGIC ⭐
//   if (period) {
//     const now = new Date();
//     let fromDate = new Date();

//     if (period === '3m') {
//       fromDate.setMonth(now.getMonth() - 3);
//     } else if (period === '6m') {
//       fromDate.setMonth(now.getMonth() - 6);
//     } else if (period === '1y') {
//       fromDate.setFullYear(now.getFullYear() - 1);
//     }

//     conditions.push({
//       createdAt: { $gte: fromDate, $lte: now },
//     });
//   }

//   // Custom date filtering
//   if (startDate || endDate) {
//     conditions.push({
//       createdAt: {
//         ...(startDate ? { $gte: new Date(startDate as string) } : {}),
//         ...(endDate ? { $lte: new Date(endDate as string) } : {}),
//       },
//     });
//   }

//   // Additional filters
//   if (Object.keys(filters).length) {
//     conditions.push({
//       $and: Object.entries(filters).map(([key, value]) => ({ [key]: value })),
//     });
//   }

//   const where = conditions.length ? { $and: conditions } : {};

//   // Pagination
//   const pageNumber = parseInt(page as string, 10);
//   const pageSize = parseInt(limit as string, 10);
//   const skip = (pageNumber - 1) * pageSize;

//   const [order, total] = await Promise.all([
//     Order.find(where)
//       // .populate({
//       //   path: 'items.productId',
//       //   model: 'Product',
//       //   select: 'title image brand',
//       // })
//       .populate('items.productId')
//       .populate({
//         path: 'userId',
//         select: 'fistName lastName email image',
//       })
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(pageSize)
//       .lean(),
//     Order.countDocuments(where),
//   ]);

//   return {
//     result: order,
//     meta: {
//       page: pageNumber,
//       total,
//     },
//   };
// };

const getAllOrderforBuyer = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const {
    searchTerm,
    period,
    startDate,
    endDate,
    page = '1',
    limit = '10',
    ...filters
  } = query;

  const conditions: any[] = [{ userId }];

  // Search term
  if (searchTerm) {
    conditions.push({
      $or: [
        { paymentStatus: { $regex: searchTerm as string, $options: 'i' } },
        { deliveryStatus: { $regex: searchTerm as string, $options: 'i' } },
      ],
    });
  }

  // ⭐ DATE FILTER LOGIC ⭐
  if (period) {
    const now = new Date();
    let fromDate = new Date();

    if (period === '3m') {
      fromDate.setMonth(now.getMonth() - 3);
    } else if (period === '6m') {
      fromDate.setMonth(now.getMonth() - 6);
    } else if (period === '1y') {
      fromDate.setFullYear(now.getFullYear() - 1);
    }

    conditions.push({
      createdAt: { $gte: fromDate, $lte: now },
    });
  }

  // Custom date filtering
  if (startDate || endDate) {
    conditions.push({
      createdAt: {
        ...(startDate ? { $gte: new Date(startDate as string) } : {}),
        ...(endDate ? { $lte: new Date(endDate as string) } : {}),
      },
    });
  }

  // Additional filters
  if (Object.keys(filters).length) {
    conditions.push({
      $and: Object.entries(filters).map(([key, value]) => ({ [key]: value })),
    });
  }

  const where = conditions.length ? { $and: conditions } : {};

  // Pagination
  const pageNumber = parseInt(page as string, 10);
  const pageSize = parseInt(limit as string, 10);
  const skip = (pageNumber - 1) * pageSize;

  const [order, total] = await Promise.all([
    Order.find(where)
      // .populate({
      //   path: 'items.productId',
      //   model: 'Product',
      //   select: 'title image brand',
      // })
      .populate('productId')
      .populate({
        path: 'userId',
        select: 'fistName lastName email image',
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),
    Order.countDocuments(where),
  ]);

  return {
    result: order,
    meta: {
      page: pageNumber,
      total,
    },
  };
};

const getOrderBySeller = async (
  sellerId: string,
  query: Record<string, unknown>
) => {
  const { searchTerm, page = '1', limit = '10', ...filters } = query;

  const conditions: any[] = [
    { sellerId }, // ✅ Filter by sellerId inside items[]
    // { 'items.sellerId': sellerId }, // ✅ Filter by sellerId inside items[]
  ];

  // Search term condition
  if (searchTerm) {
    conditions.push({
      $or: [
        { paymentStatus: { $regex: searchTerm as string, $options: 'i' } },
        { deliveryStatus: { $regex: searchTerm as string, $options: 'i' } },
        { orderId: { $regex: searchTerm as string, $options: 'i' } },
      ],
    });
  }

  // Additional filters
  if (Object.keys(filters).length) {
    conditions.push({
      $and: Object.entries(filters).map(([key, value]) => ({ [key]: value })),
    });
  }

  const where = { $and: conditions };

  // Pagination
  const pageNumber = parseInt(page as string, 10);
  const pageSize = parseInt(limit as string, 10);
  const skip = (pageNumber - 1) * pageSize;

  // Fetch orders with populate
  const [order, total] = await Promise.all([
    Order.find(where)
      .populate({
        // path: 'items.productId',
        path: 'productId',
        model: 'Product',
        select: 'title image brand',
      })
      .populate({
        path: 'userId',
        select: 'firstName lastName email image',
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),

    Order.countDocuments(where),
  ]);

  return {
    result: order,
    meta: {
      page: pageNumber,
      total,
    },
  };
};

const getSingleOrder = async (orderId: string) => {
  const isExist = await Order.findById(orderId);
  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Order not found');
  }

  const result = await Order.findById(orderId);
  return result;
};

export const OrderService = {
  createOrder,
  getAllOrderforBuyer,
  getOrderBySeller,
  getSingleOrder,
};
