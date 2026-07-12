import { useState, useEffect, useMemo } from 'react'
import {
  FileTextIcon,
  SearchIcon,
  CalendarIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  ClockIcon,
} from 'lucide-react'
import { StatusBadge } from '@/components/design-system/status-badge'
import { KpiCard } from '@/components/design-system/kpi-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { DataTable, DataTableColumn } from '@/components/shared/data/DataTable'
import { LoadingBoundary } from '@/components/shared/feedback/LoadingBoundary'
import { ErrorBoundary } from '@/components/shared/feedback/ErrorBoundary'
import type { StatusTone } from '@/components/design-system/status-badge'

interface LicenseRecord {
  id: string
  driverName: string
  licenseNo: string
  expiryDate: string
  renewalStatus: 'Valid' | 'Expiring Soon' | 'Expired'
  medicalCertificate: 'Valid' | 'Expiring Soon' | 'Expired'
  daysUntilExpiry: number
}

const mockLicenses: LicenseRecord[] = [
  { id: 'D-001', driverName: 'Marcus Vance', licenseNo: 'DL-1420180029341', expiryDate: '2028-11-15', renewalStatus: 'Valid', medicalCertificate: 'Valid', daysUntilExpiry: 857 },
  { id: 'D-002', driverName: 'Lucas Thorne', licenseNo: 'DL-1820160041222', expiryDate: '2026-09-10', renewalStatus: 'Expiring Soon', medicalCertificate: 'Valid', daysUntilExpiry: 60 },
  { id: 'D-003', driverName: 'Elena Rostova', licenseNo: 'DL-0020140018901', expiryDate: '2026-08-01', renewalStatus: 'Expiring Soon', medicalCertificate: 'Expiring Soon', daysUntilExpiry: 20 },
  { id: 'D-004', driverName: 'Raj Patel', licenseNo: 'DL-2419990077001', expiryDate: '2026-07-05', renewalStatus: 'Expired', medicalCertificate: 'Expired', daysUntilExpiry: -7 },
  { id: 'D-005', driverName: 'Sarah Jenkins', licenseNo: 'DL-0920210099120', expiryDate: '2029-03-22', renewalStatus: 'Valid', medicalCertificate: 'Valid', daysUntilExpiry: 984 },
  { id: 'D-006', driverName: 'James Okafor', licenseNo: 'DL-1120170044812', expiryDate: '2026-07-08', renewalStatus: 'Expired', medicalCertificate: 'Valid', daysUntilExpiry: -4 },
]

const LICENSE_TONE: Record<string, StatusTone> = {
  'Valid': 'success',
  'Expiring Soon': 'warning',
  'Expired': 'danger',
}

const COLUMNS: DataTableColumn<LicenseRecord>[] = [
  { header: 'Driver', accessorKey: 'driverName' as keyof LicenseRecord },
  { header: 'License No.', accessorKey: 'licenseNo' as keyof LicenseRecord },
  { header: 'Expiry Date', accessorKey: 'expiryDate' as keyof LicenseRecord },
  {
    header: 'Days Left',
    accessorKey: 'daysUntilExpiry' as keyof LicenseRecord,
    cell: (row) => (
      <span className={`font-semibold text-xs ${row.daysUntilExpiry < 0 ? 'text-destructive' : row.daysUntilExpiry < 30 ? 'text-warning' : 'text-success'}`}>
        {row.daysUntilExpiry < 0 ? `Expired ${Math.abs(row.daysUntilExpiry)} days ago` : `${row.daysUntilExpiry} days`}
      </span>
    ),
  },
  {
    header: 'License Status',
    accessorKey: 'renewalStatus' as keyof LicenseRecord,
    cell: (row) => <StatusBadge tone={LICENSE_TONE[row.renewalStatus]}>{row.renewalStatus}</StatusBadge>,
  },
  {
    header: 'Medical Certificate',
    accessorKey: 'medicalCertificate' as keyof LicenseRecord,
    cell: (row) => <StatusBadge tone={LICENSE_TONE[row.medicalCertificate]}>{row.medicalCertificate}</StatusBadge>,
  },
]

export function SafetyLicensePage() {
  const [records, setRecords] = useState<LicenseRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const t = setTimeout(() => { setRecords(mockLicenses); setLoading(false) }, 400)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() =>
    records.filter(r =>
      r.driverName.toLowerCase().includes(search.toLowerCase()) ||
      r.licenseNo.toLowerCase().includes(search.toLowerCase())
    ), [records, search])

  const valid = records.filter(r => r.renewalStatus === 'Valid').length
  const expiringSoon = records.filter(r => r.renewalStatus === 'Expiring Soon').length
  const expired = records.filter(r => r.renewalStatus === 'Expired').length

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">License Monitoring</h1>
          <p className="text-sm text-muted-foreground">Track CDL expiry, renewal status and medical certificate validity across the fleet.</p>
        </div>

        <LoadingBoundary isLoading={loading} variant="card">
          <div className="grid gap-5 sm:grid-cols-3">
            <KpiCard label="Valid Licenses" value={String(valid)} icon={CheckCircle2Icon} delta="No action" trend="up" hint="fully compliant" />
            <KpiCard label="Expiring Soon" value={String(expiringSoon)} icon={ClockIcon} delta="Renew now" trend="flat" hint="within 90 days" />
            <KpiCard label="Expired" value={String(expired)} icon={AlertCircleIcon} delta="Urgent" trend="down" hint="driver suspended" />
          </div>

          <Card className="border border-border/45 bg-card rounded-[20px] shadow-premium-sm mt-6">
            <CardHeader className="pb-4 border-b border-border/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                  <FileTextIcon className="size-4.5 text-primary" />
                  License Registry
                </CardTitle>
                <InputGroup className="max-w-xs">
                  <InputGroupAddon>
                    <SearchIcon className="size-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    placeholder="Search driver or license..."
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
