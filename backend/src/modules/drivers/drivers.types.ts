export interface CreateDriverInput {
  fullName: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: Date;
  contactNumber: string;
  safetyScore?: number;
}

export interface UpdateDriverInput {
  fullName?: string;
  licenseNumber?: string;
  licenseCategory?: string;
  licenseExpiryDate?: Date;
  contactNumber?: string;
  safetyScore?: number;
  statusId?: number;
}

export interface DriverListQuery {
  page: number;
  limit: number;
  sort?: string;
  search?: string;
  status?: string;
  licenseCategory?: string;
}

export interface DriverResponse {
  id: number;
  fullName: string;
  licenseNumber: string;
  licenseCategory: string;
  licenseExpiryDate: Date;
  contactNumber: string;
  safetyScore: number;
  status: string;
  statusId: number;
  createdAt: Date;
  updatedAt: Date;
}
