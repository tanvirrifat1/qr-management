import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { AdminService } from './admin.service';

const createAdmin = catchAsync(async (req, res) => {
  const result = await AdminService.createAdmin(req.body);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Admin created successfully',
    data: result,
  });
});

const getAllAdmins = catchAsync(async (req, res) => {
  const result = await AdminService.getAllAdmins(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Admin retrive successfully',
    data: result,
  });
});

const getAdminDetails = catchAsync(async (req, res) => {
  const result = await AdminService.getAdminDetails(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Admin retrive successfully',
    data: result,
  });
});

export const AdminController = {
  createAdmin,
  getAllAdmins,
  getAdminDetails,
};
