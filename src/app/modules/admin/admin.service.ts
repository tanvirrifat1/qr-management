import { StatusCodes } from 'http-status-codes';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';

const createAdmin = async (payload: IUser) => {
  const result = await User.create({
    ...payload,
    role: USER_ROLES.ADMIN,
    verified: true,
    subscription: true,
  });

  return result;
};

const getAllAdmins = async (query: Record<string, unknown>) => {
  const { page = 1, limit = 10, searchTerm, ...filters } = query;

  const andConditions: any[] = [];

  // Search condition
  if (searchTerm) {
    andConditions.push({
      $or: [
        { firstName: { $regex: searchTerm as string, $options: 'i' } },
        { lastName: { $regex: searchTerm as string, $options: 'i' } },
      ],
    });
  }

  // Additional filter conditions
  if (Object.keys(filters).length) {
    andConditions.push({
      $and: Object.entries(filters).map(([key, value]) => ({ [key]: value })),
    });
  }

  // Ensure only Admins are fetched
  andConditions.push({ role: USER_ROLES.ADMIN });

  // Combine conditions
  const whereConditions = andConditions.length ? { $and: andConditions } : {};

  const pageNumber = Number(page);

  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  // Fetch data
  const result = await User.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber)
    .lean<IUser[]>();

  const total = await User.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
    },
  };
};

const getAdminDetails = async (id: string) => {
  const admin = await User.isExistUserById(id);

  if (!admin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Admin doesn't exist!");
  }

  return admin;
};

export const AdminService = {
  createAdmin,
  getAllAdmins,
  getAdminDetails,
};
