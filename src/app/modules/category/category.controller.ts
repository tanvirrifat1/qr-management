import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { CategoryService } from './category.service';

const createCategoryToDB = catchAsync(async (req, res) => {
  const files = req.files as { [fieldname: string]: Express.MulterS3.File[] };

  const imageFile = files?.['image']?.[0];

  const value = {
    ...req.body,
    image: imageFile?.location,
  };

  const result = await CategoryService.createCategoryToDB(value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category created successfully',
    data: result,
  });
});

const uppdateProductToDB = catchAsync(async (req, res) => {
  const files = req.files as { [fieldname: string]: Express.MulterS3.File[] };

  const imageFile = files?.['image']?.[0];

  const value = {
    ...req.body,
    image: imageFile?.location,
  };

  const result = await CategoryService.uppdateProductToDB(req.params.id, value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category created successfully',
    data: result,
  });
});

const getAllCategoryFromDB = catchAsync(async (req, res) => {
  const result = await CategoryService.getAllCategoryFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category fetched successfully',
    data: result,
  });
});

const getSingleCategoryFromDB = catchAsync(async (req, res) => {
  const result = await CategoryService.getSingleCategoryFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category fetched successfully',
    data: result,
  });
});

const deleteCategoryFromDB = catchAsync(async (req, res) => {
  const result = await CategoryService.deleteCategoryFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Category deleted successfully',
    data: result,
  });
});

export const CategoryController = {
  createCategoryToDB,
  uppdateProductToDB,
  getAllCategoryFromDB,
  getSingleCategoryFromDB,
  deleteCategoryFromDB,
};
