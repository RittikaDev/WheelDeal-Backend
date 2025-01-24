import { z } from 'zod';

// DEFINING THE TUser SCHEMA WITH CUSTOM ERROR MESSAGE
const CreateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z
      .string()
      .email({ message: 'Invalid email address' })
      .nonempty({ message: 'Email is required' }),
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .nonempty({ message: 'Password is required' }),
    role: z.enum(['admin', 'user']).optional().default('user'),
    isBlocked: z.boolean().optional().default(false),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }),
    password: z.string({ required_error: ' Password is required' }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'refresh token is required',
    }),
  }),
});

export const UserValidations = {
  CreateUserValidationSchema,
  loginValidationSchema,
  refreshTokenValidationSchema,
};
