import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { ICategory } from './category.interface';
import { Category } from './category.model';

const createCategoryToDB = async (payload: ICategory) => {
  const result = await Category.create(payload);
  return result;
};

const getAllCategoryFromDB = async (query: Record<string, unknown>) => {
  const { page, limit, searchTerm, ...filterData } = query;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({ title: { $regex: searchTerm, $options: 'i' } });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value }),
    );
    andConditions.push({ $and: filterConditions });
  }

  // Combine all conditions
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await Category.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();
  const count = await Category.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

const uppdateProductToDB = async (id: string, payload: ICategory) => {
  const result = await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const getSingleCategoryFromDB = async (id: string) => {
  const isExist = await Category.findById(id);

  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');
  }

  return isExist;
};

const deleteCategoryFromDB = async (id: string) => {
  const isExist = await Category.findById(id);

  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');
  }

  const result = await Category.findByIdAndDelete(id);

  return result;
};

export const CategoryService = {
  createCategoryToDB,
  uppdateProductToDB,
  getAllCategoryFromDB,
  getSingleCategoryFromDB,
  deleteCategoryFromDB,
};
