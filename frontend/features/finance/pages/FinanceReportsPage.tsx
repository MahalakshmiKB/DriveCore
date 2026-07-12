import { useState, useEffect, useMemo } from 'react'
import { BarChart3Icon, DownloadIcon, FileTextIcon } from 'lucide-react'
import { toast } from 'sonner'
import { KpiCard } from '@/components/design-system/kpi-card'
import { Button } from '@/components/ui/button'
import { DataTable, DataTableColumn } from '@/components/shared/data/DataTable'
import { PageToolbar, ToolbarSelect, ToolbarSearch } from '@/components/shared/data/PageToolbar'
import { LoadingBoundary } from '@/components/shared/feedback/LoadingBoundary'
import { ErrorBoundary } from '@/components/shared/feedback/ErrorBoundary'

interface FinancialReport {
  id: string
  title: string
  period: 'Monthly' | 'Quarterly' | 'Yearly'
  format: 'PDF' | 'XLSX'
  size: string
  generated: string
}

const mockReports: FinancialReport[] = [
  { id: 'fr-001', title: 'July 2026 Fleet Expense Summary', period: 'Monthly', format: 'PDF', size: '2.8 MB', generated: '2026-07-01' },
  { id: 'fr-002', title: 'Q2 2026 Financial Operations Report', period: 'Quarterly', format: 'XLSX', size: '4.1 MB', generated: '2026-07-01' },
  { id: 'fr-003', title: 'June 2026 Fleet Expense Summary', period: 'Monthly', format: 'PDF', size: '2.6 MB', generated: '2026-06-01' },
  { id: 'fr-004', title: 'FY 2025-26 Fleet Profitability Report', period: 'Yearly', format: 'XLSX', size: '6.4 MB', generated: '2026-04-01' },
  { id: 'fr-005', title: 'Q1 2026 Financial Operations Report', period: 'Quarterly', format: 'PDF', size: '3.9 MB', generated: '2026-04-01' },
  { id: 'fr-006', title: 'May 2026 Fleet Expense Summary', period: 'Monthly', format: 'PDF', size: '2.5 MB', generated: '2026-05-01' },
]

const COLUMNS: DataTableColumn<FinancialReport>[] = [
  { header: 'ID', accessorKey: 'id' as keyof FinancialReport },
  { header: 'Report Title', accessorKey: 'title' as keyof FinancialReport },
  { header: 'Period', accessorKey: 'period' as keyof FinancialReport },
  { header: 'Format', accessorKey: 'format' as keyof FinancialReport },
  { header: 'Size', accessorKey: 'size' as keyof FinancialReport },
  { header: 'Generated', accessorKey: 'generated' as keyof FinancialReport },
  {
    header: 'Action',
    accessorKey: 'id' as keyof FinancialReport,
    cell: (row) => (
      <div className="flex items-center gap-1.5">
        <Button size="sm" variant="outline" className="h-7 px-3 rounded-lg text-xs" onClick={() => toast.success(`Downloading PDF: ${row.title}`)}>
          <DownloadIcon className="size-3.5 mr-1" /> PDF
        </Button>
        <Button size="sm" variant="outline" className="h-7 px-3 rounded-lg text-xs" onClick={() => toast.success(`Downloading Excel: ${row.title}`)}>
          <DownloadIcon className="size-3.5 mr-1" /> Excel
        </Button>
      </div>
    ),
  },
]

export function FinanceReportsPage() {
  const [reports, setReports] = useState<FinancialReport[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [periodFilter, setPeriodFilter] = useState('All')

  useEffect(() => {
    const t = setTimeout(() => { setReports(mockReports); setLoading(false) }, 400)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() =>
    reports.filter(r => {
      const matchSearch = r.title.toLowerCase().includes(search.toLowerCase())
      const matchPeriod = periodFilter === 'All' || r.period === periodFilter
      return matchSearch && matchPeriod
    }), [reports, search, periodFilter])

  const PERIODS = ['All', 'Monthly', 'Quarterly', 'Yearly']

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Financial Reports</h1>
          <p className="text-sm text-muted-foreground">Access monthly, quarterly and yearly financial reports. Export as PDF or Excel.</p>
        </div>

        <LoadingBoundary isLoading={loading} variant="card">
          <div className="grid gap-5 sm:grid-cols-3">
            <KpiCard label="Monthly Reports" value={String(reports.filter(r => r.period === 'Monthly').length)} icon={FileTextIcon} delta="Available" trend="up" hint="this period" />
            <KpiCard label="Quarterly Reports" value={String(reports.filter(r => r.period === 'Quarterly').length)} icon={BarChart3Icon} delta="Generated" trend="up" hint="archived" />
            <KpiCard label="Yearly Reports" value={String(reports.filter(r => r.period === 'Yearly').length)} icon={BarChart3Icon} delta="Annual" trend="flat" hint="fiscal year" />
          </div>

          <div className="flex flex-col gap-0 min-w-0 border border-border/40 rounded-[20px] bg-card shadow-[0_2px_16px_0_rgba(0,0,0,0.18)] overflow-hidden mt-6">
            
            {/* ── Single-line toolbar ── */}
            <PageToolbar title="📊 Report Archive">
              <ToolbarSelect
                value={periodFilter}
                onChange={setPeriodFilter}
                options={PERIODS}
              />
              <ToolbarSearch
                value={search}
                onChange={setSearch}
                placeholder="Search reports…"
              />
              <Button
                size="sm"
                className="h-9 px-4 rounded-xl text-xs font-semibold shrink-0"
                onClick={() => toast.success('Archive export initiated.')}
              >
                <DownloadIcon className="size-3.5 mr-1.5" />
                Export All
              </Button>
            </PageToolbar>

            <div className="p-4 w-full min-w-0">
              <DataTable columns={COLUMNS} data={filtered} keyExtractor={(r) => r.id} />
            </div>
          </div>
        </LoadingBoundary>
      </div>
    </ErrorBoundary>
  )
}
