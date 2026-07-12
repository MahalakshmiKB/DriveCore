import { useState, useEffect, useMemo } from 'react'
import { FuelIcon, SearchIcon, DownloadIcon, TrendingUpIcon } from 'lucide-react'
import { toast } from 'sonner'
import { KpiCard } from '@/components/design-system/kpi-card'
import { ChartCard, CostAreaChart } from '@/components/shared/data/ChartWrapper'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { DataTable, DataTableColumn } from '@/components/shared/data/DataTable'
import { LoadingBoundary } from '@/components/shared/feedback/LoadingBoundary'
import { ErrorBoundary } from '@/components/shared/feedback/ErrorBoundary'
import { type ChartConfig } from '@/components/ui/chart'

interface FuelRecord {
  id: string
  plate: string
  model: string
  driver: string
  litres: number
  costPerLitre: number
  totalCost: number
  mileage: number
  station: string
  date: string
}

const mockFuelLogs: FuelRecord[] = [
  { id: 'f-201', plate: 'FL-5542', model: 'Tata Prima 5530.S', driver: 'Marcus Vance', litres: 195, costPerLitre: 91.2, totalCost: 17784, mileage: 11.8, station: 'Indian Oil NH-48', date: '2026-07-12' },
  { id: 'f-202', plate: 'TX-8921', model: 'Ashok Leyland 2518', driver: 'Ava Monroe', litres: 170, costPerLitre: 91.2, totalCost: 15504, mileage: 12.4, station: 'HPCL Pune', date: '2026-07-12' },
  { id: 'f-203', plate: 'CA-4431', model: 'Volvo FMX 440', driver: 'Lucas Thorne', litres: 145, costPerLitre: 91.6, totalCost: 13282, mileage: 13.1, station: 'Bharat Petroleum Nashik', date: '2026-07-11' },
  { id: 'f-204', plate: 'NY-1029', model: 'BharatBenz 2823', driver: 'Sarah Jenkins', litres: 180, costPerLitre: 91.2, totalCost: 16416, mileage: 12.0, station: 'Indian Oil Surat', date: '2026-07-10' },
  { id: 'f-205', plate: 'WA-7731', model: 'Eicher Pro 6049', driver: 'Elena Rostova', litres: 160, costPerLitre: 90.8, totalCost: 14528, mileage: 12.8, station: 'HPCL Ahmedabad', date: '2026-07-09' },
]

const efficiencyTrendData = [
  { month: 'Feb', fuel: 155, maintenance: 34 },
  { month: 'Mar', fuel: 148, maintenance: 41 },
  { month: 'Apr', fuel: 162, maintenance: 29 },
  { month: 'May', fuel: 170, maintenance: 38 },
  { month: 'Jun', fuel: 158, maintenance: 31 },
  { month: 'Jul', fuel: 149, maintenance: 26 },
]

const efficiencyConfig = {
  fuel: { label: 'Fuel Cost (₹k)', color: 'var(--chart-1)' },
  maintenance: { label: 'Mileage Efficiency', color: 'var(--chart-4)' },
} satisfies ChartConfig

const COLUMNS: DataTableColumn<FuelRecord>[] = [
  { header: 'Vehicle', accessorKey: 'plate' as keyof FuelRecord },
  { header: 'Model', accessorKey: 'model' as keyof FuelRecord },
  { header: 'Driver', accessorKey: 'driver' as keyof FuelRecord },
  { header: 'Litres', accessorKey: 'litres' as keyof FuelRecord },
  {
    header: 'Cost/Litre',
    accessorKey: 'costPerLitre' as keyof FuelRecord,
    cell: (row) => <span>₹{row.costPerLitre.toFixed(1)}</span>,
  },
  {
    header: 'Total Cost',
    accessorKey: 'totalCost' as keyof FuelRecord,
    cell: (row) => <span className="font-semibold">₹{row.totalCost.toLocaleString('en-IN')}</span>,
  },
  {
    header: 'Mileage (km/L)',
    accessorKey: 'mileage' as keyof FuelRecord,
    cell: (row) => <span className={`font-semibold ${row.mileage > 12 ? 'text-success' : 'text-warning'}`}>{row.mileage}</span>,
  },
  { header: 'Station', accessorKey: 'station' as keyof FuelRecord },
  { header: 'Date', accessorKey: 'date' as keyof FuelRecord },
]

export function FinanceFuelPage() {
  const [logs, setLogs] = useState<FuelRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const t = setTimeout(() => { setLogs(mockFuelLogs); setLoading(false) }, 400)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() =>
    logs.filter(r =>
      r.plate.toLowerCase().includes(search.toLowerCase()) ||
      r.driver.toLowerCase().includes(search.toLowerCase()) ||
      r.model.toLowerCase().includes(search.toLowerCase())
    ), [logs, search])

  const totalCost = logs.reduce((s, r) => s + r.totalCost, 0)
  const totalLitres = logs.reduce((s, r) => s + r.litres, 0)
  const avgMileage = logs.length ? (logs.reduce((s, r) => s + r.mileage, 0) / logs.length).toFixed(1) : '0'

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Fuel Logs</h1>
          <p className="text-sm text-muted-foreground">Analyse fuel consumption, mileage efficiency and cost distribution across the fleet.</p>
        </div>

        <LoadingBoundary isLoading={loading} variant="card">
          <div className="grid gap-5 sm:grid-cols-3">
            <KpiCard label="Total Fuel Cost" value={`₹${(totalCost / 1000).toFixed(1)}k`} icon={FuelIcon} delta="+6.7%" trend="up" hint="this month" />
            <KpiCard label="Total Litres" value={`${totalLitres}L`} icon={FuelIcon} delta="Consumed" trend="neutral" hint="total refuelling" />
            <KpiCard label="Avg Fleet Mileage" value={`${avgMileage} km/L`} icon={TrendingUpIcon} delta="+0.3 km/L" trend="up" hint="vs last month" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mt-6">
            <ChartCard title="Fuel Cost Trend" description="Monthly fuel spend vs maintenance (₹k)">
              <CostAreaChart data={efficiencyTrendData} config={efficiencyConfig} />
            </ChartCard>
            <Card className="border border-border/45 bg-card rounded-[20px] shadow-premium-sm">
              <CardHeader className="pb-4 border-b border-border/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                    <FuelIcon className="size-4.5 text-primary" />
                    Fuel Log Details
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <InputGroup className="max-w-xs">
                      <InputGroupAddon>
                        <SearchIcon className="size-4 text-muted-foreground" />
                      </InputGroupAddon>
                      <InputGroupInput placeholder="Search vehicle/driver..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </InputGroup>
                    <Button className="h-9 px-4 rounded-xl text-xs font-semibold bg-primary text-white active:scale-[0.98]" onClick={() => toast.success('Fuel export initiated.')}>
                      <DownloadIcon className="size-4 mr-1" /> Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <DataTable columns={COLUMNS} data={filtered} keyExtractor={(r) => r.id} />
              </CardContent>
            </Card>
          </div>
        </LoadingBoundary>
      </div>
    </ErrorBoundary>
  )
}
