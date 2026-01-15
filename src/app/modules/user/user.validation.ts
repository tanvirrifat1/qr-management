import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    firstName: z.string({ required_error: 'FirstName is required' }),
    lastName: z.string({ required_error: 'LastName is required' }),
    email: z.string({ required_error: 'Email name is required' }),
    password: z.string({ required_error: 'Password is required' }).min(6),
  }),
});

const updateZodSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  address: z.string().optional(),
  streetName: z.string().optional(),
  area: z.string().optional(),
  city: z.string().optional(),
  zip: z.number().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
});

export const UserValidation = {
  createUserZodSchema,
  updateZodSchema,
};
