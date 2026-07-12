import { useState, useEffect, useMemo } from 'react'
import {
  UsersIcon,
  SearchIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  AwardIcon,
  CalendarIcon,
} from 'lucide-react'
import { KpiCard } from '@/components/design-system/kpi-card'
import { StatusBadge } from '@/components/design-system/status-badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { DataTable, DataTableColumn } from '@/components/shared/data/DataTable'
import { LoadingBoundary } from '@/components/shared/feedback/LoadingBoundary'
import { ErrorBoundary } from '@/components/shared/feedback/ErrorBoundary'

interface DriverSafetyRecord {
  id: string
  name: string
  safetyScore: number
  violations: number
  warnings: number
  trainingCompleted: string
  lastInspection: string
  status: 'Compliant' | 'Warning' | 'Non-Compliant'
}

const mockDriverSafety: DriverSafetyRecord[] = [
  { id: 'D-001', name: 'Marcus Vance', safetyScore: 96, violations: 0, warnings: 0, trainingCompleted: '6/6 modules', lastInspection: '2026-07-01', status: 'Compliant' },
  { id: 'D-002', name: 'Lucas Thorne', safetyScore: 91, violations: 0, warnings: 1, trainingCompleted: '5/6 modules', lastInspection: '2026-06-25', status: 'Compliant' },
  { id: 'D-003', name: 'Elena Rostova', safetyScore: 85, violations: 1, warnings: 2, trainingCompleted: '4/6 modules', lastInspection: '2026-06-10', status: 'Warning' },
  { id: 'D-004', name: 'Raj Patel', safetyScore: 78, violations: 2, warnings: 3, trainingCompleted: '3/6 modules', lastInspection: '2026-05-28', status: 'Warning' },
  { id: 'D-005', name: 'Sarah Jenkins', safetyScore: 63, violations: 4, warnings: 5, trainingCompleted: '2/6 modules', lastInspection: '2026-05-01', status: 'Non-Compliant' },
  { id: 'D-006', name: 'James Okafor', safetyScore: 94, violations: 0, warnings: 0, trainingCompleted: '6/6 modules', lastInspection: '2026-07-08', status: 'Compliant' },
]

const COLUMNS: DataTableColumn<DriverSafetyRecord>[] = [
  { header: 'ID', accessorKey: 'id' as keyof DriverSafetyRecord },
  { header: 'Driver Name', accessorKey: 'name' as keyof DriverSafetyRecord },
  {
    header: 'Safety Score',
    accessorKey: 'safetyScore' as keyof DriverSafetyRecord,
    cell: (row) => (
      <span className={`font-bold text-sm ${row.safetyScore >= 90 ? 'text-success' : row.safetyScore >= 75 ? 'text-warning' : 'text-destructive'}`}>
        {row.safetyScore}%
      </span>
    ),
  },
  { header: 'Violations', accessorKey: 'violations' as keyof DriverSafetyRecord },
  { header: 'Warnings', accessorKey: 'warnings' as keyof DriverSafetyRecord },
  { header: 'Training', accessorKey: 'trainingCompleted' as keyof DriverSafetyRecord },
  { header: 'Last Inspection', accessorKey: 'lastInspection' as keyof DriverSafetyRecord },
  {
    header: 'Status',
    accessorKey: 'status' as keyof DriverSafetyRecord,
    cell: (row) => (
      <StatusBadge tone={row.status === 'Compliant' ? 'success' : row.status === 'Warning' ? 'warning' : 'danger'}>
        {row.status}
      </StatusBadge>
    ),
  },
]

export function SafetyDriversPage() {
  const [records, setRecords] = useState<DriverSafetyRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const t = setTimeout(() => { setRecords(mockDriverSafety); setLoading(false) }, 400)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() =>
    records.filter(r =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase())
    ), [records, search])

  const compliant = records.filter(r => r.status === 'Compliant').length
  const warning = records.filter(r => r.status === 'Warning').length
  const nonCompliant = records.filter(r => r.status === 'Non-Compliant').length
  const avgScore = records.length ? Math.round(records.reduce((s, r) => s + r.safetyScore, 0) / records.length) : 0

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Driver Safety</h1>
          <p className="text-sm text-muted-foreground">Monitor individual driver safety scores, violations and training status.</p>
        </div>

        <LoadingBoundary isLoading={loading} variant="card">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Compliant Drivers" value={String(compliant)} icon={ShieldCheckIcon} delta={`${Math.round(compliant / (records.length || 1) * 100)}%`} trend="up" hint="of fleet" />
            <KpiCard label="On Warning" value={String(warning)} icon={AlertTriangleIcon} delta="Monitor" trend="neutral" hint="action recommended" />
            <KpiCard label="Non-Compliant" value={String(nonCompliant)} icon={AlertTriangleIcon} delta="Urgent" trend="down" hint="immediate review" />
            <KpiCard label="Avg Safety Score" value={`${avgScore}%`} icon={AwardIcon} delta="+2.4%" trend="up" hint="vs last quarter" />
          </div>

          <Card className="border border-border/45 bg-card rounded-[20px] shadow-premium-sm mt-6">
            <CardHeader className="pb-4 border-b border-border/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                  <UsersIcon className="size-4.5 text-primary" />
                  Driver Safety Registry
                </CardTitle>
                <InputGroup className="max-w-xs">
                  <InputGroupAddon>
                    <SearchIcon className="size-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    placeholder="Search driver..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </InputGroup>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <DataTable columns={COLUMNS} data={filtered} keyExtractor={(r) => r.id} />
            </CardContent>
          </Card>
        </LoadingBoundary>
      </div>
    </ErrorBoundary>
  )
}
