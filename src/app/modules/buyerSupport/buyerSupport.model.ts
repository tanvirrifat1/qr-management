import { model, Schema } from 'mongoose';
import { IBuyerSupport } from './buyerSupport.interface';

const buyerSupportSchema = new Schema<IBuyerSupport>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: { type: String, required: true },
    des: { type: String, required: true },
    image: { type: String, required: false },
    status: { type: String, required: true, default: 'pending' },
  },
  {
    timestamps: true,
  }
);

export const BuyerSupport = model<IBuyerSupport>(
  'BuyerSupport',
  buyerSupportSchema
);
