import { z } from 'zod';

const CreateCouponSchema = z.object({
  body: z.object({
    code: z.string().min(3).max(50).toUpperCase(),
    discountAmount: z.number().positive(),
    discountType: z.enum(['flat', 'percentage']),
    expiryDate: z.string().datetime(),
  }),
});

const ApplyCouponSchema = z.object({
  body: z.object({
    code: z.string().min(3).max(50),
    carIds: z.array(z.string().min(1)),
  }),
});

export const UpdateCouponSchema = z.object({
  body: z.object({
    code: z.string().optional(),
    carId: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .optional(),
    discountAmount: z.number().positive().optional(),
    discountType: z.enum(['flat', 'percentage']).optional(),
    expiryDate: z.string().datetime().optional(),
  }),
});

export const CouponValidationSchema = {
  CreateCouponSchema,
  ApplyCouponSchema,
  UpdateCouponSchema,
};
