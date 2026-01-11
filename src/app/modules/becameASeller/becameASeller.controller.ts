import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BecameASellerService } from './becameASeller.service';

const becameASellerCreate = catchAsync(async (req, res) => {
  const files = req.files as { [fieldname: string]: Express.MulterS3.File[] };

  const userId = req.user.id;

  // collect all uploaded images
  const imageFiles = files?.['image'] || [];

  // map image locations into an array
  const imageUrls = imageFiles.map(file => file.location);

  const value = {
    ...req.body,
    image: imageUrls, // <-- store array of URLs
    userId,
  };

  const result = await BecameASellerService.becameASellerCreate(value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'BecameASeller created successfully',
    data: result,
  });
});

const updateBecameASeller = catchAsync(async (req, res) => {
  const files = req.files as { [fieldname: string]: Express.MulterS3.File[] };

  // collect all uploaded images
  const imageFiles = files?.['image'] || [];

  // map image locations into an array
  const imageUrls = imageFiles.map(file => file.location);

  const value = {
    ...req.body,
    image: imageUrls, // <-- store array of URLs
  };

  const result = await BecameASellerService.updateBecameASeller(
    req.params.id,
    value
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'BecameASeller updated successfully',
    data: result,
  });
});

const getAllSellerData = catchAsync(async (req, res) => {
  const result = await BecameASellerService.getAllSellerData(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'BecameASeller retrive successfully',
    data: result,
  });
});

const updateSellerDataFormAdmin = catchAsync(async (req, res) => {
  const result = await BecameASellerService.updateSellerDataFormAdmin(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'BecameASeller updated successfully',
    data: result,
  });
});

const getSingleSellerData = catchAsync(async (req, res) => {
  const result = await BecameASellerService.getSingleSellerData(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'BecameASeller retrive successfully',
    data: result,
  });
});

export const BecameASellerController = {
  becameASellerCreate,
  updateBecameASeller,
  getAllSellerData,
  updateSellerDataFormAdmin,
  getSingleSellerData,
};
