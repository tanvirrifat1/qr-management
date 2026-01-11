import { Types } from 'mongoose';

export type IProduct = {
  categoryId: Types.ObjectId;
  subCategoryId: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  price: number;
  brand: string;
  size: string[];
  des: string;
  return?: string;
  deliveryChargeInDc?: string;
  deliveryChargeOutOfDc?: string;
  carrier: string;
  sku: string;
  image: string[];
  rating?: number;
  count?: number;
  status: 'active' | 'deleted';
  inStock: boolean;
  discount: number;
  frbricType: string;
  careInsturction: string;
  origin: string;
  closureType: string;
};

export type UpdateProductPayload = Partial<IProduct> & {
  imagesToDelete?: string[];
};
