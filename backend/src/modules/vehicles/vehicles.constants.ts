export const VEHICLE_STATUS = {
  AVAILABLE: 'Available',
  ON_TRIP: 'On Trip',
  IN_SHOP: 'In Shop',
  RETIRED: 'Retired',
} as const;

export type VehicleStatusName = (typeof VEHICLE_STATUS)[keyof typeof VEHICLE_STATUS];

export const VEHICLE_SORTABLE_FIELDS = [
  'registrationNumber',
  'nameModel',
  'type',
  'maxLoadCapacityKg',
  'odometerKm',
  'acquisitionCost',
  'createdAt',
] as const;

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
