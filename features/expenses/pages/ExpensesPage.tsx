'use client'

import * as React from 'react'
import { DollarSignIcon, SearchIcon, PlusIcon, FileCheck2Icon, LandmarkIcon, BarChartIcon, InfoIcon } from 'lucide-react'
import { toast } from 'sonner'

import { KpiCard } from '@/components/design-system/kpi-card'
import { StatusBadge } from '@/components/design-system/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { DataTable, DataTableColumn } from '@/components/shared/data/DataTable'
import { LoadingBoundary } from '@/components/shared/feedback/LoadingBoundary'
import { ErrorBoundary } from '@/components/shared/feedback/ErrorBoundary'

interface ExpenseRecord {
  id: string
  date: string
  category: 'Fuel' | 'Maintenance' | 'Salaries' | 'Insurance' | 'Tolls'
  description: string
  amount: number
  asset: string
  status: 'Approved' | 'Pending'
}

const mockExpenses: ExpenseRecord[] = [
  { id: 'tx-501', date: '2026-07-12', category: 'Fuel', description: 'Diesel refill at Shell station', amount: 161.20, asset: 'FL-5542', status: 'Approved' },
  { id: 'tx-502', date: '2026-07-12', category: 'Maintenance', description: 'Diagnostics work order engine audit', amount: 450.00, asset: 'TX-8921', status: 'Approved' },
  { id: 'tx-503', date: '2026-07-11', category: 'Insurance', description: 'Monthly commercial fleet insurance premium', amount: 18000.00, asset: 'Global Fleet', status: 'Approved' },
  { id: 'tx-504', date: '2026-07-10', category: 'Salaries', description: 'Driver bi-weekly paycheck dispatch payout', amount: 4800.00, asset: 'Ava Monroe', status: 'Approved' },
  { id: 'tx-505', date: '2026-07-09', category: 'Tolls', description: 'Interstate tollway pass refill', amount: 250.00, asset: 'Global Fleet', status: 'Pending' },
  { id: 'tx-506', date: '2026-07-08', category: 'Maintenance', description: 'Brake pads replacement quote', amount: 210.00, asset: 'CA-4431', status: 'Pending' },
]

export function ExpensesPage() {
  const [expenses, setExpenses] = React.useState<ExpenseRecord[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState<string>('All')

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setExpenses(mockExpenses)
      setLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  const handleAddExpense = () => {
    toast.success('Expense transaction logged for approval.')
  }

  const filteredExpenses = React.useMemo(() => {
    return expenses.filter((e) => {
      const matchesSearch = e.description.toLowerCase().includes(search.toLowerCase()) ||
                            e.asset.toLowerCase().includes(search.toLowerCase()) ||
                            e.category.toLowerCase().includes(search.toLowerCase())
      
      const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [expenses, search, categoryFilter])

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const pendingCount = expenses.filter(e => e.status === 'Pending').length
  const budgetUtilization = 82 // mock percentage

  const columns: DataTableColumn<ExpenseRecord>[] = [
    {
      header: 'Transaction ID',
      accessorKey: 'id',
      className: 'font-mono text-xs text-muted-foreground',
    },
    {
      header: 'Date',
      accessorKey: 'date',
      className: 'text-muted-foreground tabular-nums',
    },
    {
      header: 'Category',
      accessorKey: 'category',
      className: 'font-semibold text-foreground',
    },
    {
      header: 'Associated Asset/Driver',
      accessorKey: 'asset',
      className: 'text-muted-foreground font-medium',
    },
    {
      header: 'Description',
      accessorKey: 'description',
    },
    {
      header: 'Amount',
      cell: (row) => `$${row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      className: 'tabular-nums text-foreground font-bold',
    },
    {
      header: 'Status',
      cell: (row) => {
        const tone = row.status === 'Approved' ? 'success' : 'warning'
        return (
          <StatusBadge tone={tone} className="ml-auto">
            {row.status}
          </StatusBadge>
        )
      },
      className: 'text-right',
    },
  ]

  return (
    <ErrorBoundary>
      <div className="flex flex-col gap-8">
        
        {/* Hero Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Operational Expenses</h1>
            <p className="text-sm text-muted-foreground">Audit budget transactions, log custom operational receipts, and track cash outflows.</p>
          </div>
          <Button onClick={handleAddExpense} size="sm" className="w-full sm:w-auto shadow-sm">
            <PlusIcon className="size-4 mr-1.5" />
            Add Custom Expense
          </Button>
        </div>

        <LoadingBoundary isLoading={loading} variant="card">
          
          {/* KPI Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Total Spent MTD" value={`$${totalSpent.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} icon={DollarSignIcon} delta="+8.4%" trend="up" hint="vs last month" />
            <KpiCard label="Budget Utilization" value={`${budgetUtilization}%`} icon={LandmarkIcon} delta="+2.1%" trend="up" hint="82% of monthly cap" />
            <KpiCard label="Avg Cost Per Mile" value="$0.45 / Mile" icon={BarChartIcon} delta="-1.5%" trend="down" hint="across whole fleet" />
            <KpiCard label="Pending Approvals" value={String(pendingCount)} icon={FileCheck2Icon} delta="+2" trend="up" hint="awaiting review" />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            
            {/* Table, search and filters */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <InputGroup>
                    <InputGroupAddon>
                      <SearchIcon className="size-4 text-muted-foreground/70" />
                    </InputGroupAddon>
                    <InputGroupInput
                      placeholder="Search transactions by category, asset, description..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </InputGroup>
                </div>
                <div className="flex gap-1">
                  {['All', 'Fuel', 'Maintenance', 'Salaries', 'Insurance', 'Tolls'].map((category) => (
                    <Button
                      key={category}
                      variant={categoryFilter === category ? 'default' : 'outline'}
                      size="xs"
                      onClick={() => setCategoryFilter(category)}
                      className="rounded-lg text-xs"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <DataTable
                columns={columns}
                data={filteredExpenses}
                keyExtractor={(e) => e.id}
                emptyTitle="No expense transactions found"
                emptyDescription="Try refining your query search parameters or category filters."
              />
            </div>

            {/* Statistics Sidebar Cards */}
            <div className="space-y-5">
              <Card className="border border-border/40 bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-foreground">Budget Progress Tracker</CardTitle>
                  <CardDescription className="text-xs">Current month allocation and progress.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Total Operations Budget</span>
                      <span>$312,000.00</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: '82%' }} />
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      $56,300.00 remaining of overall monthly cap limits.
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-border/40 bg-card text-card-foreground">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-foreground">
                    <InfoIcon className="size-4 text-primary" />
                    Financial Auditing
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Transactions are audited automatically against GPS logs and digital receipts before final approval payout.
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
