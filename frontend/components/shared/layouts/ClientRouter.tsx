'use client'

import * as React from 'react'
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

export function ClientRouter() {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
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
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="vehicles" element={<VehiclesPage />} />
            <Route path="drivers" element={<DriversPage />} />
            <Route path="trips" element={<TripsPage />} />
            <Route path="maintenance" element={<MaintenancePage />} />
            <Route path="fuel" element={<FuelPage />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="design-system" element={<DesignSystemPage />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}
