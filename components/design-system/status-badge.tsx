import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * StatusBadge — a pill that communicates operational state via a colored dot
 * and label. Tones map to the DriveCore functional color system.
 */
const statusBadgeVariants = cva(
  'inline-flex h-5.5 w-fit items-center gap-1.5 rounded-full border px-2 text-[10.5px] font-semibold tracking-wide uppercase whitespace-nowrap shadow-[0_1px_1px_rgba(0,0,0,0.01)] transition-colors',
  {
    variants: {
      tone: {
        neutral: 'border-border bg-muted/60 text-muted-foreground dark:bg-muted/30',
        info: 'border-info/20 bg-info-muted/40 text-info dark:bg-info-muted/15',
        success: 'border-success/25 bg-success-muted/45 text-success dark:bg-success-muted/20',
        warning: 'border-warning/30 bg-warning-muted/45 text-warning-foreground dark:bg-warning-muted/20',
        danger: 'border-destructive/20 bg-destructive/10 text-destructive dark:bg-destructive/15',
        brand: 'border-primary/20 bg-primary/10 text-primary dark:bg-primary/15',
      },
    },
    defaultVariants: {
      tone: 'neutral',
    },
  },
)

const dotVariants = cva('size-1.5 shrink-0 rounded-full shadow-[0_0_4px_currentColor]', {
  variants: {
    tone: {
      neutral: 'bg-muted-foreground/80',
      info: 'bg-info animate-pulse',
      success: 'bg-success',
      warning: 'bg-warning',
      danger: 'bg-destructive',
      brand: 'bg-primary',
    },
  },
  defaultVariants: {
    tone: 'neutral',
  },
})

type StatusTone = NonNullable<VariantProps<typeof statusBadgeVariants>['tone']>

export interface StatusBadgeProps
  extends React.ComponentProps<'span'>,
    VariantProps<typeof statusBadgeVariants> {
  /** Hide the leading status dot. */
  hideDot?: boolean
}

function StatusBadge({
  className,
  tone,
  hideDot = false,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ tone }), className)} {...props}>
      {!hideDot && <span className={dotVariants({ tone })} aria-hidden />}
      {children}
    </span>
  )
}

/* ---- Domain status → tone maps (from the TransitOps spec) ---- */

export const vehicleStatusTone: Record<string, StatusTone> = {
  Available: 'success',
  'On Trip': 'info',
  'In Shop': 'warning',
  Retired: 'neutral',
}

export const driverStatusTone: Record<string, StatusTone> = {
  Available: 'success',
  'On Trip': 'info',
  'Off Duty': 'neutral',
  Suspended: 'danger',
}

export const tripStatusTone: Record<string, StatusTone> = {
  Draft: 'neutral',
  Dispatched: 'info',
  Completed: 'success',
  Cancelled: 'danger',
}

export { StatusBadge, statusBadgeVariants }
export type { StatusTone }
