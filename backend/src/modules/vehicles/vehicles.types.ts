export interface CreateVehicleInput {
  registrationNumber: string;
  nameModel: string;
  type: string;
  maxLoadCapacityKg: number;
  acquisitionCost: number;
  odometerKm?: number;
  region?: string;
}

export interface UpdateVehicleInput {
  registrationNumber?: string;
  nameModel?: string;
  type?: string;
  maxLoadCapacityKg?: number;
  acquisitionCost?: number;
  odometerKm?: number;
  region?: string;
  statusId?: number;
}

export interface VehicleListQuery {
  page: number;
  limit: number;
  sort?: string;
  search?: string;
  status?: string;
  type?: string;
  region?: string;
}

export interface VehicleResponse {
  id: number;
  registrationNumber: string;
  nameModel: string;
  type: string;
  maxLoadCapacityKg: number;
  odometerKm: number;
  acquisitionCost: number;
  region: string | null;
  status: string;
  statusId: number;
  createdAt: Date;
  updatedAt: Date;
}
