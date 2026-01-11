import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { WalletService } from './wallet.service';

const getMyWallet = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const result = await WalletService.getMyWallet(userId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Wallet retrive successfully',
    data: result,
  });
});

const getAllWallte = catchAsync(async (req, res) => {
  const result = await WalletService.getAllWallte(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Wallet retrive successfully',
    data: result,
  });
});

export const WalletController = {
  getMyWallet,
  getAllWallte,
};
