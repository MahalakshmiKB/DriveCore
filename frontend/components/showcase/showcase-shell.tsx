'use client'

import React, { useState, useEffect } from 'react'
import {
  BarChart3Icon,
  BellIcon,
  BellRingIcon,
  LayersIcon,
  LayoutGridIcon,
  MenuIcon,
  MousePointerClickIcon,
  SearchIcon,
  TextCursorInputIcon,
  TruckIcon,
  XIcon,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/theme-toggle'

export interface ShellNavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

// Nav config lives in this Client Component so icon components never cross the
// server/client boundary (which would fail serialization).
const navItems: ShellNavItem[] = [
  { id: 'foundations', label: 'Foundations', icon: LayersIcon },
  { id: 'buttons', label: 'Buttons', icon: MousePointerClickIcon },
  { id: 'forms', label: 'Forms & Inputs', icon: TextCursorInputIcon },
  { id: 'data-display', label: 'Data Display', icon: LayoutGridIcon },
  { id: 'feedback', label: 'Feedback & Nav', icon: BellRingIcon },
  { id: 'charts', label: 'Charts', icon: BarChart3Icon },
]

export function ShowcaseShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive] = useState(navItems[0]?.id)

  // Scroll-spy to highlight the active section in the sidebar.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    navItems.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [navItems])

  const handleNav = (id: string) => {
    setMobileOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-svh bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
          <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <TruckIcon className="size-4.5" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">DriveCore</span>
            <span className="text-[11px] text-sidebar-foreground/60">
              Design System
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="ml-auto text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:hidden"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          >
            <XIcon />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-2 pb-2 text-[11px] font-medium tracking-wide text-sidebar-foreground/50 uppercase">
            Components
          </p>
          <ul className="flex flex-col gap-0.5">
            {navItems.map(({ id, label, icon: Icon }) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => handleNav(id)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors',
                    active === id
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
                  )}
                  aria-current={active === id ? 'true' : undefined}
                >
                  <Icon className="size-4 shrink-0" />
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
            <Avatar className="size-8">
              <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                AM
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-sm font-medium">Ava Monroe</span>
              <span className="truncate text-[11px] text-sidebar-foreground/60">
                Fleet Manager
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main column */}
      <div className="lg:pl-64">
        {/* Navbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </Button>

          <div className="relative hidden max-w-sm flex-1 sm:block">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search components, tokens…"
              className="h-9 w-full rounded-lg border border-input bg-muted/40 pr-3 pl-8.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              className="relative"
            >
              <BellIcon />
              <Badge
                variant="destructive"
                className="absolute -top-0.5 -right-0.5 size-4 min-w-4 rounded-full p-0 text-[10px]"
              >
                3
              </Badge>
            </Button>
            <ThemeToggle />
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
