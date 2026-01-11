import { z } from 'zod';

const createProductZodSchema = z.object({
  title: z.string({
    required_error: 'Title is required',
  }),

  price: z.number({
    required_error: 'Price is required',
  }),

  brand: z.string({
    required_error: 'Brand is required',
  }),

  size: z
    .array(
      z.string({
        required_error: 'Size is required',
      })
    )
    .nonempty(),

  des: z.string({
    required_error: 'Description is required',
  }),

  return: z.string().optional(),

  deliveryChargeInDc: z.string().optional(),

  deliveryChargeOutOfDc: z.string().optional(),

  carrier: z.string({
    required_error: 'Carrier is required',
  }),

  sku: z.string({
    required_error: 'SKU is required',
  }),

  categoryId: z.string({
    required_error: 'CategoryId is required',
  }),

  subCategoryId: z.string({
    required_error: 'SubCategoryId is required',
  }),

  closureType: z.string({
    required_error: 'ClosureType is required',
  }),

  origin: z.string({
    required_error: 'Origin is required',
  }),

  careInsturction: z.string({
    required_error: 'CareInsturction is required',
  }),

  frbricType: z.string({
    required_error: 'FrbricType is required',
  }),

  rating: z.number().optional(),
});

const updateProductZodSchema = z.object({
  title: z.string().optional(),

  price: z.number().optional(),

  brand: z.string().optional(),

  size: z.array(z.string()).nonempty().optional(),

  des: z.string().optional(),

  return: z.string().optional(),

  deliveryChargeInDc: z.string().optional(),

  deliveryChargeOutOfDc: z.string().optional(),

  carrier: z.string().optional(),

  sku: z.string().optional(),

  categoryId: z.string().optional(),

  subCategoryId: z.string().optional(),

  rating: z.number().optional(),
  status: z.string().optional(),
  discount: z.number().optional(),
  inStock: z.boolean().optional(),

  closureType: z.string().optional(),

  origin: z.string().optional(),

  careInsturction: z.string().optional(),

  frbricType: z.string().optional(),
});

export const ProductValidation = {
  createProductZodSchema,
  updateProductZodSchema,
};
