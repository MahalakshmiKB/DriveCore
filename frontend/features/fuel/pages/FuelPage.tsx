'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { FuelIcon, SearchIcon, PlusIcon, CompassIcon, InfoIcon, AwardIcon, TrendingUpIcon } from 'lucide-react'
import { toast } from 'sonner'

import { KpiCard } from '@/components/design-system/kpi-card'
import { StatusBadge } from '@/components/design-system/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { DataTable, DataTableColumn } from '@/components/shared/data/DataTable'
import { LoadingBoundary } from '@/components/shared/feedback/LoadingBoundary'
import { ErrorBoundary } from '@/components/shared/feedback/ErrorBoundary'

interface FuelRecord {
  id: string
  plate: string
  model: string
  driver: string
  gallons: number
  cost: number
  station: string
  date: string
  mpg: number
}

const mockFuelLogs: FuelRecord[] = [
  { id: 'f-201', plate: 'FL-5542', model: 'Kenworth T680', driver: 'Marcus Vance', gallons: 52.0, cost: 161.20, station: 'Shell #41 - Denver', date: '2026-07-12', mpg: 11.8 },
  { id: 'f-202', plate: 'TX-8921', model: 'Freightliner Cascadia', driver: 'Ava Monroe', gallons: 45.2, cost: 135.60, station: 'BP #12 - Dallas', date: '2026-07-12', mpg: 12.4 },
  { id: 'f-203', plate: 'CA-4431', model: 'Volvo VNL 860', driver: 'Lucas Thorne', gallons: 38.5, cost: 119.35, station: 'Pilot #88 - Barstow', date: '2026-07-11', mpg: 13.1 },
  { id: 'f-204', plate: 'NY-1029', model: 'Peterbilt 579', driver: 'Sarah Jenkins', gallons: 48.0, cost: 153.60, station: 'BP #104 - Albany', date: '2026-07-10', mpg: 12.0 },
  { id: 'f-205', plate: 'WA-7731', model: 'Volvo VNL 860', driver: 'Elena Rostova', gallons: 42.5, cost: 131.75, station: 'Love’s #230 - Tacoma', date: '2026-07-09', mpg: 12.8 },
]

