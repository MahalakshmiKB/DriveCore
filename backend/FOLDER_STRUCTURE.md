# DriveCore Backend — Folder Structure

This is the backend foundation only. Domain modules (vehicles, drivers, trips,
maintenance, fuel, expenses, dashboard, reports, AI) are intentionally NOT
included yet — only `auth` is fully implemented, per scope.

```
drivecore-backend/
├── src/
│   ├── config/
│   │   ├── database.ts        # Prisma client singleton
│   │   ├── env.ts              # typed, validated environment variables
│   │   └── swagger.ts          # swagger-jsdoc + swagger-ui-express setup
│   │
│   ├── middlewares/
│   │   ├── authenticate.ts     # verifies JWT access token, attaches req.user
│   │   ├── authorize.ts        # role-based route guard factory
│   │   ├── validate.ts         # generic Zod body/query/params validator
│   │   └── errorHandler.ts     # centralized error handler (last middleware)
│   │
│   ├── modules/
│   │   └── auth/
│   │       ├── auth.types.ts       # TS interfaces/types for this module
│   │       ├── auth.schema.ts      # Zod request schemas
│   │       ├── auth.repository.ts  # Prisma data-access layer
│   │       ├── auth.service.ts     # business logic
│   │       ├── auth.controller.ts  # Express request handlers
│   │       └── auth.routes.ts      # route wiring + Swagger jsdoc
│   │
│   │   # Future modules go here as siblings of auth/:
│   │   # vehicles/, drivers/, trips/, maintenance/, fuel/, expenses/,
│   │   # reports/, dashboard/, notifications/, audit/
│   │
│   ├── utils/
│   │   ├── logger.ts           # Winston logger instance
│   │   ├── jwt.ts              # sign/verify access + refresh tokens
│   │   ├── password.ts         # bcrypt hash/compare helpers
│   │   ├── ApiError.ts         # custom operational error class
│   │   └── ApiResponse.ts      # standard success response envelope
│   │
│   ├── jobs/
│   │   └── .gitkeep            # reserved for node-cron jobs (e.g. license
│   │                           # expiry reminders) — added with later modules
│   │
│   ├── types/
│   │   └── express.d.ts        # Express Request augmentation (req.user)
│   │
│   ├── app.ts                  # Express app: middleware wiring, routes, docs
│   └── server.ts               # entrypoint: boot, listen, graceful shutdown
│
├── prisma/
│   ├── schema.prisma           # full data model (all 16 tables)
│   └── seed.ts                 # seeds roles + all status/type lookup tables
│
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── FOLDER_STRUCTURE.md
```
