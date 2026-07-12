import { z } from 'zod';

const passwordRule = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[0-9]/, 'Password must contain a number');

/**
 * @openapi
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required: [fullName, email, password, roleId]
 *       properties:
 *         fullName: { type: string, example: "Asha Rao" }
 *         email: { type: string, format: email, example: "asha@drivecore.app" }
 *         password: { type: string, format: password, example: "Str0ngPass!" }
 *         roleId: { type: integer, example: 2 }
 */
export const registerBodySchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email().max(150),
  password: passwordRule,
  roleId: z.coerce.number().int().positive(),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email: { type: string, format: email }
 *         password: { type: string, format: password }
 */
export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordBodySchema = z.object({
  email: z.string().email(),
});

export const resetPasswordBodySchema = z.object({
  token: z.string().min(1),
  newPassword: passwordRule,
});

export const refreshBodySchema = z.object({
  // optional: only needed if the client isn't relying on the httpOnly refresh cookie
  refreshToken: z.string().min(1).optional(),
});

export type RegisterBody = z.infer<typeof registerBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
export type ForgotPasswordBody = z.infer<typeof forgotPasswordBodySchema>;
export type ResetPasswordBody = z.infer<typeof resetPasswordBodySchema>;
export type RefreshBody = z.infer<typeof refreshBodySchema>;
