import { model, Schema } from 'mongoose';
import { IPayment } from './payment.interface';

const paymentSchema = new Schema<IPayment>(
  {
    amount: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
    sellerId: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    transactionId: { type: String, required: true },
    email: { type: String, required: true },
    status: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const Payment = model<IPayment>('Payment', paymentSchema);
