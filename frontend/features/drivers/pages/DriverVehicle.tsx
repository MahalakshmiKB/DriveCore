import { useState } from 'react'
import { toast } from 'sonner'
import { 
  TruckIcon, 
  WrenchIcon, 
  ShieldAlertIcon, 
  CalendarIcon, 
  FuelIcon,
  GaugeIcon,
  CheckSquareIcon,
  AwardIcon,
  CheckCircle2Icon,
  InfoIcon
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/design-system/status-badge'

export function DriverVehicle() {
  const vehicle = {
    plate: 'MH-12-GQ-4431',
    model: 'Tata Prima 4930.S (Eco-Drive Edition)',
    capacity: '40,000 kg (GCW)',
    fuelLevel: '78%',
    odometer: '1,24,550 km',
    lastService: '2026-06-25 (1,23,000 km)',
    insuranceExpiry: '2027-02-18',
    fitnessCert: 'Valid (Expires 2027-04-12)',
    condition: 'Excellent',
    status: 'Nominal'
  }

  const [checklist, setChecklist] = useState([
    { id: 'tires', label: 'Inspect tire pressures & tread wear', checked: false },
    { id: 'brakes', label: 'Verify brake lines & fluid level', checked: false },
    { id: 'lights', label: 'Confirm headlamps, turn signals & brake lights', checked: false },
    { id: 'fluids', label: 'Check engine oil & coolant levels', checked: false },
    { id: 'safety', label: 'Ensure safety triangle & fire extinguisher present', checked: false }
  ])

  const toggleCheck = (id: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, checked: !item.checked }
      }
      return item
    }))
  }

  const handleInspectionSubmit = () => {
    const allChecked = checklist.every(item => item.checked)
    if (allChecked) {
      toast.success("Pre-trip walkaround inspection submitted successfully! Good to go.")
    } else {
      toast.error("Please complete all checklist items before submitting.")
    }
  }

  return (
    <div className="flex flex-col gap-8">
      
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Assigned Vehicle Details</h1>
        <p className="text-sm text-muted-foreground">Monitor performance, insurance details, and run checklist logs.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        
        {/* Left Column: Details & Alerts */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border border-border/45 bg-card rounded-[20px] shadow-premium-sm">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-1.5">
                  <TruckIcon className="size-5 text-primary" />
                  Vehicle Profile
                </CardTitle>
                <CardDescription className="text-xs mt-1">Primary details and registrations.</CardDescription>
              </div>
              <StatusBadge tone="success">{vehicle.status}</StatusBadge>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid gap-4 sm:grid-cols-2 text-xs border border-border/20 p-4 rounded-xl bg-muted/20">
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider font-sans">Registration Code</span>
                  <span className="font-bold text-white text-sm">{vehicle.plate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider font-sans">Vehicle Model</span>
                  <span className="font-semibold text-white">{vehicle.model}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider font-sans">Max Gross Capacity</span>
                  <span className="font-semibold text-white">{vehicle.capacity}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider font-sans">Odometer Count</span>
                  <span className="font-semibold text-white flex items-center gap-1">
                    <GaugeIcon className="size-3.5 text-primary" />
                    {vehicle.odometer}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider font-sans">Last Service Date</span>
                  <span className="font-semibold text-white flex items-center gap-1">
                    <WrenchIcon className="size-3.5 text-primary" />
                    {vehicle.lastService}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider font-sans">Insurance Expiry</span>
                  <span className="font-semibold text-white flex items-center gap-1">
                    <CalendarIcon className="size-3.5 text-primary" />
                    {vehicle.insuranceExpiry}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider font-sans">Fitness Certification</span>
                  <span className="font-semibold text-white flex items-center gap-1">
                    <CheckCircle2Icon className="size-3.5 text-success" />
                    {vehicle.fitnessCert}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider font-sans">Current Fuel Tank Level</span>
                  <span className="font-semibold text-white flex items-center gap-1">
                    <FuelIcon className="size-3.5 text-primary" />
                    {vehicle.fuelLevel}
                  </span>
                </div>
              </div>

              {/* Maintenance Alert Block */}
              <div className="mt-5 p-4 rounded-xl border border-warning/20 bg-warning/5 text-xs text-[#eab308] font-semibold flex items-start gap-3">
                <ShieldAlertIcon className="size-4.5 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Next Routine Maintenance Alert</div>
                  <div className="text-[10px] text-[#eab308]/80 font-normal mt-0.5">
                    Wheel alignment and lubrication schedule due in 450 km or by August 1, 2026.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Pre-Trip checklist */}
        <div className="lg:col-span-5">
          <Card className="border border-border/45 bg-card rounded-[20px] shadow-premium-sm">
            <CardHeader className="pb-3 border-b border-border/20">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <CheckSquareIcon className="size-4.5 text-primary" />
                Pre-Trip Checklist Log
              </CardTitle>
              <CardDescription className="text-[10px]">Complete walkaround safety log before launching a trip.</CardDescription>
            </CardHeader>
            <CardContent className="pt-5 space-y-4">
              
              <div className="space-y-3">
                {checklist.map((item) => (
                  <label 
                    key={item.id}
                    className="flex items-start gap-3 p-3.5 rounded-xl border border-white/5 bg-slate-950/20 hover:bg-slate-950/40 transition-colors cursor-pointer text-xs"
                  >
                    <input 
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleCheck(item.id)}
                      className="rounded border-white/10 bg-slate-950 accent-primary size-4.5 shrink-0 mt-0.5"
                    />
                    <span className={`leading-normal ${item.checked ? 'text-slate-300 line-through' : 'text-slate-200'}`}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>

              <div className="pt-2 border-t border-border/20">
                <Button 
                  onClick={handleInspectionSubmit}
                  className="w-full h-10 rounded-xl font-bold text-xs bg-primary hover:bg-primary/95 text-white active:scale-[0.98]"
                >
                  Submit Inspection Report
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>

    </div>
  )
}
