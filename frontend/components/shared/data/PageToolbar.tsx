import React from 'react'
import { cn } from '@/utils'

interface PageToolbarProps {
  /** Left side: icon + title text, e.g. <><WalletIcon/> Expense Ledger</> */
  title: React.ReactNode
  /** Right side controls — rendered in a fixed nowrap row */
  children: React.ReactNode
  className?: string
}

/**
 * A single-line responsive toolbar used across table pages.
 *
 * Desktop: [Title ─────────────────────── Filter | Search | Action]
 * Mobile:  title on first line, controls wrap below
 */
export function PageToolbar({ title, children, className }: PageToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between',
        'px-5 py-3.5 border-b border-border/20 min-w-0',
        className
      )}
    >
      {/* Title — flex-1 on desktop so controls stay right-aligned */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-sm font-bold text-foreground leading-none whitespace-nowrap">
          {title}
        </span>
      </div>

      {/* Controls — never wrap on desktop (flex-nowrap + shrink-0 items) */}
      <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap sm:shrink-0">
        {children}
      </div>
    </div>
  )
}

/**
 * A fixed-width filter select that matches the toolbar design.
 */
interface ToolbarSelectProps {
  value: string
  onChange: (value: string) => void
  options: string[]
  placeholder?: string
  className?: string
}

export function ToolbarSelect({
  value,
  onChange,
  options,
  placeholder,
  className,
}: ToolbarSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        'h-9 shrink-0 rounded-xl px-3 text-xs font-medium',
        'bg-muted/40 border border-border/40 text-foreground',
        'focus:outline-none focus:ring-1 focus:ring-primary/50',
        'transition-colors hover:bg-muted/60 cursor-pointer',
        'w-[160px]',
        className
      )}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  )
}

/**
 * A fixed-width search input that grows to fill available space.
 * Use inside PageToolbar — it has flex-1 so it expands to fill.
 */
interface ToolbarSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function ToolbarSearch({
  value,
  onChange,
  placeholder = 'Search…',
  className,
}: ToolbarSearchProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 h-9 px-3 rounded-xl',
        'bg-muted/40 border border-border/40',
        'focus-within:ring-1 focus-within:ring-primary/50 focus-within:border-primary/40',
        'transition-colors',
        // 320px min, grows to fill remaining space in the toolbar
        'min-w-[220px] sm:min-w-[300px] sm:w-[340px]',
        className
      )}
    >
      {/* Search icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="size-3.5 text-muted-foreground/60 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'flex-1 min-w-0 bg-transparent text-xs text-foreground',
          'placeholder:text-muted-foreground/50',
          'focus:outline-none border-0 ring-0 outline-none',
        )}
      />
    </div>
  )
}
