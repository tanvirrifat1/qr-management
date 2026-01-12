import { Types } from 'mongoose';

export type IWishlist = {
  productId: Types.ObjectId;
  userId: Types.ObjectId;
};
