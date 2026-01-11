import { model, Schema } from 'mongoose';
import { ISellerWallet } from './sellerWallet.interface';

const sellerWalletSchema = new Schema<ISellerWallet>(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment', required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export const SellerWallet = model<ISellerWallet>(
  'SellerWallet',
  sellerWalletSchema
);
