'use client'

import * as React from 'react'
import { PlusIcon, SearchIcon, RouteIcon } from 'lucide-react'
import { toast } from 'sonner'

import { tripService } from '@/services/tripService'
import { vehicleService } from '@/services/vehicleService'
import { driverService } from '@/services/driverService'
import { Trip, Vehicle, Driver } from '@/types'
import { TRIP_STATUS_TONE } from '@/constants'
import { StatusBadge } from '@/components/design-system/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { DataTable, DataTableColumn } from '@/components/shared/data/DataTable'
import { FormSelect, FormTextarea } from '@/components/shared/data/FormFields'
import { LoadingBoundary } from '@/components/shared/feedback/LoadingBoundary'
import { ErrorBoundary } from '@/components/shared/feedback/ErrorBoundary'

export function TripsPage() {
  const [trips, setTrips] = React.useState<Trip[]>([])
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([])
  const [drivers, setDrivers] = React.useState<Driver[]>([])
  const [loading, setLoading] = React.useState(true)

  // Form State
  const [selectedPlate, setSelectedPlate] = React.useState('')
  const [selectedDriverId, setSelectedDriverId] = React.useState('')
  const [region, setRegion] = React.useState('West')
  const [notes, setNotes] = React.useState('')
  const [submitting, setSubmitting] = React.useState(false)
  const [search, setSearch] = React.useState('')

  const loadData = React.useCallback(async () => {
    try {
      const [tList, vList, dList] = await Promise.all([
        tripService.getTrips(),
        vehicleService.getVehicles(),
        driverService.getDrivers(),
      ])
      setTrips(tList)
      setVehicles(vList)
      setDrivers(dList)
    } catch (err) {
      toast.error('Failed to load dispatch dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadData()
  }, [loadData])

  // Get available vehicles and drivers
  const availableVehicles = React.useMemo(() => {
    return vehicles.filter((v) => v.status === 'Available')
  }, [vehicles])

  const availableDrivers = React.useMemo(() => {
    return drivers.filter((d) => d.status === 'Available')
  }, [drivers])

  const handleCreateTrip = React.useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPlate) {
      toast.error('Please assign an available vehicle.')
      return
    }
    if (!selectedDriverId) {
      toast.error('Please assign an available driver.')
      return
    }

    setSubmitting(true)
    try {
      const vehicle = vehicles.find((v) => v.plate === selectedPlate)!
      const driver = drivers.find((d) => d.id === selectedDriverId)!

      // Create new trip
      await tripService.createTrip({
        plate: vehicle.plate,
        model: vehicle.model,
        driver: driver.name,
        status: 'Dispatched',
        region,
        notes,
      })

      // Update vehicle and driver status
      await Promise.all([
        vehicleService.updateVehicle(vehicle.plate, { status: 'On Trip', driver: driver.name }),
        driverService.updateDriver(driver.id, { status: 'On Trip' }),
      ])

      toast.success(`Trip dispatched successfully! Vehicle ${vehicle.plate} and Driver ${driver.name} set to On Trip.`)

      // Reset form
      setSelectedPlate('')
      setSelectedDriverId('')
      setNotes('')
      loadData()
    } catch (err: any) {
      toast.error(err.message || 'Failed to dispatch trip.')
    } finally {
      setSubmitting(false)
    }
  }, [selectedPlate, selectedDriverId, region, notes, vehicles, drivers, loadData])

  const filteredTrips = React.useMemo(() => {
    return trips.filter(
      (t) =>
        t.plate.toLowerCase().includes(search.toLowerCase()) ||
        t.model.toLowerCase().includes(search.toLowerCase()) ||
        t.driver.toLowerCase().includes(search.toLowerCase()) ||
        t.region.toLowerCase().includes(search.toLowerCase())
    )
  }, [trips, search])

  const columns: DataTableColumn<Trip>[] = [
    {
      header: 'Trip ID',
      accessorKey: 'id',
      className: 'font-mono text-xs text-muted-foreground',
    },
    {
      header: 'Vehicle Plate',
      accessorKey: 'plate',
      className: 'font-medium tabular-nums',
    },
    {
      header: 'Model',
      accessorKey: 'model',
    },
    {
      header: 'Assigned Driver',
      accessorKey: 'driver',
      className: 'text-muted-foreground',
    },
    {
      header: 'Region',
      accessorKey: 'region',
      className: 'text-muted-foreground',
    },
    {
      header: 'Status',
      cell: (row) => (
        <StatusBadge tone={TRIP_STATUS_TONE[row.status]} className="ml-auto">
          {row.status}
        </StatusBadge>
      ),
      className: 'text-right',
    },
  ]

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Dispatches & Trips</h1>
          <p className="text-sm text-muted-foreground">Manage ongoing dispatches, plan routes, and create new trip drafts.</p>
        </div>

        <LoadingBoundary isLoading={loading} variant="table">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-1">
              <form onSubmit={handleCreateTrip}>
                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <RouteIcon className="size-4.5 text-primary" />
                      Dispatch Trip
                    </CardTitle>
                    <CardDescription>Assign an available vehicle and driver to launch a new route.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <FormSelect
                      label="Available Vehicles"
                      options={availableVehicles.map((v) => ({ label: `${v.plate} (${v.model})`, value: v.plate }))}
                      value={selectedPlate}
                      onValueChange={setSelectedPlate}
                      placeholder={availableVehicles.length === 0 ? 'No available vehicles' : 'Select vehicle'}
                      disabled={availableVehicles.length === 0 || submitting}
                    />

                    <FormSelect
                      label="Available Drivers"
                      options={availableDrivers.map((d) => ({ label: d.name, value: d.id }))}
                      value={selectedDriverId}
                      onValueChange={setSelectedDriverId}
                      placeholder={availableDrivers.length === 0 ? 'No available drivers' : 'Select driver'}
                      disabled={availableDrivers.length === 0 || submitting}
                    />

                    <FormSelect
                      label="Operational Region"
                      options={[
                        { label: 'West', value: 'West' },
                        { label: 'North', value: 'North' },
                        { label: 'South', value: 'South' },
                        { label: 'East', value: 'East' },
                      ]}
                      value={region}
                      onValueChange={setRegion}
                      disabled={submitting}
                    />

                    <FormTextarea
                      label="Dispatch Notes"
                      placeholder="Special handling instructions, routes..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      disabled={submitting}
                    />

                    <Button type="submit" className="w-full mt-2" disabled={submitting || availableVehicles.length === 0 || availableDrivers.length === 0}>
                      <PlusIcon data-icon="inline-start" className="size-4" />
                      {submitting ? 'Dispatching...' : 'Dispatch Trip'}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </div>

            {/* List Table Section */}
            <div className="lg:col-span-2 space-y-4">
              <div className="max-w-md">
                <InputGroup>
                  <InputGroupAddon>
                    <SearchIcon className="size-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    placeholder="Search dispatches by plate, model, driver..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </InputGroup>
              </div>

              <DataTable
                columns={columns}
                data={filteredTrips}
                keyExtractor={(t) => t.id}
                emptyTitle="No dispatches found"
                emptyDescription="Dispatch a trip using the panel on the left."
              />
            </div>
          </div>
        </LoadingBoundary>
      </div>
    </ErrorBoundary>
  )
}
