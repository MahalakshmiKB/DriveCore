import { useState, useEffect } from 'react'
import { 
  TruckIcon, 
  ClockIcon, 
  CheckCircle2Icon, 
  ShieldAlertIcon, 
  AwardIcon, 
  CalendarIcon, 
  RouteIcon, 
  TrendingUpIcon,
  BellIcon,
  MapPinIcon
} from 'lucide-react'
import { KpiCard } from '@/components/design-system/kpi-card'
import { StatusBadge } from '@/components/design-system/status-badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function DriverDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Sample data for driver metrics
  const safetyScore = 96
  const licenseExpiry = '2028-11-15'
  const distanceToday = '340 km'
  const deliveriesCompleted = 12

  const notifications = [
    { id: '1', text: 'Vehicle inspection due tomorrow morning.', type: 'alert' },
    { id: '2', text: 'New dispatch trip assigned (Route Mum-Pun).', type: 'info' }
  ]

  const activeTrip = {
    id: 'TRIP-772',
    source: 'JNPT Port, Navi Mumbai',
    destination: 'Chakan Industrial Zone, Pune',
    cargo: 'Automotive Assemblies',
    status: 'In Transit',
    eta: '16:30'
  }

  const upcomingTrips = [
    { id: 'TRIP-781', date: 'July 13, 2026', route: 'Pune - Mumbai Port', status: 'Assigned' },
    { id: 'TRIP-785', date: 'July 15, 2026', route: 'Mumbai - Nashik Outflow', status: 'Assigned' }
  ]

  return (
    <div className="flex flex-col gap-6">
      
      {/* Welcome Hero */}
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Driver Portal</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {user?.name || 'Marcus Vance'}. Drive safe and secure.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/5 border border-white/5 flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-success animate-pulse" />
            Duty Active
          </span>
        </div>
      </div>

      {/* Notifications */}
      <div className="grid gap-4 md:grid-cols-2">
        {notifications.map((n) => (
          <div 
            key={n.id} 
            className={`flex items-start gap-3 p-3.5 rounded-2xl border text-xs leading-normal ${
              n.type === 'alert'
                ? 'border-destructive/20 bg-destructive/5 text-destructive font-semibold'
                : 'border-primary/20 bg-primary/5 text-primary font-semibold'
            }`}
          >
            <BellIcon className="size-4 shrink-0 mt-0.5" />
            <span>{n.text}</span>
          </div>
        ))}
      </div>

      {/* Driver Performance & Safety KPI Indicators */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard 
          label="Safety Score" 
          value={`${safetyScore}%`} 
          icon={AwardIcon} 
          delta="+0.8%" 
          trend="up" 
          hint="Excellent rating" 
        />
        <KpiCard 
          label="License Validity" 
          value="Valid" 
          icon={CheckCircle2Icon} 
          delta="Normal" 
          trend="up" 
          hint={`Expires ${licenseExpiry}`} 
        />
        <KpiCard 
          label="Distance Today" 
          value={distanceToday} 
          icon={TrendingUpIcon} 
          delta="+45 km" 
          trend="up" 
          hint="vs yesterday" 
        />
        <KpiCard 
          label="Deliveries Completed" 
          value={String(deliveriesCompleted)} 
          icon={CheckCircle2Icon} 
          delta="+2" 
          trend="up" 
          hint="this week" 
        />
      </div>

      {/* Active Trip & Current Vehicle details */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Left Column: Active Trip */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border border-border/45 bg-card rounded-[20px] shadow-premium-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <RouteIcon className="size-5 text-primary" />
                  Active Dispatch Order
                </CardTitle>
                <CardDescription className="text-xs mt-1">Current ongoing delivery assignment.</CardDescription>
              </div>
              <StatusBadge tone="info">{activeTrip.status}</StatusBadge>
            </CardHeader>
            <CardContent className="pt-2 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4 p-4 rounded-xl border border-border/20 bg-muted/40 dark:bg-muted/10">
                <div className="space-y-3 flex-1">
                  <div className="flex items-start gap-2.5 text-xs">
                    <MapPinIcon className="size-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-muted-foreground block font-bold tracking-wider uppercase font-sans">Source</span>
                      <span className="font-semibold text-foreground">{activeTrip.source}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs">
                    <MapPinIcon className="size-4 text-success shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] text-muted-foreground block font-bold tracking-wider uppercase font-sans">Destination</span>
                      <span className="font-semibold text-foreground">{activeTrip.destination}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t sm:border-t-0 sm:border-l border-border/20 pt-3 sm:pt-0 sm:pl-4 space-y-3 w-44">
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-bold tracking-wider uppercase font-sans">Assigned Cargo</span>
                    <span className="text-xs font-semibold text-foreground">{activeTrip.cargo}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block font-bold tracking-wider uppercase font-sans">ETA</span>
                    <span className="text-xs font-semibold text-primary">{activeTrip.eta} (Today)</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2.5">
                <Button 
                  onClick={() => navigate('/driver-my-trips')}
                  className="h-9 px-5 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/95 text-white active:scale-[0.98]"
                >
                  Manage Active Trip
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Simple Visual SVG Charts for Driver performance tracking */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border border-border/45 bg-card rounded-[20px] shadow-premium-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">Weekly Completed vs Pending Trips</CardTitle>
                <CardDescription className="text-[10px]">Trips executed this week</CardDescription>
              </CardHeader>
              <CardContent className="h-44 flex items-center justify-center">
                {/* Horizontal Progress chart */}
                <div className="w-full space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Completed Trips</span>
                      <span className="text-success">8 Trips (80%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-muted border border-border/40 rounded-full overflow-hidden">
                      <div className="h-full bg-success rounded-full" style={{ width: '80%' }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Pending/Active Trips</span>
                      <span className="text-primary">2 Trips (20%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-muted border border-border/40 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '20%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/45 bg-card rounded-[20px] shadow-premium-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold">Refueling Outflows</CardTitle>
                <CardDescription className="text-[10px]">Estimated vs Actual economy savings</CardDescription>
              </CardHeader>
              <CardContent className="h-44 flex items-center justify-center">
                <div className="w-full space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Average Mileage</span>
                      <span className="text-foreground">12.4 km/L</span>
                    </div>
                    <div className="h-2.5 w-full bg-muted border border-border/40 rounded-full overflow-hidden">
                      <div className="h-full bg-[#eab308] rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Eco-Score Grade</span>
                      <span className="text-success">Grade A (Eco-Driver)</span>
                    </div>
                    <div className="h-2.5 w-full bg-muted border border-border/40 rounded-full overflow-hidden">
                      <div className="h-full bg-success rounded-full" style={{ width: '96%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column: Current Vehicle & Upcoming list */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border border-border/45 bg-card rounded-[20px] shadow-premium-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <TruckIcon className="size-4.5 text-primary" />
                Current Vehicle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="aspect-video w-full rounded-xl border border-dashed border-border bg-gradient-to-br from-primary/5 via-transparent to-primary/5 relative overflow-hidden flex flex-col items-center justify-center p-4">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50" />
                <TruckIcon className="size-12 text-primary/40 mb-2 relative z-10" />
                <span className="text-foreground font-mono font-bold text-xs tracking-wider relative z-10 bg-background/60 px-2 py-0.5 rounded border border-border/40">MH-12-GQ-4431</span>
                <span className="text-[10px] text-muted-foreground mt-1 relative z-10">Tata Prima 4930.S &middot; Nominal</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5 text-xs pt-1">
                <div>
                  <span className="text-muted-foreground block text-[10px] font-bold tracking-wider uppercase font-sans">Model</span>
                  <span className="font-semibold text-foreground">Tata Prima 4930.S</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] font-bold tracking-wider uppercase font-sans">Odometer</span>
                  <span className="font-semibold text-foreground">1,24,550 km</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/driver-vehicle')}
                className="w-full h-9 rounded-xl text-xs font-semibold border-border hover:bg-muted text-foreground mt-2"
              >
                Inspect Vehicle Details
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-border/45 bg-card rounded-[20px] shadow-premium-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <CalendarIcon className="size-4.5 text-primary" />
                Upcoming Trips
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/20">
                {upcomingTrips.map((trip) => (
                  <div key={trip.id} className="p-3.5 hover:bg-muted/10 transition-colors flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-foreground">{trip.route}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">{trip.date} &middot; {trip.id}</div>
                    </div>
                    <StatusBadge tone="neutral">{trip.status}</StatusBadge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  )
}
