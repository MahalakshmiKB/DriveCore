# DriveCore Backend — Foundation

Backend foundation for the DriveCore Smart Transport Operations Platform.
This delivery includes infrastructure (config, middlewares, utils, Prisma
schema for all 16 tables) plus one fully working module: **Auth**.

Stack: Node.js 22 · Express · TypeScript · MySQL · Prisma · JWT · bcrypt ·
Zod · Winston · Swagger · dotenv · Helmet · CORS · express-rate-limit ·
Nodemailer · node-cron.

## Setup

```bash
cp .env.example .env        # fill in DATABASE_URL, JWT secrets, SMTP, etc.
npm install
npm run prisma:generate
npm run prisma:migrate      # creates tables in your MySQL database
npm run prisma:seed         # seeds roles, status lookups, and a default admin
npm run dev                 # http://localhost:4000
```

Default seeded admin login: `admin@drivecore.app` / `ChangeMe123!`
(change immediately in a real environment).

- API base: `http://localhost:4000/api/v1`
- Swagger docs: `http://localhost:4000/api-docs`
- Health check: `http://localhost:4000/health`

## What's included

- Full folder structure (see `FOLDER_STRUCTURE.md`)
- Prisma schema for all 16 tables from the architecture doc (roles, users,
  vehicles, drivers, trips, maintenance_logs, fuel_logs, expenses,
  vehicle_documents, notifications, audit_logs, and the 5 status/type
  lookup tables), plus `refresh_tokens` / `password_reset_tokens` support
  tables needed for the auth flows
- Seed script for roles + all lookup tables + a default Admin user
- Shared middlewares: `authenticate`, `authorize`, `validate`, `errorHandler`
- Shared utils: Winston `logger`, JWT sign/verify, bcrypt hash/compare,
  Nodemailer wrapper, `ApiError`, `ApiResponse`
- Swagger/OpenAPI wired up and documenting every auth route
- Complete **Auth** module: register, login, refresh (rotating), logout,
  forgot-password, reset-password, `/auth/me` — controller / service /
  repository / routes / Zod schemas / types

## What's intentionally NOT included yet

Vehicles, Drivers, Trips, Maintenance, Fuel, Expenses, Dashboard, Reports,
and AI modules — per scope. The folder structure and `app.ts` already show
where each will mount.

## Notes on the MySQL vs. brief's ANSI-SQL note

The source doc flagged Postgres-vs-ANSI-SQL as a tension and resolved it by
keeping the schema portable. This build swaps the deployment engine to
MySQL 8 (per your fixed stack) while keeping the same portability
discipline: no JSON columns, no native enums (status/type values are
lookup-table foreign keys instead), no arrays. One consequence worth
flagging: the doc's cross-table CHECK constraint (`cargo_weight_kg <=
vehicles.max_load_capacity_kg`) isn't expressible as a table-level CHECK in
either engine — it's enforced in the service layer when the Trip module is
built.
