import { Types } from 'mongoose';

export type IWithdrowMoney = {
  userId: Types.ObjectId;
  amount: number;
  status: string;
  image: string;
  walletId?: Types.ObjectId;
  cardNumber?: string;
  date?: Date;
  cvc?: string;
  nameOfCard?: string;
  country?: string;
  zipCode?: string;
};
