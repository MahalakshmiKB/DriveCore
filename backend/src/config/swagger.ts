import swaggerJSDoc from 'swagger-jsdoc';
import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import { env } from './env';

const swaggerDefinition: swaggerJSDoc.Options['definition'] = {
  openapi: '3.0.3',
  info: {
    title: 'DriveCore API',
    version: '0.1.0',
    description:
      'Smart Transport Operations Platform — REST API. This spec currently documents ' +
      'the Auth module only; further modules (vehicles, drivers, trips, maintenance, ' +
      'fuel, expenses, reports, dashboard) will extend this document as they are built.',
  },
  servers: [
    {
      url: `http://localhost:${env.PORT}${env.API_PREFIX}`,
      description: 'Local development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ApiError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Validation failed' },
          errors: {
            type: 'array',
            items: { type: 'object' },
          },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  // jsdoc comments live alongside each module's *.routes.ts file
  apis: ['./src/modules/**/*.routes.ts', './src/modules/**/*.schema.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);

export function mountSwagger(app: Express): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}
