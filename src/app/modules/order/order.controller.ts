import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { OrderService } from './order.service';

const createOrder = catchAsync(async (req, res) => {
  const userId = req.user.id;

  const value = {
    ...req.body,
    userId,
  };

  const result = await OrderService.createOrder(value);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Order created successfully',
    data: result,
  });
});

const getAllOrderforBuyer = catchAsync(async (req, res) => {
  const result = await OrderService.getAllOrderforBuyer(req.user.id, req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Order retrive successfully',
    data: result,
  });
});

const getOrderBySeller = catchAsync(async (req, res) => {
  const result = await OrderService.getOrderBySeller(req.user.id, req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Order retrive successfully',
    data: result,
  });
});

const getSingleOrder = catchAsync(async (req, res) => {
  const result = await OrderService.getSingleOrder(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Order retrive successfully',
    data: result,
  });
});

export const OrderController = {
  createOrder,
  getAllOrderforBuyer,
  getOrderBySeller,
  getSingleOrder,
};
