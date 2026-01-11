import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { WithdrowMoneyService } from './withdrowMoney.service';

const requestWithdraw = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const value = {
    ...req.body,
    userId,
  };

  const result = await WithdrowMoneyService.requestWithdraw(value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Withdraw request successfully',
    data: result,
  });
});

const getAllWithdrawRequests = catchAsync(async (req, res) => {
  const result = await WithdrowMoneyService.getAllWithdrawRequests(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Withdraw request retrive successfully',
    data: result,
  });
});

const paidWithdraw = catchAsync(async (req, res) => {
  const files = req.files as { [fieldname: string]: Express.MulterS3.File[] };

  const imageFile = files?.['image']?.[0];

  const value = {
    ...req.body,
    image: imageFile?.location,
  };

  const result = await WithdrowMoneyService.paidWithdraw(req.params.id, value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Withdraw paid successfully',
    data: result,
  });
});

const getMyWithdrawHistory = catchAsync(async (req, res) => {
  const result = await WithdrowMoneyService.getMyWithdrawHistory(
    req.user.id,
    req.query
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Withdraw history retrive successfully',
    data: result,
  });
});

const getAllWithdrawHistory = catchAsync(async (req, res) => {
  const result = await WithdrowMoneyService.getAllWithdrawHistory(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Withdraw history retrive successfully',
    data: result,
  });
});

export const WithdrowMoneyController = {
  requestWithdraw,
  getAllWithdrawRequests,
  paidWithdraw,
  getMyWithdrawHistory,
  getAllWithdrawHistory,
};
