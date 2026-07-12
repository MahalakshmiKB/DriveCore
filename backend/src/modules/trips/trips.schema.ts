import { z } from 'zod';
import { TRIP_SORTABLE_FIELDS, MAX_PAGE_SIZE } from './trips.constants';

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateTripRequest:
 *       type: object
 *       required: [source, destination, vehicleId, driverId, cargoWeightKg, plannedDistanceKm]
 *       properties:
 *         source: { type: string, example: "Chennai" }
 *         destination: { type: string, example: "Bangalore" }
 *         vehicleId: { type: integer, example: 1 }
 *         driverId: { type: integer, example: 2 }
 *         cargoWeightKg: { type: number, example: 500 }
 *         plannedDistanceKm: { type: number, example: 350 }
 */
export const createTripBodySchema = z.object({
  source: z.string().trim().min(1).max(150),
  destination: z.string().trim().min(1).max(150),
  vehicleId: z.coerce.number().int().positive(),
  driverId: z.coerce.number().int().positive(),
  cargoWeightKg: z.coerce.number().positive('cargoWeightKg must be greater than 0'),
  plannedDistanceKm: z.coerce.number().positive('plannedDistanceKm must be greater than 0'),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateTripRequest:
 *       type: object
 *       properties:
 *         source: { type: string }
 *         destination: { type: string }
 *         vehicleId: { type: integer }
 *         driverId: { type: integer }
 *         cargoWeightKg: { type: number }
 *         plannedDistanceKm: { type: number }
 */
export const updateTripBodySchema = z
  .object({
    source: z.string().trim().min(1).max(150).optional(),
    destination: z.string().trim().min(1).max(150).optional(),
    vehicleId: z.coerce.number().int().positive().optional(),
    driverId: z.coerce.number().int().positive().optional(),
    cargoWeightKg: z.coerce.number().positive('cargoWeightKg must be greater than 0').optional(),
    plannedDistanceKm: z.coerce.number().positive('plannedDistanceKm must be greater than 0').optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided to update',
  });

/**
 * @openapi
 * components:
 *   schemas:
 *     CompleteTripRequest:
 *       type: object
 *       properties:
 *         actualDistanceKm: { type: number, example: 360 }
 *         fuelConsumedLiters: { type: number, example: 85.5 }
 */
export const completeTripBodySchema = z.object({
  actualDistanceKm: z.coerce.number().positive('actualDistanceKm must be greater than 0').optional(),
  fuelConsumedLiters: z.coerce.number().min(0, 'fuelConsumedLiters must be >= 0').optional(),
});

export const tripIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const listTripsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(MAX_PAGE_SIZE).default(20),
  sort: z
    .string()
    .optional()
    .refine((val) => !val || TRIP_SORTABLE_FIELDS.includes(val.replace(/^-/, '') as any), {
      message: `sort must be one of: ${TRIP_SORTABLE_FIELDS.join(', ')} (prefix with "-" for descending)`,
    }),
  search: z.string().trim().max(150).optional(),
  status: z.string().trim().max(50).optional(),
  vehicleId: z.coerce.number().int().positive().optional(),
  driverId: z.coerce.number().int().positive().optional(),
});

export type CreateTripBody = z.infer<typeof createTripBodySchema>;
export type UpdateTripBody = z.infer<typeof updateTripBodySchema>;
export type CompleteTripBody = z.infer<typeof completeTripBodySchema>;
export type TripIdParams = z.infer<typeof tripIdParamsSchema>;
export type ListTripsQuery = z.infer<typeof listTripsQuerySchema>;
