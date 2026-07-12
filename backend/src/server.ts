import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { logger } from './utils/logger';

async function bootstrap(): Promise<void> {
  await connectDatabase();

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    logger.info(`🚀 DriveCore API listening on port ${env.PORT} [${env.NODE_ENV}]`);
    logger.info(`📘 Swagger docs: http://localhost:${env.PORT}/api-docs`);
  });

  // Cron jobs (e.g. license-expiry reminders) are wired here once the
  // relevant module exists:
  // import './jobs/licenseExpiryReminder';

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });

    // Force-exit if graceful shutdown hangs
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled promise rejection', { reason });
  });

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', { error });
    process.exit(1);
  });
}

bootstrap().catch((err) => {
  logger.error('Failed to bootstrap application', { error: err });
  process.exit(1);
});
