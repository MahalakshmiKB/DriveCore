import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { mountSwagger } from './config/swagger';
import { notFoundHandler, errorHandler } from './middlewares/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import vehicleRoutes from './modules/vehicles/vehicles.routes';
import driverRoutes from './modules/drivers/drivers.routes';
import tripRoutes from './modules/trips/trips.routes';

export function createApp(): Express {
  const app = express();

  // ── Security & parsing ──────────────────────────────────
  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_ORIGIN,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Baseline global rate limit (auth-specific routes apply a stricter one)
  app.use(
    rateLimit({
      windowMs: 60_000,
      max: 300,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  // ── Health check ─────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', service: 'drivecore-backend', env: env.NODE_ENV });
  });

  // ── API docs ─────────────────────────────────────────────
  mountSwagger(app);

  // ── Routes ───────────────────────────────────────────────
  const api = express.Router();
  api.use('/auth', authRoutes);
  api.use('/vehicles', vehicleRoutes);
  api.use('/drivers', driverRoutes);
  api.use('/trips', tripRoutes);
  // Future modules mount here, e.g.:
  // api.use('/maintenance', maintenanceRoutes);

  app.use(env.API_PREFIX, api);

  // ── Fallbacks ────────────────────────────────────────────
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
