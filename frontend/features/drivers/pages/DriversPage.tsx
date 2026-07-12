'use client'

import * as React from 'react'
import { SearchIcon, StarIcon } from 'lucide-react'
import { toast } from 'sonner'

import { driverService } from '@/services/driverService'
import { Driver } from '@/types'
import { DRIVER_STATUS_TONE } from '@/constants'
import { StatusBadge } from '@/components/design-system/status-badge'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { DataTable, DataTableColumn } from '@/components/shared/data/DataTable'
import { LoadingBoundary } from '@/components/shared/feedback/LoadingBoundary'
import { ErrorBoundary } from '@/components/shared/feedback/ErrorBoundary'

export function DriversPage() {
  const [drivers, setDrivers] = React.useState<Driver[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')

  React.useEffect(() => {
    async function fetchDrivers() {
      try {
        const list = await driverService.getDrivers()
        setDrivers(list)
      } catch (err) {
        toast.error('Failed to load drivers directory.')
      } finally {
        setLoading(false)
      }
    }
    fetchDrivers()
  }, [])

  const filteredDrivers = React.useMemo(() => {
    return drivers.filter(
      (d) =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.licenseNumber.toLowerCase().includes(search.toLowerCase()) ||
        d.status.toLowerCase().includes(search.toLowerCase())
    )
  }, [drivers, search])

  const columns: DataTableColumn<Driver>[] = [
    {
      header: 'Driver Name',
      accessorKey: 'name',
      className: 'font-medium',
    },
    {
      header: 'License Number',
      accessorKey: 'licenseNumber',
      className: 'text-muted-foreground tabular-nums',
    },
    {
      header: 'License Expiration',
      accessorKey: 'licenseExpiry',
      className: 'text-muted-foreground tabular-nums',
    },
    {
      header: 'Safety Rating',
      cell: (row) => (
        <span className="flex items-center gap-1.5 font-medium tabular-nums text-foreground">
          <StarIcon className="size-3.5 fill-warning text-warning" />
          {row.safetyScore} / 100
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row) => (
        <StatusBadge tone={DRIVER_STATUS_TONE[row.status]} className="ml-auto">
          {row.status}
        </StatusBadge>
      ),
      className: 'text-right',
    },
  ]

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Drivers Directory</h1>
          <p className="text-sm text-muted-foreground">Monitor safety scores, check license certifications, and track driver availability.</p>
        </div>

        <div className="max-w-md">
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon className="size-4 text-muted-foreground" />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search drivers by name, license..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
        </div>

        <LoadingBoundary isLoading={loading} variant="table">
          <DataTable
            columns={columns}
            data={filteredDrivers}
            keyExtractor={(d) => d.id}
            emptyTitle="No drivers found"
            emptyDescription="Try adjusting your filter settings or search term."
          />
        </LoadingBoundary>
      </div>
    </ErrorBoundary>
  )
}
