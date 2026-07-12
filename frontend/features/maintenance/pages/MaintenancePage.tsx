'use client'

import * as React from 'react'
import { WrenchIcon, SearchIcon, PlusIcon, CalendarIcon, CheckCircle2Icon, Settings2Icon } from 'lucide-react'
import { toast } from 'sonner'

import { KpiCard } from '@/components/design-system/kpi-card'
import { StatusBadge } from '@/components/design-system/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { DataTable, DataTableColumn } from '@/components/shared/data/DataTable'
import { LoadingBoundary } from '@/components/shared/feedback/LoadingBoundary'
import { ErrorBoundary } from '@/components/shared/feedback/ErrorBoundary'

interface MaintenanceRecord {
  id: string
  plate: string
  model: string
  description: string
  cost: number
  scheduledDate: string
  status: 'In Shop' | 'Scheduled' | 'Completed'
}

const mockMaintenanceData: MaintenanceRecord[] = [
  { id: 'm-101', plate: 'TX-8921', model: 'Freightliner Cascadia', description: 'Engine Diagnostics & Tuning', cost: 450, scheduledDate: '2026-07-12', status: 'In Shop' },
  { id: 'm-102', plate: 'CA-4431', model: 'Volvo VNL 860', description: 'Brake Pads & Rotors Replacement', cost: 210, scheduledDate: '2026-07-15', status: 'Scheduled' },
  { id: 'm-103', plate: 'NY-1029', model: 'Peterbilt 579', description: 'Scheduled oil and filter change', cost: 75, scheduledDate: '2026-07-10', status: 'Completed' },
  { id: 'm-104', plate: 'FL-5542', model: 'Kenworth T680', description: 'Tire rotation and alignment check', cost: 180, scheduledDate: '2026-07-11', status: 'Completed' },
  { id: 'm-105', plate: 'WA-7731', model: 'Volvo VNL 860', description: 'Transmission fluid replacement', cost: 320, scheduledDate: '2026-07-18', status: 'Scheduled' },
]

export function MaintenancePage() {
  const [records, setRecords] = React.useState<MaintenanceRecord[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string>('All')

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setRecords(mockMaintenanceData)
      setLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  const handleCreateOrder = () => {
    toast.success('Maintenance work order created successfully.')
  }

  const filteredRecords = React.useMemo(() => {
    return records.filter((r) => {
      const matchesSearch = r.plate.toLowerCase().includes(search.toLowerCase()) ||
                            r.model.toLowerCase().includes(search.toLowerCase()) ||
                            r.description.toLowerCase().includes(search.toLowerCase())
      
      const matchesStatus = statusFilter === 'All' || r.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [records, search, statusFilter])

  const activeCount = records.filter(r => r.status === 'In Shop').length
  const scheduledCount = records.filter(r => r.status === 'Scheduled').length
  const totalCostMTD = records.filter(r => r.status === 'Completed' || r.status === 'In Shop').reduce((sum, r) => sum + r.cost, 0)

  const columns: DataTableColumn<MaintenanceRecord>[] = [
    {
      header: 'Ticket ID',
      accessorKey: 'id',
      className: 'font-mono text-xs text-muted-foreground',
    },
    {
      header: 'Vehicle Plate',
      accessorKey: 'plate',
      className: 'font-semibold tabular-nums text-foreground',
    },
    {
      header: 'Model',
      accessorKey: 'model',
      className: 'text-muted-foreground',
    },
    {
      header: 'Work Description',
      accessorKey: 'description',
    },
    {
      header: 'Cost',
      cell: (row) => `$${row.cost.toFixed(2)}`,
      className: 'tabular-nums text-foreground font-medium',
    },
    {
      header: 'Scheduled Date',
      accessorKey: 'scheduledDate',
      className: 'text-muted-foreground tabular-nums',
    },
    {
      header: 'Status',
      cell: (row) => {
        const tone = row.status === 'In Shop' ? 'warning' : row.status === 'Scheduled' ? 'info' : 'success'
        return (
          <StatusBadge tone={tone} className="ml-auto">
            {row.status}
          </StatusBadge>
        )
      },
      className: 'text-right',
    },
  ]

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-8">
        
        {/* Hero Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Maintenance Center</h1>
            <p className="text-sm text-muted-foreground">Manage active workshop tickets, vehicle schedules, and preventive audits.</p>
          </div>
          <Button onClick={handleCreateOrder} size="sm" className="w-full sm:w-auto shadow-sm">
            <PlusIcon className="size-4 mr-1.5" />
            Create Work Order
          </Button>
        </div>

        <LoadingBoundary isLoading={loading} variant="card">
          
          {/* KPI summaries */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Active In Shop" value={String(activeCount)} icon={WrenchIcon} delta="+1" trend="up" hint="vs last week" />
            <KpiCard label="Scheduled Services" value={String(scheduledCount)} icon={CalendarIcon} delta="+2" trend="up" hint="this week" />
            <KpiCard label="Inspection Costs (MTD)" value={`$${totalCostMTD}`} icon={PlusIcon} delta="+12.4%" trend="up" hint="vs budget" />
            <KpiCard label="Avg Turnaround" value="1.8 Days" icon={Settings2Icon} delta="-0.3" trend="down" hint="resolution time" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            
            {/* Search & Filters & Data Table */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <InputGroup>
                    <InputGroupAddon>
                      <SearchIcon className="size-4 text-muted-foreground/70" />
                    </InputGroupAddon>
                    <InputGroupInput
                      placeholder="Search tickets by plate, model, description..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </InputGroup>
                </div>
                <div className="flex gap-1">
                  {['All', 'In Shop', 'Scheduled', 'Completed'].map((filter) => (
                    <Button
                      key={filter}
                      variant={statusFilter === filter ? 'default' : 'outline'}
                      size="xs"
                      onClick={() => setStatusFilter(filter)}
                      className="rounded-lg text-xs"
                    >
                      {filter}
                    </Button>
                  ))}
                </div>
              </div>

              <DataTable
                columns={columns}
                data={filteredRecords}
                keyExtractor={(r) => r.id}
                emptyTitle="No maintenance tickets found"
                emptyDescription="Try refining your query search parameters or status filters."
              />
            </div>

            {/* Statistics Sidebar Cards */}
            <div className="space-y-5">
              <Card className="border border-border/40 bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-foreground">Workshop Distribution</CardTitle>
                  <CardDescription className="text-xs">Service types allocation for active fleet tickets.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Engine & Transmission</span>
                      <span>40%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '40%' }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Brakes & Chassis</span>
                      <span>30%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full animate-pulse" style={{ width: '30%' }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Preventive Maintenance</span>
                      <span>30%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-success rounded-full" style={{ width: '30%' }} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/40 bg-card text-card-foreground">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-foreground">
                    <CheckCircle2Icon className="size-4 text-success" />
                    Compliance Rate
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    98.2% of scheduled preventive check-ups have been resolved within SLA timelines over the past 30 days.
                  </p>
                </CardContent>
              </Card>
            </div>
            
          </div>

        </LoadingBoundary>
      </div>
    </ErrorBoundary>
  )
}
