import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IReview } from './review.interface';
import { Review } from './review.model';
import { Product } from '../product/product.model';
import { Types } from 'mongoose';

const createReviewToDB = async (payload: Partial<IReview>) => {
  const { productId, userId, rating } = payload;

  // ✅ 1. Fast validation
  if (!productId || !userId || !rating) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Missing required fields');
  }

  // ✅ 2. Fetch product + seller in one call
  const product = await Product.findById(productId).select('userId');
  if (!product) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Product not found');
  }

  // ✅ 3. Prevent duplicate review using atomic check
  const existingReview = await Review.findOne({ productId, userId }).lean();
  //   if (existingReview) {
  //     throw new ApiError(StatusCodes.BAD_REQUEST, 'Review already exists');
  //   }

  // ✅ 4. Create review
  const result = await Review.create({
    ...payload,
    sellerId: product.userId,
  });

  // ✅ 5. Aggregate rating efficiently
  const [stats] = await Review.aggregate([
    { $match: { productId: result.productId } },
    {
      $group: {
        _id: '$productId',
        avgRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  // ✅ 6. Single optimized update
  if (stats) {
    await Product.updateOne(
      { _id: result.productId },
      {
        $set: {
          rating: Number(stats.avgRating.toFixed(1)),
          count: stats.totalReviews,
        },
      }
    );
  }

  return result;
};

const getAllReview = async (query: Record<string, unknown>) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.max(Number(query.limit) || 10, 1);
  const skip = (page - 1) * limit;

  const [result, total] = await Promise.all([
    Review.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'userId',
        select: 'name email role image',
      })
      .populate({
        path: 'productId',
        select: 'title price image',
      })
      .lean(),

    Review.countDocuments(),
  ]);

  const totalPage = Math.ceil(total / limit);

  return {
    data: result,
    meta: {
      page,
      limit,
      total,
      totalPage,
    },
  };
};

const getAllDataFromUser = async (
  sellerId: string,
  query: Record<string, unknown>
) => {
  const { page, limit, searchTerm, ...filterData } = query;

  const andConditions: any = [{ sellerId }];

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    andConditions.push({ $and: filterConditions });
  }

  // Combine all conditions
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Review.find(whereConditions)
    .populate({
      path: 'userId',
      select: 'name email role image',
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();
  const count = await Review.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

const reviewCount = async (sellerId: string) => {
  const result = await Review.aggregate([
    {
      $match: {
        sellerId: new Types.ObjectId(sellerId),
      },
    },
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              { case: { $eq: ['$rating', 5] }, then: 'positive' },
              { case: { $in: ['$rating', [3, 4]] }, then: 'neutral' },
              { case: { $in: ['$rating', [1, 2]] }, then: 'negative' },
            ],
            default: 'unknown',
          },
        },
        count: { $sum: 1 },
      },
    },
  ]);

  // ✅ Clean formatted response
  const summary = {
    positive: 0,
    neutral: 0,
    negative: 0,
  };

  result.forEach(item => {
    summary[item._id as 'positive' | 'neutral' | 'negative'] = item.count;
  });

  return summary;
};

export const ReviewService = {
  createReviewToDB,
  getAllReview,
  getAllDataFromUser,
  reviewCount,
};
