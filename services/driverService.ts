import { mockRequest, storageDb } from '@/api/client'
import { Driver } from '@/types'

const DB_KEY = 'drivers'

const INITIAL_DRIVERS: Driver[] = [
  { id: '1', name: 'Ava Monroe', licenseNumber: 'LMV-9921', licenseExpiry: '2027-10-15', safetyScore: 96, status: 'On Trip' },
  { id: '2', name: 'Liam Carter', licenseNumber: 'LMV-8840', licenseExpiry: '2026-07-24', safetyScore: 88, status: 'Available' }, // 12 days from July 12, 2026
  { id: '3', name: 'Noah Blake', licenseNumber: 'LMV-4521', licenseExpiry: '2028-03-12', safetyScore: 91, status: 'Off Duty' },
  { id: '4', name: 'Mia Torres', licenseNumber: 'LMV-1102', licenseExpiry: '2027-05-18', safetyScore: 94, status: 'Available' },
]

export const driverService = {
  async getDrivers(): Promise<Driver[]> {
    const list = storageDb.get<Driver[]>(DB_KEY, INITIAL_DRIVERS)
    return mockRequest(list)
  },

  async updateDriver(id: string, updates: Partial<Driver>): Promise<Driver> {
    const list = storageDb.get<Driver[]>(DB_KEY, INITIAL_DRIVERS)
    const index = list.findIndex((d) => d.id === id)
    if (index === -1) {
      throw new Error(`Driver with ID ${id} not found`)
    }
    const updated = { ...list[index], ...updates }
    list[index] = updated
    storageDb.set(DB_KEY, list)
    return mockRequest(updated)
  },
}
