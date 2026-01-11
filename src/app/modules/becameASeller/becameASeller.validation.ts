import { z } from 'zod';

const becameASellerSchema = z.object({
  accountNumber: z.string().min(1, 'accountNumber is required'),
  accountType: z.string().min(1, 'accountType is required'),
  address: z.string().min(1, 'address is required'),
  bankName: z.string().min(1, 'bankName is required'),
  businessAccHolderName: z.string().min(1, 'businessAccHolderName is required'),
  businessAddress: z.string().min(1, 'businessAddress is required'),
  businessEmail: z.string().email('Invalid businessEmail'),
  businessName: z.string().min(1, 'businessName is required'),
  businessPhone: z.string().min(1, 'businessPhone is required'),
  businessReg: z.string().min(1, 'businessReg is required'),
  businessType: z.string().min(1, 'businessType is required'),
  categories: z
    .array(z.string().min(1))
    .nonempty('At least one category is required'),
  contactAdress: z.string().min(1, 'contactAdress is required'),
  contactEmail: z.string().email('Invalid contactEmail'),
  country: z.string().min(1, 'country is required'),
  fullName: z.string().min(1, 'fullName is required'),
  residency: z.string().min(1, 'residency is required'),
  role: z.string().min(1, 'role is required'),
  shopDescription: z.string().min(1, 'shopDescription is required'),
  shopName: z.string().min(1, 'shopName is required'),
  stripeId: z.string().min(1, 'stripeId is required'),
  tin: z.number().int().nonnegative('tin must be a non-negative integer'),
  zip: z.number().int().nonnegative('zip must be a non-negative integer'),
  returnPolicy: z.string().optional(),
  fashion: z.boolean().optional().default(false),
  homeLiving: z.boolean().optional().default(false),
  city: z.string().min(1, 'city is required'),
  street: z.string().min(1, 'street is required'),
  status: z.string().optional().default('pending'),
  swiftCode: z.string().min(1, 'swiftCode is required'),
});

const becameASellerSchemaUpdate = z.object({
  accountNumber: z.string().min(1, 'accountNumber is required').optional(),
  accountType: z.string().min(1, 'accountType is required').optional(),
  address: z.string().min(1, 'address is required').optional(),
  bankName: z.string().min(1, 'bankName is required').optional(),
  businessAccHolderName: z
    .string()
    .min(1, 'businessAccHolderName is required')
    .optional(),
  businessAddress: z.string().min(1, 'businessAddress is required').optional(),
  businessEmail: z.string().email('Invalid businessEmail').optional(),
  businessName: z.string().min(1, 'businessName is required').optional(),
  businessPhone: z.string().min(1, 'businessPhone is required').optional(),
  businessReg: z.string().min(1, 'businessReg is required').optional(),
  businessType: z.string().min(1, 'businessType is required').optional(),

  categories: z
    .array(z.string().min(1))
    .nonempty('At least one category is required')
    .optional(),

  contactAdress: z.string().min(1, 'contactAdress is required').optional(),
  contactEmail: z.string().email('Invalid contactEmail').optional(),
  country: z.string().min(1, 'country is required').optional(),
  fullName: z.string().min(1, 'fullName is required').optional(),
  residency: z.string().min(1, 'residency is required').optional(),
  role: z.string().min(1, 'role is required').optional(),
  shopDescription: z.string().min(1, 'shopDescription is required').optional(),
  shopName: z.string().min(1, 'shopName is required').optional(),
  stripeId: z.string().min(1, 'stripeId is required').optional(),

  tin: z
    .number()
    .int()
    .nonnegative('tin must be a non-negative integer')
    .optional(),

  zip: z
    .number()
    .int()
    .nonnegative('zip must be a non-negative integer')
    .optional(),

  returnPolicy: z.string().optional(),

  fashion: z.boolean().optional().default(false),
  homeLiving: z.boolean().optional().default(false),

  city: z.string().min(1, 'city is required').optional(),
  street: z.string().min(1, 'street is required').optional(),

  status: z.string().optional().default('pending'),

  swiftCode: z.string().min(1, 'swiftCode is required').optional(),
});

export const BecameASellerValidation = {
  becameASellerSchema,
  becameASellerSchemaUpdate,
};
