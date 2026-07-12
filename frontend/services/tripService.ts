import { mockRequest, storageDb } from '@/api/client'
import { Trip } from '@/types'

const DB_KEY = 'trips'

const INITIAL_TRIPS: Trip[] = [
  { id: 't1', plate: 'MH-12-AB-1234', model: 'Volvo FH16', driver: 'Ava Monroe', status: 'Dispatched', region: 'West', date: '2026-07-12', notes: 'Express operations transfer.' },
  { id: 't2', plate: 'DL-03-CX-8890', model: 'Tata Prima', driver: 'Liam Carter', status: 'Completed', region: 'North', date: '2026-07-11', notes: 'Routine logistical delivery.' },
  { id: 't3', plate: 'TN-09-PP-1102', model: 'BharatBenz 2823', driver: 'Mia Torres', status: 'Draft', region: 'South', date: '2026-07-12', notes: 'Scheduled for dispatch.' },
]

export const tripService = {
  async getTrips(): Promise<Trip[]> {
    const list = storageDb.get<Trip[]>(DB_KEY, INITIAL_TRIPS)
    return mockRequest(list)
  },

  async createTrip(trip: Omit<Trip, 'id' | 'date'>): Promise<Trip> {
    const list = storageDb.get<Trip[]>(DB_KEY, INITIAL_TRIPS)
    const newTrip: Trip = {
      ...trip,
      id: `t_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    }
    list.unshift(newTrip)
    storageDb.set(DB_KEY, list)
    return mockRequest(newTrip)
  },

  async updateTripStatus(id: string, status: Trip['status']): Promise<Trip> {
    const list = storageDb.get<Trip[]>(DB_KEY, INITIAL_TRIPS)
    const index = list.findIndex((t) => t.id === id)
    if (index === -1) {
      throw new Error(`Trip with ID ${id} not found`)
    }
    const updated = { ...list[index], status }
    list[index] = updated
    storageDb.set(DB_KEY, list)
    return mockRequest(updated)
  },
}
