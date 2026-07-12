import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';
import { VEHICLE_SORTABLE_FIELDS } from './vehicles.constants';
import { ListVehiclesQuery } from './vehicles.types';

const includeStatus = { status: true } satisfies Prisma.VehicleInclude;

function buildOrderBy(sort?: string): Prisma.VehicleOrderByWithRelationInput {
  if (!sort) return { createdAt: 'desc' };
  const direction: Prisma.SortOrder = sort.startsWith('-') ? 'desc' : 'asc';
  const field = sort.replace(/^-/, '');
  if (!VEHICLE_SORTABLE_FIELDS.includes(field as any)) return { createdAt: 'desc' };
  return { [field]: direction };
}

function buildWhere(query: Pick<ListVehiclesQuery, 'search' | 'status' | 'type' | 'region'>): Prisma.VehicleWhereInput {
  const where: Prisma.VehicleWhereInput = {};

  if (query.status) {
    where.status = { name: query.status };
  }
  if (query.type) {
    where.type = { equals: query.type };
  }
  if (query.region) {
    where.region = { equals: query.region };
  }
  if (query.search) {
    where.OR = [
      { registrationNumber: { contains: query.search } },
      { nameModel: { contains: query.search } },
      { type: { contains: query.search } },
      { region: { contains: query.search } },
    ];
  }

  return where;
}

export const vehiclesRepository = {
  async findMany(query: ListVehiclesQuery) {
    const where = buildWhere(query);
    const orderBy = buildOrderBy(query.sort);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        orderBy,
        skip,
        take: query.limit,
        include: includeStatus,
      }),
      prisma.vehicle.count({ where }),
    ]);

    return { items, total };
  },

  findAvailable() {
    return prisma.vehicle.findMany({
      where: { status: { name: 'Available' } },
      orderBy: { registrationNumber: 'asc' },
      include: includeStatus,
    });
  },

  findById(id: number) {
    return prisma.vehicle.findUnique({
      where: { id },
      include: includeStatus,
    });
  },

  findByRegistrationNumber(registrationNumber: string) {
    return prisma.vehicle.findUnique({
      where: { registrationNumber },
    });
  },

  findStatusByName(name: string) {
    return prisma.vehicleStatusLookup.findUnique({ where: { name } });
  },

  findStatusById(id: number) {
    return prisma.vehicleStatusLookup.findUnique({ where: { id } });
  },

  create(data: Prisma.VehicleUncheckedCreateInput) {
    return prisma.vehicle.create({
      data,
      include: includeStatus,
    });
  },

  update(id: number, data: Prisma.VehicleUncheckedUpdateInput) {
    return prisma.vehicle.update({
      where: { id },
      data,
      include: includeStatus,
    });
  },

  setStatus(id: number, statusId: number) {
    return prisma.vehicle.update({
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
        tableName: 'vehicles',
        recordId: entry.recordId,
        action: entry.action,
        oldValue: entry.oldValue ?? null,
        newValue: entry.newValue ?? null,
      },
    });
  },
};
