import * as React from 'react'

import { cn } from '@/lib/utils'

export function Section({
  id,
  title,
  description,
  children,
  className,
}: {
  id: string
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('scroll-mt-20 py-8 first:pt-0', className)}>
      <div className="mb-5 border-b border-border pb-3">
        <h2 className="text-lg font-semibold tracking-tight text-foreground text-balance">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground text-pretty">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

export function Subsection({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>
      {children}
    </div>
  )
}
