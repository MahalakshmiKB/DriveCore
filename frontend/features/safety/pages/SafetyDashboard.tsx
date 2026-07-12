import { useState, useEffect } from 'react'
import {
  ShieldCheckIcon,
  FileWarningIcon,
  CalendarClockIcon,
  TrendingUpIcon,
  AlertTriangleIcon,
  BadgeCheckIcon,
} from 'lucide-react'
import { KpiCard } from '@/components/design-system/kpi-card'
import { ChartCard, TripsBarChart, CostAreaChart, StatusPieChart } from '@/components/shared/data/ChartWrapper'
import { LoadingBoundary } from '@/components/shared/feedback/LoadingBoundary'
import { ErrorBoundary } from '@/components/shared/feedback/ErrorBoundary'
import { useAuth } from '@/hooks/useAuth'
import { type ChartConfig } from '@/components/ui/chart'

const safetyTrendData = [
  { month: 'Feb', score: 88, incidents: 4 },
  { month: 'Mar', score: 91, incidents: 3 },
  { month: 'Apr', score: 89, incidents: 5 },
  { month: 'May', score: 93, incidents: 2 },
  { month: 'Jun', score: 94, incidents: 2 },
  { month: 'Jul', score: 96, incidents: 1 },
]

const safetyTrendConfig = {
  score: { label: 'Safety Score', color: 'var(--chart-1)' },
  incidents: { label: 'Incidents', color: 'var(--chart-3)' },
} satisfies ChartConfig

const licenseExpiryData = [
  { month: 'Aug', valid: 142, expiringSoon: 12, expired: 2 },
  { month: 'Sep', valid: 138, expiringSoon: 16, expired: 2 },
  { month: 'Oct', valid: 133, expiringSoon: 18, expired: 5 },
  { month: 'Nov', valid: 130, expiringSoon: 20, expired: 6 },
  { month: 'Dec', valid: 126, expiringSoon: 24, expired: 6 },
  { month: 'Jan', valid: 120, expiringSoon: 30, expired: 6 },
]

const licenseExpiryConfig = {
  valid: { label: 'Valid', color: 'var(--chart-1)' },
  expiringSoon: { label: 'Expiring Soon', color: 'var(--chart-4)' },
} satisfies ChartConfig

const incidentDistributionData = [
  { status: 'Minor', value: 14, fill: 'var(--chart-4)' },
  { status: 'Moderate', value: 5, fill: 'var(--chart-3)' },
  { status: 'Major', value: 2, fill: 'var(--chart-2)' },
  { status: 'Critical', value: 1, fill: 'var(--destructive)' },
]

const incidentDistributionConfig = {
  value: { label: 'Incidents' },
  Minor: { label: 'Minor', color: 'var(--chart-4)' },
  Moderate: { label: 'Moderate', color: 'var(--chart-3)' },
  Major: { label: 'Major', color: 'var(--chart-2)' },
  Critical: { label: 'Critical', color: 'var(--destructive)' },
} satisfies ChartConfig

export function SafetyDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Safety Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.name || 'Safety Officer'}. Monitor compliance and driver safety metrics.
            </p>
          </div>
          <span className="text-xs text-muted-foreground font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/5 flex items-center gap-1.5 w-fit">
            <span className="size-2 rounded-full bg-success animate-pulse" />
            Monitoring Active
          </span>
        </div>

        <LoadingBoundary isLoading={loading} variant="card">
          {/* KPI Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <KpiCard label="Drivers Compliant" value="142" icon={ShieldCheckIcon} delta="+2.1%" trend="up" hint="vs last month" />
            <KpiCard label="Expired Licenses" value="6" icon={FileWarningIcon} delta="-3" trend="up" hint="need urgent renewal" />
            <KpiCard label="Upcoming Renewals" value="24" icon={CalendarClockIcon} delta="Next 30 days" trend="neutral" hint="action required" />
            <KpiCard label="Fleet Safety Score" value="96%" icon={TrendingUpIcon} delta="+2.4%" trend="up" hint="vs last quarter" />
            <KpiCard label="Open Incidents" value="3" icon={AlertTriangleIcon} delta="-2" trend="up" hint="vs last month" />
            <KpiCard label="Compliance Rate" value="94.7%" icon={BadgeCheckIcon} delta="+1.1%" trend="up" hint="vs last quarter" />
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2 mt-6">
            <ChartCard title="Safety Score Trend" description="Monthly score vs incidents">
              <TripsBarChart data={safetyTrendData} config={safetyTrendConfig} />
            </ChartCard>

            <ChartCard title="License Expiry Timeline" description="Valid vs expiring licenses by month">
              <TripsBarChart data={licenseExpiryData} config={licenseExpiryConfig} />
            </ChartCard>

            <ChartCard title="Incident Distribution" description="Severity breakdown" className="lg:col-span-2">
              <StatusPieChart
                data={incidentDistributionData}
                config={incidentDistributionConfig}
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
