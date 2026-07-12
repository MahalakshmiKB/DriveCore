import { Router } from 'express';
import { vehiclesController } from './vehicles.controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import {
  createVehicleBodySchema,
  updateVehicleBodySchema,
  vehicleIdParamsSchema,
  listVehiclesQuerySchema,
} from './vehicles.schema';

const router = Router();

// All vehicle routes require authentication
router.use(authenticate);

/**
 * @openapi
 * /vehicles:
 *   get:
 *     summary: List vehicles (paginated, filterable, searchable)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *       - in: query
 *         name: sort
 *         schema: { type: string, example: "-createdAt" }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, example: "Available" }
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *       - in: query
 *         name: region
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Paginated list of vehicles
 */
router.get('/', validate({ query: listVehiclesQuerySchema }), vehiclesController.list);

/**
 * @openapi
 * /vehicles/available:
 *   get:
 *     summary: List dispatch-eligible vehicles only (status = Available)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Available vehicles
 */
router.get('/available', authorize(['Driver', 'Fleet Manager']), vehiclesController.available);

/**
 * @openapi
 * /vehicles/{id}:
 *   get:
 *     summary: Get a single vehicle by id
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Vehicle detail
 *       404:
 *         description: Vehicle not found
 */
router.get('/:id', validate({ params: vehicleIdParamsSchema }), vehiclesController.getById);

/**
 * @openapi
 * /vehicles:
 *   post:
 *     summary: Register a new vehicle (status defaults to Available)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVehicleRequest'
 *     responses:
 *       201:
 *         description: Vehicle created
 *       409:
 *         description: Duplicate registration number
 */
router.post(
  '/',
  authorize(['Fleet Manager']),
  validate({ body: createVehicleBodySchema }),
  vehiclesController.create,
);

/**
 * @openapi
 * /vehicles/{id}:
 *   put:
 *     summary: Update a vehicle
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateVehicleRequest'
 *     responses:
 *       200:
 *         description: Vehicle updated
 *       404:
 *         description: Vehicle not found
 *       409:
 *         description: Duplicate registration number
 */
router.put(
  '/:id',
  authorize(['Fleet Manager']),
  validate({ params: vehicleIdParamsSchema, body: updateVehicleBodySchema }),
  vehiclesController.update,
);

/**
 * @openapi
 * /vehicles/{id}:
 *   delete:
 *     summary: Soft-retire a vehicle (sets status = Retired, does not delete the row)
 *     tags: [Vehicles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Vehicle retired
 *       404:
 *         description: Vehicle not found
 *       409:
 *         description: Vehicle already retired
 *       422:
 *         description: Vehicle currently on a trip cannot be retired
 */
router.delete(
  '/:id',
  authorize(['Fleet Manager']),
  validate({ params: vehicleIdParamsSchema }),
  vehiclesController.retire,
);

export default router;
