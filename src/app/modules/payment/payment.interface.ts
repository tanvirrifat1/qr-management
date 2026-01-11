import { Types } from 'mongoose';

export type IPayment = {
  amount: number;
  userId: Types.ObjectId;
  orderId: Types.ObjectId[];
  sellerId: Types.ObjectId[];
  transactionId: string;
  email: string;
  status: string;
};
