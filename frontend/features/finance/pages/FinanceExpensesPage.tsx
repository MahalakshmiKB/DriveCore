import { useState, useEffect, useMemo } from 'react'
import { WalletIcon, SearchIcon, PlusIcon, DownloadIcon } from 'lucide-react'
import { toast } from 'sonner'
import { KpiCard } from '@/components/design-system/kpi-card'
import { StatusBadge } from '@/components/design-system/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { DataTable, DataTableColumn } from '@/components/shared/data/DataTable'
import { LoadingBoundary } from '@/components/shared/feedback/LoadingBoundary'
import { ErrorBoundary } from '@/components/shared/feedback/ErrorBoundary'
import type { StatusTone } from '@/components/design-system/status-badge'

interface ExpenseRecord {
  id: string
  date: string
  category: 'Fuel' | 'Maintenance' | 'Salaries' | 'Insurance' | 'Tolls'
  description: string
  amount: number
  vendor: string
  vehicle: string
  status: 'Approved' | 'Pending'
}

const mockExpenses: ExpenseRecord[] = [
  { id: 'tx-501', date: '2026-07-12', category: 'Fuel', description: 'Diesel refill – Shell NH-48', amount: 16120, vendor: 'Shell India', vehicle: 'FL-5542', status: 'Approved' },
  { id: 'tx-502', date: '2026-07-12', category: 'Maintenance', description: 'Engine diagnostics work order', amount: 45000, vendor: 'Ashok Leyland Service', vehicle: 'TX-8921', status: 'Approved' },
  { id: 'tx-503', date: '2026-07-11', category: 'Insurance', description: 'Monthly commercial fleet premium', amount: 180000, vendor: 'HDFC Ergo', vehicle: 'Global Fleet', status: 'Approved' },
  { id: 'tx-504', date: '2026-07-10', category: 'Salaries', description: 'Driver bi-weekly payout', amount: 48000, vendor: 'Internal Payroll', vehicle: 'All', status: 'Approved' },
  { id: 'tx-505', date: '2026-07-09', category: 'Tolls', description: 'FASTag recharge – Pune-Mumbai Expressway', amount: 25000, vendor: 'NHAI FASTag', vehicle: 'Global Fleet', status: 'Pending' },
  { id: 'tx-506', date: '2026-07-08', category: 'Maintenance', description: 'Brake pads replacement', amount: 21000, vendor: 'MRF Tyres & Service', vehicle: 'CA-4431', status: 'Pending' },
]

const STATUS_TONE: Record<string, StatusTone> = { Approved: 'success', Pending: 'warning' }

const COLUMNS: DataTableColumn<ExpenseRecord>[] = [
  { header: 'ID', accessorKey: 'id' as keyof ExpenseRecord },
  { header: 'Date', accessorKey: 'date' as keyof ExpenseRecord },
  { header: 'Category', accessorKey: 'category' as keyof ExpenseRecord },
  { header: 'Description', accessorKey: 'description' as keyof ExpenseRecord },
  {
    header: 'Amount',
    accessorKey: 'amount' as keyof ExpenseRecord,
    cell: (row) => <span className="font-semibold">₹{row.amount.toLocaleString('en-IN')}</span>,
  },
  { header: 'Vendor', accessorKey: 'vendor' as keyof ExpenseRecord },
  { header: 'Vehicle', accessorKey: 'vehicle' as keyof ExpenseRecord },
  {
    header: 'Status',
    accessorKey: 'status' as keyof ExpenseRecord,
    cell: (row) => <StatusBadge tone={STATUS_TONE[row.status]}>{row.status}</StatusBadge>,
  },
]

export function FinanceExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  useEffect(() => {
    const t = setTimeout(() => { setExpenses(mockExpenses); setLoading(false) }, 400)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() =>
    expenses.filter(e => {
      const matchSearch = e.description.toLowerCase().includes(search.toLowerCase()) ||
        e.vendor.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase())
      const matchCat = categoryFilter === 'All' || e.category === categoryFilter
      return matchSearch && matchCat
    }), [expenses, search, categoryFilter])

  const totalSpend = expenses.reduce((s, e) => s + e.amount, 0)
  const approved = expenses.filter(e => e.status === 'Approved').length
  const pending = expenses.filter(e => e.status === 'Pending').length

  const CATEGORIES = ['All', 'Fuel', 'Maintenance', 'Salaries', 'Insurance', 'Tolls']

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Expenses</h1>
          <p className="text-sm text-muted-foreground">Track all fleet expenditure categories, amounts, and approval status.</p>
        </div>

        <LoadingBoundary isLoading={loading} variant="card">
          <div className="grid gap-5 sm:grid-cols-3">
            <KpiCard label="Total Spend (MTD)" value={`₹${(totalSpend / 100).toLocaleString('en-IN')}k`} icon={WalletIcon} delta="+4.2%" trend="up" hint="vs last month" />
            <KpiCard label="Approved" value={String(approved)} icon={WalletIcon} delta="Verified" trend="up" hint="transactions" />
            <KpiCard label="Pending" value={String(pending)} icon={WalletIcon} delta="Await approval" trend="neutral" hint="transactions" />
          </div>

          <Card className="border border-border/45 bg-card rounded-[20px] shadow-premium-sm mt-6">
            <CardHeader className="pb-4 border-b border-border/20">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                  <WalletIcon className="size-4.5 text-primary" />
                  Expense Ledger
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="h-9 rounded-xl px-3 text-xs bg-muted/50 border border-border/40 text-foreground"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <InputGroup className="max-w-xs">
                    <InputGroupAddon>
                      <SearchIcon className="size-4 text-muted-foreground" />
                    </InputGroupAddon>
                    <InputGroupInput placeholder="Search expenses..." value={search} onChange={(e) => setSearch(e.target.value)} />
                  </InputGroup>
                  <Button className="h-9 px-4 rounded-xl text-xs font-semibold bg-primary text-white active:scale-[0.98]" onClick={() => toast.success('Expense export initiated.')}>
                    <DownloadIcon className="size-4 mr-1" /> Export
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
