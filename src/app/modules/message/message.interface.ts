import { Types } from 'mongoose';

export type IMessage = {
  senderId: Types.ObjectId;

  inboxId: Types.ObjectId;
  message: string;
};
