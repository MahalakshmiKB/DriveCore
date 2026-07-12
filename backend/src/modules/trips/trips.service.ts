import { tripsRepository, TripWithRelations } from './trips.repository';
import { vehiclesRepository } from '../vehicles/vehicles.repository';
import { driversRepository } from '../drivers/drivers.repository';
import { ApiError } from '../../utils/ApiError';
import { TRIP_STATUS } from './trips.constants';
import { VEHICLE_STATUS } from '../vehicles/vehicles.constants';
import { DRIVER_STATUS } from '../drivers/drivers.constants';
import {
  CompleteTripInput,
  CreateTripInput,
  TripListQuery,
  TripResponse,
  UpdateTripInput,
} from './trips.types';

function startOfToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function toTripResponse(trip: TripWithRelations): TripResponse {
  return {
    id: trip.id,
    source: trip.source,
    destination: trip.destination,
    vehicleId: trip.vehicleId,
    driverId: trip.driverId,
    vehicleRegistrationNumber: trip.vehicle.registrationNumber,
    vehicleNameModel: trip.vehicle.nameModel,
    driverFullName: trip.driver.fullName,
    cargoWeightKg: Number(trip.cargoWeightKg),
    plannedDistanceKm: Number(trip.plannedDistanceKm),
    actualDistanceKm: trip.actualDistanceKm !== null ? Number(trip.actualDistanceKm) : null,
    fuelConsumedLiters: trip.fuelConsumedLiters !== null ? Number(trip.fuelConsumedLiters) : null,
    status: trip.status.name,
    statusId: trip.statusId,
    createdBy: trip.createdBy,
    creatorFullName: trip.creator.fullName,
    dispatchedAt: trip.dispatchedAt,
    completedAt: trip.completedAt,
    createdAt: trip.createdAt,
    updatedAt: trip.updatedAt,
  };
}

async function validateVehicleForAssignment(vehicleId: number, cargoWeightKg: number) {
  const vehicle = await vehiclesRepository.findById(vehicleId);
  if (!vehicle) throw ApiError.notFound('Vehicle not found');

  if (vehicle.status.name === VEHICLE_STATUS.RETIRED) {
    throw ApiError.unprocessable('Retired vehicles cannot be assigned');
  }
  if (vehicle.status.name !== VEHICLE_STATUS.AVAILABLE) {
    throw ApiError.unprocessable(`Vehicle must be Available (current status: ${vehicle.status.name})`);
  }

  const maxCapacity = Number(vehicle.maxLoadCapacityKg);
  if (cargoWeightKg > maxCapacity) {
    throw ApiError.unprocessable(
      `Cargo weight (${cargoWeightKg} kg) exceeds vehicle capacity (${maxCapacity} kg)`,
    );
  }

  return vehicle;
}

async function validateDriverForAssignment(driverId: number) {
  const driver = await driversRepository.findById(driverId);
  if (!driver) throw ApiError.notFound('Driver not found');

  if (driver.status.name === DRIVER_STATUS.SUSPENDED) {
    throw ApiError.unprocessable('Suspended drivers cannot be assigned');
  }
  if (driver.status.name !== DRIVER_STATUS.AVAILABLE) {
    throw ApiError.unprocessable(`Driver must be Available (current status: ${driver.status.name})`);
  }
  if (driver.licenseExpiryDate < startOfToday()) {
    throw ApiError.unprocessable('Driver license has expired');
  }

  return driver;
}

async function validateDraftTripAssignments(
  vehicleId: number,
  driverId: number,
  cargoWeightKg: number,
) {
  await validateVehicleForAssignment(vehicleId, cargoWeightKg);
  await validateDriverForAssignment(driverId);
}

