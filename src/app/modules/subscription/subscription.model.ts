import { model, Schema } from 'mongoose';
import { ISubscription } from './subscription.interface';

const subscriptionSchema = new Schema<ISubscription>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  packageId: {
    type: Schema.Types.ObjectId,
    ref: 'Package',
    required: true,
  },
  subscriptionId: {
    type: String,
  },
  stripeCustomerId: {
    type: String,
  },
  status: {
    type: String,
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  email: {
    type: String,
  },
  amount: {
    type: Number,
  },
  time: {
    type: String,
  },
});

export const Subscription = model('subscription', subscriptionSchema);
