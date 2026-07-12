'use client'

import * as React from 'react'
import {
  FuelIcon,
  RouteIcon,
  TruckIcon,
  UsersIcon,
  XIcon,
} from 'lucide-react'

import { Section, Subsection } from '@/components/showcase/section'
import { KpiCard } from '@/components/design-system/kpi-card'
import {
  StatusBadge,
  driverStatusTone,
  tripStatusTone,
  vehicleStatusTone,
} from '@/components/design-system/status-badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from '@/components/ui/avatar'
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const fleetRows = [
  { plate: 'MH-12-AB-1234', model: 'Volvo FH16', driver: 'Ava Monroe', status: 'On Trip', region: 'West' },
  { plate: 'DL-03-CX-8890', model: 'Tata Prima', driver: 'Liam Carter', status: 'Available', region: 'North' },
  { plate: 'KA-05-MN-4521', model: 'Ashok Leyland', driver: '—', status: 'In Shop', region: 'South' },
  { plate: 'TN-09-PP-1102', model: 'BharatBenz 2823', driver: 'Mia Torres', status: 'Available', region: 'South' },
  { plate: 'GJ-01-ZZ-7788', model: 'Eicher Pro', driver: '—', status: 'Retired', region: 'West' },
] as const

function FilterChips() {
  const [chips, setChips] = React.useState([
    'Status: Available',
    'Region: West',
    'Capacity > 5,000 kg',
    'License valid',
  ])

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.length === 0 && (
        <span className="text-sm text-muted-foreground">No active filters.</span>
      )}
      {chips.map((chip) => (
        <span
          key={chip}
          className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-secondary pr-1 pl-2.5 text-xs font-medium text-secondary-foreground"
        >
          {chip}
          <button
            type="button"
            onClick={() => setChips((c) => c.filter((x) => x !== chip))}
            className="flex size-4 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted-foreground/20 hover:text-foreground"
            aria-label={`Remove filter ${chip}`}
          >
            <XIcon className="size-3" />
          </button>
        </span>
      ))}
    </div>
  )
}

export function DataDisplaySection() {
  return (
    <Section
      id="data-display"
      title="Data Display"
      description="KPI cards, status system, tables, and the building blocks for data-dense operational views."
    >
      <div className="flex flex-col gap-8">
        <Subsection title="KPI cards">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Active vehicles"
              value="248"
              icon={TruckIcon}
              delta="+4.2%"
              trend="up"
              hint="vs last month"
            />
            <KpiCard
              label="Drivers on duty"
              value="176"
              icon={UsersIcon}
              delta="+1.8%"
              trend="up"
              hint="vs last month"
            />
            <KpiCard
              label="Trips in progress"
              value="63"
              icon={RouteIcon}
              delta="-2.1%"
              trend="down"
              hint="vs yesterday"
            />
            <KpiCard
              label="Fuel cost (MTD)"
              value="$92.4k"
              icon={FuelIcon}
              delta="+6.7%"
              trend="up"
              hint="vs budget"
            />
          </div>
        </Subsection>

        <Subsection title="Status badges">
          <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-14 text-xs font-medium text-muted-foreground">Vehicle</span>
              {Object.keys(vehicleStatusTone).map((s) => (
                <StatusBadge key={s} tone={vehicleStatusTone[s]}>
                  {s}
                </StatusBadge>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-14 text-xs font-medium text-muted-foreground">Driver</span>
              {Object.keys(driverStatusTone).map((s) => (
                <StatusBadge key={s} tone={driverStatusTone[s]}>
                  {s}
                </StatusBadge>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="w-14 text-xs font-medium text-muted-foreground">Trip</span>
              {Object.keys(tripStatusTone).map((s) => (
                <StatusBadge key={s} tone={tripStatusTone[s]}>
                  {s}
                </StatusBadge>
              ))}
            </div>
          </div>
        </Subsection>

        <div className="grid gap-8 lg:grid-cols-2">
          <Subsection title="Filter chips">
            <FilterChips />
          </Subsection>

          <Subsection title="Avatars">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Avatar size="sm">
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>LC</AvatarFallback>
                </Avatar>
                <Avatar size="lg">
                  <AvatarFallback>MT</AvatarFallback>
                </Avatar>
              </div>
              <AvatarGroup>
                <Avatar>
                  <AvatarFallback>AM</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>LC</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>NB</AvatarFallback>
                </Avatar>
                <AvatarGroupCount>+8</AvatarGroupCount>
              </AvatarGroup>
            </div>
          </Subsection>
        </div>

        <Subsection title="Progress">
          <div className="grid gap-5 rounded-lg border border-border bg-card p-4 sm:grid-cols-3">
            <Progress value={82}>
              <ProgressLabel>Fleet utilization</ProgressLabel>
              <ProgressValue />
            </Progress>
            <Progress value={64}>
              <ProgressLabel>Fuel efficiency</ProgressLabel>
              <ProgressValue />
            </Progress>
            <Progress value={38}>
              <ProgressLabel>Maintenance due</ProgressLabel>
              <ProgressValue />
            </Progress>
          </div>
        </Subsection>

        <Subsection title="Content cards">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Volvo FH16 · MH-12-AB-1234</CardTitle>
                <CardDescription>Heavy hauler · West region</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Odometer</span>
                  <span className="text-sm font-medium tabular-nums">184,220 km</span>
                </div>
                <StatusBadge tone={vehicleStatusTone['On Trip']}>On Trip</StatusBadge>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Ava Monroe</CardTitle>
                <CardDescription>License LMV-9921 · valid to 2027</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">Safety score</span>
                  <span className="text-sm font-medium tabular-nums">96 / 100</span>
                </div>
                <StatusBadge tone={driverStatusTone['On Trip']}>On Trip</StatusBadge>
              </CardContent>
            </Card>
          </div>
        </Subsection>

        <Subsection title="Data table">
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead>Registration</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fleetRows.map((row) => (
                  <TableRow key={row.plate}>
                    <TableCell className="font-medium tabular-nums">{row.plate}</TableCell>
                    <TableCell>{row.model}</TableCell>
                    <TableCell className="text-muted-foreground">{row.driver}</TableCell>
                    <TableCell className="text-muted-foreground">{row.region}</TableCell>
                    <TableCell className="text-right">
                      <StatusBadge
                        tone={vehicleStatusTone[row.status]}
                        className="ml-auto"
                      >
                        {row.status}
                      </StatusBadge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Pagination className="mt-4 justify-between">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </Subsection>
      </div>
    </Section>
  )
}
