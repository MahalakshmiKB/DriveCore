'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { WalletIcon, DownloadIcon, FileCheck2Icon, LandmarkIcon, BarChartIcon, InfoIcon, PlusIcon } from 'lucide-react'
import { toast } from 'sonner'

import { KpiCard } from '@/components/design-system/kpi-card'
import { StatusBadge } from '@/components/design-system/status-badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DataTable, DataTableColumn } from '@/components/shared/data/DataTable'
import { PageToolbar, ToolbarSelect, ToolbarSearch } from '@/components/shared/data/PageToolbar'
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

// ─── Column layout (must sum to 100%) ─────────────────────────────────────
// ID 8% | Date 12% | Category 14% | Description 28% | Amount 12% | Asset/Driver 16% | Status 10%
const columns: DataTableColumn<ExpenseRecord>[] = [
  {
    header: 'Txn ID',
    accessorKey: 'id',
    className: 'w-[8%] font-mono text-muted-foreground',
  },
  {
    header: 'Date',
    accessorKey: 'date',
    className: 'w-[12%] tabular-nums text-muted-foreground',
  },
  {
    header: 'Category',
    accessorKey: 'category',
    className: 'w-[14%] font-semibold text-foreground',
  },
  {
    // widest column — truncates long descriptions cleanly
    header: 'Description',
    accessorKey: 'description',
    className: 'w-[28%] text-foreground/80',
  },
  {
    header: 'Amount',
    cell: (row) => (
      <span className="font-bold tabular-nums text-foreground">
        ₹{row.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
      </span>
    ),
    // truncate=false because the cell renderer returns a React node, not raw text
    truncate: false,
    className: 'w-[12%] text-right pr-5',
  },
  {
    header: 'Asset / Driver',
    accessorKey: 'asset',
    className: 'w-[16%] text-muted-foreground font-medium',
  },
  {
    header: 'Status',
    cell: (row) => {
      const tone = row.status === 'Approved' ? 'success' : 'warning'
      return <StatusBadge tone={tone}>{row.status}</StatusBadge>
    },
    truncate: false,
    className: 'w-[10%] pl-4',
  },
]


export function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('All')

  useEffect(() => {
    const timer = setTimeout(() => {
      setExpenses(mockExpenses)
      setLoading(false)
    }, 400)
    return () => clearTimeout(timer)
  }, [])

  const handleAddExpense = () => {
    toast.success('Expense transaction logged for approval.')
  }

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchesSearch =
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        e.asset.toLowerCase().includes(search.toLowerCase()) ||
        e.category.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = categoryFilter === 'All' || e.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [expenses, search, categoryFilter])

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0)
  const pendingCount = expenses.filter(e => e.status === 'Pending').length
  const budgetUtilization = 82

  return (
    <ErrorBoundary>
      {/* w-full + min-w-0 prevents this column from ever pushing its parent wider */}
      <div className="flex flex-col gap-4 w-full min-w-0">

        {/* Header row */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between min-w-0">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-foreground truncate">Operational Expenses</h1>
            <p className="text-xs text-muted-foreground truncate">Audit budget transactions, log custom receipts and track cash outflows.</p>
          </div>
          <Button onClick={handleAddExpense} size="sm" className="shrink-0 shadow-sm">
            <PlusIcon className="size-4 mr-1.5" />
            Add Expense
          </Button>
        </div>

        <LoadingBoundary isLoading={loading} variant="card">

          {/* KPI Cards — single responsive row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 min-w-0">
            <KpiCard
              label="Total Spent MTD"
              value={`₹${totalSpent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
              icon={LandmarkIcon}
              delta="+8.4%"
              trend="up"
              hint="vs last month"
            />
            <KpiCard
              label="Budget Utilization"
              value={`${budgetUtilization}%`}
              icon={LandmarkIcon}
              delta="+2.1%"
              trend="up"
              hint="82% of monthly cap"
            />
            <KpiCard
              label="Avg Cost / Mile"
              value="₹0.45"
              icon={BarChartIcon}
              delta="-1.5%"
              trend="down"
              hint="across fleet"
            />
            <KpiCard
              label="Pending Approvals"
              value={String(pendingCount)}
              icon={FileCheck2Icon}
              delta="+2"
              trend="up"
              hint="awaiting review"
            />
          </div>

          {/* Main card: toolbar + table + sidebar in a 3-col grid */}
          <div className="grid gap-4 lg:grid-cols-3 min-w-0">

            {/* Table + toolbar — spans 2 cols */}
            <div className="lg:col-span-2 flex flex-col gap-0 min-w-0 border border-border/40 rounded-[20px] bg-card shadow-[0_2px_16px_0_rgba(0,0,0,0.18)] overflow-hidden">

              {/* ── Single-line toolbar ── */}
              <PageToolbar title="💼 Expense Ledger">
                <ToolbarSelect
                  value={categoryFilter}
                  onChange={setCategoryFilter}
                  options={['All', 'Fuel', 'Maintenance', 'Salaries', 'Insurance', 'Tolls']}
                />
                <ToolbarSearch
                  value={search}
                  onChange={setSearch}
                  placeholder="Search expenses…"
                />
                <Button
                  size="sm"
                  className="h-9 px-4 rounded-xl text-xs font-semibold shrink-0"
                  onClick={() => toast.success('Expense export initiated.')}
                >
                  <DownloadIcon className="size-3.5 mr-1.5" />
                  Export
                </Button>
              </PageToolbar>

              {/* Table */}
              <div className="p-4 w-full min-w-0">
                <DataTable
                  columns={columns}
                  data={filteredExpenses}
                  keyExtractor={(e) => e.id}
                  emptyTitle="No expense transactions found"
                  emptyDescription="Try refining your search or category filters."
                />
              </div>
            </div>

            {/* Statistics sidebar — single column */}
            <div className="flex flex-col gap-4 min-w-0">
              {/* Budget progress */}
              <Card className="border border-border/40 bg-card min-w-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold text-foreground">Budget Tracker</CardTitle>
                  <CardDescription className="text-xs">Current month allocation.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold min-w-0">
                      <span className="truncate mr-2">Total Operations Budget</span>
                      <span className="shrink-0 tabular-nums">₹3,12,000</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full transition-all" style={{ width: '82%' }} />
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      ₹56,300 remaining of monthly cap.
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Financial Auditing note */}
              <Card className="border border-border/40 bg-card min-w-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-foreground">
                    <InfoIcon className="size-4 text-primary shrink-0" />
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
