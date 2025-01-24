import { z } from 'zod';

const createCarValidationSchema = z.object({
  body: z.object({
    brand: z.string().min(1, { message: 'Car Brand is required.' }),
    model: z.string().min(1, { message: 'Car Model is required.' }),
    year: z
      .number()
      .int()
      .gte(1886, { message: 'Year must be 1886 or later.' }) // SINCE CARS WERE INVEMTED IN 1886, CHECK LINK => https://www.thoughtco.com/who-invented-the-car-4059932#:~:text=On%20January%2029%2C%201886%2C%20Benz,manufacturer%20of%20automobiles%20by%201900.
      .lte(new Date().getFullYear(), {
        message: 'Year cannot be in the future.',
      }),
    price: z
      .number()
      .positive({ message: 'Car Price must be a positive number.' }),
    category: z.enum(['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible'], {
      required_error: 'Car Category is required.',
    }),
    description: z.string().min(1, { message: 'Car Description is required.' }),
    quantity: z
      .number()
      .int()
      .nonnegative({ message: 'Car Quantity cannot be negative.' }),
    inStock: z.boolean({ required_error: 'InStock field is required.' }),
  }),
});

const updateCarValidationSchema = z.object({
  body: z.object({
    brand: z.string().min(1, { message: 'Car Brand is required.' }).optional(),
    model: z.string().min(1, { message: 'Car Model is required.' }).optional(),
    year: z
      .number()
      .int()
      .gte(1886, { message: 'Year must be 1886 or later.' })
      .lte(new Date().getFullYear(), {
        message: 'Year cannot be in the future.',
      })
      .optional(),
    price: z
      .number()
      .positive({ message: 'Car Price must be a positive number.' })
      .optional(),
    category: z
      .enum(['Sedan', 'SUV', 'Truck', 'Coupe', 'Convertible'], {
        required_error: 'Car Category is required.',
      })
      .optional(),
    description: z
      .string()
      .min(1, { message: 'Car Description is required.' })
      .optional(),
    quantity: z
      .number()
      .int()
      .nonnegative({ message: 'Car Quantity cannot be negative.' })
      .optional(),
    inStock: z
      .boolean({ required_error: 'InStock field is required.' })
      .optional(),
  }),
});

export const CarValidationSchema = {
  createCarValidationSchema,
  updateCarValidationSchema,
};
