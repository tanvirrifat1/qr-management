import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ReviewService } from './review.service';

const createReviewToDB = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const value = {
    ...req.body,
    userId,
  };

  const result = await ReviewService.createReviewToDB(value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Review created successfully',
    data: result,
  });
});

const getAllReview = catchAsync(async (req, res) => {
  const result = await ReviewService.getAllReview(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Review retrive successfully',
    data: result,
  });
});

const getAllDataFromUser = catchAsync(async (req, res) => {
  const result = await ReviewService.getAllDataFromUser(
    req.params.id,
    req.query
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Review retrive successfully',
    data: result,
  });
});

const reviewCount = catchAsync(async (req, res) => {
  const result = await ReviewService.reviewCount(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Review retrive successfully',
    data: result,
  });
});

export const ReviewController = {
  createReviewToDB,
  getAllReview,
  getAllDataFromUser,
  reviewCount,
};
