import { z } from 'zod';

export const phoneSchema = z.object({
  countryCode: z.string().min(1, 'required'),
  phoneNumber: z.string()
    .min(4, 'Phone number must be at least 4 digits')
    .max(17, 'Phone number must be at most 17 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
});

export const otpSchema = z.object({
  otp: z.string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only digits'),
});

export const chatRoomSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(50, 'Title must be less than 50 characters'),
});

export const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty'),
  image: z.any().optional(),
});