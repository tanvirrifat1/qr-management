import { model, Schema } from 'mongoose';
import { IInbox } from './inbox.interface';

const inboxSchema = new Schema<IInbox>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    unreadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Inbox = model<IInbox>('Inbox', inboxSchema);
