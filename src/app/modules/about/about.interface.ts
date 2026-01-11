import { Types } from 'mongoose';

export type IAbout = {
  description: string;
  location: string;
  memberSince: string;
  seller: string;
  userId: Types.ObjectId;
};
