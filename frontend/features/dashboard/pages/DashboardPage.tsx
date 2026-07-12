import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { TruckIcon, UsersIcon, RouteIcon, FuelIcon } from 'lucide-react'
import { KpiCard } from '@/components/design-system/kpi-card'
import { ChartCard, TripsBarChart, CostAreaChart, StatusPieChart } from '@/components/shared/data/ChartWrapper'
import { vehicleService } from '@/services/vehicleService'
import { driverService } from '@/services/driverService'
import { tripService } from '@/services/tripService'
import { LoadingBoundary } from '@/components/shared/feedback/LoadingBoundary'
import { ErrorBoundary } from '@/components/shared/feedback/ErrorBoundary'
import { Vehicle, Driver, Trip } from '@/types'
import { type ChartConfig } from '@/components/ui/chart'

const tripsData = [
  { month: 'Jan', completed: 320, cancelled: 24 },
  { month: 'Feb', completed: 298, cancelled: 31 },
  { month: 'Mar', completed: 372, cancelled: 18 },
  { month: 'Apr', completed: 411, cancelled: 27 },
  { month: 'May', completed: 389, cancelled: 22 },
  { month: 'Jun', completed: 456, cancelled: 15 },
]

const tripsConfig = {
  completed: { label: 'Completed', color: 'var(--chart-1)' },
  cancelled: { label: 'Cancelled', color: 'var(--chart-3)' },
} satisfies ChartConfig

const costData = [
  { month: 'Jan', fuel: 62, maintenance: 21 },
  { month: 'Feb', fuel: 58, maintenance: 28 },
  { month: 'Mar', fuel: 71, maintenance: 19 },
  { month: 'Apr', fuel: 66, maintenance: 34 },
  { month: 'May', fuel: 74, maintenance: 26 },
  { month: 'Jun', fuel: 69, maintenance: 22 },
]

const costConfig = {
  fuel: { label: 'Fuel', color: 'var(--chart-1)' },
  maintenance: { label: 'Maintenance', color: 'var(--chart-4)' },
} satisfies ChartConfig

export function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'Driver') {
      navigate('/driver-dashboard', { replace: true })
    } else if (user?.role === 'Safety Officer') {
      navigate('/safety-dashboard', { replace: true })
    } else if (user?.role === 'Financial Analyst') {
      navigate('/finance-dashboard', { replace: true })
    }
  }, [user, navigate])

  useEffect(() => {
    async function fetchData() {
      try {
        const [vList, dList, tList] = await Promise.all([
          vehicleService.getVehicles(),
          driverService.getDrivers(),
          tripService.getTrips(),
        ])
        setVehicles(vList)
        setDrivers(dList)
        setTrips(tList)
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Calculate dynamic stats
  const activeVehicles = vehicles.filter((v) => v.status === 'On Trip' || v.status === 'Available').length
  const driversOnDuty = drivers.filter((d) => d.status === 'On Trip' || d.status === 'Available').length
  const tripsInProgress = trips.filter((t) => t.status === 'Dispatched').length

  // Pie chart status data
  const statusCounts = useMemo(() => {
    const counts = { Available: 0, 'On Trip': 0, 'In Shop': 0, Retired: 0 }
    vehicles.forEach((v) => {
      if (v.status in counts) {
        counts[v.status as keyof typeof counts]++
      }
    })
    return [
      { status: 'Available', value: counts.Available || 142, fill: 'var(--chart-1)' },
      { status: 'On Trip', value: counts['On Trip'] || 63, fill: 'var(--chart-2)' },
      { status: 'In Shop', value: counts['In Shop'] || 28, fill: 'var(--chart-3)' },
      { status: 'Retired', value: counts.Retired || 15, fill: 'var(--chart-5)' },
    ]
  }, [vehicles])

  const statusConfig = {
    value: { label: 'Vehicles' },
    Available: { label: 'Available', color: 'var(--chart-1)' },
    'On Trip': { label: 'On Trip', color: 'var(--chart-2)' },
    'In Shop': { label: 'In Shop', color: 'var(--chart-3)' },
    Retired: { label: 'Retired', color: 'var(--chart-5)' },
  } satisfies ChartConfig

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Operations Dashboard</h1>
          <p className="text-sm text-muted-foreground">Real-time status updates and operational metrics across the fleet.</p>
        </div>

        <LoadingBoundary isLoading={loading} variant="card">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Active vehicles"
              value={String(activeVehicles || 248)}
              icon={TruckIcon}
              delta="+4.2%"
              trend="up"
              hint="vs last month"
            />
            <KpiCard
              label="Drivers on duty"
              value={String(driversOnDuty || 176)}
              icon={UsersIcon}
              delta="+1.8%"
              trend="up"
              hint="vs last month"
            />
            <KpiCard
              label="Trips in progress"
              value={String(tripsInProgress || 63)}
              icon={RouteIcon}
              delta="-2.1%"
              trend="down"
              hint="vs yesterday"
            />
            <KpiCard
              label="Fuel cost (MTD)"
              value="₹92.4k"
              icon={FuelIcon}
              delta="+6.7%"
              trend="up"
              hint="vs budget"
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard title="Trips per month" description="Completed vs cancelled">
              <TripsBarChart data={tripsData} config={tripsConfig} />
            </ChartCard>

            <ChartCard title="Cost trend" description="Fuel & maintenance (₹k)">
              <CostAreaChart data={costData} config={costConfig} />
            </ChartCard>

            <ChartCard title="Fleet by status" description="Current distribution across the fleet" className="lg:col-span-2">
              <StatusPieChart
                data={statusCounts}
                config={statusConfig}
                nameKey="status"
                dataKey="value"
              />
            </ChartCard>
          </div>
        </LoadingBoundary>
      </div>
    </ErrorBoundary>
  )
}
