import { model, Schema } from 'mongoose';
import { IPackage } from './package.interface';

const packageSchema = new Schema<IPackage>(
  {
    name: { type: String, required: true },
    description: { type: [String], required: true },
    unitAmount: { type: Number, required: true },
    interval: { type: String, required: true },
    productId: { type: String, required: true },
    priceId: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Package = model<IPackage>('Package', packageSchema);
