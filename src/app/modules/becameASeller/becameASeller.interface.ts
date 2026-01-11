import { Types } from 'mongoose';

export type IBecameASeller = {
  userId: Types.ObjectId;
  businessType: string;
  businessName: string;
  businessReg: string;
  businessAddress: string;
  country: string;
  businessPhone: string;
  businessEmail: string;
  image: string[];
  tin: number;
  residency: string;
  fullName: string;
  role: string;
  contactEmail: string;
  contactAdress: string;
  address: string;
  shopName: string;
  shopDescription: string;
  returnPolicy?: string;
  categories: string[];
  fashion?: boolean;
  homeLiving?: boolean;
  businessAccHolderName: string;
  bankName: string;
  accountNumber: string;
  swiftCode: string;
  accountType: string;
  stripeId?: string;
  street: string;
  city: string;
  zip: number;
  status: string;
  isPayment: boolean;
};

export type UpdateBecameASellerPayload = Partial<IBecameASeller> & {
  imagesToDelete?: string[];
};