export function FuelPage() {
  const [logs, setLogs] = useState<FuelRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [regionFilter, setRegionFilter] = useState<string>('All')

  useEffect(() => {
    const timer = setTimeout(() => {
      setLogs(mockFuelLogs)
      setLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  const handleLogRefill = () => {
    toast.success('Fuel transaction logged successfully.')
  }

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const matchesSearch = l.plate.toLowerCase().includes(search.toLowerCase()) ||
                            l.driver.toLowerCase().includes(search.toLowerCase()) ||
                            l.station.toLowerCase().includes(search.toLowerCase())
      
      const matchesRegion = regionFilter === 'All' || l.station.toLowerCase().includes(regionFilter.toLowerCase())
      return matchesSearch && matchesRegion
    })
  }, [logs, search, regionFilter])

  const totalCost = logs.reduce((sum, l) => sum + l.cost, 0)
  const avgMpg = logs.length > 0 ? (logs.reduce((sum, l) => sum + l.mpg, 0) / logs.length).toFixed(1) : '0.0'
  const totalGallons = logs.reduce((sum, l) => sum + l.gallons, 0)
  const avgCostPerGallon = totalGallons > 0 ? (totalCost / totalGallons).toFixed(2) : '0.00'

  const columns: DataTableColumn<FuelRecord>[] = [
    {
      header: 'Refill ID',
      accessorKey: 'id',
      className: 'font-mono text-xs text-muted-foreground',
    },
    {
      header: 'Vehicle',
      accessorKey: 'plate',
      className: 'font-semibold tabular-nums text-foreground',
    },
    {
      header: 'Driver',
      accessorKey: 'driver',
      className: 'text-muted-foreground',
    },
    {
      header: 'Gallons',
      cell: (row) => `${row.gallons.toFixed(1)} Gal`,
      className: 'tabular-nums text-foreground font-medium',
    },
    {
      header: 'Total Cost',
      cell: (row) => `₹${row.cost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      className: 'tabular-nums text-foreground font-semibold',
    },
    {
      header: 'Station',
      accessorKey: 'station',
      className: 'text-muted-foreground text-xs',
    },
    {
      header: 'Date',
      accessorKey: 'date',
      className: 'text-muted-foreground tabular-nums',
    },
    {
      header: 'Fuel Efficiency',
      cell: (row) => (
        <span className="flex items-center gap-1.5 font-semibold text-success">
          <TrendingUpIcon className="size-3.5" />
          {row.mpg} MPG
        </span>
      ),
      className: 'text-right',
    },
  ]

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-8">
        
        {/* Hero Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Fuel logs & Energy</h1>
            <p className="text-sm text-muted-foreground">Monitor fuel efficiency metrics, track corporate card dispatches, and audit refill costs.</p>
          </div>
          <Button onClick={handleLogRefill} size="sm" className="w-full sm:w-auto shadow-sm">
            <PlusIcon className="size-4 mr-1.5" />
            Log Fuel Purchase
          </Button>
        </div>

        <LoadingBoundary isLoading={loading} variant="card">
          
          {/* KPI Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Fuel Costs MTD" value={`₹${totalCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`} icon={FuelIcon} delta="+6.7%" trend="up" hint="vs monthly budget" />
            <KpiCard label="Avg efficiency" value={`${avgMpg} MPG`} icon={AwardIcon} delta="+1.2%" trend="up" hint="across active fleet" />
            <KpiCard label="Total Gallons" value={`${totalGallons.toFixed(1)} Gal`} icon={TrendingUpIcon} delta="+3.4%" trend="up" hint="monthly usage" />
            <KpiCard label="Avg Price/Gal" value={`₹${avgCostPerGallon}`} icon={CompassIcon} delta="-0.04" trend="down" hint="market comparison" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            
            {/* Table & search and filters */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <InputGroup>
                    <InputGroupAddon>
                      <SearchIcon className="size-4 text-muted-foreground/70" />
                    </InputGroupAddon>
                    <InputGroupInput
                      placeholder="Search fuel logs by plate, driver, station..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </InputGroup>
                </div>
                <div className="flex gap-1">
                  {['All', 'Denver', 'Dallas', 'Barstow', 'Albany'].map((region) => (
                    <Button
                      key={region}
                      variant={regionFilter === region ? 'default' : 'outline'}
                      size="xs"
                      onClick={() => setRegionFilter(region)}
                      className="rounded-lg text-xs"
                    >
                      {region}
                    </Button>
                  ))}
                </div>
              </div>

              <DataTable
                columns={columns}
                data={filteredLogs}
                keyExtractor={(l) => l.id}
                emptyTitle="No fuel refill transactions found"
                emptyDescription="Try refining your query search parameters or region filters."
              />
            </div>

            {/* Statistics Sidebar Cards */}
            <div className="space-y-5">
              <Card className="border border-border/40 bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-foreground">Efficiency Leaderboard</CardTitle>
                  <CardDescription className="text-xs">Highest fuel efficiency records across fleet regions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">West Coast (Barstow)</span>
                    <span className="font-bold text-success">13.1 MPG</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">Northwest (Tacoma)</span>
                    <span className="font-bold text-success">12.8 MPG</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">Southwest (Dallas)</span>
                    <span className="font-bold text-success">12.4 MPG</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">Northeast (Albany)</span>
                    <span className="font-bold text-warning-foreground">12.0 MPG</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/40 bg-card text-card-foreground">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-foreground">
                    <InfoIcon className="size-4 text-primary" />
                    Carbon Offset Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    By auditing and maintaining the active fleet at over 12 MPG, the carbon footprint has been reduced by 4.8 tons of CO2 MTD.
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
