'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { BarChart3Icon, SearchIcon, PlusIcon, FileTextIcon, DownloadIcon, CheckCircle2Icon, SlidersIcon, ShieldAlertIcon } from 'lucide-react'
import { toast } from 'sonner'

import { KpiCard } from '@/components/design-system/kpi-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { DataTable, DataTableColumn } from '@/components/shared/data/DataTable'
import { FormSelect, FormInput } from '@/components/shared/data/FormFields'
import { LoadingBoundary } from '@/components/shared/feedback/LoadingBoundary'
import { ErrorBoundary } from '@/components/shared/feedback/ErrorBoundary'

interface ReportRecord {
  id: string
  title: string
  format: 'PDF' | 'XLSX' | 'CSV'
  size: string
  frequency: 'Weekly' | 'Monthly' | 'On-Demand'
  lastGenerated: string
  createdBy: string
}

const mockReports: ReportRecord[] = [
  { id: 'rep-301', title: 'Q2 Fleet Fuel Efficiency Audit', format: 'PDF', size: '2.4 MB', frequency: 'Monthly', lastGenerated: '2026-07-01', createdBy: 'Ava Monroe' },
  { id: 'rep-302', title: 'June Dispatch Operations Log', format: 'XLSX', size: '1.8 MB', frequency: 'Monthly', lastGenerated: '2026-07-02', createdBy: 'System Scheduler' },
  { id: 'rep-303', title: 'Weekly Maintenance Forecast Audit', format: 'CSV', size: '340 KB', frequency: 'Weekly', lastGenerated: '2026-07-10', createdBy: 'Ava Monroe' },
  { id: 'rep-304', title: 'Safety Certification & Compliance Audit', format: 'PDF', size: '4.2 MB', frequency: 'Weekly', lastGenerated: '2026-07-11', createdBy: 'Risk Manager' },
  { id: 'rep-305', title: 'Operational Outflows Ledger', format: 'XLSX', size: '820 KB', frequency: 'On-Demand', lastGenerated: '2026-07-08', createdBy: 'System Scheduler' },
]

