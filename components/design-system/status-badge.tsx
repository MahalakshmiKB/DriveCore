import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/**
 * StatusBadge — a pill that communicates operational state via a colored dot
 * and label. Tones map to the DriveCore functional color system.
 */
const statusBadgeVariants = cva(
  'inline-flex h-6 w-fit items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium whitespace-nowrap',
  {
    variants: {
      tone: {
        neutral: 'border-border bg-muted text-muted-foreground',
        info: 'border-info/20 bg-info-muted text-info',
        success: 'border-success/20 bg-success-muted text-success',
        warning: 'border-warning/25 bg-warning-muted text-warning-foreground',
        danger: 'border-destructive/20 bg-destructive/10 text-destructive',
        brand: 'border-primary/20 bg-primary/10 text-primary',
      },
    },
    defaultVariants: {
      tone: 'neutral',
    },
  },
)

const dotVariants = cva('size-1.5 shrink-0 rounded-full', {
  variants: {
    tone: {
      neutral: 'bg-muted-foreground',
      info: 'bg-info',
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
