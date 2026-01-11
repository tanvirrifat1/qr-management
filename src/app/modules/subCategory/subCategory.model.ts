import { model, Schema } from 'mongoose';
import { ISubCategory } from './subCategory.interface';

const subCategorySchema = new Schema<ISubCategory>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const SubCategory = model<ISubCategory>(
  'SubCategory',
  subCategorySchema
);