export function ReportsPage() {
  const [reports, setReports] = useState<ReportRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [formatFilter, setFormatFilter] = useState<string>('All')

  // Form builder state
  const [reportType, setReportType] = useState('Fuel')
  const [timeframe, setTimeframe] = useState('This Month')
  const [exportFormat, setExportFormat] = useState('PDF')

  useEffect(() => {
    const timer = setTimeout(() => {
      setReports(mockReports)
      setLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  const handleBuildReport = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success(`Custom report "${reportType} Audit (${timeframe})" is being generated in background.`)
  }

  const handleDownload = (title: string) => {
    toast.success(`Started downloading file: ${title}`)
  }

  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) ||
                            r.createdBy.toLowerCase().includes(search.toLowerCase())
      
      const matchesFormat = formatFilter === 'All' || r.format === formatFilter
      return matchesSearch && matchesFormat
    })
  }, [reports, search, formatFilter])

  const generatedThisWeek = reports.filter(r => r.lastGenerated >= '2026-07-06').length
  const complianceRate = 98.6

  const columns: DataTableColumn<ReportRecord>[] = [
    {
      header: 'Report Title',
      cell: (row) => (
        <span className="flex items-center gap-2 font-semibold text-foreground">
          <FileTextIcon className="size-4.5 text-primary/80" />
          {row.title}
        </span>
      ),
    },
    {
      header: 'Format',
      accessorKey: 'format',
      className: 'font-mono text-xs text-muted-foreground',
    },
    {
      header: 'File Size',
      accessorKey: 'size',
      className: 'text-muted-foreground tabular-nums',
    },
    {
      header: 'Frequency',
      accessorKey: 'frequency',
      className: 'text-muted-foreground',
    },
    {
      header: 'Last Generated',
      accessorKey: 'lastGenerated',
      className: 'text-muted-foreground tabular-nums',
    },
    {
      header: 'Created By',
      accessorKey: 'createdBy',
      className: 'text-muted-foreground',
    },
    {
      header: 'Actions',
      cell: (row) => (
        <Button variant="outline" size="xs" onClick={() => handleDownload(row.title)}>
          <DownloadIcon data-icon="inline-start" className="size-3.5" />
          Export
        </Button>
      ),
      className: 'text-right w-24',
    },
  ]

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-8">
        
        {/* Hero Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics & Reports</h1>
          <p className="text-sm text-muted-foreground">Access operations audit sheets, export compliance logs, and run the report generator.</p>
        </div>

        <LoadingBoundary isLoading={loading} variant="card">
          
          {/* KPI Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Templates Available" value={String(reports.length + 8)} icon={BarChart3Icon} delta="+2" trend="up" hint="vs last quarter" />
            <KpiCard label="Audits Generated" value={String(generatedThisWeek)} icon={FileTextIcon} delta="+3" trend="up" hint="this week" />
            <KpiCard label="Compliance SLA" value={`${complianceRate}%`} icon={CheckCircle2Icon} delta="+0.4%" trend="up" hint="on-time generation" />
            <KpiCard label="Scheduled Deliveries" value="3 Active" icon={SlidersIcon} delta="Flat" trend="flat" hint="automated dispatches" />
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            
            {/* Table, Search, and filters */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <InputGroup>
                    <InputGroupAddon>
                      <SearchIcon className="size-4 text-muted-foreground/70" />
                    </InputGroupAddon>
                    <InputGroupInput
                      placeholder="Search reports by title, author..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </InputGroup>
                </div>
                <div className="flex gap-1">
                  {['All', 'PDF', 'XLSX', 'CSV'].map((format) => (
                    <Button
                      key={format}
                      variant={formatFilter === format ? 'default' : 'outline'}
                      size="xs"
                      onClick={() => setFormatFilter(format)}
                      className="rounded-lg text-xs"
                    >
                      {format}
                    </Button>
                  ))}
                </div>
              </div>

              <DataTable
                columns={columns}
                data={filteredReports}
                keyExtractor={(r) => r.id}
                emptyTitle="No analytical reports found"
                emptyDescription="Try refining your query search parameters or file format filters."
              />
            </div>

            {/* Report Builder Panel Card */}
            <div className="space-y-5">
              <form onSubmit={handleBuildReport}>
                <Card className="border border-border/40 bg-card">
                  <CardHeader>
                    <CardTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                      <SlidersIcon className="size-4 text-primary" />
                      Quick Report Builder
                    </CardTitle>
                    <CardDescription className="text-xs">Compile data tables into customized dashboard exports.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-2">
                    <FormSelect
                      label="Data Categories"
                      options={[
                        { label: 'Fuel Logs & MPG Efficiency', value: 'Fuel' },
                        { label: 'Maintenance Log & Costs', value: 'Maintenance' },
                        { label: 'Operational Outflow Ledger', value: 'Expenses' },
                        { label: 'Driver Safety Certifications', value: 'Drivers' },
                      ]}
                      value={reportType}
                      onValueChange={setReportType}
                    />

                    <FormSelect
                      label="Aggregation Timeframe"
                      options={[
                        { label: 'Current Week', value: 'This Week' },
                        { label: 'Current Month (MTD)', value: 'This Month' },
                        { label: 'Previous Quarter (Q1)', value: 'Last Quarter' },
                      ]}
                      value={timeframe}
                      onValueChange={setTimeframe}
                    />

                    <FormSelect
                      label="Export File Format"
                      options={[
                        { label: 'Portable Document Format (.pdf)', value: 'PDF' },
                        { label: 'Microsoft Excel Spreadsheet (.xlsx)', value: 'XLSX' },
                        { label: 'Comma Separated Values (.csv)', value: 'CSV' },
                      ]}
                      value={exportFormat}
                      onValueChange={setExportFormat}
                    />

                    <Button type="submit" className="w-full mt-2" size="sm">
                      Generate Document
                    </Button>
                  </CardContent>
                </Card>
              </form>

              <Card className="border border-border/40 bg-card text-card-foreground">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-foreground">
                    <ShieldAlertIcon className="size-4 text-warning" />
                    Security Clearance
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Data compiled contains PII and confidential operational ledger logs. Access is restricted to Managers and Auditors.
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
