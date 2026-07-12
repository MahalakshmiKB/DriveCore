export const DRIVER_STATUS = {
  AVAILABLE: 'Available',
  ON_TRIP: 'On Trip',
  OFF_DUTY: 'Off Duty',
  SUSPENDED: 'Suspended',
} as const;

export type DriverStatusName = (typeof DRIVER_STATUS)[keyof typeof DRIVER_STATUS];

export const DRIVER_SORTABLE_FIELDS = [
  'fullName',
  'licenseNumber',
  'licenseCategory',
  'licenseExpiryDate',
  'contactNumber',
  'safetyScore',
  'createdAt',
] as const;

export const MIN_SAFETY_SCORE = 0;
export const MAX_SAFETY_SCORE = 100;

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
