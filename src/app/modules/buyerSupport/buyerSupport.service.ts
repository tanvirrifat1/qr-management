import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IBuyerSupport } from './buyerSupport.interface';
import { BuyerSupport } from './buyerSupport.model';

const createBuyerSupport = async (payload: IBuyerSupport) => {
  const result = await BuyerSupport.create(payload);
  return result;
};

const getAllSupport = async (query: Record<string, unknown>) => {
  const { searchTerm, page = '1', limit = '10', ...filters } = query;

  const conditions: any[] = [];

  if (searchTerm) {
    conditions.push({
      $or: [{ status: { $regex: searchTerm as string, $options: 'i' } }],
    });
  }

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
    BuyerSupport.find(where)
      .populate({
        path: 'userId',
        select: 'firstName lastName email image',
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),

    BuyerSupport.countDocuments(where),
  ]);

  return {
    result: order,
    meta: {
      page: pageNumber,
      total,
    },
  };
};

const provideSupport = async (id: string) => {
  const isExist = await BuyerSupport.findById(id);

  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'BuyerSupport not found');
  }

  const updateData = await BuyerSupport.findByIdAndUpdate(
    id,
    { status: 'solved' },
    {
      new: true,
      runValidators: true,
    }
  );

  return updateData;
};

export const BuyerSupportService = {
  createBuyerSupport,
  getAllSupport,
  provideSupport,
};
