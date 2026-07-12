import { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';
import { TRIP_SORTABLE_FIELDS, TRIP_STATUS } from './trips.constants';
import { TripListQuery } from './trips.types';
import { VEHICLE_STATUS } from '../vehicles/vehicles.constants';
import { DRIVER_STATUS } from '../drivers/drivers.constants';

function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export const tripInclude = {
  status: true,
  vehicle: { include: { status: true } },
  driver: { include: { status: true } },
  creator: { select: { id: true, fullName: true } },
} satisfies Prisma.TripInclude;

export type TripWithRelations = Prisma.TripGetPayload<{ include: typeof tripInclude }>;

function buildOrderBy(sort?: string): Prisma.TripOrderByWithRelationInput {
  if (!sort) return { createdAt: 'desc' };
  const direction: Prisma.SortOrder = sort.startsWith('-') ? 'desc' : 'asc';
  const field = sort.replace(/^-/, '');
  if (!TRIP_SORTABLE_FIELDS.includes(field as (typeof TRIP_SORTABLE_FIELDS)[number])) {
    return { createdAt: 'desc' };
  }
  return { [field]: direction };
}

function buildWhere(
  query: Pick<TripListQuery, 'search' | 'status' | 'vehicleId' | 'driverId'>,
): Prisma.TripWhereInput {
  const where: Prisma.TripWhereInput = {};

  if (query.status) {
    where.status = { name: query.status };
  }
  if (query.vehicleId) {
    where.vehicleId = query.vehicleId;
  }
  if (query.driverId) {
    where.driverId = query.driverId;
  }
  if (query.search) {
    where.OR = [
      { source: { contains: query.search } },
      { destination: { contains: query.search } },
    ];
  }

  return where;
}

export const tripsRepository = {
  async findMany(query: TripListQuery) {
    const where = buildWhere(query);
    const orderBy = buildOrderBy(query.sort);
    const skip = (query.page - 1) * query.limit;

    const [items, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        orderBy,
        skip,
        take: query.limit,
        include: tripInclude,
      }),
      prisma.trip.count({ where }),
    ]);

    return { items, total };
  },

  findById(id: number) {
    return prisma.trip.findUnique({
      where: { id },
      include: tripInclude,
    });
  },

  findStatusByName(name: string) {
    return prisma.tripStatusLookup.findUnique({ where: { name } });
  },

  create(data: Prisma.TripUncheckedCreateInput) {
    return prisma.trip.create({
      data,
      include: tripInclude,
    });
  },

  update(id: number, data: Prisma.TripUncheckedUpdateInput) {
    return prisma.trip.update({
      where: { id },
      data,
      include: tripInclude,
    });
  },

  dispatchAtomic(params: {
    tripId: number;
    dispatchedStatusId: number;
    vehicleOnTripStatusId: number;
    driverOnTripStatusId: number;
    actorUserId?: number;
  }) {
    const { tripId, dispatchedStatusId, vehicleOnTripStatusId, driverOnTripStatusId, actorUserId } = params;

    return prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({ where: { id: tripId }, include: tripInclude });
      if (!trip) return { ok: false as const, reason: 'NOT_FOUND' as const };

      if (trip.status.name !== TRIP_STATUS.DRAFT) {
        return { ok: false as const, reason: 'INVALID_STATUS' as const, status: trip.status.name };
      }

      const vehicle = await tx.vehicle.findUnique({
        where: { id: trip.vehicleId },
        include: { status: true },
      });
      const driver = await tx.driver.findUnique({
        where: { id: trip.driverId },
        include: { status: true },
      });

      if (!vehicle || !driver) {
        return { ok: false as const, reason: 'NOT_FOUND' as const };
      }

      if (vehicle.status.name !== VEHICLE_STATUS.AVAILABLE) {
        return {
          ok: false as const,
          reason: 'VEHICLE_UNAVAILABLE' as const,
          status: vehicle.status.name,
        };
      }

      if (driver.status.name === DRIVER_STATUS.SUSPENDED) {
        return { ok: false as const, reason: 'DRIVER_SUSPENDED' as const };
      }

      if (driver.status.name !== DRIVER_STATUS.AVAILABLE) {
        return {
          ok: false as const,
          reason: 'DRIVER_UNAVAILABLE' as const,
          status: driver.status.name,
        };
      }

      if (driver.licenseExpiryDate < startOfToday()) {
        return { ok: false as const, reason: 'DRIVER_LICENSE_EXPIRED' as const };
      }

      const cargoWeightKg = Number(trip.cargoWeightKg);
      const maxCapacity = Number(vehicle.maxLoadCapacityKg);
      if (cargoWeightKg > maxCapacity) {
        return {
          ok: false as const,
          reason: 'CARGO_EXCEEDS_CAPACITY' as const,
          cargoWeightKg,
          maxCapacity,
        };
      }

      const vehicleConflict = await tx.trip.findFirst({
        where: {
          vehicleId: trip.vehicleId,
          status: { name: TRIP_STATUS.DISPATCHED },
          NOT: { id: tripId },
        },
      });

      if (vehicleConflict) {
        return { ok: false as const, reason: 'VEHICLE_CONFLICT' as const };
      }

      const driverConflict = await tx.trip.findFirst({
        where: {
          driverId: trip.driverId,
          status: { name: TRIP_STATUS.DISPATCHED },
          NOT: { id: tripId },
        },
      });

      if (driverConflict) {
        return { ok: false as const, reason: 'DRIVER_CONFLICT' as const };
      }

      const now = new Date();
      const updated = await tx.trip.update({
        where: { id: tripId },
        data: { statusId: dispatchedStatusId, dispatchedAt: now },
        include: tripInclude,
      });

      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { statusId: vehicleOnTripStatusId },
      });

      await tx.driver.update({
        where: { id: trip.driverId },
        data: { statusId: driverOnTripStatusId },
      });

      await tx.auditLog.create({
        data: {
          userId: actorUserId ?? null,
          tableName: 'trips',
          recordId: tripId,
          action: 'DISPATCH',
          oldValue: JSON.stringify({ status: trip.status.name }),
          newValue: JSON.stringify({ status: TRIP_STATUS.DISPATCHED }),
        },
      });

      return { ok: true as const, trip: updated };
    });
  },

  completeAtomic(params: {
    tripId: number;
    completedStatusId: number;
    availableVehicleStatusId: number;
    availableDriverStatusId: number;
    actualDistanceKm?: number;
    fuelConsumedLiters?: number;
    actorUserId?: number;
  }) {
    const {
      tripId,
      completedStatusId,
      availableVehicleStatusId,
      availableDriverStatusId,
      actualDistanceKm,
      fuelConsumedLiters,
      actorUserId,
    } = params;

    return prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({ where: { id: tripId }, include: tripInclude });
      if (!trip) return { ok: false as const, reason: 'NOT_FOUND' as const };

      if (trip.status.name !== TRIP_STATUS.DISPATCHED) {
        return { ok: false as const, reason: 'INVALID_STATUS' as const, status: trip.status.name };
      }

      const now = new Date();
      const updated = await tx.trip.update({
        where: { id: tripId },
        data: {
          statusId: completedStatusId,
          completedAt: now,
          ...(actualDistanceKm !== undefined && { actualDistanceKm }),
          ...(fuelConsumedLiters !== undefined && { fuelConsumedLiters }),
        },
        include: tripInclude,
      });

      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { statusId: availableVehicleStatusId },
      });

      await tx.driver.update({
        where: { id: trip.driverId },
        data: { statusId: availableDriverStatusId },
      });

      await tx.auditLog.create({
        data: {
          userId: actorUserId ?? null,
          tableName: 'trips',
          recordId: tripId,
          action: 'COMPLETE',
          oldValue: JSON.stringify({ status: trip.status.name }),
          newValue: JSON.stringify({ status: TRIP_STATUS.COMPLETED, actualDistanceKm, fuelConsumedLiters }),
        },
      });

      return { ok: true as const, trip: updated };
    });
  },

  cancelAtomic(params: {
    tripId: number;
    cancelledStatusId: number;
    availableVehicleStatusId: number;
    availableDriverStatusId: number;
    actorUserId?: number;
  }) {
    const {
      tripId,
      cancelledStatusId,
      availableVehicleStatusId,
      availableDriverStatusId,
      actorUserId,
    } = params;

    return prisma.$transaction(async (tx) => {
      const trip = await tx.trip.findUnique({ where: { id: tripId }, include: tripInclude });
      if (!trip) return { ok: false as const, reason: 'NOT_FOUND' as const };

      if (trip.status.name === TRIP_STATUS.COMPLETED) {
        return { ok: false as const, reason: 'ALREADY_COMPLETED' as const };
      }
      if (trip.status.name === TRIP_STATUS.CANCELLED) {
        return { ok: false as const, reason: 'ALREADY_CANCELLED' as const };
      }

      const revertAssignments = trip.status.name === TRIP_STATUS.DISPATCHED;

      const updated = await tx.trip.update({
        where: { id: tripId },
        data: { statusId: cancelledStatusId },
        include: tripInclude,
      });

      if (revertAssignments) {
        await tx.vehicle.update({
          where: { id: trip.vehicleId },
          data: { statusId: availableVehicleStatusId },
        });

        await tx.driver.update({
          where: { id: trip.driverId },
          data: { statusId: availableDriverStatusId },
        });
      }

      await tx.auditLog.create({
        data: {
          userId: actorUserId ?? null,
          tableName: 'trips',
          recordId: tripId,
          action: 'CANCEL',
          oldValue: JSON.stringify({ status: trip.status.name }),
          newValue: JSON.stringify({ status: TRIP_STATUS.CANCELLED, revertAssignments }),
        },
      });

      return { ok: true as const, trip: updated };
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
        tableName: 'trips',
        recordId: entry.recordId,
        action: entry.action,
        oldValue: entry.oldValue ?? null,
        newValue: entry.newValue ?? null,
      },
    });
  },
};
