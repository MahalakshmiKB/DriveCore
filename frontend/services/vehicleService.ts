import { mockRequest, storageDb } from '@/api/client'
import { Vehicle } from '@/types'

const DB_KEY = 'vehicles'

const INITIAL_VEHICLES: Vehicle[] = [
  { plate: 'MH-12-AB-1234', model: 'Volvo FH16', driver: 'Ava Monroe', status: 'On Trip', region: 'West', odometer: 184220 },
  { plate: 'DL-03-CX-8890', model: 'Tata Prima', driver: 'Liam Carter', status: 'Available', region: 'North', odometer: 92400 },
  { plate: 'KA-05-MN-4521', model: 'Ashok Leyland', driver: '—', status: 'In Shop', region: 'South', odometer: 115200 },
  { plate: 'TN-09-PP-1102', model: 'BharatBenz 2823', driver: 'Mia Torres', status: 'Available', region: 'South', odometer: 76100 },
  { plate: 'GJ-01-ZZ-7788', model: 'Eicher Pro', driver: '—', status: 'Retired', region: 'West', odometer: 254800 },
]

export const vehicleService = {
  async getVehicles(): Promise<Vehicle[]> {
    const list = storageDb.get<Vehicle[]>(DB_KEY, INITIAL_VEHICLES)
    return mockRequest(list)
  },

  async updateVehicle(plate: string, updates: Partial<Vehicle>): Promise<Vehicle> {
    const list = storageDb.get<Vehicle[]>(DB_KEY, INITIAL_VEHICLES)
    const index = list.findIndex((v) => v.plate === plate)
    if (index === -1) {
      throw new Error(`Vehicle with plate ${plate} not found`)
    }
    const updated = { ...list[index], ...updates }
    list[index] = updated
    storageDb.set(DB_KEY, list)
    return mockRequest(updated)
  },

  async logMaintenance(plate: string, description: string, cost: number): Promise<Vehicle> {
    // Log maintenance sets the vehicle's status to In Shop
    return this.updateVehicle(plate, { status: 'In Shop' })
  },
}
