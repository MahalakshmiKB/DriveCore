import { useState, useEffect } from 'react'
import { TrendingUpIcon, TruckIcon, WrenchIcon, WalletIcon } from 'lucide-react'
import { KpiCard } from '@/components/design-system/kpi-card'
import { ChartCard, TripsBarChart, CostAreaChart, StatusPieChart } from '@/components/shared/data/ChartWrapper'
import { LoadingBoundary } from '@/components/shared/feedback/LoadingBoundary'
import { ErrorBoundary } from '@/components/shared/feedback/ErrorBoundary'
import { type ChartConfig } from '@/components/ui/chart'

const operatingCostData = [
  { month: 'Feb', fuel: 155, maintenance: 34, salaries: 120 },
  { month: 'Mar', fuel: 148, maintenance: 41, salaries: 120 },
  { month: 'Apr', fuel: 162, maintenance: 29, salaries: 125 },
  { month: 'May', fuel: 170, maintenance: 38, salaries: 125 },
  { month: 'Jun', fuel: 158, maintenance: 31, salaries: 130 },
  { month: 'Jul', fuel: 149, maintenance: 26, salaries: 130 },
]

const operatingCostConfig = {
  fuel: { label: 'Fuel (₹k)', color: 'var(--chart-1)' },
  maintenance: { label: 'Maintenance (₹k)', color: 'var(--chart-4)' },
} satisfies ChartConfig

const revenueTrendData = [
  { month: 'Feb', fuel: 480, maintenance: 390 },
  { month: 'Mar', fuel: 510, maintenance: 400 },
  { month: 'Apr', fuel: 530, maintenance: 395 },
  { month: 'May', fuel: 565, maintenance: 420 },
  { month: 'Jun', fuel: 545, maintenance: 410 },
  { month: 'Jul', fuel: 580, maintenance: 425 },
]

const revenueTrendConfig = {
  fuel: { label: 'Revenue (₹k)', color: 'var(--chart-1)' },
  maintenance: { label: 'Operating Cost (₹k)', color: 'var(--chart-3)' },
} satisfies ChartConfig

const vehicleROIData = [
  { status: 'FL-5542', value: 32, fill: 'var(--chart-1)' },
  { status: 'TX-8921', value: 28, fill: 'var(--chart-2)' },
  { status: 'CA-4431', value: 22, fill: 'var(--chart-4)' },
  { status: 'NY-1029', value: 18, fill: 'var(--chart-3)' },
]

const vehicleROIConfig = {
  value: { label: 'ROI (%)' },
  'FL-5542': { label: 'FL-5542', color: 'var(--chart-1)' },
  'TX-8921': { label: 'TX-8921', color: 'var(--chart-2)' },
  'CA-4431': { label: 'CA-4431', color: 'var(--chart-4)' },
  'NY-1029': { label: 'NY-1029', color: 'var(--chart-3)' },
} satisfies ChartConfig

export function FinanceAnalyticsPage() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Analytics</h1>
          <p className="text-sm text-muted-foreground">Deep-dive into operating costs, revenue trends, maintenance patterns and vehicle ROI.</p>
        </div>

        <LoadingBoundary isLoading={loading} variant="card">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Operating Cost" value="₹3.6L" icon={WalletIcon} delta="+2.8%" trend="up" hint="this month" />
            <KpiCard label="Revenue" value="₹5.8L" icon={TrendingUpIcon} delta="+8.3%" trend="up" hint="this month" />
            <KpiCard label="Maintenance Trend" value="₹26.1k" icon={WrenchIcon} delta="-3.2%" trend="up" hint="vs last month" />
            <KpiCard label="Fleet Profitability" value="37.9%" icon={TruckIcon} delta="+1.5%" trend="up" hint="net margin" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mt-6">
            <ChartCard title="Operating Cost Breakdown" description="Fuel, Maintenance & Salaries (₹k)">
              <TripsBarChart data={operatingCostData} config={operatingCostConfig} />
            </ChartCard>

            <ChartCard title="Revenue vs Operating Cost" description="Monthly trend (₹k)">
              <CostAreaChart data={revenueTrendData} config={revenueTrendConfig} />
            </ChartCard>

            <ChartCard title="Vehicle ROI Distribution" description="Return on investment by vehicle %" className="lg:col-span-2">
              <StatusPieChart
                data={vehicleROIData}
                config={vehicleROIConfig}
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