async function resolveStatusIds() {
  const [
    draftStatus,
    dispatchedStatus,
    completedStatus,
    cancelledStatus,
    vehicleAvailableStatus,
    vehicleOnTripStatus,
    driverAvailableStatus,
    driverOnTripStatus,
  ] = await Promise.all([
    tripsRepository.findStatusByName(TRIP_STATUS.DRAFT),
    tripsRepository.findStatusByName(TRIP_STATUS.DISPATCHED),
    tripsRepository.findStatusByName(TRIP_STATUS.COMPLETED),
    tripsRepository.findStatusByName(TRIP_STATUS.CANCELLED),
    vehiclesRepository.findStatusByName(VEHICLE_STATUS.AVAILABLE),
    vehiclesRepository.findStatusByName(VEHICLE_STATUS.ON_TRIP),
    driversRepository.findStatusByName(DRIVER_STATUS.AVAILABLE),
    driversRepository.findStatusByName(DRIVER_STATUS.ON_TRIP),
  ]);

  if (
    !draftStatus ||
    !dispatchedStatus ||
    !completedStatus ||
    !cancelledStatus ||
    !vehicleAvailableStatus ||
    !vehicleOnTripStatus ||
    !driverAvailableStatus ||
    !driverOnTripStatus
  ) {
    throw ApiError.internal('Status lookup tables are not seeded correctly');
  }

  return {
    draftStatus,
    dispatchedStatus,
    completedStatus,
    cancelledStatus,
    vehicleAvailableStatus,
    vehicleOnTripStatus,
    driverAvailableStatus,
    driverOnTripStatus,
  };
}

