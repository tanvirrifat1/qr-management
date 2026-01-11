import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SubCategoryService } from './subCategory.service';

const createSubCategory = catchAsync(async (req, res) => {
  const result = await SubCategoryService.createSubCategory(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'SubCategory created successfully',
    data: result,
  });
});

const getSubCategory = catchAsync(async (req, res) => {
  const result = await SubCategoryService.getSubCategory(
    req.query,
    req.params.id
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'SubCategory retrive successfully',
    data: result,
  });
});

const getSubCategoryForAdmin = catchAsync(async (req, res) => {
  const result = await SubCategoryService.getSubCategoryForAdmin(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'SubCategory retrive successfully',
    data: result,
  });
});

export const SubCategoryController = {
  createSubCategory,
  getSubCategory,
  getSubCategoryForAdmin,
};
