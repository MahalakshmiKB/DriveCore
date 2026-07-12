import { driversRepository } from './drivers.repository';
import { ApiError } from '../../utils/ApiError';
import { DRIVER_STATUS } from './drivers.constants';
import {
  CreateDriverInput,
  UpdateDriverInput,
  DriverListQuery,
  DriverResponse,
} from './drivers.types';

function toDriverResponse(driver: {
  id: number;
  fullName: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: Date;
  contactNumber: string;
  safetyScore: number;
  statusId: number;
  status: { name: string };
  createdAt: Date;
  updatedAt: Date;
}): DriverResponse {
  return {
    id: driver.id,
    fullName: driver.fullName,
    licenseNumber: driver.licenseNumber,
    licenseCategory: driver.licenseCategory,
    licenseExpiryDate: driver.licenseExpiryDate,
    contactNumber: driver.contactNumber,
    safetyScore: driver.safetyScore,
    status: driver.status.name,
    statusId: driver.statusId,
    createdAt: driver.createdAt,
    updatedAt: driver.updatedAt,
  };
}

export const driversService = {
  async list(query: DriverListQuery): Promise<{ items: DriverResponse[]; total: number; page: number; limit: number }> {
    const { items, total } = await driversRepository.findMany(query);
    return {
      items: items.map(toDriverResponse),
      total,
      page: query.page,
      limit: query.limit,
    };
  },

  async getAvailable(): Promise<DriverResponse[]> {
    const items = await driversRepository.findAvailable();
    return items.map(toDriverResponse);
  },

  async getById(id: number): Promise<DriverResponse> {
    const driver = await driversRepository.findById(id);
    if (!driver) throw ApiError.notFound('Driver not found');
    return toDriverResponse(driver);
  },

  async create(input: CreateDriverInput, actorUserId?: number): Promise<DriverResponse> {
    const existing = await driversRepository.findByLicenseNumber(input.licenseNumber);
    if (existing) {
      throw ApiError.conflict('A driver with this license number already exists');
    }

    const availableStatus = await driversRepository.findStatusByName(DRIVER_STATUS.AVAILABLE);
    if (!availableStatus) {
      throw ApiError.internal('Driver status lookup is not seeded correctly');
    }

    const driver = await driversRepository.create({
      fullName: input.fullName,
      licenseNumber: input.licenseNumber,
      licenseCategory: input.licenseCategory,
      licenseExpiryDate: input.licenseExpiryDate,
      contactNumber: input.contactNumber,
      safetyScore: input.safetyScore ?? 100,
      statusId: availableStatus.id,
    });

    await driversRepository.writeAuditLog({
      userId: actorUserId,
      recordId: driver.id,
      action: 'CREATE',
      newValue: JSON.stringify(input),
    });

    return toDriverResponse(driver);
  },

  async update(id: number, input: UpdateDriverInput, actorUserId?: number): Promise<DriverResponse> {
    const existing = await driversRepository.findById(id);
    if (!existing) throw ApiError.notFound('Driver not found');

    if (input.licenseNumber && input.licenseNumber !== existing.licenseNumber) {
      const duplicate = await driversRepository.findByLicenseNumber(input.licenseNumber);
      if (duplicate) {
        throw ApiError.conflict('A driver with this license number already exists');
      }
    }

    if (input.statusId) {
      const status = await driversRepository.findStatusById(input.statusId);
      if (!status) throw ApiError.badRequest('Invalid statusId');
    }

    const updated = await driversRepository.update(id, {
      ...(input.fullName !== undefined && { fullName: input.fullName }),
      ...(input.licenseNumber !== undefined && { licenseNumber: input.licenseNumber }),
      ...(input.licenseCategory !== undefined && { licenseCategory: input.licenseCategory }),
      ...(input.licenseExpiryDate !== undefined && { licenseExpiryDate: input.licenseExpiryDate }),
      ...(input.contactNumber !== undefined && { contactNumber: input.contactNumber }),
      ...(input.safetyScore !== undefined && { safetyScore: input.safetyScore }),
      ...(input.statusId !== undefined && { statusId: input.statusId }),
    });

    await driversRepository.writeAuditLog({
      userId: actorUserId,
      recordId: id,
      action: 'UPDATE',
      oldValue: JSON.stringify(toDriverResponse(existing)),
      newValue: JSON.stringify(input),
    });

    return toDriverResponse(updated);
  },

  /** Soft-deactivate: DELETE never removes the row — it sets status = Suspended. */
  async suspend(id: number, actorUserId?: number): Promise<DriverResponse> {
    const existing = await driversRepository.findById(id);
    if (!existing) throw ApiError.notFound('Driver not found');

    if (existing.status.name === DRIVER_STATUS.SUSPENDED) {
      throw ApiError.conflict('Driver is already suspended');
    }

    if (existing.status.name === DRIVER_STATUS.ON_TRIP) {
      throw ApiError.unprocessable('Driver currently on a trip cannot be suspended');
    }

    const suspendedStatus = await driversRepository.findStatusByName(DRIVER_STATUS.SUSPENDED);
    if (!suspendedStatus) {
      throw ApiError.internal('Driver status lookup is not seeded correctly');
    }

    const updated = await driversRepository.setStatus(id, suspendedStatus.id);

    await driversRepository.writeAuditLog({
      userId: actorUserId,
      recordId: id,
      action: 'SUSPEND',
      oldValue: JSON.stringify({ status: existing.status.name }),
      newValue: JSON.stringify({ status: DRIVER_STATUS.SUSPENDED }),
    });

    return toDriverResponse(updated);
  },
};
