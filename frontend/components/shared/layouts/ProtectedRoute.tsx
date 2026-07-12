'use client'

import * as React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LoadingBoundary } from '@/components/shared/feedback/LoadingBoundary'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth()
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
    // Save the location they were trying to access to redirect them back after logging in
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
