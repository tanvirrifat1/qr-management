import { model, Schema } from 'mongoose';
import { IMessage } from './message.interface';

const messageSchema = new Schema<IMessage>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User' },
    message: { type: String, required: true },
    inboxId: { type: Schema.Types.ObjectId, ref: 'Inbox', required: true },
  },
  {
    timestamps: true,
  }
);

export const Message = model<IMessage>('Message', messageSchema);
