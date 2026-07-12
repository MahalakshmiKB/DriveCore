import * as React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface LoadingBoundaryProps {
  isLoading: boolean
  children: React.ReactNode
  fallback?: React.ReactNode
  variant?: 'card' | 'table' | 'list'
}

export function LoadingBoundary({
  isLoading,
  children,
  fallback,
  variant = 'card',
}: LoadingBoundaryProps) {
  if (!isLoading) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  if (variant === 'table') {
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-8 w-[150px]" />
          <Skeleton className="h-8 w-[250px]" />
        </div>
        <div className="border rounded-md p-4 space-y-4 bg-card border-border">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </div>
    )
  }

  if (variant === 'list') {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/3" />
            </div>
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
        ))}
      </div>
    )
  }

  // default 'card' skeleton
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-border bg-card rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  )
}
