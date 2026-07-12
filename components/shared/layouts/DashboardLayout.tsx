'use client'

import * as React from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import {
  MenuIcon,
  SearchIcon,
  BellIcon,
  XIcon,
  TruckIcon,
  LogOutIcon,
  WrenchIcon,
  FuelIcon,
  DollarSignIcon,
  BarChart3Icon,
  SettingsIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
  DownloadIcon,
  SlidersIcon,
  FileTextIcon,
  LayersIcon,
} from 'lucide-react'

import { cn } from '@/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'
import { useAuth } from '@/hooks/useAuth'
import { NAV_ITEMS, APP_NAME, APP_SUBTITLE } from '@/constants'
import { toast } from 'sonner'

export function DashboardLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [activeDrawer, setActiveDrawer] = React.useState<'maintenance' | 'fuel' | 'expenses' | 'reports' | 'settings' | null>(null)
  const [notificationsOpen, setNotificationsOpen] = React.useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleNavItemClick = (item: typeof NAV_ITEMS[number]) => {
    setMobileOpen(false)
    if (item.isDrawer) {
      setActiveDrawer(item.path.slice(1) as any)
    } else {
      setActiveDrawer(null)
      navigate(item.path)
    }
  }

  return (
    <div className="min-h-screen w-full bg-muted/40 p-2 sm:p-3 lg:p-4 flex gap-4 text-foreground antialiased dark:bg-background/20">
      
      {/* Sidebar - Floating Arc style */}
      <aside
        className={cn(
          'fixed inset-y-4 left-4 z-50 flex w-64 flex-col bg-card/65 backdrop-blur-xl border border-border/40 shadow-xl rounded-2xl transition-all duration-300 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-[110%] lg:translate-x-0',
        )}
      >
        {/* Brand header */}
        <div className="flex h-16 items-center gap-2.5 px-6 border-b border-border/20">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_1px_3px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.2)]">
            <TruckIcon className="size-5" />
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight">{APP_NAME}</span>
            <span className="text-[10px] text-muted-foreground font-semibold mt-0.5 uppercase tracking-wider">
              Fleet Operations
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            className="ml-auto hover:bg-muted/80 lg:hidden"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          >
            <XIcon className="size-4" />
          </Button>
        </div>

        {/* Sidebar Menu items */}
        <nav className="flex-1 overflow-y-auto px-4 py-5 scrollbar-thin">
          <p className="px-2 pb-2 text-[10px] font-bold tracking-wider text-muted-foreground/60 uppercase">
            Operations Menu
          </p>
          <ul className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const { path, label, icon: Icon, isDrawer } = item
              const isActive = isDrawer 
                ? activeDrawer === path.slice(1)
                : location.pathname === path || (path !== '/' && location.pathname.startsWith(path) && !activeDrawer)

              return (
                <li key={path}>
                  <button
                    onClick={() => handleNavItemClick(item)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer active:scale-[0.98]',
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-[0_2px_8px_-2px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.1)]'
                        : 'text-muted-foreground hover:bg-muted/65 hover:text-foreground',
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {label}
                    {isDrawer && (
                      <span className="ml-auto size-1.5 rounded-full bg-primary-foreground/30" />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Profile Footer */}
        <div className="border-t border-border/20 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-muted/30 border border-border/10 p-2 shadow-sm">
            <Avatar className="size-8.5 rounded-lg border border-border/40 shadow-sm">
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                {user?.avatarFallback || 'AM'}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col leading-tight flex-1">
              <span className="truncate text-xs font-bold text-foreground">{user?.name || 'Ava Monroe'}</span>
              <span className="truncate text-[10px] font-semibold text-muted-foreground/80 mt-0.5">
                {user?.role || 'Fleet Manager'}
              </span>
            </div>
            <div className="flex gap-0.5">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setActiveDrawer('settings')}
                className="hover:bg-muted/70 text-muted-foreground hover:text-foreground"
                title="Settings"
              >
                <SettingsIcon className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleLogout}
                className="hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                title="Logout"
              >
                <LogOutIcon className="size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-background/55 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Container - Padded Arc Floating Panel */}
      <div className="flex-1 min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-1.5rem)] min-h-[calc(100vh-1rem)] flex flex-col bg-background border border-border/40 rounded-2xl shadow-xl dark:bg-card lg:ml-72">
        
        {/* Header - Glassmorphic Navbar */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border/30 bg-background/60 backdrop-blur-md px-6 rounded-t-2xl dark:bg-card/50">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="lg:hidden"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon className="size-4" />
            </Button>
            <div className="relative hidden max-w-sm sm:block">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground/70" />
              <input
                type="search"
                placeholder="Search dispatches, drivers..."
                className="h-8.5 w-64 rounded-xl border border-border/40 bg-muted/40 pr-3 pl-9 text-xs outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary/80 focus:bg-background/80 focus:ring-2 focus:ring-primary/20 dark:bg-muted/10 dark:focus:bg-card"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications Button */}
            <div className="relative">
              <Button
                variant="outline"
                size="icon-sm"
                aria-label="Notifications"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className={cn("rounded-xl transition-all", notificationsOpen && "bg-muted")}
              >
                <BellIcon className="size-4" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 size-4 min-w-4 rounded-full p-0 text-[9px] font-bold shadow-[0_0_0_2px_var(--background)] flex items-center justify-center"
                >
                  3
                </Badge>
              </Button>

              {/* Notifications Popover */}
              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 top-10 z-40 w-80 rounded-2xl border border-border/40 bg-card p-4 shadow-xl animate-in fade-in-0 slide-in-from-top-2 duration-200">
                    <div className="flex items-center justify-between border-b border-border/20 pb-2 mb-3">
                      <span className="text-xs font-bold text-foreground">Alerts Hub</span>
                      <span className="text-[10px] text-muted-foreground/80 font-medium hover:underline cursor-pointer">Clear all</span>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-start gap-2.5 rounded-lg bg-muted/30 p-2 text-[11px] leading-snug">
                        <AlertTriangleIcon className="size-4 text-warning shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold">CA-4431</span> requires immediate engine oil audit.
                          <div className="text-[9px] text-muted-foreground mt-0.5">2 mins ago</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 rounded-lg bg-muted/30 p-2 text-[11px] leading-snug">
                        <CheckCircle2Icon className="size-4 text-success shrink-0 mt-0.5" />
                        <div>
                          Trip <span className="font-bold">t-884a</span> successfully completed.
                          <div className="text-[9px] text-muted-foreground mt-0.5">15 mins ago</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5 rounded-lg bg-muted/30 p-2 text-[11px] leading-snug">
                        <AlertTriangleIcon className="size-4 text-destructive shrink-0 mt-0.5" />
                        <div>
                          Driver safety rating dropped below <span className="font-bold">80</span>.
                          <div className="text-[9px] text-muted-foreground mt-0.5">1 hour ago</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <ThemeToggle />
          </div>
        </header>

        {/* Page Content View */}
        <main className="flex-1 px-6 py-6 lg:px-8 bg-background dark:bg-card rounded-b-2xl">
          <Outlet />
        </main>
      </div>

      {/* Slide-out drawers for extra screens (Maintenance, Fuel logs, Expenses, Reports, Settings) */}
      {activeDrawer && (
        <>
          {/* Overlay background */}
          <div 
            className="fixed inset-0 bg-background/55 backdrop-blur-xs z-50 transition-opacity duration-300"
            onClick={() => setActiveDrawer(null)}
          />
          {/* Drawer Wrapper */}
          <div className="fixed inset-y-4 right-4 z-50 w-full max-w-md bg-card/90 backdrop-blur-xl border border-border/40 shadow-2xl rounded-2xl flex flex-col p-6 animate-in slide-in-from-right duration-300 dark:bg-card">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/20 pb-4 mb-5">
              <h3 className="text-sm font-bold text-foreground capitalize flex items-center gap-2 tracking-tight">
                {activeDrawer === 'maintenance' && <WrenchIcon className="size-4 text-primary" />}
                {activeDrawer === 'fuel' && <FuelIcon className="size-4 text-primary" />}
                {activeDrawer === 'expenses' && <DollarSignIcon className="size-4 text-primary" />}
                {activeDrawer === 'reports' && <BarChart3Icon className="size-4 text-primary" />}
                {activeDrawer === 'settings' && <SettingsIcon className="size-4 text-primary" />}
                {activeDrawer} Dashboard
              </h3>
              <Button variant="ghost" size="icon-sm" className="rounded-lg" onClick={() => setActiveDrawer(null)}>
                <XIcon className="size-4" />
              </Button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto pr-1 space-y-5 scrollbar-thin">
              
              {/* MAINTENANCE DRAWER */}
              {activeDrawer === 'maintenance' && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    View active service tickets and schedule preventive inspections for vehicle assets.
                  </p>
                  <div className="space-y-2.5">
                    <div className="p-3 border border-border/40 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">TX-8921</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-warning px-1.5 py-0.5 bg-warning-muted/25 rounded-md border border-warning/10">In Shop</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5">Engine Diagnostics & Tuning</p>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground/80 mt-2">
                        <span>Est: $450.00</span>
                        <span>Opened: Today</span>
                      </div>
                    </div>
                    <div className="p-3 border border-border/40 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">CA-4431</span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-success px-1.5 py-0.5 bg-success-muted/25 rounded-md border border-success/10">Scheduled</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5">Brake Pads Replacement</p>
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground/80 mt-2">
                        <span>Est: $210.00</span>
                        <span>Scheduled: Oct 15</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-4" size="sm" onClick={() => toast.success("Maintenance scheduler opened")}>
                    Create Work Order
                  </Button>
                </div>
              )}

              {/* FUEL DRAWER */}
              {activeDrawer === 'fuel' && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Logs of energy refills and average efficiency metrics across the active fleet.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-border/30 rounded-xl bg-muted/20">
                      <div>
                        <div className="text-xs font-bold text-foreground">FL-5542</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">Shell Station #41</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-foreground">52.0 Gal</div>
                        <div className="text-[10px] text-success font-semibold mt-0.5">11.8 mpg</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-border/30 rounded-xl bg-muted/20">
                      <div>
                        <div className="text-xs font-bold text-foreground">TX-8921</div>
                        <div className="text-[10px] text-muted-foreground mt-0.5">BP Fuel Stop #12</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-foreground">45.2 Gal</div>
                        <div className="text-[10px] text-success font-semibold mt-0.5">12.4 mpg</div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="p-3 border border-border/40 rounded-xl bg-muted/20 text-center">
                      <div className="text-[10px] uppercase font-bold text-muted-foreground/80">Avg MPG</div>
                      <div className="text-lg font-bold text-foreground mt-1">12.1</div>
                    </div>
                    <div className="p-3 border border-border/40 rounded-xl bg-muted/20 text-center">
                      <div className="text-[10px] uppercase font-bold text-muted-foreground/80">Avg Gal Price</div>
                      <div className="text-lg font-bold text-foreground mt-1">$3.15</div>
                    </div>
                  </div>
                </div>
              )}

              {/* EXPENSES DRAWER */}
              {activeDrawer === 'expenses' && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Current month expenses breakdown across operations.
                  </p>
                  <div className="divide-y divide-border/20">
                    <div className="flex justify-between py-2.5">
                      <span className="text-xs text-muted-foreground">Fuel Refills</span>
                      <span className="text-xs font-bold text-foreground">$92,400.00</span>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span className="text-xs text-muted-foreground">Preventive Maintenance</span>
                      <span className="text-xs font-bold text-foreground">$24,800.00</span>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span className="text-xs text-muted-foreground">Driver Salaries</span>
                      <span className="text-xs font-bold text-foreground">$120,500.00</span>
                    </div>
                    <div className="flex justify-between py-2.5">
                      <span className="text-xs text-muted-foreground">Fleet Insurance</span>
                      <span className="text-xs font-bold text-foreground">$18,000.00</span>
                    </div>
                  </div>
                  <div className="border-t border-border/30 pt-3 flex justify-between items-center mt-4">
                    <span className="text-xs font-bold text-foreground">Total Budget Spent</span>
                    <span className="text-sm font-extrabold text-primary">$255,700.00</span>
                  </div>
                </div>
              )}

              {/* REPORTS DRAWER */}
              {activeDrawer === 'reports' && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Operational analytics reports ready for dispatch and audit.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border border-border/40 rounded-xl bg-muted/20 hover:bg-muted/40 transition-all cursor-pointer">
                      <div className="flex items-center gap-2">
                        <FileTextIcon className="size-4 text-primary" />
                        <span className="text-xs font-semibold">Q2 Fuel Efficiency Audit</span>
                      </div>
                      <Button variant="ghost" size="icon-xs" onClick={() => toast.success("File downloading started")}>
                        <DownloadIcon className="size-3.5" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-border/40 rounded-xl bg-muted/20 hover:bg-muted/40 transition-all cursor-pointer">
                      <div className="flex items-center gap-2">
                        <FileTextIcon className="size-4 text-primary" />
                        <span className="text-xs font-semibold">June Dispatch Records</span>
                      </div>
                      <Button variant="ghost" size="icon-xs" onClick={() => toast.success("File downloading started")}>
                        <DownloadIcon className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                  <Button className="w-full mt-4" size="sm" onClick={() => toast.success("Report builder launched")}>
                    Build Custom Report
                  </Button>
                </div>
              )}

              {/* SETTINGS DRAWER */}
              {activeDrawer === 'settings' && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">
                    Customize operations center settings, integration keys, and display preferences.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-foreground">Alert Hub Notifications</div>
                        <div className="text-[10px] text-muted-foreground">Receive real-time push dispatches</div>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded border-border text-primary focus:ring-primary size-4" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-foreground">API Integrations</div>
                        <div className="text-[10px] text-muted-foreground">Enable Webhooks & Fleet GPS SDK</div>
                      </div>
                      <input type="checkbox" className="rounded border-border text-primary focus:ring-primary size-4" />
                    </div>
                  </div>
                  <div className="border-t border-border/30 pt-4 mt-6">
                    <Button className="w-full" size="sm" onClick={() => {
                      toast.success("Settings saved successfully")
                      setActiveDrawer(null)
                    }}>
                      Save Configurations
                    </Button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </>
      )}
    </div>
  )
}

