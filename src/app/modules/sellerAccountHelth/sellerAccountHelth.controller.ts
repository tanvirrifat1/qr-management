import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { SellerAccountHelthService } from './sellerAccountHelth.service';

const accountMsgResponse = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await SellerAccountHelthService.accountMsgResponse(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Account helth retrive successfully',
    data: result,
  });
});

const onTimeDeliveryRatio = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await SellerAccountHelthService.onTimeDeliveryRatio(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'On time delivery retrive successfully',
    data: result,
  });
});

const getAllReviewAndRatingRatio = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result =
    await SellerAccountHelthService.getAllReviewAndRatingRatio(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Review and rating retrive successfully',
    data: result,
  });
});

const getAccountHealthRatio = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await SellerAccountHelthService.getAccountHealthRatio(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Account helth retrive successfully',
    data: result,
  });
});

const getAllSalesReport = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await SellerAccountHelthService.getAllSalesReport(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Account helth retrive successfully',
    data: result,
  });
});

const getAllTopSalesProducts = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await SellerAccountHelthService.getAllTopSalesProducts(
    userId,
    req.query,
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Top sales product retrive successfully',
    data: result,
  });
});

export const SellerAccountHelthController = {
  accountMsgResponse,
  onTimeDeliveryRatio,
  getAllReviewAndRatingRatio,
  getAccountHealthRatio,
  getAllSalesReport,
  getAllTopSalesProducts,
};
