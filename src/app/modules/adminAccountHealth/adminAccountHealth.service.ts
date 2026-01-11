import { USER_ROLES } from '../../../enums/user';
import { BecameASeller } from '../becameASeller/becameASeller.model';
import { Order } from '../order/order.model';
import { Payment } from '../payment/payment.model';
import { Product } from '../product/product.model';
import { User } from '../user/user.model';

const dashboardInstance = async () => {
  const [totalUser, totalSeller, totalPendingUser, totalRevenue] =
    await Promise.all([
      User.countDocuments({
        role: { $in: [USER_ROLES.BUYER] },
      }),

      User.countDocuments({
        role: { $in: [USER_ROLES.SELLER] }, // assuming seller role
      }),

      BecameASeller.countDocuments({ status: 'pending' }),

      Payment.aggregate([
        {
          $match: {
            status: 'completed', //
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
          },
        },
      ]),
    ]);

  return {
    totalUser,
    totalSeller,
    totalPendingUser,
    totalRevenue: totalRevenue[0]?.totalAmount || 0, // ✅ safe return
  };
};

const sellerPerformance = async () => {
  try {
    const orders = await Order.find({ paymentStatus: 'paid' }).populate({
      path: 'sellerId',
      select: 'firstName lastName image',
    });

    const sellerMap = new Map<string, any>();

    orders.forEach((order: any) => {
      const sellerId = order.sellerId._id.toString();
      const amount = order.price;

      if (sellerMap.has(sellerId)) {
        const seller = sellerMap.get(sellerId);
        seller.totalAmount += amount;
        seller.totalOrders += 1;
      } else {
        sellerMap.set(sellerId, {
          sellerId,
          totalAmount: amount,
          totalOrders: 1,
          firstName: order.sellerId.firstName,
          lastName: order.sellerId.lastName,
          image: order.sellerId.image,
        });
      }
    });

    const result = Array.from(sellerMap.values()).map(seller => {
      const avgPrice = seller.totalAmount / seller.totalOrders;

      let rating = 1;

      if (seller.totalOrders >= 10 && avgPrice >= 50) rating = 5;
      else if (seller.totalOrders >= 7 && avgPrice >= 40) rating = 4;
      else if (seller.totalOrders >= 5 && avgPrice >= 30) rating = 3;
      else if (seller.totalOrders >= 3 && avgPrice >= 20) rating = 2;

      return {
        ...seller,
        rating,
      };
    });

    result.sort((a, b) => b.rating - a.rating || b.totalAmount - a.totalAmount);

    return result;
  } catch (error) {
    console.error(error);
  }
};

const getAllRevenue = async () => {
  const revenue = await Payment.aggregate([
    // 1️⃣ Only completed transactions
    { $match: { status: 'completed' } },

    // 2️⃣ Group by year + month
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        amount: { $sum: '$amount' },
      },
    },

    // 3️⃣ Format month name
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: {
          $arrayElemAt: [
            [
              '',
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ],
            '$_id.month',
          ],
        },
        amount: 1,
      },
    },

    // 4️⃣ Sort
    { $sort: { year: 1, month: 1 } },

    // 5️⃣ Create single totalAmount
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        data: { $push: '$$ROOT' },
      },
    },

    // 6️⃣ Final shape
    {
      $project: {
        _id: 0,
        totalAmount: 1,
        data: 1,
      },
    },
  ]);

  return revenue[0] || { totalAmount: 0, data: [] };
};

const getAllProductInventory = async (
  query: Record<string, unknown>,
  userId: string
) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {
    inStock: true,
    userId,
  };

  const result = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(filter);

  return {
    data: result,
    meta: {
      page,
      limit,
      total,
    },
  };
};

const getAllSellerReqData = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const result = await BecameASeller.find({ status: 'pending' })
    .populate({
      path: 'userId',
      model: 'User',
      select: 'name email image role',
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await BecameASeller.countDocuments({ status: 'pending' });

  return {
    data: result,
    meta: {
      page,
      limit,
      total,
    },
  };
};

export const AdminAccountHealthService = {
  dashboardInstance,
  sellerPerformance,
  getAllRevenue,
  getAllProductInventory,
  getAllSellerReqData,
};
