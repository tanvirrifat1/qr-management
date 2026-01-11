import { Wallet } from './wallet.model';

const getMyWallet = async (userId: string) => {
  const wallet = await Wallet.findOne({ userId });
  return wallet;
};

const getAllWallte = async (query: Record<string, unknown>) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.max(Number(query.limit) || 10, 1);
  const skip = (page - 1) * limit;

  const result = await Wallet.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Wallet.countDocuments();

  return {
    data: result,
    meta: {
      page,
      limit,
      total,
    },
  };
};

export const WalletService = {
  getMyWallet,
  getAllWallte,
};
