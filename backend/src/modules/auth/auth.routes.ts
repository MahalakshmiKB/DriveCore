import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { authController } from './auth.controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/authenticate';
import {
  registerBodySchema,
  loginBodySchema,
  forgotPasswordBodySchema,
  resetPasswordBodySchema,
  refreshBodySchema,
} from './auth.schema';
import { env } from '../../config/env';

const router = Router();

const authRateLimiter = rateLimit({
  windowMs: env.AUTH_RATE_LIMIT_WINDOW_MS,
  max: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again later' },
});

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Create a new user account
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Account created
 *       409:
 *         description: Email already registered
 */
router.post('/register', validate({ body: registerBodySchema }), authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Authenticate with email + password, receive access token (refresh token set as httpOnly cookie)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authRateLimiter, validate({ body: loginBodySchema }), authController.login);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Rotate the refresh token and issue a new access token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refreshed
 *       401:
 *         description: Refresh token invalid/expired
 */
router.post('/refresh', validate({ body: refreshBodySchema }), authController.refresh);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Invalidate the current refresh token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out
 */
router.post('/logout', authController.logout);

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     summary: Send a password-reset email (always returns 200 to avoid email enumeration)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, format: email }
 *     responses:
 *       200:
 *         description: Reset email sent if the account exists
 */
router.post(
  '/forgot-password',
  authRateLimiter,
  validate({ body: forgotPasswordBodySchema }),
  authController.forgotPassword,
);

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     summary: Set a new password using a valid reset token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, newPassword]
 *             properties:
 *               token: { type: string }
 *               newPassword: { type: string, format: password }
 *     responses:
 *       200:
 *         description: Password reset
 *       400:
 *         description: Invalid or expired token
 */
router.post('/reset-password', validate({ body: resetPasswordBodySchema }), authController.resetPassword);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get the currently authenticated user's profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user
 *       401:
 *         description: Not authenticated
 */
router.get('/me', authenticate, authController.me);

export default router;
