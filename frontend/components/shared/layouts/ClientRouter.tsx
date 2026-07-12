'use client'

import React, { useState, useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/shared/layouts/ProtectedRoute'
import { DashboardLayout } from '@/components/shared/layouts/DashboardLayout'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { VehiclesPage } from '@/features/vehicles/pages/VehiclesPage'
import { DriversPage } from '@/features/drivers/pages/DriversPage'
import { TripsPage } from '@/features/trips/pages/TripsPage'
import { MaintenancePage } from '@/features/maintenance/pages/MaintenancePage'
import { FuelPage } from '@/features/fuel/pages/FuelPage'
import { ExpensesPage } from '@/features/expenses/pages/ExpensesPage'
import { ReportsPage } from '@/features/reports/pages/ReportsPage'
import { DesignSystemPage } from '@/features/design-system/pages/DesignSystemPage'
import { AiDispatchPage } from '@/features/trips/pages/AiDispatchPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'
import { useAuth } from '@/hooks/useAuth'
import { AccessDeniedPage } from '@/components/shared/layouts/AccessDeniedPage'
import { DriverDashboard } from '@/features/drivers/pages/DriverDashboard'
import { DriverMyTrips } from '@/features/drivers/pages/DriverMyTrips'
import { DriverVehicle } from '@/features/drivers/pages/DriverVehicle'
import { DriverHistory } from '@/features/drivers/pages/DriverHistory'
import { DriverProfile } from '@/features/drivers/pages/DriverProfile'

export function ClientRouter() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-svh w-full items-center justify-center p-8 bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <div className="text-xs text-muted-foreground font-medium">Loading operations center...</div>
        </div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<IndexRedirect />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="vehicles" element={<VehiclesPage />} />
            <Route path="drivers" element={<DriversPage />} />
            <Route path="trips" element={<TripsPage />} />
            <Route path="maintenance" element={<MaintenancePage />} />
            <Route path="fuel" element={<FuelPage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="ai-dispatch" element={<AiDispatchPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="design-system" element={<DesignSystemPage />} />
            
            {/* Placeholder dashboards for non-admin roles */}
            <Route path="driver-dashboard" element={<DriverDashboard />} />
            <Route path="driver-my-trips" element={<DriverMyTrips />} />
            <Route path="driver-vehicle" element={<DriverVehicle />} />
            <Route path="driver-history" element={<DriverHistory />} />
            <Route path="driver-profile" element={<DriverProfile />} />
            <Route path="safety-dashboard" element={<PlaceholderDashboard title="Safety Dashboard" />} />
            <Route path="finance-dashboard" element={<PlaceholderDashboard title="Finance Dashboard" />} />
            
            {/* Access Denied Route */}
            <Route path="access-denied" element={<AccessDeniedPage />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}

function PlaceholderDashboard({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-[50vh] text-center p-8 bg-card border border-border/45 rounded-[20px] shadow-premium-sm">
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <svg className="size-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          This module is under development.
        </p>
      </div>
    </div>
  )
}

function IndexRedirect() {
  const { user } = useAuth()
  if (user?.role === 'Driver') {
    return <Navigate to="/driver-dashboard" replace />
  }
  return <Navigate to="/dashboard" replace />
}
