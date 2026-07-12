import * as React from 'react'
import { ArrowDownRightIcon, ArrowUpRightIcon, type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

export interface KpiCardProps extends React.ComponentProps<typeof Card> {
  label: string
  value: string
  icon?: LucideIcon
  /** e.g. "+12.4%" — positive/negative inferred from `trend`. */
  delta?: string
  trend?: 'up' | 'down' | 'flat'
  /** Small helper line under the delta, e.g. "vs last month". */
  hint?: string
}

function KpiCard({
  label,
  value,
  icon: Icon,
  delta,
  trend = 'flat',
  hint,
  className,
  ...props
}: KpiCardProps) {
  const trendClass =
    trend === 'up'
      ? 'text-success'
      : trend === 'down'
        ? 'text-destructive'
        : 'text-muted-foreground'

  return (
    <Card className={cn('gap-0 border border-border/40 bg-card hover:translate-y-[-2px] transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.01),0_8px_16px_-4px_rgba(0,0,0,0.03)] dark:shadow-[0_1px_3px_rgba(0,0,0,0.15),0_10px_20px_-8px_rgba(0,0,0,0.25)]', className)} {...props}>
      <CardContent className="flex flex-col gap-3 p-6">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/85">
            {label}
          </span>
          {Icon ? (
            <span className="flex size-9 items-center justify-center rounded-xl bg-muted/65 text-muted-foreground border border-border/30 shadow-[0_1px_2px_rgba(0,0,0,0.01)] dark:bg-muted/15">
              <Icon className="size-4.5 text-primary" />
            </span>
          ) : null}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight tabular-nums text-foreground">
            {value}
          </span>
        </div>

        {(delta || hint) && (
          <div className="flex items-center gap-1.5 text-xs">
            {delta ? (
              <span className={cn('inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-semibold text-[11px] tabular-nums border', 
                trend === 'up' 
                  ? 'bg-success-muted/50 text-success border-success/15 dark:bg-success-muted/15' 
                  : trend === 'down' 
                    ? 'bg-destructive/10 text-destructive border-destructive/10 dark:bg-destructive/15' 
                    : 'bg-muted text-muted-foreground border-border/50'
              )}>
                {trend === 'up' && <ArrowUpRightIcon className="size-3" />}
                {trend === 'down' && <ArrowDownRightIcon className="size-3" />}
                {delta}
              </span>
            ) : null}
            {hint ? <span className="text-muted-foreground/75 font-medium">{hint}</span> : null}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { KpiCard }
