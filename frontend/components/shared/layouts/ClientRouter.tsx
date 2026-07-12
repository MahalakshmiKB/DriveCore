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

// Driver pages
import { DriverDashboard } from '@/features/drivers/pages/DriverDashboard'
import { DriverMyTrips } from '@/features/drivers/pages/DriverMyTrips'
import { DriverVehicle } from '@/features/drivers/pages/DriverVehicle'
import { DriverHistory } from '@/features/drivers/pages/DriverHistory'
import { DriverProfile } from '@/features/drivers/pages/DriverProfile'

// Safety Officer pages
import { SafetyDashboard } from '@/features/safety/pages/SafetyDashboard'
import { SafetyDriversPage } from '@/features/safety/pages/SafetyDriversPage'
import { SafetyLicensePage } from '@/features/safety/pages/SafetyLicensePage'
import { SafetyIncidentsPage } from '@/features/safety/pages/SafetyIncidentsPage'
import { SafetyReportsPage } from '@/features/safety/pages/SafetyReportsPage'
import { SafetyProfilePage } from '@/features/safety/pages/SafetyProfilePage'

// Financial Analyst pages
import { FinanceDashboard } from '@/features/finance/pages/FinanceDashboard'
import { FinanceExpensesPage } from '@/features/finance/pages/FinanceExpensesPage'
import { FinanceFuelPage } from '@/features/finance/pages/FinanceFuelPage'
import { FinanceReportsPage } from '@/features/finance/pages/FinanceReportsPage'
import { FinanceAnalyticsPage } from '@/features/finance/pages/FinanceAnalyticsPage'
import { FinanceProfilePage } from '@/features/finance/pages/FinanceProfilePage'

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

            {/* Fleet Manager routes */}
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

            {/* Driver routes */}
            <Route path="driver-dashboard" element={<DriverDashboard />} />
            <Route path="driver-my-trips" element={<DriverMyTrips />} />
            <Route path="driver-vehicle" element={<DriverVehicle />} />
            <Route path="driver-history" element={<DriverHistory />} />
            <Route path="driver-profile" element={<DriverProfile />} />

            {/* Safety Officer routes */}
            <Route path="safety-dashboard" element={<SafetyDashboard />} />
            <Route path="safety-drivers" element={<SafetyDriversPage />} />
            <Route path="safety-licenses" element={<SafetyLicensePage />} />
            <Route path="safety-incidents" element={<SafetyIncidentsPage />} />
            <Route path="safety-reports" element={<SafetyReportsPage />} />
            <Route path="safety-profile" element={<SafetyProfilePage />} />

            {/* Financial Analyst routes */}
            <Route path="finance-dashboard" element={<FinanceDashboard />} />
            <Route path="finance-expenses" element={<FinanceExpensesPage />} />
            <Route path="finance-fuel" element={<FinanceFuelPage />} />
            <Route path="finance-reports" element={<FinanceReportsPage />} />
            <Route path="finance-analytics" element={<FinanceAnalyticsPage />} />
            <Route path="finance-profile" element={<FinanceProfilePage />} />

            {/* Access Denied */}
            <Route path="access-denied" element={<AccessDeniedPage />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}

function IndexRedirect() {
  const { user } = useAuth()
  if (user?.role === 'Driver') return <Navigate to="/driver-dashboard" replace />
  if (user?.role === 'Safety Officer') return <Navigate to="/safety-dashboard" replace />
  if (user?.role === 'Financial Analyst') return <Navigate to="/finance-dashboard" replace />
  return <Navigate to="/dashboard" replace />
}

