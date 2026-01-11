import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AdminAccountHealthService } from './adminAccountHealth.service';

const dashboardInstance = catchAsync(async (req, res) => {
  const result = await AdminAccountHealthService.dashboardInstance();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Dashboard retrive successfully',
    data: result,
  });
});

const sellerPerformance = catchAsync(async (req, res) => {
  const result = await AdminAccountHealthService.sellerPerformance();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Dashboard retrive successfully',
    data: result,
  });
});

const getAllRevenue = catchAsync(async (req, res) => {
  const result = await AdminAccountHealthService.getAllRevenue();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Dashboard retrive successfully',
    data: result,
  });
});

const getAllProductInventory = catchAsync(async (req, res) => {
  const result = await AdminAccountHealthService.getAllProductInventory(
    req.query,
    req.user.id
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Product Inventory retrive successfully',
    data: result,
  });
});

const getAllSellerReqData = catchAsync(async (req, res) => {
  const result = await AdminAccountHealthService.getAllSellerReqData(req.query);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Total Sellers Request retrive successfully',
    data: result,
  });
});

export const AdminAccountHealthController = {
  dashboardInstance,
  sellerPerformance,
  getAllRevenue,
  getAllProductInventory,
  getAllSellerReqData,
};