export const tripsService = {
  async list(query: TripListQuery): Promise<{ items: TripResponse[]; total: number; page: number; limit: number }> {
    const { items, total } = await tripsRepository.findMany(query);
    return {
      items: items.map(toTripResponse),
      total,
      page: query.page,
      limit: query.limit,
    };
  },

  async getById(id: number): Promise<TripResponse> {
    const trip = await tripsRepository.findById(id);
    if (!trip) throw ApiError.notFound('Trip not found');
    return toTripResponse(trip);
  },

  async create(input: CreateTripInput, actorUserId: number): Promise<TripResponse> {
    await validateDraftTripAssignments(input.vehicleId, input.driverId, input.cargoWeightKg);

    const { draftStatus } = await resolveStatusIds();

    const trip = await tripsRepository.create({
      source: input.source,
      destination: input.destination,
      vehicleId: input.vehicleId,
      driverId: input.driverId,
      cargoWeightKg: input.cargoWeightKg,
      plannedDistanceKm: input.plannedDistanceKm,
      statusId: draftStatus.id,
      createdBy: actorUserId,
    });

    await tripsRepository.writeAuditLog({
      userId: actorUserId,
      recordId: trip.id,
      action: 'CREATE',
      newValue: JSON.stringify(input),
    });

    return toTripResponse(trip);
  },

  async update(id: number, input: UpdateTripInput, actorUserId?: number): Promise<TripResponse> {
    const existing = await tripsRepository.findById(id);
    if (!existing) throw ApiError.notFound('Trip not found');

    if (existing.status.name !== TRIP_STATUS.DRAFT) {
      throw ApiError.unprocessable(`Only Draft trips can be updated (current status: ${existing.status.name})`);
    }

    const vehicleId = input.vehicleId ?? existing.vehicleId;
    const driverId = input.driverId ?? existing.driverId;
    const cargoWeightKg = input.cargoWeightKg ?? Number(existing.cargoWeightKg);

    await validateDraftTripAssignments(vehicleId, driverId, cargoWeightKg);

    const updated = await tripsRepository.update(id, {
      ...(input.source !== undefined && { source: input.source }),
      ...(input.destination !== undefined && { destination: input.destination }),
      ...(input.vehicleId !== undefined && { vehicleId: input.vehicleId }),
      ...(input.driverId !== undefined && { driverId: input.driverId }),
      ...(input.cargoWeightKg !== undefined && { cargoWeightKg: input.cargoWeightKg }),
      ...(input.plannedDistanceKm !== undefined && { plannedDistanceKm: input.plannedDistanceKm }),
    });

    await tripsRepository.writeAuditLog({
      userId: actorUserId,
      recordId: id,
      action: 'UPDATE',
      oldValue: JSON.stringify(toTripResponse(existing)),
      newValue: JSON.stringify(input),
    });

    return toTripResponse(updated);
  },

  async dispatch(id: number, actorUserId?: number): Promise<TripResponse> {
    const existing = await tripsRepository.findById(id);
    if (!existing) throw ApiError.notFound('Trip not found');

    if (existing.status.name !== TRIP_STATUS.DRAFT) {
      throw ApiError.unprocessable(`Cannot dispatch trip in ${existing.status.name} status`);
    }

    await validateDraftTripAssignments(
      existing.vehicleId,
      existing.driverId,
      Number(existing.cargoWeightKg),
    );

    const {
      dispatchedStatus,
      vehicleOnTripStatus,
      driverOnTripStatus,
    } = await resolveStatusIds();

    const result = await tripsRepository.dispatchAtomic({
      tripId: id,
      dispatchedStatusId: dispatchedStatus.id,
      vehicleOnTripStatusId: vehicleOnTripStatus.id,
      driverOnTripStatusId: driverOnTripStatus.id,
      actorUserId,
    });

    if (!result.ok) {
      switch (result.reason) {
        case 'NOT_FOUND':
          throw ApiError.notFound('Trip not found');
        case 'INVALID_STATUS':
          throw ApiError.unprocessable(`Cannot dispatch trip in ${result.status} status`);
        case 'VEHICLE_UNAVAILABLE':
          throw ApiError.unprocessable(`Vehicle must be Available (current status: ${result.status})`);
        case 'DRIVER_SUSPENDED':
          throw ApiError.unprocessable('Suspended drivers cannot be assigned');
        case 'DRIVER_UNAVAILABLE':
          throw ApiError.unprocessable(`Driver must be Available (current status: ${result.status})`);
        case 'DRIVER_LICENSE_EXPIRED':
          throw ApiError.unprocessable('Driver license has expired');
        case 'CARGO_EXCEEDS_CAPACITY':
          throw ApiError.unprocessable(
            `Cargo weight (${result.cargoWeightKg} kg) exceeds vehicle capacity (${result.maxCapacity} kg)`,
          );
        case 'VEHICLE_CONFLICT':
          throw ApiError.unprocessable('Vehicle is already assigned to an active dispatched trip');
        case 'DRIVER_CONFLICT':
          throw ApiError.unprocessable('Driver is already assigned to an active dispatched trip');
      }
    }

    return toTripResponse(result.trip);
  },

  async complete(id: number, input: CompleteTripInput, actorUserId?: number): Promise<TripResponse> {
    const existing = await tripsRepository.findById(id);
    if (!existing) throw ApiError.notFound('Trip not found');

    if (existing.status.name !== TRIP_STATUS.DISPATCHED) {
      throw ApiError.unprocessable(`Cannot complete trip in ${existing.status.name} status`);
    }

    const {
      completedStatus,
      vehicleAvailableStatus,
      driverAvailableStatus,
    } = await resolveStatusIds();

    const result = await tripsRepository.completeAtomic({
      tripId: id,
      completedStatusId: completedStatus.id,
      availableVehicleStatusId: vehicleAvailableStatus.id,
      availableDriverStatusId: driverAvailableStatus.id,
      actualDistanceKm: input.actualDistanceKm,
      fuelConsumedLiters: input.fuelConsumedLiters,
      actorUserId,
    });

    if (!result.ok) {
      if (result.reason === 'NOT_FOUND') throw ApiError.notFound('Trip not found');
      throw ApiError.unprocessable(`Cannot complete trip in ${result.status} status`);
    }

    return toTripResponse(result.trip);
  },

  async cancel(id: number, actorUserId?: number): Promise<TripResponse> {
    const existing = await tripsRepository.findById(id);
    if (!existing) throw ApiError.notFound('Trip not found');

    if (existing.status.name === TRIP_STATUS.COMPLETED) {
      throw ApiError.unprocessable('Completed trips cannot be cancelled');
    }
    if (existing.status.name === TRIP_STATUS.CANCELLED) {
      throw ApiError.unprocessable('Trip is already cancelled');
    }

    const { cancelledStatus, vehicleAvailableStatus, driverAvailableStatus } = await resolveStatusIds();

    const result = await tripsRepository.cancelAtomic({
      tripId: id,
      cancelledStatusId: cancelledStatus.id,
      availableVehicleStatusId: vehicleAvailableStatus.id,
      availableDriverStatusId: driverAvailableStatus.id,
      actorUserId,
    });

    if (!result.ok) {
      if (result.reason === 'NOT_FOUND') throw ApiError.notFound('Trip not found');
      if (result.reason === 'ALREADY_COMPLETED') {
        throw ApiError.unprocessable('Completed trips cannot be cancelled');
      }
      throw ApiError.unprocessable('Trip is already cancelled');
    }

    return toTripResponse(result.trip);
  },
};
