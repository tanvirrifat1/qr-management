import { Types } from 'mongoose';

export type IReview = {
  productId: Types.ObjectId;
  userId: Types.ObjectId;
  sellerId: Types.ObjectId;
  rating: number;
  review: string;
};
