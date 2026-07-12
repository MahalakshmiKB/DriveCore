'use client'

import React, { useState, useMemo, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty'
import { cn } from '@/utils'

export interface DataTableColumn<T> {
  /** Column header label */
  header: string
  /** Key of the row object to display as plain text. Mutually exclusive with cell. */
  accessorKey?: keyof T
  /**
   * Tailwind classes for BOTH <th> and <td>.
   * Use w-[N%] here to set proportional column widths for table-fixed layout.
   * Use text-right, font-mono, etc. for cell-specific styling.
   */
  className?: string
  /** Override classes for the <th> only */
  headerClassName?: string
  /** Custom cell renderer. When provided, the raw value tooltip is unavailable. */
  cell?: (row: T) => React.ReactNode
  /**
   * Whether to truncate overflowing text with an ellipsis.
   * Defaults to true. Set to false for badge/custom cells that should not be clipped.
   */
  truncate?: boolean
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  keyExtractor: (row: T) => string | number
  emptyTitle?: string
  emptyDescription?: string
  pageSize?: number
}

// Header height ~40px + cell padding giving ~56px row height via py-3.5
const CELL_CLS = 'align-middle px-4 py-3.5 text-[11px] leading-snug'
const HEAD_CLS = 'align-middle px-4 py-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70'

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyTitle = 'No data available',
  emptyDescription = 'There are no records to display.',
  pageSize = 5,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(data.length / pageSize)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return data.slice(start, start + pageSize)
  }, [data, currentPage, pageSize])

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [data, currentPage, totalPages])

  if (data.length === 0) {
    return (
      <Empty className="border border-border bg-card rounded-[20px]">
        <EmptyHeader>
          <EmptyTitle>{emptyTitle}</EmptyTitle>
          <EmptyDescription>{emptyDescription}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-3 w-full min-w-0">
      {/*
        The outer div clips the table so it never causes horizontal scrollbar.
        overflow-y-auto on the inner scroll container + sticky thead give the sticky header.
      */}
      <div className="w-full min-w-0 rounded-[20px] border border-border/40 bg-card shadow-[0_2px_16px_0_rgba(0,0,0,0.18)] overflow-hidden">
        {/* Scrollable body with sticky header */}
        <div className="overflow-x-hidden overflow-y-auto max-h-[480px]">
          <Table className="w-full table-fixed border-collapse">
            {/* ── Sticky header ── */}
            <TableHeader className="sticky top-0 z-10">
              <TableRow className="border-b border-border/30 bg-[hsl(var(--muted)/0.18)] hover:bg-[hsl(var(--muted)/0.18)]">
                {columns.map((col, i) => (
                  <TableHead
                    key={i}
                    className={cn(
                      HEAD_CLS,
                      col.headerClassName ?? col.className ?? ''
                    )}
                  >
                    <span className="block truncate">{col.header}</span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            {/* ── Body rows ── */}
            <TableBody>
              {paginatedData.map((row, rowIdx) => (
                <TableRow
                  key={keyExtractor(row)}
                  className={cn(
                    'border-b border-border/15 transition-colors duration-100',
                    rowIdx % 2 === 0
                      ? 'bg-card hover:bg-[hsl(var(--muted)/0.12)]'
                      : 'bg-[hsl(var(--muted)/0.06)] hover:bg-[hsl(var(--muted)/0.14)]'
                  )}
                >
                  {columns.map((col, colIdx) => {
                    const shouldTruncate = col.truncate !== false && !col.cell
                    const rawValue =
                      col.accessorKey ? String(row[col.accessorKey] ?? '') : undefined

                    return (
                      <TableCell
                        key={colIdx}
                        title={shouldTruncate ? rawValue : undefined}
                        className={cn(
                          CELL_CLS,
                          shouldTruncate ? 'overflow-hidden max-w-0' : '',
                          col.className ?? ''
                        )}
                      >
                        {shouldTruncate ? (
                          <span className="block truncate">
                            {rawValue}
                          </span>
                        ) : col.cell ? (
                          col.cell(row)
                        ) : (
                          rawValue
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <Pagination className="justify-between">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage > 1) setCurrentPage(currentPage - 1)
                }}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage(page)
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                }}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
