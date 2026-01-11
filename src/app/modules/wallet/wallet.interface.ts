import { Types } from 'mongoose';

export type IWallet = {
  userId: Types.ObjectId;
  balance: number;
};
