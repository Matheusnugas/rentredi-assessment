import { z } from 'zod';

export interface User {
  id: string;
  name: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  zipCode: string;
}

export interface UpdateUserData {
  name?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters').optional(),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format').optional(),
});

export const userResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  zipCode: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CreateUserRequest = z.infer<typeof createUserSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
export type UserResponse = z.infer<typeof userResponseSchema>; 