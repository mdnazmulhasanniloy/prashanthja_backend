import { z } from 'zod';
import { Role, USER_ROLE } from './user.constants';

const userValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'name is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email address' }),
    phoneNumber: z
      .string()
      .min(1, 'Phone number is required')
      .regex(/^(\+?\d{8,15})$/, 'Invalid phone number'),
    address: z.string({ required_error: 'Address is required' }),
    role: z.enum([...Role] as [string, ...string[]]).default(USER_ROLE.user),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

export const userValidation = {
  userValidationSchema,
};
