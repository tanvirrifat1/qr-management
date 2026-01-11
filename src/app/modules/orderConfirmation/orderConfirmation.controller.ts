import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OrderConfirmationService } from './orderConfirmation.service';

const createOrderConfirmationToDB = catchAsync(async (req, res) => {
  const result = await OrderConfirmationService.createOrderConfirmationToDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Order Confirmation successfully',
    data: result,
  });
});

export const OrderConfirmationController = {
  createOrderConfirmationToDB,
};
