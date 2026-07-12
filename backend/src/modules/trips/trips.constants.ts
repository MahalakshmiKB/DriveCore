export const TRIP_STATUS = {
  DRAFT: 'Draft',
  DISPATCHED: 'Dispatched',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
} as const;

export type TripStatusName = (typeof TRIP_STATUS)[keyof typeof TRIP_STATUS];

export const TRIP_SORTABLE_FIELDS = [
  'source',
  'destination',
  'cargoWeightKg',
  'plannedDistanceKm',
  'actualDistanceKm',
  'createdAt',
  'dispatchedAt',
  'completedAt',
] as const;

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
