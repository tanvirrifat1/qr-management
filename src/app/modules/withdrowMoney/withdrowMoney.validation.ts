import { z } from 'zod';

export const withdrawSchema = z.object({
  status: z.string().min(1, { message: 'Status is required' }),
  image: z.string().optional(),

  cardNumber: z.string().optional(),

  country: z.string().optional(),

  cvc: z.string().optional(),

  date: z.coerce.date().optional(),

  nameOfCard: z.string().optional(),

  zipCode: z.string().optional(),
});
