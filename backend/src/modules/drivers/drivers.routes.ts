import { Router } from 'express';
import { driversController } from './drivers.controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/authenticate';
import { authorize } from '../../middlewares/authorize';
import {
  createDriverBodySchema,
  updateDriverBodySchema,
  driverIdParamsSchema,
  listDriversQuerySchema,
} from './drivers.schema';

const router = Router();

// All driver routes require authentication
router.use(authenticate);

/**
 * @openapi
 * /drivers:
 *   get:
 *     summary: List drivers (paginated, filterable, searchable)
 *     tags: [Drivers]
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
 *         name: licenseCategory
 *         schema: { type: string, example: "LMV" }
 *     responses:
 *       200:
 *         description: Paginated list of drivers
 */
router.get('/', validate({ query: listDriversQuerySchema }), driversController.list);

/**
 * @openapi
 * /drivers/available:
 *   get:
 *     summary: List dispatch-eligible drivers (status = Available, valid license)
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Available drivers with non-expired licenses
 */
router.get('/available', authorize(['Driver', 'Fleet Manager']), driversController.available);

/**
 * @openapi
 * /drivers/{id}:
 *   get:
 *     summary: Get a single driver by id
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Driver detail
 *       404:
 *         description: Driver not found
 */
router.get('/:id', validate({ params: driverIdParamsSchema }), driversController.getById);

/**
 * @openapi
 * /drivers:
 *   post:
 *     summary: Register a new driver (status defaults to Available)
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDriverRequest'
 *     responses:
 *       201:
 *         description: Driver created
 *       409:
 *         description: Duplicate license number
 */
router.post(
  '/',
  authorize(['Fleet Manager']),
  validate({ body: createDriverBodySchema }),
  driversController.create,
);

/**
 * @openapi
 * /drivers/{id}:
 *   put:
 *     summary: Update a driver
 *     tags: [Drivers]
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
 *             $ref: '#/components/schemas/UpdateDriverRequest'
 *     responses:
 *       200:
 *         description: Driver updated
 *       404:
 *         description: Driver not found
 *       409:
 *         description: Duplicate license number
 */
router.put(
  '/:id',
  authorize(['Fleet Manager']),
  validate({ params: driverIdParamsSchema, body: updateDriverBodySchema }),
  driversController.update,
);

/**
 * @openapi
 * /drivers/{id}:
 *   delete:
 *     summary: Soft-deactivate a driver (sets status = Suspended, does not delete the row)
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Driver suspended
 *       404:
 *         description: Driver not found
 *       409:
 *         description: Driver already suspended
 *       422:
 *         description: Driver currently on a trip cannot be suspended
 */
router.delete(
  '/:id',
  authorize(['Fleet Manager']),
  validate({ params: driverIdParamsSchema }),
  driversController.suspend,
);

export default router;
