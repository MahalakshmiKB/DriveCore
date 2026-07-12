'use client'

import React, { useState } from 'react'
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen w-full bg-muted/30 p-2 sm:p-3 lg:p-4 flex gap-4 text-foreground antialiased dark:bg-background/10 bg-[radial-gradient(circle_at_top_right,oklch(var(--primary)/0.03),transparent_40%),radial-gradient(circle_at_bottom_left,oklch(var(--primary)/0.015),transparent_40%)]">
      
      {/* Sidebar - Floating Arc style */}
      <aside
        className={cn(
          'fixed inset-y-4 left-4 z-50 flex w-64 flex-col bg-card/65 backdrop-blur-xl border border-border/40 shadow-premium-sm rounded-[20px] transition-all duration-300 lg:translate-x-0',
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
              const { path, label, icon: Icon } = item
              const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path))

              return (
                <li key={path}>
                  <Link
                    to={path}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer active:scale-[0.98]',
                      isActive
                        ? 'bg-gradient-to-r from-primary/12 to-primary/4 text-primary border border-primary/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] rounded-xl'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    {label}
                  </Link>
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
                onClick={() => navigate('/settings')}
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
      <div className="flex-1 min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-1.5rem)] min-h-[calc(100vh-1rem)] flex flex-col bg-background border border-border/45 rounded-[20px] shadow-premium-sm dark:bg-card lg:ml-72">
        
        {/* Header - Glassmorphic Navbar */}
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-black/5 dark:border-white/10 bg-background/70 backdrop-blur-md px-6 rounded-t-[20px] dark:bg-card/50">
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
    </div>
  )
}

