import { model, Schema } from 'mongoose';
import { IWithdrowMoney } from './withdrowMoney.interface';

const withdrowMoneySchema = new Schema<IWithdrowMoney>(
  {
    amount: { type: Number, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['request', 'paid', 'rejected'],
      default: 'request',
    },
    image: { type: String, required: false },
    walletId: { type: Schema.Types.ObjectId, ref: 'Wallet', required: false },
    cardNumber: { type: String, required: false },
    country: { type: String, required: false },
    cvc: { type: String, required: false },
    date: { type: Date, required: false },
    nameOfCard: { type: String, required: false },
    zipCode: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

export const WithdrowMoney = model<IWithdrowMoney>(
  'WithdrowMoney',
  withdrowMoneySchema
);
