import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { PackageService } from './package.service';

const createPackage = catchAsync(async (req, res) => {
  const result = await PackageService.createPackage(req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Package created successfully',
    data: result,
  });
});

const getAllPackage = catchAsync(async (req, res) => {
  const result = await PackageService.getAllPackage();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Package retrive successfully',
    data: result,
  });
});

const getSinglePackage = catchAsync(async (req, res) => {
  const result = await PackageService.getSinglePackage(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Package retrive successfully',
    data: result,
  });
});

const updatePackage = catchAsync(async (req, res) => {
  const result = await PackageService.updatePackage(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Package updated successfully',
    data: result,
  });
});

const deletePackage = catchAsync(async (req, res) => {
  const result = await PackageService.deletePackage(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Package deleted successfully',
    data: result,
  });
});

export const PackageController = {
  createPackage,
  getAllPackage,
  getSinglePackage,
  updatePackage,
  deletePackage,
};
