import { useState, useEffect, useMemo } from 'react'
import {
  BarChart3Icon,
  DownloadIcon,
  SearchIcon,
  FileTextIcon,
  ShieldCheckIcon,
} from 'lucide-react'
import { toast } from 'sonner'
import { KpiCard } from '@/components/design-system/kpi-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { DataTable, DataTableColumn } from '@/components/shared/data/DataTable'
import { LoadingBoundary } from '@/components/shared/feedback/LoadingBoundary'
import { ErrorBoundary } from '@/components/shared/feedback/ErrorBoundary'

interface ComplianceReport {
  id: string
  title: string
  type: 'Monthly Safety' | 'Inspection' | 'Violation'
  format: 'PDF' | 'XLSX'
  size: string
  generated: string
}

const mockReports: ComplianceReport[] = [
  { id: 'sr-001', title: 'June 2026 Safety Compliance Summary', type: 'Monthly Safety', format: 'PDF', size: '3.2 MB', generated: '2026-07-01' },
  { id: 'sr-002', title: 'Fleet Inspection Audit – Q2 2026', type: 'Inspection', format: 'PDF', size: '4.8 MB', generated: '2026-07-05' },
  { id: 'sr-003', title: 'May 2026 Violation Ledger', type: 'Violation', format: 'XLSX', size: '1.1 MB', generated: '2026-06-02' },
  { id: 'sr-004', title: 'May 2026 Safety Compliance Summary', type: 'Monthly Safety', format: 'PDF', size: '3.0 MB', generated: '2026-06-01' },
  { id: 'sr-005', title: 'Pre-monsoon Vehicle Inspection Report', type: 'Inspection', format: 'PDF', size: '5.4 MB', generated: '2026-05-28' },
]

const COLUMNS: DataTableColumn<ComplianceReport>[] = [
  { header: 'ID', accessorKey: 'id' as keyof ComplianceReport },
  { header: 'Report Title', accessorKey: 'title' as keyof ComplianceReport },
  { header: 'Type', accessorKey: 'type' as keyof ComplianceReport },
  { header: 'Format', accessorKey: 'format' as keyof ComplianceReport },
  { header: 'Size', accessorKey: 'size' as keyof ComplianceReport },
  { header: 'Generated', accessorKey: 'generated' as keyof ComplianceReport },
  {
    header: 'Action',
    accessorKey: 'id' as keyof ComplianceReport,
    cell: (row) => (
      <Button
        size="sm"
        variant="outline"
        className="h-7 px-3 rounded-lg text-xs"
        onClick={() => toast.success(`Downloading: ${row.title}`)}
      >
        <DownloadIcon className="size-3.5 mr-1" /> Download
      </Button>
    ),
  },
]

export function SafetyReportsPage() {
  const [reports, setReports] = useState<ComplianceReport[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const t = setTimeout(() => { setReports(mockReports); setLoading(false) }, 400)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() =>
    reports.filter(r =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.type.toLowerCase().includes(search.toLowerCase())
    ), [reports, search])

  const handleExport = () => {
    toast.success('Generating latest compliance package for export...')
  }

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Compliance Reports</h1>
          <p className="text-sm text-muted-foreground">Access monthly safety reports, inspection audits and violation ledgers.</p>
        </div>

        <LoadingBoundary isLoading={loading} variant="card">
          <div className="grid gap-5 sm:grid-cols-3">
            <KpiCard label="Monthly Safety" value={String(reports.filter(r => r.type === 'Monthly Safety').length)} icon={ShieldCheckIcon} delta="This quarter" trend="up" hint="reports generated" />
            <KpiCard label="Inspection Reports" value={String(reports.filter(r => r.type === 'Inspection').length)} icon={FileTextIcon} delta="Audited" trend="up" hint="vehicle checks" />
            <KpiCard label="Violation Reports" value={String(reports.filter(r => r.type === 'Violation').length)} icon={BarChart3Icon} delta="Tracked" trend="neutral" hint="incidents logged" />
          </div>

          <Card className="border border-border/45 bg-card rounded-[20px] shadow-premium-sm mt-6">
            <CardHeader className="pb-4 border-b border-border/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                  <BarChart3Icon className="size-4.5 text-primary" />
                  Report Archive
                </CardTitle>
                <div className="flex items-center gap-2">
                  <InputGroup className="max-w-xs">
                    <InputGroupAddon>
                      <SearchIcon className="size-4 text-muted-foreground" />
                    </InputGroupAddon>
                    <InputGroupInput
                      placeholder="Search reports..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </InputGroup>
                  <Button
                    className="h-9 px-4 rounded-xl text-xs font-semibold bg-primary text-white active:scale-[0.98]"
                    onClick={handleExport}
                  >
                    <DownloadIcon className="size-4 mr-1" /> Export PDF
                  </Button>
                </div>
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
