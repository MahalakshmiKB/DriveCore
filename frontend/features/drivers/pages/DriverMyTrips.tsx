import { useState } from 'react'
import { toast } from 'sonner'
import { 
  RouteIcon, 
  MapPinIcon, 
  ClockIcon, 
  TruckIcon, 
  PackageIcon, 
  WeightIcon,
  PlayIcon,
  PauseIcon,
  CheckCircle2Icon,
  ArrowRightIcon,
  SparklesIcon,
  LayersIcon
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/design-system/status-badge'

interface Trip {
  id: string
  source: string
  destination: string
  cargo: string
  weight: string
  vehicle: string
  status: string
  dispatchTime: string
  eta: string
}

const initialTrips: Trip[] = [
  {
    id: 'TRIP-772',
    source: 'JNPT Port, Navi Mumbai',
    destination: 'Chakan Industrial Zone, Pune',
    cargo: 'Automotive Assemblies',
    weight: '12.4 Tons',
    vehicle: 'MH-12-GQ-4431',
    status: 'In Transit',
    dispatchTime: '2026-07-12 11:30',
    eta: '16:30'
  },
  {
    id: 'TRIP-781',
    source: 'Pune Logistics Hub',
    destination: 'Mumbai Domestic Terminal',
    cargo: 'Perishable Pharmaceuticals',
    weight: '4.8 Tons',
    vehicle: 'MH-12-GQ-4431',
    status: 'Assigned',
    dispatchTime: '2026-07-13 08:00',
    eta: '13:00'
  }
]

const PROGRESSION = [
  'Assigned',
  'Accepted',
  'Started',
  'Reached Pickup',
  'Loaded',
  'In Transit',
  'Reached Destination',
  'Delivered',
  'Completed'
]

export function DriverMyTrips() {
  const [trips, setTrips] = useState<Trip[]>(initialTrips)
  const [selectedTripId, setSelectedTripId] = useState('TRIP-772')

  const selectedTrip = trips.find(t => t.id === selectedTripId) || trips[0]

  const updateStatus = (tripId: string, nextStatus: string) => {
    setTrips(prev => prev.map(t => {
      if (t.id === tripId) {
        return { ...t, status: nextStatus }
      }
      return t
    }))
    toast.success(`Trip ${tripId} status updated to: ${nextStatus}`)
  }

  const getNextStatus = (currentStatus: string): string | null => {
    const currentIndex = PROGRESSION.indexOf(currentStatus)
    if (currentIndex === -1 || currentIndex === PROGRESSION.length - 1) return null
    return PROGRESSION[currentIndex + 1]
  }

  return (
    <div className="flex flex-col gap-8">
      
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">My Assigned Trips</h1>
        <p className="text-sm text-muted-foreground">Manage active dispatches and log route milestones.</p>
      </div>

      {/* Main Grid: Left is Trips list, Right is Selected Trip details & Actions */}
      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Left: Trip List */}
        <div className="lg:col-span-7 space-y-4">
          {trips.map((trip) => {
            const isSelected = trip.id === selectedTripId
            return (
              <Card 
                key={trip.id}
                onClick={() => setSelectedTripId(trip.id)}
                className={`border transition-all duration-200 cursor-pointer rounded-[20px] shadow-premium-sm hover:translate-y-[-2px] ${
                  isSelected 
                    ? 'border-primary/45 bg-muted/50 dark:bg-slate-900/40 shadow-premium-md' 
                    : 'border-border/30 bg-card hover:bg-muted/10'
                }`}
              >
                <CardContent className="p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-foreground tracking-wide bg-muted border border-border/40 px-2 py-0.5 rounded">{trip.id}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold">{trip.cargo}</span>
                    </div>
                    <StatusBadge tone={trip.status === 'Completed' ? 'success' : 'info'}>{trip.status}</StatusBadge>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-start gap-2">
                      <MapPinIcon className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] text-muted-foreground block font-bold uppercase font-sans">From</span>
                        <span className="font-semibold text-foreground">{trip.source}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPinIcon className="size-3.5 text-success shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[9px] text-muted-foreground block font-bold uppercase font-sans">To</span>
                        <span className="font-semibold text-foreground">{trip.destination}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground border-t border-border/20 pt-3 mt-1 font-sans">
                    <span>ETA: <span className="text-foreground font-semibold">{trip.eta}</span></span>
                    <span>Vehicle: <span className="text-foreground font-semibold">{trip.vehicle}</span></span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Right: Selected Trip Drawer/Details */}
        <div className="lg:col-span-5">
          {selectedTrip && (
            <Card className="border border-border/45 bg-card rounded-[20px] shadow-premium-sm sticky top-24">
              <CardHeader className="pb-3 border-b border-border/20">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base flex items-center gap-1.5">
                    <RouteIcon className="size-4.5 text-primary" />
                    Trip Details
                  </CardTitle>
                  <span className="text-xs font-bold text-foreground bg-muted px-2 py-0.5 rounded border border-border/40">{selectedTrip.id}</span>
                </div>
                <CardDescription className="text-xs">Milestone tracking and operational controls.</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-5 space-y-6">
                
                {/* Statistics detail grid */}
                <div className="grid grid-cols-2 gap-4 text-xs bg-muted/40 dark:bg-muted/10 border border-border/20 p-4 rounded-xl">
                  <div>
                    <span className="text-muted-foreground block text-[9px] font-bold uppercase font-sans">Cargo Load</span>
                    <span className="font-bold text-foreground flex items-center gap-1 mt-0.5">
                      <PackageIcon className="size-3.5 text-primary" />
                      {selectedTrip.cargo}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[9px] font-bold uppercase font-sans">Gross Weight</span>
                    <span className="font-bold text-foreground flex items-center gap-1 mt-0.5">
                      <WeightIcon className="size-3.5 text-primary" />
                      {selectedTrip.weight}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[9px] font-bold uppercase font-sans">Dispatch Time</span>
                    <span className="font-bold text-foreground flex items-center gap-1 mt-0.5">
                      <ClockIcon className="size-3.5 text-primary" />
                      {selectedTrip.dispatchTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[9px] font-bold uppercase font-sans">Eta Goal</span>
                    <span className="font-bold text-foreground flex items-center gap-1 mt-0.5">
                      <ClockIcon className="size-3.5 text-primary" />
                      {selectedTrip.eta}
                    </span>
                  </div>
                </div>

                {/* Status Timeline Progress View */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-foreground font-sans">Trip Milestone Timeline</h4>
                  <div className="flex flex-col gap-3 relative pl-4 border-l border-border/40 ml-1">
                    {PROGRESSION.map((step) => {
                      const isCompleted = PROGRESSION.indexOf(selectedTrip.status) >= PROGRESSION.indexOf(step)
                      const isActive = selectedTrip.status === step
                      return (
                        <div key={step} className="flex items-center gap-3 text-xs relative">
                          {/* Dot indicator */}
                          <div className={`absolute left-[-21px] size-2 rounded-full border ${
                            isActive
                              ? 'bg-primary border-primary shadow-[0_0_8px_#3b82f6] animate-pulse'
                              : isCompleted
                                ? 'bg-success border-success'
                                : 'bg-background border-border'
                          }`} />
                          <span className={`${isActive ? 'text-primary font-bold' : isCompleted ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>
                            {step}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Interactive Status progression Controls */}
                <div className="pt-2 border-t border-border/20 space-y-2">
                  {getNextStatus(selectedTrip.status) ? (
                    <Button 
                      onClick={() => updateStatus(selectedTrip.id, getNextStatus(selectedTrip.status)!)}
                      className="w-full h-10 rounded-xl font-semibold text-xs bg-primary hover:bg-primary/95 text-white active:scale-[0.98]"
                    >
                      Log Next Milestone: {getNextStatus(selectedTrip.status)}
                    </Button>
                  ) : (
                    <div className="text-center text-xs font-semibold text-success p-2.5 rounded-xl border border-success/20 bg-success/5 flex items-center justify-center gap-1.5">
                      <CheckCircle2Icon className="size-4 shrink-0" />
                      Trip Completed Successfully!
                    </div>
                  )}

                  {selectedTrip.status !== 'Completed' && (
                    <div className="flex gap-2.5 mt-2">
                      <Button 
                        variant="outline" 
                        disabled={selectedTrip.status === 'Paused'}
                        onClick={() => updateStatus(selectedTrip.id, 'Paused')}
                        className="flex-1 h-9 rounded-xl text-xs font-semibold border-border hover:bg-muted text-foreground"
                      >
                        <PauseIcon className="size-3.5 mr-1" />
                        Pause Trip
                      </Button>
                      <Button 
                        variant="outline" 
                        disabled={selectedTrip.status !== 'Paused'}
                        onClick={() => updateStatus(selectedTrip.id, 'In Transit')}
                        className="flex-1 h-9 rounded-xl text-xs font-semibold border-border hover:bg-muted text-foreground"
                      >
                        <PlayIcon className="size-3.5 mr-1" />
                        Resume Trip
                      </Button>
                    </div>
                  )}
                </div>

              </CardContent>
            </Card>
          )}
        </div>

      </div>

    </div>
  )
}
