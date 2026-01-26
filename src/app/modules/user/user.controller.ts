import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';

import { MulterFile } from './user.constant';

const createBuyerToDB = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const value = {
      ...req.body,
    };

    await UserService.createBuyerToDB(value);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message:
        'Please check your email to verify your account. We have sent you an OTP to complete the registration process.',
    });
  },
);

const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { user, body } = req;
    const files = req.files as
      | { [fieldname: string]: MulterFile[] }
      | undefined;

    if (!user) {
      return next(new Error('User not authenticated'));
    }

    const imageFiles = files?.['image'];

    const imageLocation =
      imageFiles && imageFiles.length > 0 ? imageFiles[0].location : undefined;

    const updateData = {
      ...body,
      image: imageLocation,
    };

    const updatedProfile = await UserService.updateProfileToDB(
      user,
      updateData,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile updated successfully',
      data: updatedProfile,
    });
  },
);

const suspendedUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.suspendedUser(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'users suspended successfully',
    data: result,
  });
});

const activeUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.activeUser(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'users actived successfully',
    data: result,
  });
});

const getUserDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getUserDetails(req.user.id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'users retrived successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers(req.query);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'users retrived successfully',
    data: result,
  });
});

export const UserController = {
  createBuyerToDB,
  updateProfile,
  suspendedUser,
  activeUser,
  getUserDetails,
  getAllUsers,
};
