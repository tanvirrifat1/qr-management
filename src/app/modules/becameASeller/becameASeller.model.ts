import { model, Schema } from 'mongoose';
import { IBecameASeller } from './becameASeller.interface';

const becameASellerSchema = new Schema<IBecameASeller>(
  {
    accountNumber: { type: String, required: true },
    accountType: { type: String, required: true },
    address: { type: String, required: true },
    bankName: { type: String, required: true },
    businessAccHolderName: { type: String, required: true },
    businessAddress: { type: String, required: true },
    businessEmail: { type: String, required: true },
    businessName: { type: String, required: true },
    businessPhone: { type: String, required: true },
    businessReg: { type: String, required: true },
    businessType: { type: String, required: true },
    categories: { type: [String], required: true },
    contactAdress: { type: String, required: true },
    contactEmail: { type: String, required: true },
    country: { type: String, required: true },
    fullName: { type: String, required: true },
    image: { type: [String], required: true },
    residency: { type: String, required: true },
    role: { type: String, required: true },
    shopDescription: { type: String, required: true },
    shopName: { type: String, required: true },
    stripeId: { type: String, required: true },
    tin: { type: Number, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    zip: { type: Number, required: true },
    returnPolicy: { type: String, required: false },
    fashion: { type: Boolean, default: false },
    homeLiving: { type: Boolean, default: false },
    city: { type: String, required: true },
    street: { type: String, required: true },
    status: { type: String, required: true, default: 'pending' },
    swiftCode: { type: String, required: true },
    isPayment: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
export const BecameASeller = model<IBecameASeller>(
  'BecameASeller',
  becameASellerSchema
);
