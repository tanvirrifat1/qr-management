import { Types } from 'mongoose';

export type ISubscription = {
  packageId: Types.ObjectId;
  userId: Types.ObjectId;
  subscriptionId: string;
  stripeCustomerId: string;
  status: string;
  startDate: Date;
  endDate: Date;
  email: string;
  amount: number;
  time: string;
  priceId: string;
};
