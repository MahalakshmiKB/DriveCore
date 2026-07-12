import { z } from 'zod';
import { VEHICLE_SORTABLE_FIELDS, MAX_PAGE_SIZE } from './vehicles.constants';

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateVehicleRequest:
 *       type: object
 *       required: [registrationNumber, nameModel, type, maxLoadCapacityKg, acquisitionCost]
 *       properties:
 *         registrationNumber: { type: string, example: "TN01AB1234" }
 *         nameModel: { type: string, example: "Tata Ace" }
 *         type: { type: string, example: "Mini Truck" }
 *         maxLoadCapacityKg: { type: number, example: 750 }
 *         acquisitionCost: { type: number, example: 550000 }
 *         odometerKm: { type: number, example: 0 }
 *         region: { type: string, example: "Chennai" }
 */
export const createVehicleBodySchema = z.object({
  registrationNumber: z
    .string()
    .trim()
    .min(3, 'registrationNumber is too short')
    .max(20, 'registrationNumber must be at most 20 characters'),
  nameModel: z.string().trim().min(1).max(100),
  type: z.string().trim().min(1).max(50),
  maxLoadCapacityKg: z.coerce.number().positive('maxLoadCapacityKg must be greater than 0'),
  acquisitionCost: z.coerce.number().min(0, 'acquisitionCost must be >= 0'),
  odometerKm: z.coerce.number().min(0).optional(),
  region: z.string().trim().max(100).optional(),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateVehicleRequest:
 *       type: object
 *       properties:
 *         registrationNumber: { type: string }
 *         nameModel: { type: string }
 *         type: { type: string }
 *         maxLoadCapacityKg: { type: number }
 *         acquisitionCost: { type: number }
 *         odometerKm: { type: number }
 *         region: { type: string }
 *         statusId: { type: integer }
 */
export const updateVehicleBodySchema = z
  .object({
    registrationNumber: z.string().trim().min(3).max(20).optional(),
    nameModel: z.string().trim().min(1).max(100).optional(),
    type: z.string().trim().min(1).max(50).optional(),
    maxLoadCapacityKg: z.coerce.number().positive('maxLoadCapacityKg must be greater than 0').optional(),
    acquisitionCost: z.coerce.number().min(0, 'acquisitionCost must be >= 0').optional(),
    odometerKm: z.coerce.number().min(0).optional(),
    region: z.string().trim().max(100).optional(),
    statusId: z.coerce.number().int().positive().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update',
  });

export const vehicleIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const listVehiclesQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(MAX_PAGE_SIZE).default(20),
  sort: z
    .string()
    .optional()
    .refine((val) => !val || VEHICLE_SORTABLE_FIELDS.includes(val.replace(/^-/, '') as any), {
      message: `sort must be one of: ${VEHICLE_SORTABLE_FIELDS.join(', ')} (prefix with "-" for descending)`,
    }),
  search: z.string().trim().max(150).optional(),
  status: z.string().trim().max(50).optional(),
  type: z.string().trim().max(50).optional(),
  region: z.string().trim().max(100).optional(),
});

export type CreateVehicleBody = z.infer<typeof createVehicleBodySchema>;
export type UpdateVehicleBody = z.infer<typeof updateVehicleBodySchema>;
export type VehicleIdParams = z.infer<typeof vehicleIdParamsSchema>;
export type ListVehiclesQuery = z.infer<typeof listVehiclesQuerySchema>;
