import { z } from 'zod';

export const updateZodSchema = z.object({
  subject: z.string({
    required_error: 'Subject is required',
  }),
  des: z.string({
    required_error: 'Description is required',
  }),
  image: z.string().optional(),
});
