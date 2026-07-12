import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';
import { DRIVER_SORTABLE_FIELDS, DRIVER_STATUS } from './drivers.constants';
import { DriverListQuery } from './drivers.types';

const includeStatus = { status: true } satisfies Prisma.DriverInclude;

function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function buildOrderBy(sort?: string): Prisma.DriverOrderByWithRelationInput {
  if (!sort) return { createdAt: 'desc' };
  const direction: Prisma.SortOrder = sort.startsWith('-') ? 'desc' : 'asc';
  const field = sort.replace(/^-/, '');
  if (!DRIVER_SORTABLE_FIELDS.includes(field as (typeof DRIVER_SORTABLE_FIELDS)[number])) {
    return { createdAt: 'desc' };
  }
  return { [field]: direction };
}

function buildWhere(
  query: Pick<DriverListQuery, 'search' | 'status' | 'licenseCategory'>,
): Prisma.DriverWhereInput {
  const where: Prisma.DriverWhereInput = {};

  if (query.status) {
    where.status = { name: query.status };
  }
  if (query.licenseCategory) {
    where.licenseCategory = { equals: query.licenseCategory };
  }
  if (query.search) {
    where.OR = [
      { fullName: { contains: query.search } },
      { licenseNumber: { contains: query.search } },
      { licenseCategory: { contains: query.search } },
      { contactNumber: { contains: query.search } },
    ];
  }

  return where;
}

export const driversRepository = {
  async findMany(query: DriverListQuery) {
    const where = buildWhere(query);
    const orderBy = buildOrderBy(query.sort);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      prisma.driver.findMany({
        where,
        orderBy,
        skip,
        take: query.limit,
        include: includeStatus,
      }),
      prisma.driver.count({ where }),
    ]);

    return { items, total };
  },

  findAvailable() {
    return prisma.driver.findMany({
      where: {
        status: { name: DRIVER_STATUS.AVAILABLE },
        licenseExpiryDate: { gte: startOfToday() },
      },
      orderBy: { fullName: 'asc' },
      include: includeStatus,
    });
  },

  findById(id: number) {
    return prisma.driver.findUnique({
      where: { id },
      include: includeStatus,
    });
  },

  findByLicenseNumber(licenseNumber: string) {
    return prisma.driver.findUnique({
      where: { licenseNumber },
    });
  },

  findStatusByName(name: string) {
    return prisma.driverStatusLookup.findUnique({ where: { name } });
  },

  findStatusById(id: number) {
    return prisma.driverStatusLookup.findUnique({ where: { id } });
  },

  create(data: Prisma.DriverUncheckedCreateInput) {
    return prisma.driver.create({
      data,
      include: includeStatus,
    });
  },

  update(id: number, data: Prisma.DriverUncheckedUpdateInput) {
    return prisma.driver.update({
      where: { id },
      data,
      include: includeStatus,
    });
  },

  setStatus(id: number, statusId: number) {
    return prisma.driver.update({
      where: { id },
      data: { statusId },
      include: includeStatus,
    });
  },

  writeAuditLog(entry: {
    userId?: number | null;
    recordId: number;
    action: string;
    oldValue?: string | null;
    newValue?: string | null;
  }) {
    return prisma.auditLog.create({
      data: {
        userId: entry.userId ?? null,
        tableName: 'drivers',
        recordId: entry.recordId,
        action: entry.action,
        oldValue: entry.oldValue ?? null,
        newValue: entry.newValue ?? null,
      },
    });
  },
};
