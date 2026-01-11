import { Types } from 'mongoose';

export type IInbox = {
  senderId: Types.ObjectId;
  receiverId: Types.ObjectId;
  unreadCount: number;
};
