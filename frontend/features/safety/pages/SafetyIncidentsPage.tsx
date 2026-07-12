import { useState, useEffect, useMemo } from 'react'
import {
  AlertTriangleIcon,
  PlusIcon,
  ShieldAlertIcon,
  CheckCircle2Icon,
  ClockIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { StatusBadge } from '@/components/design-system/status-badge'
import { KpiCard } from '@/components/design-system/kpi-card'
import { Button } from '@/components/ui/button'
import { DataTable, DataTableColumn } from '@/components/shared/data/DataTable'
import { PageToolbar, ToolbarSelect, ToolbarSearch } from '@/components/shared/data/PageToolbar'
import { LoadingBoundary } from '@/components/shared/feedback/LoadingBoundary'
import { ErrorBoundary } from '@/components/shared/feedback/ErrorBoundary'
import type { StatusTone } from '@/components/design-system/status-badge'

interface IncidentRecord {
  id: string
  date: string
  driver: string
  vehicle: string
  severity: 'Minor' | 'Moderate' | 'Major' | 'Critical'
  description: string
  status: 'Open' | 'Under Review' | 'Resolved'
}

const mockIncidents: IncidentRecord[] = [
  { id: 'INC-001', date: '2026-07-10', driver: 'Elena Rostova', vehicle: 'CA-4431', severity: 'Minor', description: 'Speeding detected on NH-48 (12 km/h over limit)', status: 'Resolved' },
  { id: 'INC-002', date: '2026-07-08', driver: 'Raj Patel', vehicle: 'NY-1029', severity: 'Moderate', description: 'Late delivery causing SLA breach for client order #8821', status: 'Resolved' },
  { id: 'INC-003', date: '2026-07-05', driver: 'Sarah Jenkins', vehicle: 'WA-7731', severity: 'Major', description: 'Vehicle involved in minor collision at Hosur junction', status: 'Under Review' },
  { id: 'INC-004', date: '2026-07-03', driver: 'Raj Patel', vehicle: 'NY-1029', severity: 'Moderate', description: 'Fatigue alert triggered — driver drove 14 hrs without break', status: 'Open' },
  { id: 'INC-005', date: '2026-06-28', driver: 'Sarah Jenkins', vehicle: 'WA-7731', severity: 'Critical', description: 'Brake failure event reported — vehicle sent for emergency maintenance', status: 'Resolved' },
]

const SEVERITY_TONE: Record<string, StatusTone> = {
  Minor: 'info',
  Moderate: 'warning',
  Major: 'danger',
  Critical: 'danger',
}

const STATUS_TONE: Record<string, StatusTone> = {
  Open: 'danger',
  'Under Review': 'warning',
  Resolved: 'success',
}

// ─── Column layout (must sum to 100%) ─────────────────────────────────────
// ID 8% | Date 10% | Driver 16% | Vehicle 10% | Severity 12% | Description 32% | Status 12%
const COLUMNS: DataTableColumn<IncidentRecord>[] = [
  {
    header: 'ID',
    accessorKey: 'id' as keyof IncidentRecord,
    className: 'w-[8%] font-mono text-muted-foreground',
  },
  {
    header: 'Date',
    accessorKey: 'date' as keyof IncidentRecord,
    className: 'w-[10%] tabular-nums text-muted-foreground',
  },
  {
    header: 'Driver',
    accessorKey: 'driver' as keyof IncidentRecord,
    className: 'w-[16%] font-medium text-foreground',
  },
  {
    header: 'Vehicle',
    accessorKey: 'vehicle' as keyof IncidentRecord,
    className: 'w-[10%] font-mono text-muted-foreground',
  },
  {
    header: 'Severity',
    accessorKey: 'severity' as keyof IncidentRecord,
    cell: (row) => <StatusBadge tone={SEVERITY_TONE[row.severity]}>{row.severity}</StatusBadge>,
    truncate: false,
    className: 'w-[12%]',
  },
  {
    // Widest column — description truncates cleanly with tooltip on hover
    header: 'Description',
    accessorKey: 'description' as keyof IncidentRecord,
    className: 'w-[32%] text-foreground/80',
  },
  {
    header: 'Status',
    accessorKey: 'status' as keyof IncidentRecord,
    cell: (row) => <StatusBadge tone={STATUS_TONE[row.status]}>{row.status}</StatusBadge>,
    truncate: false,
    className: 'w-[12%]',
  },
]


export function SafetyIncidentsPage() {
  const [incidents, setIncidents] = useState<IncidentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [severityFilter, setSeverityFilter] = useState('All')

  useEffect(() => {
    const t = setTimeout(() => { setIncidents(mockIncidents); setLoading(false) }, 400)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() =>
    incidents.filter(r => {
      const matchSearch = r.driver.toLowerCase().includes(search.toLowerCase()) ||
                          r.vehicle.toLowerCase().includes(search.toLowerCase()) ||
                          r.description.toLowerCase().includes(search.toLowerCase())
      const matchSeverity = severityFilter === 'All' || r.severity === severityFilter
      return matchSearch && matchSeverity
    }), [incidents, search, severityFilter])

  const open = incidents.filter(i => i.status === 'Open').length
  const underReview = incidents.filter(i => i.status === 'Under Review').length
  const resolved = incidents.filter(i => i.status === 'Resolved').length

  const handleCreate = () => {
    toast.success('New incident report created and assigned for review.')
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-4 w-full min-w-0">

        {/* Page title */}
        <div className="flex flex-col gap-1 min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-sans truncate">Incidents</h1>
          <p className="text-xs text-muted-foreground truncate">
            Track, create and manage driver and vehicle incidents with severity classification.
          </p>
        </div>

        <LoadingBoundary isLoading={loading} variant="card">

          {/* KPI row — always horizontal, responsive grid */}
          <div className="grid grid-cols-3 gap-3 min-w-0">
            <KpiCard label="Open Incidents" value={String(open)} icon={AlertTriangleIcon} delta="Urgent" trend="down" hint="require action" />
            <KpiCard label="Under Review" value={String(underReview)} icon={ClockIcon} delta="In Progress" trend="flat" hint="being investigated" />
            <KpiCard label="Resolved" value={String(resolved)} icon={CheckCircle2Icon} delta="This month" trend="up" hint="closed incidents" />
          </div>

          {/* Main table card */}
          <div className="flex flex-col gap-0 min-w-0 border border-border/40 rounded-[20px] bg-card shadow-[0_2px_16px_0_rgba(0,0,0,0.18)] overflow-hidden">
            
            {/* ── Single-line toolbar ── */}
            <PageToolbar title="⚠️ Incident Register">
              <ToolbarSelect
                value={severityFilter}
                onChange={setSeverityFilter}
                options={['All', 'Minor', 'Moderate', 'Major', 'Critical']}
              />
              <ToolbarSearch
                value={search}
                onChange={setSearch}
                placeholder="Search incidents…"
              />
              <Button
                size="sm"
                className="h-9 px-4 rounded-xl text-xs font-semibold shrink-0"
                onClick={handleCreate}
              >
                <PlusIcon className="size-3.5 mr-1.5" />
                Report Incident
              </Button>
            </PageToolbar>

            <div className="p-4 w-full min-w-0">
              <DataTable
                columns={COLUMNS}
                data={filtered}
                keyExtractor={(r) => r.id}
                emptyTitle="No incidents found"
                emptyDescription="Try adjusting your search query."
              />
            </div>
          </div>

        </LoadingBoundary>
      </div>
    </ErrorBoundary>
  )
}
