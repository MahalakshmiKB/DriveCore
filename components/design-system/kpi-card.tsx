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
    <Card className={cn('relative gap-0 border border-border/45 hover:translate-y-[-2px] hover:shadow-premium-md transition-all duration-200 ease-out clay-card-premium overflow-hidden', className)} {...props}>
      {/* Top accent line */}
      <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-primary/90 via-primary/50 to-transparent" />
      
      <CardContent className="flex flex-col gap-4.5 p-6 pt-7">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
            {label}
          </span>
          {Icon ? (
            <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/10 to-primary/0 text-primary border border-primary/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
              <Icon className="size-6 text-primary" />
            </span>
          ) : null}
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold tracking-tight tabular-nums text-foreground leading-none">
            {value}
          </span>
        </div>

        {(delta || hint) && (
          <div className="flex items-center gap-1.5 text-xs">
            {delta ? (
              <span className={cn('inline-flex items-center gap-0.5 rounded-lg px-1.5 py-0.5 font-semibold text-[11px] tabular-nums border', 
                trend === 'up' 
                  ? 'bg-success-muted/30 text-success border-success/15 dark:bg-success-muted/15' 
                  : trend === 'down' 
                    ? 'bg-destructive/10 text-destructive border-destructive/10 dark:bg-destructive/15' 
                    : 'bg-muted text-muted-foreground border-border/50'
              )}>
                {trend === 'up' && <ArrowUpRightIcon className="size-3" />}
                {trend === 'down' && <ArrowDownRightIcon className="size-3" />}
                {delta}
              </span>
            ) : null}
            {hint ? <span className="text-muted-foreground/75 font-semibold">{hint}</span> : null}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export { KpiCard }
