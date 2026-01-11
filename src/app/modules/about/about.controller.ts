import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AboutService } from './about.service';

const createAboutToDB = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const val = {
    ...req.body,
    userId,
  };

  const result = await AboutService.createAboutToDB(val);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'About created successfully',
    data: result,
  });
});

const getMyAbout = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const result = await AboutService.getMyAbout(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'About retrive successfully',
    data: result,
  });
});

const getSellerAbout = catchAsync(async (req, res) => {
  const result = await AboutService.getSellerAbout(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'About retrive successfully',
    data: result,
  });
});

export const AboutController = {
  createAboutToDB,
  getMyAbout,
  getSellerAbout,
};
