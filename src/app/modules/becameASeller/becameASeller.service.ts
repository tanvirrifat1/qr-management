import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import {
  IBecameASeller,
  UpdateBecameASellerPayload,
} from './becameASeller.interface';
import { BecameASeller } from './becameASeller.model';
import { sendEmail } from '../../../helpers/sendMail';
import { User } from '../user/user.model';

const becameASellerCreate = async (payload: IBecameASeller) => {
  const isExist = await BecameASeller.findOne({ userId: payload.userId });
  if (isExist) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'You are already a seller');
  }

  const result = await BecameASeller.create(payload);
  return result;
};

const updateBecameASeller = async (
  id: string,
  payload: UpdateBecameASellerPayload
) => {
  const isExistBecomeASeller = await BecameASeller.findById(id);

  if (!isExistBecomeASeller) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'BecameASeller not found');
  }

  isExistBecomeASeller.image = isExistBecomeASeller.image.filter(
    (img: string) => !payload.imagesToDelete?.includes(img)
  );

  const updateImages = payload.image
    ? [...isExistBecomeASeller.image, ...payload.image]
    : isExistBecomeASeller.image;

  const updateData = {
    ...payload,
    image: updateImages,
  };

  const result = await BecameASeller.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  return result;
};

// const getAllSellerData = async (query: Record<string, unknown>) => {
//   const page = Number(query.page) || 1;
//   const limit = Number(query.limit) || 10;
//   const skip = (page - 1) * limit;

//   // Extract status from query
//   const status = query.status as string;

//   // Build filter object
//   const filter: Record<string, unknown> = {};
//   if (status) {
//     filter.status = status;
//   }

//   const [result, count] = await Promise.all([
//     BecameASeller.find(filter)
//       .populate({
//         path: 'userId',
//         model: 'User',
//         select: 'name email image role',
//       })
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit)
//       .lean(),

//     BecameASeller.countDocuments(filter),
//   ]);

//   return {
//     result,
//     meta: {
//       page,
//       limit,
//       total: count,
//     },
//   };
// };

const getAllSellerData = async (query: Record<string, unknown>) => {
  const {
    searchTerm,
    period,
    startDate,
    endDate,
    page = '1',
    limit = '10',
    ...filters
  } = query;

  const conditions: any[] = [];

  // Search term
  if (searchTerm) {
    conditions.push({
      $or: [{ status: { $regex: searchTerm as string, $options: 'i' } }],
    });
  }

  // ⭐ DATE FILTER LOGIC ⭐
  if (period) {
    const now = new Date();
    let fromDate = new Date();

    if (period === '3m') {
      fromDate.setMonth(now.getMonth() - 3);
    } else if (period === '6m') {
      fromDate.setMonth(now.getMonth() - 6);
    } else if (period === '1y') {
      fromDate.setFullYear(now.getFullYear() - 1);
    }

    conditions.push({
      createdAt: { $gte: fromDate, $lte: now },
    });
  }

  // Custom date filtering
  if (startDate || endDate) {
    conditions.push({
      createdAt: {
        ...(startDate ? { $gte: new Date(startDate as string) } : {}),
        ...(endDate ? { $lte: new Date(endDate as string) } : {}),
      },
    });
  }

  // Additional filters
  if (Object.keys(filters).length) {
    conditions.push({
      $and: Object.entries(filters).map(([key, value]) => ({ [key]: value })),
    });
  }

  const where = conditions.length ? { $and: conditions } : {};

  // Pagination
  const pageNumber = parseInt(page as string, 10);
  const pageSize = parseInt(limit as string, 10);
  const skip = (pageNumber - 1) * pageSize;

  const [order, total] = await Promise.all([
    BecameASeller.find(where)
      .populate({
        path: 'userId',
        select: 'firstName lastName email image',
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),
    BecameASeller.countDocuments(where),
  ]);

  return {
    result: order,
    meta: {
      page: pageNumber,
      total,
    },
  };
};

const updateSellerDataFormAdmin = async (
  id: string,
  payload: UpdateBecameASellerPayload
) => {
  const seller = await BecameASeller.findById(id);
  if (!seller) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'BecameASeller not found');
  }

  const user = await User.findById(seller.userId);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const { status } = payload;

  // Update Seller status
  const updatedSellerRecord = await BecameASeller.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  // If approved → update user role
  if (status === 'approved') {
    await User.findByIdAndUpdate(
      user._id,
      { role: 'SELLER' },
      { new: true, runValidators: true }
    );

    // Send approved email
    sendEmail(
      user.email,
      'Your Seller Account Has Been Approved',
      `
        Hello ${user.firstName ?? ''},

        Congratulations! Your seller account has been approved.
        You can now start selling on our platform.

        Thank you.
      `.trim()
    );
  }

  // If rejected → send rejection email
  if (status === 'rejected') {
    sendEmail(
      user.email,
      'Your Seller Account Has Been Rejected',
      `
        Hello ${user.firstName ?? ''},

        Unfortunately, your seller account request has been rejected.

        Your information was incorrect. Please resubmit the application.

        Thank you.
      `.trim()
    );
  }

  return updatedSellerRecord;
};

const getSingleSellerData = async (id: string) => {
  const isExist = await BecameASeller.findById(id);
  if (!isExist) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'BecameASeller not found');
  }

  const result = await BecameASeller.findById(id).populate({
    path: 'userId',
    model: 'User',
    select: 'firstName lastName email image',
  });

  return result;
};

export const BecameASellerService = {
  becameASellerCreate,
  updateBecameASeller,
  getAllSellerData,
  updateSellerDataFormAdmin,
  getSingleSellerData,
};
