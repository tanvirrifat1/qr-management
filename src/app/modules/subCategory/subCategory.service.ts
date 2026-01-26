import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { Category } from '../category/category.model';
import { ISubCategory } from './subCategory.interface';
import { SubCategory } from './subCategory.model';

const createSubCategory = async (payload: ISubCategory) => {
  const isExistCategory = await Category.findById(payload.categoryId);

  if (!isExistCategory) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Category not found');
  }

  const duplicateSubCategory = await SubCategory.findOne({
    title: payload.title,
    categoryId: payload.categoryId,
  });

  if (duplicateSubCategory) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'SubCategory already exists');
  }

  const result = await SubCategory.create(payload);
  return result;
};

const getSubCategory = async (query: Record<string, unknown>, id: string) => {
  const { page = 1, limit = 10, searchTerm, ...filters } = query;

  const andConditions: any[] = [{ categoryId: id }];

  // Search condition
  if (searchTerm) {
    andConditions.push({
      $or: [{ title: { $regex: searchTerm as string, $options: 'i' } }],
    });
  }

  // Additional filter conditions
  if (Object.keys(filters).length) {
    andConditions.push({
      $and: Object.entries(filters).map(([key, value]) => ({ [key]: value })),
    });
  }

  // Combine conditions
  const whereConditions = andConditions.length ? { $and: andConditions } : {};

  const pageNumber = Number(page);

  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  // Fetch data
  const result = await SubCategory.find(whereConditions)
    .populate('categoryId')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber)
    .lean<ISubCategory[]>();

  const total = await SubCategory.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
    },
  };
};

const getSubCategoryForAdmin = async (query: Record<string, unknown>) => {
  const { page = 1, limit = 10, searchTerm, ...filters } = query;

  const andConditions: any[] = [];

  // Search condition
  if (searchTerm) {
    andConditions.push({
      $or: [{ title: { $regex: searchTerm as string, $options: 'i' } }],
    });
  }

  // Additional filter conditions
  if (Object.keys(filters).length) {
    andConditions.push({
      $and: Object.entries(filters).map(([key, value]) => ({ [key]: value })),
    });
  }

  // Combine conditions
  const whereConditions = andConditions.length ? { $and: andConditions } : {};

  const pageNumber = Number(page);

  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  // Fetch data
  const result = await SubCategory.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber)
    .lean<ISubCategory[]>();

  const total = await SubCategory.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
    },
  };
};

const updateSubCategory = async (id: string, payload: ISubCategory) => {
  const isExist = await SubCategory.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'SubCategory not found');
  }

  const result = await SubCategory.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteCategoryFromDB = async (id: string) => {
  const isExist = await SubCategory.findById(id);

  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'SubCategory not found');
  }

  const result = await SubCategory.findByIdAndDelete(id);

  return result;
};

export const SubCategoryService = {
  createSubCategory,
  getSubCategory,
  getSubCategoryForAdmin,
  updateSubCategory,
  deleteCategoryFromDB,
};
