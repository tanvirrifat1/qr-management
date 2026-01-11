import { Types } from 'mongoose';
import { Message } from '../message/message.model';
import { Order } from '../order/order.model';
import { Review } from '../review/review.model';
import { Payment } from '../payment/payment.model';
import { SellerWallet } from '../sellerWallet/sellerWallet.model';

const accountMsgResponse = async (userId: string) => {
  const userObjectId = new Types.ObjectId(userId);

  // 1. Get all messages sent by the user
  const userMessages = await Message.find({ senderId: userObjectId }).lean();

  if (userMessages.length === 0)
    return { totalMessages: 0, repliedMessages: 0, responseRate: 0 };

  // 2. Count messages that got a reply (any message in the same inbox not from the user)
  let repliedCount = 0;

  for (const msg of userMessages) {
    const reply = await Message.findOne({
      inboxId: msg.inboxId,
      senderId: { $ne: userObjectId },
      createdAt: { $gt: (msg as any).createdAt }, // reply comes after the original message
    }).lean();

    if (reply) repliedCount++;
  }

  // 3. Calculate response rate
  const responseRate = (repliedCount / userMessages.length) * 100;

  return {
    totalMessages: userMessages.length,
    repliedMessages: repliedCount,
    responseRate: Number(responseRate.toFixed(2)), // e.g., 75.00%
  };
};

const onTimeDeliveryRatio = async (sellerId: string) => {
  const objectId = new Types.ObjectId(sellerId);

  // Expected delivery time in days
  const EXPECTED_DAYS = 3;
  const EXPECTED_MS = EXPECTED_DAYS * 24 * 60 * 60 * 1000;

  const result = await Order.aggregate([
    {
      $match: {
        sellerId: objectId,
        deliveryStatus: 'delivered',
      },
    },
    {
      $project: {
        deliveryTimeMs: { $subtract: ['$updatedAt', '$createdAt'] },
      },
    },
    {
      $project: {
        deliveryScore: {
          $cond: [
            { $lte: ['$deliveryTimeMs', EXPECTED_MS] },
            100, // on-time
            { $multiply: [{ $divide: [EXPECTED_MS, '$deliveryTimeMs'] }, 100] }, // late
          ],
        },
      },
    },
    {
      $group: {
        _id: null,
        deliveryRatio: { $avg: '$deliveryScore' }, // average across all orders
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  if (!result.length) return { deliveryRatio: 0, totalOrders: 0 };

  return {
    deliveryRatio: Number(result[0].deliveryRatio.toFixed(2)), // %
    totalOrders: result[0].totalOrders,
  };
};

const getAllReviewAndRatingRatio = async (sellerId: string) => {
  const objectId = new Types.ObjectId(sellerId);

  const result = await Review.aggregate([
    {
      $match: {
        sellerId: objectId,
      },
    },
    {
      $group: {
        _id: null,
        totalReviews: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
    {
      $project: {
        _id: 0,
        totalReviews: 1,
        averageRating: { $round: ['$averageRating', 2] },
        ratingRatio: {
          $round: [{ $multiply: [{ $divide: ['$averageRating', 5] }, 100] }, 2],
        },
      },
    },
  ]);

  if (!result.length) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingRatio: 0,
    };
  }

  return result[0];
};

const getAccountHealthRatio = async (sellerId: string) => {
  // Run all calculations in parallel (FAST)
  const [msgResponse, delivery, rating] = await Promise.all([
    accountMsgResponse(sellerId),
    onTimeDeliveryRatio(sellerId),
    getAllReviewAndRatingRatio(sellerId),
  ]);

  // Weights
  const MESSAGE_WEIGHT = 0.3;
  const DELIVERY_WEIGHT = 0.4;
  const RATING_WEIGHT = 0.3;

  // Safe fallback if no data exists
  const messageScore = msgResponse.responseRate || 0;
  const deliveryScore = delivery.deliveryRatio || 0;
  const ratingScore = rating.ratingRatio || 0;

  const accountHealthRatio =
    messageScore * MESSAGE_WEIGHT +
    deliveryScore * DELIVERY_WEIGHT +
    ratingScore * RATING_WEIGHT;

  // Health label
  let healthStatus: 'Excellent' | 'Good' | 'Average' | 'Poor';

  if (accountHealthRatio >= 85) healthStatus = 'Excellent';
  else if (accountHealthRatio >= 70) healthStatus = 'Good';
  else if (accountHealthRatio >= 50) healthStatus = 'Average';
  else healthStatus = 'Poor';

  return {
    accountHealthRatio: Number(accountHealthRatio.toFixed(2)),
    healthStatus,

    // breakdown (for dashboard)
    breakdown: {
      messageResponseRate: Number(messageScore.toFixed(2)),
      onTimeDeliveryRatio: Number(deliveryScore.toFixed(2)),
      ratingRatio: Number(ratingScore.toFixed(2)),
    },
  };
};

//sales report

const getAllSalesReport = async (sellerId: string) => {
  const sellerObjectId = new Types.ObjectId(sellerId);

  const data = await SellerWallet.aggregate([
    {
      $match: {
        sellerId: sellerObjectId,
      },
    },
    {
      $addFields: {
        year: { $year: '$createdAt' },
        month: { $month: '$createdAt' },
      },
    },
    {
      $group: {
        _id: {
          year: '$year',
          month: '$month',
        },
        totalAmount: { $sum: '$amount' },
      },
    },
    {
      $sort: {
        '_id.year': 1,
        '_id.month': 1,
      },
    },
  ]);

  const monthlyReport: Record<string, number> = {};
  let grandTotal = 0;

  data.forEach(item => {
    const monthName = new Date(
      item._id.year,
      item._id.month - 1
    ).toLocaleString('en-US', { month: 'short' });

    monthlyReport[monthName] =
      (monthlyReport[monthName] || 0) + item.totalAmount;

    grandTotal += item.totalAmount;
  });

  return {
    monthlyReport, // { Jan: 1200, Feb: 3400 }
    totalAmount: grandTotal, // overall total
  };
};

export const SellerAccountHelthService = {
  accountMsgResponse,
  onTimeDeliveryRatio,
  getAllReviewAndRatingRatio,
  getAccountHealthRatio,
  getAllSalesReport,
};
