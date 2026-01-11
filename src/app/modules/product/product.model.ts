import { model, Schema } from 'mongoose';
import { IProduct } from './product.interface';

const proudctSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    brand: { type: String, required: true },
    size: [{ type: String, required: true }],
    des: { type: String, required: true },
    return: { type: String, required: false },
    deliveryChargeInDc: { type: String, required: false },
    deliveryChargeOutOfDc: { type: String, required: false },
    carrier: { type: String, required: true },
    sku: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subCategoryId: {
      type: Schema.Types.ObjectId,
      ref: 'SubCategory',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    image: [{ type: String, required: true }],
    rating: { type: Number, required: false },
    count: { type: Number, required: false },
    status: { type: String, required: true, default: 'active' },
    inStock: { type: Boolean, required: true, default: true },
    discount: { type: Number, required: false },
    careInsturction: { type: String, required: false },
    closureType: { type: String, required: false },
    frbricType: { type: String, required: false },
    origin: { type: String, required: false },
  },
  { timestamps: true }
);

export const Product = model<IProduct>('Product', proudctSchema);
