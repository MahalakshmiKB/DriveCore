import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function upsertByName<T extends { name: string }>(
  model: { upsert: (args: any) => Promise<any> },
  name: string,
) {
  return model.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

async function main() {
  console.log('Seeding roles...');
  const roleNames = ['Admin', 'Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'];
  for (const name of roleNames) {
    await upsertByName(prisma.role, name);
  }

  console.log('Seeding vehicle_status_lookup...');
  for (const name of ['Available', 'On Trip', 'In Shop', 'Retired']) {
    await upsertByName(prisma.vehicleStatusLookup, name);
  }

  console.log('Seeding driver_status_lookup...');
  for (const name of ['Available', 'On Trip', 'Off Duty', 'Suspended']) {
    await upsertByName(prisma.driverStatusLookup, name);
  }

  console.log('Seeding trip_status_lookup...');
  for (const name of ['Draft', 'Dispatched', 'Completed', 'Cancelled']) {
    await upsertByName(prisma.tripStatusLookup, name);
  }

  console.log('Seeding maintenance_status_lookup...');
  for (const name of ['Open', 'Closed']) {
    await upsertByName(prisma.maintenanceStatusLookup, name);
  }

  console.log('Seeding expense_type_lookup...');
  for (const name of ['Toll', 'Permit', 'Fine', 'Misc']) {
    await upsertByName(prisma.expenseTypeLookup, name);
  }

  console.log('Seeding default Admin user...');
  const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: 'Admin' } });
  const passwordHash = await bcrypt.hash('ChangeMe123!', 12);
  await prisma.user.upsert({
    where: { email: 'admin@drivecore.app' },
    update: {},
    create: {
      fullName: 'DriveCore Admin',
      email: 'admin@drivecore.app',
      passwordHash,
      roleId: adminRole.id,
      isActive: true,
    },
  });

  console.log('Seed complete. Default admin login: admin@drivecore.app / ChangeMe123! (change immediately)');
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
