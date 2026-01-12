import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { WishlistService } from './wishlist.service';

const createWishList = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id;

  const value: any = {
    userId,
    productId,
  };

  const result = await WishlistService.createWishList(value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Wishlist created successfully',
    data: result,
  });
});

const removeWishList = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const productId = req.params.id;

  const value: any = {
    userId,
    productId,
  };

  const result = await WishlistService.removeWishList(value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Wishlist removed successfully',
    data: result,
  });
});

const getAllWishLists = catchAsync(async (req, res) => {
  const result = await WishlistService.getAllWishLists(req.user.id, req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Wishlist retrive successfully',
    data: result,
  });
});

const getWishList = catchAsync(async (req, res) => {
  const result = await WishlistService.getWishList(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Wishlist retrive successfully',
    data: result,
  });
});

export const WishlistController = {
  createWishList,
  removeWishList,
  getAllWishLists,
  getWishList,
};
