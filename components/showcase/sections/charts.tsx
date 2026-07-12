'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
} from 'recharts'

import { Section } from '@/components/showcase/section'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

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

const statusData = [
  { status: 'Available', value: 142, fill: 'var(--chart-1)' },
  { status: 'On Trip', value: 63, fill: 'var(--chart-2)' },
  { status: 'In Shop', value: 28, fill: 'var(--chart-3)' },
  { status: 'Retired', value: 15, fill: 'var(--chart-5)' },
]

const statusConfig = {
  value: { label: 'Vehicles' },
  Available: { label: 'Available', color: 'var(--chart-1)' },
  'On Trip': { label: 'On Trip', color: 'var(--chart-2)' },
  'In Shop': { label: 'In Shop', color: 'var(--chart-3)' },
  Retired: { label: 'Retired', color: 'var(--chart-5)' },
} satisfies ChartConfig

export function ChartsSection() {
  return (
    <Section
      id="charts"
      title="Charts"
      description="Recharts styled with the DriveCore data-visualization palette and consistent tooltips."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Trips per month</CardTitle>
            <CardDescription>Completed vs cancelled</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={tripsConfig} className="h-56 w-full">
              <BarChart data={tripsData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="completed" fill="var(--color-completed)" radius={4} />
                <Bar dataKey="cancelled" fill="var(--color-cancelled)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost trend</CardTitle>
            <CardDescription>Fuel &amp; maintenance ($k)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={costConfig} className="h-56 w-full">
              <AreaChart data={costData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  dataKey="fuel"
                  type="natural"
                  fill="var(--color-fuel)"
                  fillOpacity={0.2}
                  stroke="var(--color-fuel)"
                  stackId="a"
                />
                <Area
                  dataKey="maintenance"
                  type="natural"
                  fill="var(--color-maintenance)"
                  fillOpacity={0.2}
                  stroke="var(--color-maintenance)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Fleet by status</CardTitle>
            <CardDescription>Current distribution across the fleet</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={statusConfig}
              className="mx-auto h-64 w-full max-w-sm"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="status"
                  innerRadius={55}
                  strokeWidth={2}
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.status} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartLegend
                  content={<ChartLegendContent nameKey="status" />}
                  className="flex-wrap gap-2"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </Section>
  )
}
