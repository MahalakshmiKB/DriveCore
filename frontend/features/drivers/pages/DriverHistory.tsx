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
  CheckCircle2Icon
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { DataTable } from '@/components/shared/data/DataTable'
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

  const columns = [
    {
      header: 'Trip ID',
      accessorKey: 'id',
      className: 'font-bold text-white text-xs w-24',
    },
    {
      header: 'Route Details',
      cell: (row: CompletedTrip) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-200">{row.route}</span>
          <span className="text-[10px] text-slate-400 mt-0.5">{row.date}</span>
        </div>
      ),
      className: 'text-left',
    },
    {
      header: 'Distance',
      accessorKey: 'distance',
      className: 'tabular-nums text-slate-300 font-medium',
    },
    {
      header: 'Duration',
      accessorKey: 'duration',
      className: 'tabular-nums text-slate-300 font-medium',
    },
    {
      header: 'Fuel Saved',
      accessorKey: 'fuelSaved',
      className: 'text-success font-semibold tabular-nums',
    },
    {
      header: 'Actions',
      cell: (row: CompletedTrip) => (
        <Button
          variant="outline"
          size="xs"
          onClick={() => handleDownload(row.id)}
          className="ml-auto flex items-center gap-1 border-white/5 bg-white/5 hover:bg-white/10 text-slate-300"
        >
          <DownloadIcon className="size-3.5" />
          Download Log
        </Button>
      ),
      className: 'text-right w-36',
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

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <InputGroup>
                <InputGroupAddon>
                  <SearchIcon className="size-4 text-slate-400" />
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="Search history by trip ID or route..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Filter:</span>
              <div className="flex gap-1 bg-slate-950/40 border border-white/5 p-1 rounded-xl">
                {['All', 'Completed', 'Cancelled'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${statusFilter === f
                      ? 'bg-primary text-white shadow-premium-sm'
                      : 'text-slate-400 hover:text-slate-300'
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
                  <div className="h-2 w-full bg-slate-950 border border-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: '98%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Smooth Braking Index</span>
                    <span className="text-success">95%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 border border-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: '95%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Engine Idle Duration Score</span>
                    <span className="text-primary">88%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-950 border border-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '88%' }} />
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl border border-white/5 bg-slate-950/40 text-[10px] text-slate-400 leading-normal flex items-start gap-2 font-medium">
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
