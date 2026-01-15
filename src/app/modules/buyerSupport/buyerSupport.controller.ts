import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { BuyerSupportService } from './buyerSupport.service';
import { MulterFile } from '../user/user.constant';

const createBuyerSupport = catchAsync(async (req, res) => {
  const files = req.files as { [fieldname: string]: MulterFile[] } | undefined;

  const imageFiles = files?.['image'];

  const imageLocation =
    imageFiles && imageFiles.length > 0 ? imageFiles[0].location : undefined;

  const userId = req.user.id;

  const updateData = {
    ...req.body,
    userId,
    image: imageLocation,
  };

  const result = await BuyerSupportService.createBuyerSupport(updateData);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'BuyerSupport created successfully',
    data: result,
  });
});

const getAllSupport = catchAsync(async (req, res) => {
  const result = await BuyerSupportService.getAllSupport(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'BuyerSupport retrive successfully',
    data: result,
  });
});

const provideSupport = catchAsync(async (req, res) => {
  const result = await BuyerSupportService.provideSupport(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'BuyerSupport retrive successfully',
    data: result,
  });
});

export const BuyerSupportController = {
  createBuyerSupport,
  getAllSupport,
  provideSupport,
};
