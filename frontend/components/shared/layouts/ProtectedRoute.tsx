'use client'

import * as React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LoadingBoundary } from '@/components/shared/feedback/LoadingBoundary'

interface ProtectedRouteProps {
  children: React.ReactNode
}

// Paths that only Fleet Manager can access
const ADMIN_ONLY_PATHS = [
  '/dashboard',
  '/vehicles',
  '/drivers',
  '/trips',
  '/ai-dispatch',
  '/maintenance',
  '/fuel',
  '/expenses',
  '/reports',
  '/settings',
  '/design-system',
]

// Paths a Safety Officer cannot access
const SAFETY_BLOCKED_PATHS = [
  '/dashboard',
  '/vehicles',
  '/trips',
  '/ai-dispatch',
  '/fuel',
  '/expenses',
  '/settings',
]

// Paths a Financial Analyst cannot access
const FINANCE_BLOCKED_PATHS = [
  '/dashboard',
  '/vehicles',
  '/drivers',
  '/trips',
  '/ai-dispatch',
  '/maintenance',
  '/settings',
  '/safety-dashboard',
  '/safety-drivers',
  '/safety-licenses',
  '/safety-incidents',
  '/safety-reports',
  '/safety-profile',
]

function isBlocked(path: string, blockedPaths: string[]): boolean {
  return blockedPaths.some(p => path === p || path.startsWith(p + '/'))
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading, user } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex h-svh w-full items-center justify-center p-8">
        <div className="w-full max-w-lg space-y-4">
          <LoadingBoundary isLoading={true} variant="list">
            <div />
          </LoadingBoundary>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const role = user?.role

  if (role === 'Driver' && isBlocked(location.pathname, ADMIN_ONLY_PATHS)) {
    return <Navigate to="/access-denied" replace />
  }

  if (role === 'Safety Officer' && isBlocked(location.pathname, SAFETY_BLOCKED_PATHS)) {
    return <Navigate to="/access-denied" replace />
  }

  if (role === 'Financial Analyst' && isBlocked(location.pathname, FINANCE_BLOCKED_PATHS)) {
    return <Navigate to="/access-denied" replace />
  }

  return <>{children}</>
}

