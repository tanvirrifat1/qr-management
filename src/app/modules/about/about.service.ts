import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { IAbout } from './about.interface';
import { About } from './about.model';

const createAboutToDB = async (payload: IAbout) => {
  // 1. Check if About already exists
  const isExistData = await About.findOne({ userId: payload.userId });

  if (isExistData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Data already exist');
  }

  // 2. Check if User exists
  const user = await User.findById(payload.userId).select('createdAt');
  if (!user?.createdAt) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  // 3. Format date
  const formattedDate = new Date(user.createdAt).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // 4. Create About
  const result = await About.create({
    ...payload,
    memberSince: formattedDate,
  });

  return result;
};

const getMyAbout = async (userId: string) => {
  const result = await About.findOne({ userId });
  return result;
};

const getSellerAbout = async (userId: string) => {
  const isExist = await User.findById(userId);
  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const result = await About.findOne({ userId });
  return result;
};

export const AboutService = {
  createAboutToDB,
  getMyAbout,
  getSellerAbout,
};
