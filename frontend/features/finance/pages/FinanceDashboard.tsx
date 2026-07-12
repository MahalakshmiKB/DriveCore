import { useState, useEffect } from 'react'
import {
  WalletIcon,
  FuelIcon,
  WrenchIcon,
  TrendingUpIcon,
  BarChart3Icon,
  TruckIcon,
} from 'lucide-react'
import { KpiCard } from '@/components/design-system/kpi-card'
import { ChartCard, TripsBarChart, CostAreaChart, StatusPieChart } from '@/components/shared/data/ChartWrapper'
import { LoadingBoundary } from '@/components/shared/feedback/LoadingBoundary'
import { ErrorBoundary } from '@/components/shared/feedback/ErrorBoundary'
import { useAuth } from '@/hooks/useAuth'
import { type ChartConfig } from '@/components/ui/chart'

const expenseBreakdownData = [
  { month: 'Feb', fuel: 92, maintenance: 34, salaries: 120, insurance: 18 },
  { month: 'Mar', fuel: 88, maintenance: 41, salaries: 120, insurance: 18 },
  { month: 'Apr', fuel: 97, maintenance: 29, salaries: 125, insurance: 18 },
  { month: 'May', fuel: 104, maintenance: 38, salaries: 125, insurance: 18 },
  { month: 'Jun', fuel: 99, maintenance: 31, salaries: 130, insurance: 18 },
  { month: 'Jul', fuel: 92, maintenance: 26, salaries: 130, insurance: 18 },
]

const expenseBreakdownConfig = {
  fuel: { label: 'Fuel (₹k)', color: 'var(--chart-1)' },
  maintenance: { label: 'Maintenance (₹k)', color: 'var(--chart-4)' },
} satisfies ChartConfig

const fuelConsumptionData = [
  { month: 'Feb', diesel: 62, petrol: 8 },
  { month: 'Mar', diesel: 58, petrol: 9 },
  { month: 'Apr', diesel: 71, petrol: 7 },
  { month: 'May', diesel: 66, petrol: 10 },
  { month: 'Jun', diesel: 74, petrol: 8 },
  { month: 'Jul', diesel: 69, petrol: 9 },
]

const fuelConsumptionConfig = {
  diesel: { label: 'Diesel (₹k)', color: 'var(--chart-1)' },
  petrol: { label: 'Petrol (₹k)', color: 'var(--chart-2)' },
} satisfies ChartConfig

const profitData = [
  { status: 'Revenue', value: 580, fill: 'var(--chart-1)' },
  { status: 'Operating Cost', value: 360, fill: 'var(--chart-3)' },
  { status: 'Net Profit', value: 220, fill: 'var(--chart-2)' },
]

const profitConfig = {
  value: { label: '₹ (Lakhs)' },
  Revenue: { label: 'Revenue', color: 'var(--chart-1)' },
  'Operating Cost': { label: 'Operating Cost', color: 'var(--chart-3)' },
  'Net Profit': { label: 'Net Profit', color: 'var(--chart-2)' },
} satisfies ChartConfig

export function FinanceDashboard() {
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
            <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Financial Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.name || 'Financial Analyst'}. Monitor fleet operating costs and financial performance.
            </p>
          </div>
          <span className="text-xs text-muted-foreground font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/5 flex items-center gap-1.5 w-fit">
            <span className="size-2 rounded-full bg-success animate-pulse" />
            Reporting Live
          </span>
        </div>

        <LoadingBoundary isLoading={loading} variant="card">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <KpiCard label="Monthly Expenses" value="₹2.66L" icon={WalletIcon} delta="+4.2%" trend="up" hint="vs last month" />
            <KpiCard label="Fuel Cost (MTD)" value="₹92.4k" icon={FuelIcon} delta="+6.7%" trend="up" hint="vs budget" />
            <KpiCard label="Maintenance Cost" value="₹26.1k" icon={WrenchIcon} delta="-3.2%" trend="up" hint="vs last month" />
            <KpiCard label="Revenue (MTD)" value="₹5.8L" icon={TrendingUpIcon} delta="+8.3%" trend="up" hint="vs last month" />
            <KpiCard label="Profit Margin" value="37.9%" icon={BarChart3Icon} delta="+1.5%" trend="up" hint="net margin" />
            <KpiCard label="Fleet Operating Cost" value="₹3.6L" icon={TruckIcon} delta="+2.8%" trend="flat" hint="total this month" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mt-6">
            <ChartCard title="Expense Breakdown" description="Fuel vs Maintenance cost trend (₹k)">
              <TripsBarChart data={expenseBreakdownData} config={expenseBreakdownConfig} />
            </ChartCard>

            <ChartCard title="Fuel Consumption" description="Diesel vs Petrol spend (₹k)">
              <TripsBarChart data={fuelConsumptionData} config={fuelConsumptionConfig} />
            </ChartCard>

            <ChartCard title="Monthly Profit Distribution" description="Revenue, Operating Cost & Net Profit (₹L)" className="lg:col-span-2">
              <StatusPieChart
                data={profitData}
                config={profitConfig}
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
