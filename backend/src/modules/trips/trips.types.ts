export interface CreateTripInput {
  source: string;
  destination: string;
  vehicleId: number;
  driverId: number;
  cargoWeightKg: number;
  plannedDistanceKm: number;
}

export interface UpdateTripInput {
  source?: string;
  destination?: string;
  vehicleId?: number;
  driverId?: number;
  cargoWeightKg?: number;
  plannedDistanceKm?: number;
}

export interface CompleteTripInput {
  actualDistanceKm?: number;
  fuelConsumedLiters?: number;
}

export interface TripListQuery {
  page: number;
  limit: number;
  sort?: string;
  search?: string;
  status?: string;
  vehicleId?: number;
  driverId?: number;
}

export interface TripResponse {
  id: number;
  source: string;
  destination: string;
  vehicleId: number;
  driverId: number;
  vehicleRegistrationNumber: string;
  vehicleNameModel: string;
  driverFullName: string;
  cargoWeightKg: number;
  plannedDistanceKm: number;
  actualDistanceKm: number | null;
  fuelConsumedLiters: number | null;
  status: string;
  statusId: number;
  createdBy: number;
  creatorFullName: string;
  dispatchedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
