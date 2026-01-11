import { z } from 'zod';

const createCategoryZodSchema = z.object({
  title: z.string({
    required_error: 'Title is required',
  }),
});

const updateCategoryZodSchema = z.object({
  title: z.string().optional(),
});

export const CategoryValidation = {
  createCategoryZodSchema,
  updateCategoryZodSchema,
};
