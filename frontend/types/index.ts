export type VehicleStatus = 'Available' | 'On Trip' | 'In Shop' | 'Retired';
export type DriverStatus = 'Available' | 'On Trip' | 'Off Duty' | 'Suspended';
export type TripStatus = 'Draft' | 'Dispatched' | 'Completed' | 'Cancelled';

export interface Vehicle {
  plate: string;
  model: string;
  driver: string;
  status: VehicleStatus;
  region: string;
  odometer: number; // in km
}

export interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  licenseExpiry: string; // YYYY-MM-DD
  safetyScore: number; // out of 100
  status: DriverStatus;
}

export interface Trip {
  id: string;
  plate: string;
  model: string;
  driver: string;
  status: TripStatus;
  region: string;
  notes?: string;
  date: string; // YYYY-MM-DD
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  avatarFallback: string;
}
