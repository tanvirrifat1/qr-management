import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ProductServiceHello } from './product.service';

const createProductFromDb = catchAsync(async (req, res) => {
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

  const result = await ProductServiceHello.createProductFromDb(value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Images and media uploaded successfully',
    data: result,
  });
});

const getAllProducts = catchAsync(async (req, res) => {
  const result = await ProductServiceHello.getAllProducts(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'product retrive successfully',
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const files = req.files as { [fieldname: string]: Express.MulterS3.File[] };

  // collect all uploaded images
  const imageFiles = files?.['image'] || [];

  // map image locations into an array
  const imageUrls = imageFiles.map(file => file.location);

  const value = {
    ...req.body,
    image: imageUrls, // <-- store array of URLs
  };

  const result = await ProductServiceHello.updateProduct(req.params.id, value);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Images and media uploaded successfully',
    data: result,
  });
});

const getMyProduct = catchAsync(async (req, res) => {
  const result = await ProductServiceHello.getMyProduct(req.user.id, req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'product retrive successfully',
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const result = await ProductServiceHello.deleteProduct(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'product deleted successfully',
    data: result,
  });
});

const getAllDiscoutProduct = catchAsync(async (req, res) => {
  const result = await ProductServiceHello.getAllDiscoutProduct(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Discount product retrive successfully',
    data: result,
  });
});

//getSingleProduct
const getSingleProduct = catchAsync(async (req, res) => {
  const result = await ProductServiceHello.getSingleProduct(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'product retrive successfully',
    data: result,
  });
});

export const ProductController = {
  createProductFromDb,
  getAllProducts,
  updateProduct,
  getMyProduct,
  deleteProduct,
  getAllDiscoutProduct,
  getSingleProduct,
};
