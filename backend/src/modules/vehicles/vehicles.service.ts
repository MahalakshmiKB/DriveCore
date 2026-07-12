import { vehiclesRepository } from './vehicles.repository';
import { ApiError } from '../../utils/ApiError';
import { VEHICLE_STATUS } from './vehicles.constants';
import {
  CreateVehicleInput,
  UpdateVehicleInput,
  VehicleListQuery,
  VehicleResponse,
} from './vehicles.types';

function toVehicleResponse(vehicle: {
  id: number;
  registrationNumber: string;
  nameModel: string;
  type: string;
  maxLoadCapacityKg: unknown;
  odometerKm: unknown;
  acquisitionCost: unknown;
  region: string | null;
  statusId: number;
  status: { name: string };
  createdAt: Date;
  updatedAt: Date;
}): VehicleResponse {
  return {
    id: vehicle.id,
    registrationNumber: vehicle.registrationNumber,
    nameModel: vehicle.nameModel,
    type: vehicle.type,
    maxLoadCapacityKg: Number(vehicle.maxLoadCapacityKg),
    odometerKm: Number(vehicle.odometerKm),
    acquisitionCost: Number(vehicle.acquisitionCost),
    region: vehicle.region,
    status: vehicle.status.name,
    statusId: vehicle.statusId,
    createdAt: vehicle.createdAt,
    updatedAt: vehicle.updatedAt,
  };
}

export const vehiclesService = {
  async list(query: VehicleListQuery): Promise<{ items: VehicleResponse[]; total: number; page: number; limit: number }> {
    const { items, total } = await vehiclesRepository.findMany(query);
    return {
      items: items.map(toVehicleResponse),
      total,
      page: query.page,
      limit: query.limit,
    };
  },

  async getAvailable(): Promise<VehicleResponse[]> {
    const items = await vehiclesRepository.findAvailable();
    return items.map(toVehicleResponse);
  },

  async getById(id: number): Promise<VehicleResponse> {
    const vehicle = await vehiclesRepository.findById(id);
    if (!vehicle) throw ApiError.notFound('Vehicle not found');
    return toVehicleResponse(vehicle);
  },

  async create(input: CreateVehicleInput, actorUserId?: number): Promise<VehicleResponse> {
    const existing = await vehiclesRepository.findByRegistrationNumber(input.registrationNumber);
    if (existing) {
      throw ApiError.conflict('A vehicle with this registration number already exists');
    }

    const availableStatus = await vehiclesRepository.findStatusByName(VEHICLE_STATUS.AVAILABLE);
    if (!availableStatus) {
      throw ApiError.internal('Vehicle status lookup is not seeded correctly');
    }

    const vehicle = await vehiclesRepository.create({
      registrationNumber: input.registrationNumber,
      nameModel: input.nameModel,
      type: input.type,
      maxLoadCapacityKg: input.maxLoadCapacityKg,
      acquisitionCost: input.acquisitionCost,
      odometerKm: input.odometerKm ?? 0,
      region: input.region,
      statusId: availableStatus.id,
    });

    await vehiclesRepository.writeAuditLog({
      userId: actorUserId,
      recordId: vehicle.id,
      action: 'CREATE',
      newValue: JSON.stringify(input),
    });

    return toVehicleResponse(vehicle);
  },

  async update(id: number, input: UpdateVehicleInput, actorUserId?: number): Promise<VehicleResponse> {
    const existing = await vehiclesRepository.findById(id);
    if (!existing) throw ApiError.notFound('Vehicle not found');

    if (input.registrationNumber && input.registrationNumber !== existing.registrationNumber) {
      const duplicate = await vehiclesRepository.findByRegistrationNumber(input.registrationNumber);
      if (duplicate) {
        throw ApiError.conflict('A vehicle with this registration number already exists');
      }
    }

    if (input.statusId) {
      const status = await vehiclesRepository.findStatusById(input.statusId);
      if (!status) throw ApiError.badRequest('Invalid statusId');
    }

    const updated = await vehiclesRepository.update(id, {
      ...(input.registrationNumber !== undefined && { registrationNumber: input.registrationNumber }),
      ...(input.nameModel !== undefined && { nameModel: input.nameModel }),
      ...(input.type !== undefined && { type: input.type }),
      ...(input.maxLoadCapacityKg !== undefined && { maxLoadCapacityKg: input.maxLoadCapacityKg }),
      ...(input.acquisitionCost !== undefined && { acquisitionCost: input.acquisitionCost }),
      ...(input.odometerKm !== undefined && { odometerKm: input.odometerKm }),
      ...(input.region !== undefined && { region: input.region }),
      ...(input.statusId !== undefined && { statusId: input.statusId }),
    });

    await vehiclesRepository.writeAuditLog({
      userId: actorUserId,
      recordId: id,
      action: 'UPDATE',
      oldValue: JSON.stringify(toVehicleResponse(existing)),
      newValue: JSON.stringify(input),
    });

    return toVehicleResponse(updated);
  },

  /** Soft-retire: DELETE never removes the row — it sets status = Retired. */
  async retire(id: number, actorUserId?: number): Promise<VehicleResponse> {
    const existing = await vehiclesRepository.findById(id);
    if (!existing) throw ApiError.notFound('Vehicle not found');

    if (existing.status.name === VEHICLE_STATUS.RETIRED) {
      throw ApiError.conflict('Vehicle is already retired');
    }

    if (existing.status.name === VEHICLE_STATUS.ON_TRIP) {
      throw ApiError.unprocessable('Vehicle currently on a trip cannot be retired');
    }

    const retiredStatus = await vehiclesRepository.findStatusByName(VEHICLE_STATUS.RETIRED);
    if (!retiredStatus) {
      throw ApiError.internal('Vehicle status lookup is not seeded correctly');
    }

    const updated = await vehiclesRepository.setStatus(id, retiredStatus.id);

    await vehiclesRepository.writeAuditLog({
      userId: actorUserId,
      recordId: id,
      action: 'RETIRE',
      oldValue: JSON.stringify({ status: existing.status.name }),
      newValue: JSON.stringify({ status: VEHICLE_STATUS.RETIRED }),
    });

    return toVehicleResponse(updated);
  },
};
