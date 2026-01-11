import { StatusCodes } from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { User } from '../user/user.model';
import { Wallet } from '../wallet/wallet.model';
import { IWithdrowMoney } from './withdrowMoney.interface';
import { WithdrowMoney } from './withdrowMoney.model';
import { sendNotifications } from '../../../helpers/notificationHelper';
import { Notification } from '../notification/notification.model';

const requestWithdraw = async (data: IWithdrowMoney) => {
  const [isUser, myWallet, isExistRequest] = await Promise.all([
    User.findById(data.userId),
    Wallet.findOne({ userId: data.userId }),
    WithdrowMoney.findOne({ user: data.userId, status: 'request' }),
  ]);

  if (!isUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  const IsReqData = await WithdrowMoney.findOne({
    userId: data.userId,
    status: 'request',
  });

  if (IsReqData) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You already have a pending withdraw request'
    );
  }

  const wallet = await Wallet.findOne({ userId: data.userId });

  if (!wallet) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Wallet not found');
  }

  if (wallet.balance < 2000) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Insufficient balance');
  }

  if (isExistRequest) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'You already have a pending withdraw request'
    );
  }

  if (!myWallet || myWallet.balance < data.amount) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Insufficient balance');
  }

  // Notification handling (run in parallel, no need to block)
  const notificationPayload = {
    title: 'You have withdraw request',
    text: `You have a withdraw request from ${isUser.firstName} ${isUser.lastName}`,
    type: 'ADMIN',
  };

  void sendNotifications(notificationPayload);
  void Notification.create(notificationPayload);

  data.walletId = myWallet._id;

  return WithdrowMoney.create(data);
};

const getAllWithdrawRequests = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (query.status) filter.status = query.status;

  const [result, total] = await Promise.all([
    WithdrowMoney.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'userId',
        select: 'firstName lastName email phone image',
      }),
    WithdrowMoney.countDocuments(filter),
  ]);

  return {
    result,
    page,
    limit,
    total,
  };
};

const paidWithdraw = async (id: string, payload: Partial<IWithdrowMoney>) => {
  const withdraw = await WithdrowMoney.findById(id);
  if (!withdraw) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Withdraw request not found');
  }

  // If already paid, block
  if (withdraw.status === 'paid') {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Withdraw request already paid'
    );
  }

  // If the incoming payload sets status to "paid"
  if (payload.status === 'paid') {
    const wallet = await Wallet.findById(withdraw.walletId);
    if (!wallet) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Wallet not found');
    }

    // Check if wallet has enough balance
    if (wallet.balance < withdraw.amount) {
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        'Insufficient wallet balance'
      );
    }

    // Deduct the amount
    wallet.balance -= withdraw.amount;
    await wallet.save();
  }

  // Update withdraw with the new payload (status, image, etc.)
  const updatedWithdraw = await WithdrowMoney.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updatedWithdraw;
};

const getMyWithdrawHistory = async (
  userId: string,
  query: Record<string, unknown>
) => {
  const { page, limit, searchTerm, ...filterData } = query;

  const andConditions: any[] = [{ userId }];

  if (searchTerm) {
    andConditions.push({ status: { $regex: searchTerm, $options: 'i' } });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    andConditions.push({ $and: filterConditions });
  }

  const whereConditions = { $and: andConditions };

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await WithdrowMoney.find(whereConditions)
    .populate('walletId')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await WithdrowMoney.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

const getAllWithdrawHistory = async (query: Record<string, unknown>) => {
  const { page, limit, searchTerm, ...filterData } = query;

  const andConditions: any[] = [];

  if (searchTerm) {
    andConditions.push({ status: { $regex: searchTerm, $options: 'i' } });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({ [field]: value })
    );
    andConditions.push({ $and: filterConditions });
  }

  const whereConditions = { $and: andConditions };

  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  const result = await WithdrowMoney.find(whereConditions)
    .populate('walletId')
    .populate({
      path: 'userId',
      select: 'firstName lastName email phone image',
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean();

  const count = await WithdrowMoney.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      total: count,
    },
  };
};

export const WithdrowMoneyService = {
  requestWithdraw,
  getAllWithdrawRequests,
  paidWithdraw,
  getMyWithdrawHistory,
  getAllWithdrawHistory,
};
