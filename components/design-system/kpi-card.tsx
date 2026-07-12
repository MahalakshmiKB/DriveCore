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
    <Card className={cn('gap-0', className)} {...props}>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            {label}
          </span>
          {Icon ? (
            <span className="flex size-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Icon className="size-4" />
            </span>
          ) : null}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold tracking-tight tabular-nums text-foreground">
            {value}
          </span>
        </div>

        {(delta || hint) && (
          <div className="flex items-center gap-1.5 text-xs">
            {delta ? (
              <span className={cn('inline-flex items-center gap-0.5 font-medium tabular-nums', trendClass)}>
                {trend === 'up' && <ArrowUpRightIcon className="size-3.5" />}
                {trend === 'down' && <ArrowDownRightIcon className="size-3.5" />}
                {delta}
              </span>
            ) : null}
            {hint ? <span className="text-muted-foreground">{hint}</span> : null}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { KpiCard }
