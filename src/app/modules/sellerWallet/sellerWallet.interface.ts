import { Types } from 'mongoose';

export type ISellerWallet = {
  paymentId: Types.ObjectId;
  amount: number;
  sellerId: Types.ObjectId;
};
