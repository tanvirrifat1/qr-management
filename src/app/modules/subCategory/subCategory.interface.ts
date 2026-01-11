import { Types } from 'mongoose';

export type ISubCategory = {
  title: string;
  categoryId: Types.ObjectId;
};
