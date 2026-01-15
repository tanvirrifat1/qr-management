import { Types } from 'mongoose';

export type IBuyerSupport = {
  userId: Types.ObjectId;
  subject: string;
  des: string;
  image: string;
  status: string;
};
