'use client'

import * as React from 'react'
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

interface ChartCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function ChartCard({ title, description, children, className }: ChartCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

// Predefined Trips per Month Bar Chart
interface TripsBarChartProps {
  data: any[]
  config: ChartConfig
}

export function TripsBarChart({ data, config }: TripsBarChartProps) {
  return (
    <ChartContainer config={config} className="h-56 w-full">
      <BarChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/40" />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="completed" fill="var(--color-completed)" radius={[6, 6, 0, 0]} />
        <Bar dataKey="cancelled" fill="var(--color-cancelled)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

// Predefined Cost Trend Area Chart
interface CostAreaChartProps {
  data: any[]
  config: ChartConfig
}

export function CostAreaChart({ data, config }: CostAreaChartProps) {
  return (
    <ChartContainer config={config} className="h-56 w-full">
      <AreaChart data={data} accessibilityLayer>
        <defs>
          <linearGradient id="colorFuelGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-fuel)" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="var(--color-fuel)" stopOpacity={0.01}/>
          </linearGradient>
          <linearGradient id="colorMaintGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-maintenance)" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="var(--color-maintenance)" stopOpacity={0.01}/>
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/40" />
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
          fill="url(#colorFuelGrad)"
          stroke="var(--color-fuel)"
          strokeWidth={2}
          stackId="a"
        />
        <Area
          dataKey="maintenance"
          type="natural"
          fill="url(#colorMaintGrad)"
          stroke="var(--color-maintenance)"
          strokeWidth={2}
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  )
}

// Predefined Status Distribution Pie Chart
interface StatusPieChartProps {
  data: any[]
  config: ChartConfig
  nameKey: string
  dataKey: string
}

export function StatusPieChart({ data, config, nameKey, dataKey }: StatusPieChartProps) {
  return (
    <ChartContainer config={config} className="mx-auto h-64 w-full max-w-sm">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={data}
          dataKey={dataKey}
          nameKey={nameKey}
          innerRadius={55}
          strokeWidth={2}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.fill} />
          ))}
        </Pie>
        <ChartLegend
          content={<ChartLegendContent nameKey={nameKey} />}
          className="flex-wrap gap-2"
        />
      </PieChart>
    </ChartContainer>
  )
}
