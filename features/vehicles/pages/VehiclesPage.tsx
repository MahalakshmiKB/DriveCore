'use client'

import * as React from 'react'
import { WrenchIcon, SearchIcon } from 'lucide-react'
import { toast } from 'sonner'

import { vehicleService } from '@/services/vehicleService'
import { Vehicle } from '@/types'
import { VEHICLE_STATUS_TONE } from '@/constants'
import { StatusBadge } from '@/components/design-system/status-badge'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { DataTable, DataTableColumn } from '@/components/shared/data/DataTable'
import { DialogWrapper } from '@/components/shared/data/DialogWrapper'
import { FormInput } from '@/components/shared/data/FormFields'
import { LoadingBoundary } from '@/components/shared/feedback/LoadingBoundary'
import { ErrorBoundary } from '@/components/shared/feedback/ErrorBoundary'
import { formatOdometer } from '@/utils'

export function VehiclesPage() {
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')
  const [selectedVehicle, setSelectedVehicle] = React.useState<Vehicle | null>(null)
  const [desc, setDesc] = React.useState('')
  const [cost, setCost] = React.useState('')
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  const fetchVehicles = React.useCallback(async () => {
    try {
      const list = await vehicleService.getVehicles()
      setVehicles(list)
    } catch (err) {
      toast.error('Failed to load vehicles directory.')
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  const handleLogMaintenance = async () => {
    if (!selectedVehicle) return
    if (!desc.trim()) {
      toast.error('Please enter a description for the maintenance.')
      return
    }

    try {
      const parsedCost = parseFloat(cost) || 0
      await vehicleService.logMaintenance(selectedVehicle.plate, desc, parsedCost)
      toast.success(`Maintenance record opened. Vehicle ${selectedVehicle.plate} set to In Shop.`)
      setDesc('')
      setCost('')
      setIsDialogOpen(false)
      setSelectedVehicle(null)
      fetchVehicles()
    } catch (err: any) {
      toast.error(err.message || 'Failed to record maintenance.')
    }
  }

  const filteredVehicles = React.useMemo(() => {
    return vehicles.filter(
      (v) =>
        v.plate.toLowerCase().includes(search.toLowerCase()) ||
        v.model.toLowerCase().includes(search.toLowerCase()) ||
        v.region.toLowerCase().includes(search.toLowerCase()) ||
        v.driver.toLowerCase().includes(search.toLowerCase())
    )
  }, [vehicles, search])

  const columns: DataTableColumn<Vehicle>[] = [
    {
      header: 'Registration',
      accessorKey: 'plate',
      className: 'font-medium tabular-nums',
    },
    {
      header: 'Model',
      accessorKey: 'model',
    },
    {
      header: 'Driver',
      accessorKey: 'driver',
      className: 'text-muted-foreground',
    },
    {
      header: 'Region',
      accessorKey: 'region',
      className: 'text-muted-foreground',
    },
    {
      header: 'Odometer',
      cell: (row) => formatOdometer(row.odometer),
      className: 'tabular-nums text-muted-foreground',
    },
    {
      header: 'Status',
      cell: (row) => (
        <StatusBadge tone={VEHICLE_STATUS_TONE[row.status]} className="ml-auto">
          {row.status}
        </StatusBadge>
      ),
      className: 'text-right',
    },
    {
      header: 'Actions',
      cell: (row) => (
        <Button
          variant="outline"
          size="xs"
          disabled={row.status === 'Retired' || row.status === 'In Shop'}
          onClick={() => {
            setSelectedVehicle(row)
            setIsDialogOpen(true)
          }}
        >
          <WrenchIcon data-icon="inline-start" className="size-3.5" />
          Log Maintenance
        </Button>
      ),
      className: 'text-right w-36',
    },
  ]

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Vehicles Directory</h1>
            <p className="text-sm text-muted-foreground">Manage and track assets, statuses, and logs across the regions.</p>
          </div>
        </div>

        <div className="max-w-md">
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon className="size-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search vehicles by plate, model, region, driver..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </div>

        <LoadingBoundary isLoading={loading} variant="table">
          <DataTable
            columns={columns}
            data={filteredVehicles}
            keyExtractor={(v) => v.plate}
            emptyTitle="No vehicles found"
            emptyDescription="Try refining your query search parameters."
          />
        </LoadingBoundary>

        {/* Maintenance Dialog */}
        {selectedVehicle && (
          <DialogWrapper
            isOpen={isDialogOpen}
            onOpenChange={(open) => {
              setIsDialogOpen(open)
              if (!open) setSelectedVehicle(null)
            }}
            trigger={<span className="hidden" />}
            title="Log maintenance"
            description={`Log maintenance for ${selectedVehicle.plate} (${selectedVehicle.model}). This changes status to In Shop.`}
            confirmText="Open record"
            onConfirm={handleLogMaintenance}
          >
            <div className="space-y-4 pt-2">
              <FormInput
                label="Description"
                id="maint-desc"
                placeholder="e.g. Brake pad replacement"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
              <FormInput
                label="Estimated cost ($)"
                id="maint-cost"
                type="number"
                placeholder="0.00"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
              />
            </div>
          </DialogWrapper>
        )}
      </div>
    </ErrorBoundary>
  )
}
