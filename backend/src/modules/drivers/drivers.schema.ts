import { z } from 'zod';
import {
  DRIVER_SORTABLE_FIELDS,
  MAX_PAGE_SIZE,
  MAX_SAFETY_SCORE,
  MIN_SAFETY_SCORE,
} from './drivers.constants';

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateDriverRequest:
 *       type: object
 *       required: [fullName, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber]
 *       properties:
 *         fullName: { type: string, example: "Ava Monroe" }
 *         licenseNumber: { type: string, example: "LMV-9921" }
 *         licenseCategory: { type: string, example: "LMV" }
 *         licenseExpiryDate: { type: string, format: date, example: "2027-10-15" }
 *         contactNumber: { type: string, example: "+919876543210" }
 *         safetyScore: { type: integer, minimum: 0, maximum: 100, example: 100 }
 */
export const createDriverBodySchema = z.object({
  fullName: z.string().trim().min(1).max(100),
  licenseNumber: z
    .string()
    .trim()
    .min(3, 'licenseNumber is too short')
    .max(30, 'licenseNumber must be at most 30 characters'),
  licenseCategory: z.string().trim().min(1).max(20),
  licenseExpiryDate: z.coerce.date(),
  contactNumber: z.string().trim().min(5).max(20),
  safetyScore: z.coerce
    .number()
    .int()
    .min(MIN_SAFETY_SCORE, `safetyScore must be >= ${MIN_SAFETY_SCORE}`)
    .max(MAX_SAFETY_SCORE, `safetyScore must be <= ${MAX_SAFETY_SCORE}`)
    .optional(),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateDriverRequest:
 *       type: object
 *       properties:
 *         fullName: { type: string }
 *         licenseNumber: { type: string }
 *         licenseCategory: { type: string }
 *         licenseExpiryDate: { type: string, format: date }
 *         contactNumber: { type: string }
 *         safetyScore: { type: integer, minimum: 0, maximum: 100 }
 *         statusId: { type: integer }
 */
export const updateDriverBodySchema = z
  .object({
    fullName: z.string().trim().min(1).max(100).optional(),
    licenseNumber: z.string().trim().min(3).max(30).optional(),
    licenseCategory: z.string().trim().min(1).max(20).optional(),
    licenseExpiryDate: z.coerce.date().optional(),
    contactNumber: z.string().trim().min(5).max(20).optional(),
    safetyScore: z.coerce
      .number()
      .int()
      .min(MIN_SAFETY_SCORE, `safetyScore must be >= ${MIN_SAFETY_SCORE}`)
      .max(MAX_SAFETY_SCORE, `safetyScore must be <= ${MAX_SAFETY_SCORE}`)
      .optional(),
    statusId: z.coerce.number().int().positive().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update',
  });

export const driverIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const listDriversQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(MAX_PAGE_SIZE).default(20),
  sort: z
    .string()
    .optional()
    .refine((val) => !val || DRIVER_SORTABLE_FIELDS.includes(val.replace(/^-/, '') as any), {
      message: `sort must be one of: ${DRIVER_SORTABLE_FIELDS.join(', ')} (prefix with "-" for descending)`,
    }),
  search: z.string().trim().max(150).optional(),
  status: z.string().trim().max(50).optional(),
  licenseCategory: z.string().trim().max(20).optional(),
});

export type CreateDriverBody = z.infer<typeof createDriverBodySchema>;
export type UpdateDriverBody = z.infer<typeof updateDriverBodySchema>;
export type DriverIdParams = z.infer<typeof driverIdParamsSchema>;
export type ListDriversQuery = z.infer<typeof listDriversQuerySchema>;
