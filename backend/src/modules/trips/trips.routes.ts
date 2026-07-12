import { Router } from 'express';
import { tripsController } from './trips.controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import {
  createTripBodySchema,
  updateTripBodySchema,
  completeTripBodySchema,
  tripIdParamsSchema,
  listTripsQuerySchema,
} from './trips.schema';

const router = Router();

router.use(authenticate);

/**
 * @openapi
 * /trips:
 *   get:
 *     summary: List trips (paginated, filterable, searchable)
 *     tags: [Trips]
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
 *         schema: { type: string, example: "Draft" }
 *       - in: query
 *         name: vehicleId
 *         schema: { type: integer }
 *       - in: query
 *         name: driverId
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Paginated list of trips
 */
router.get('/', validate({ query: listTripsQuerySchema }), tripsController.list);

/**
 * @openapi
 * /trips/{id}:
 *   get:
 *     summary: Get a single trip by id
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Trip detail
 *       404:
 *         description: Trip not found
 */
router.get('/:id', validate({ params: tripIdParamsSchema }), tripsController.getById);

/**
 * @openapi
 * /trips:
 *   post:
 *     summary: Create a new trip in Draft status
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTripRequest'
 *     responses:
 *       201:
 *         description: Trip created
 *       422:
 *         description: Assignment or cargo validation failed
 */
router.post(
  '/',
  authorize(['Fleet Manager']),
  validate({ body: createTripBodySchema }),
  tripsController.create,
);

/**
 * @openapi
 * /trips/{id}:
 *   put:
 *     summary: Update a Draft trip
 *     tags: [Trips]
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
 *             $ref: '#/components/schemas/UpdateTripRequest'
 *     responses:
 *       200:
 *         description: Trip updated
 *       404:
 *         description: Trip not found
 *       422:
 *         description: Trip is not in Draft status or validation failed
 */
router.put(
  '/:id',
  authorize(['Fleet Manager']),
  validate({ params: tripIdParamsSchema, body: updateTripBodySchema }),
  tripsController.update,
);

/**
 * @openapi
 * /trips/{id}/dispatch:
 *   post:
 *     summary: Dispatch a Draft trip (atomically sets trip, vehicle, and driver to On Trip)
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Trip dispatched
 *       404:
 *         description: Trip not found
 *       422:
 *         description: Invalid status transition or assignment conflict
 */
router.post(
  '/:id/dispatch',
  authorize(['Fleet Manager']),
  validate({ params: tripIdParamsSchema }),
  tripsController.dispatch,
);

/**
 * @openapi
 * /trips/{id}/complete:
 *   post:
 *     summary: Complete a Dispatched trip (atomically releases vehicle and driver)
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompleteTripRequest'
 *     responses:
 *       200:
 *         description: Trip completed
 *       404:
 *         description: Trip not found
 *       422:
 *         description: Invalid status transition
 */
router.post(
  '/:id/complete',
  authorize(['Fleet Manager', 'Driver']),
  validate({ params: tripIdParamsSchema, body: completeTripBodySchema }),
  tripsController.complete,
);

/**
 * @openapi
 * /trips/{id}/cancel:
 *   post:
 *     summary: Cancel a Draft or Dispatched trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Trip cancelled
 *       404:
 *         description: Trip not found
 *       422:
 *         description: Invalid status transition
 */
router.post(
  '/:id/cancel',
  authorize(['Fleet Manager']),
  validate({ params: tripIdParamsSchema }),
  tripsController.cancel,
);

export default router;
