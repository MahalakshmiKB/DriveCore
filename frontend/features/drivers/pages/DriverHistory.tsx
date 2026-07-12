import { useState } from 'react'
import { toast } from 'sonner'
import {
  HistoryIcon,
  SearchIcon,
  DownloadIcon,
  MapPinIcon,
  CalendarIcon,
  TrendingUpIcon,
  AwardIcon,
  ClockIcon,
  ChevronRightIcon,
  CheckCircle2Icon,
  Leaf
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { DataTable, DataTableColumn } from '@/components/shared/data/DataTable'
import { StatusBadge } from '@/components/design-system/status-badge'
import { KpiCard } from '@/components/design-system/kpi-card'

interface CompletedTrip {
  id: string
  route: string
  date: string
  distance: string
  duration: string
  status: 'Completed' | 'Cancelled'
  fuelSaved: string
}

const mockHistory: CompletedTrip[] = [
  { id: 'TRIP-641', route: 'Pune - Mumbai Domestic Cargo', date: '2026-07-08', distance: '165 km', duration: '3.5 Hrs', status: 'Completed', fuelSaved: '4.2 L' },
  { id: 'TRIP-622', route: 'JNPT Port - Chakan Plant', date: '2026-07-06', distance: '120 km', duration: '2.8 Hrs', status: 'Completed', fuelSaved: '3.1 L' },
  { id: 'TRIP-615', route: 'Mumbai Terminal - Nashik Depot', date: '2026-07-03', distance: '180 km', duration: '4.2 Hrs', status: 'Completed', fuelSaved: '5.0 L' },
  { id: 'TRIP-601', route: 'Pune Hub - Panvel Warehouse', date: '2026-06-28', distance: '90 km', duration: '2.0 Hrs', status: 'Completed', fuelSaved: '2.2 L' },
  { id: 'TRIP-584', route: 'Chakan - JNPT Container Line', date: '2026-06-24', distance: '120 km', duration: '3.0 Hrs', status: 'Completed', fuelSaved: '2.8 L' }
]

export function DriverHistory() {
  const [trips] = useState<CompletedTrip[]>(mockHistory)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const handleDownload = (tripId: string) => {
    toast.success(`Started downloading summary for trip: ${tripId}`)
  }

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.route.toLowerCase().includes(search.toLowerCase()) || trip.id.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'All' || trip.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Performance totals
  const totalTrips = trips.filter(t => t.status === 'Completed').length
  const totalDistance = '675 km'
  const totalHours = '15.5 Hrs'
  const avgEcoRating = '98%'

  const columns: DataTableColumn<CompletedTrip>[] = [
    {
      header: 'Trip ID',
      accessorKey: 'id',
      className: 'w-[10%] font-mono text-xs font-bold text-foreground',
    },
    {
      header: 'Route Details',
      cell: (row: CompletedTrip) => (
        <div className="flex items-center gap-2 max-w-full min-w-0">
          <MapPinIcon className="size-3.5 text-primary shrink-0" />
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-foreground truncate">{row.route}</span>
            <span className="text-[10px] text-muted-foreground mt-0.5">{row.date}</span>
          </div>
        </div>
      ),
      className: 'w-[42%] text-left',
    },
    {
      header: 'Distance',
      cell: (row: CompletedTrip) => {
        const [value, suffix] = row.distance.split(' ')
        return (
          <span className="tabular-nums text-foreground font-bold text-sm">
            {value}<span className="text-[10px] text-muted-foreground font-normal ml-0.5">{suffix}</span>
          </span>
        )
      },
      className: 'w-[12%] text-left',
    },
    {
      header: 'Duration',
      cell: (row: CompletedTrip) => (
        <div className="inline-flex items-center justify-center gap-1.5 tabular-nums text-foreground mx-auto">
          <ClockIcon className="size-3.5 text-muted-foreground shrink-0" />
          <span>{row.duration}</span>
        </div>
      ),
      className: 'w-[12%] text-center',
    },
    {
      header: 'Fuel Saved',
      cell: (row: CompletedTrip) => (
        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-success/15 dark:bg-success/20 text-success border border-success/10">
          <Leaf className="size-3 shrink-0" />
          <span>{row.fuelSaved}</span>
        </div>
      ),
      truncate: false,
      className: 'w-[12%] text-left',
    },
    {
      header: 'Actions',
      cell: (row: CompletedTrip) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDownload(row.id)}
          className="h-8 px-3 rounded-lg text-xs font-semibold border-border hover:bg-muted text-foreground flex items-center gap-1.5 ml-auto"
        >
          <DownloadIcon className="size-3.5 shrink-0" />
          Download Log
        </Button>
      ),
      truncate: false,
      className: 'w-[12%] text-right',
    }
  ]

  return (
    <div className="flex flex-col gap-6">

      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Trip History</h1>
        <p className="text-sm text-muted-foreground">Check completed operations logs, download dispatch sheets, and inspect fuel savings.</p>
      </div>

      {/* Monthly totals summary cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Completed Trips" value={String(totalTrips)} icon={CheckCircle2Icon} delta="+2" trend="up" hint="This Month" />
        <KpiCard label="Hours Driven" value={totalHours} icon={ClockIcon} delta="+3.5 Hrs" trend="up" hint="This Month" />
        <KpiCard label="Distance Covered" value={totalDistance} icon={TrendingUpIcon} delta="+120 km" trend="up" hint="This Month" />
        <KpiCard label="Eco Saving Score" value={avgEcoRating} icon={AwardIcon} delta="+0.4%" trend="up" hint="Eco rating" />
      </div>

      {/* Main layout grid */}
      <div className="grid gap-6 lg:grid-cols-12">

        {/* Left: Table & filters */}
        <div className="lg:col-span-8 space-y-4">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-muted/20 dark:bg-card/45 p-3 rounded-2xl border border-border/40">
            <div className="flex-1 max-w-md min-w-0">
              <InputGroup>
                <InputGroupAddon>
                  <SearchIcon className="size-4 text-muted-foreground" />
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="Search history by trip ID or route..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground font-semibold">Status:</span>
              <div className="flex gap-1 bg-muted/60 dark:bg-slate-950/40 border border-border/30 p-1 rounded-xl">
                {['All', 'Completed', 'Cancelled'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all ${statusFilter === f
                      ? 'bg-primary text-white shadow-premium-sm'
                      : 'text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Card className="border border-border/45 bg-card rounded-[20px] shadow-premium-sm overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredTrips}
              keyExtractor={(t) => t.id}
              emptyTitle="No completed logs found"
              emptyDescription="Adjust filters or try a different search parameter."
            />
          </Card>
        </div>

        {/* Right: Driver performance stats */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border border-border/45 bg-card rounded-[20px] shadow-premium-sm">
            <CardHeader className="pb-3 border-b border-border/20">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <AwardIcon className="size-4.5 text-primary" />
                Eco-Performance Dashboard
              </CardTitle>
              <CardDescription className="text-[10px]">Real-time efficiency scoring metrics.</CardDescription>
            </CardHeader>
            <CardContent className="pt-5 space-y-4 text-xs">

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Speed Limit Compliance</span>
                    <span className="text-success">98%</span>
                  </div>
                  <div className="h-2 w-full bg-muted border border-border/40 rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: '98%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Smooth Braking Index</span>
                    <span className="text-success">95%</span>
                  </div>
                  <div className="h-2 w-full bg-muted border border-border/40 rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Engine Idle Duration Score</span>
                    <span className="text-primary">88%</span>
                  </div>
                  <div className="h-2 w-full bg-muted border border-border/40 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl border border-border/40 bg-muted/40 dark:bg-slate-950/40 text-[10px] text-muted-foreground leading-normal flex items-start gap-2 font-medium">
                <AwardIcon className="size-4 text-primary shrink-0 mt-0.5" />
                <span>Maintain safety ratings above 90% to remain eligible for seasonal dispatcher bonuses.</span>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  )
}
