'use client'

import * as React from 'react'
import { FoundationsSection } from '@/components/showcase/sections/foundations'
import { ButtonsSection } from '@/components/showcase/sections/buttons'
import { FormsSection } from '@/components/showcase/sections/forms'
import { DataDisplaySection } from '@/components/showcase/sections/data-display'
import { FeedbackSection } from '@/components/showcase/sections/feedback'
import { ChartsSection } from '@/components/showcase/sections/charts'
import { DESIGN_SYSTEM_NAV_ITEMS, APP_NAME } from '@/constants'
import { cn } from '@/utils'

export function DesignSystemPage() {
  const [active, setActive] = React.useState(DESIGN_SYSTEM_NAV_ITEMS[0]?.id)

  // Scroll-spy to highlight active sub-section in page navigation
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        })
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
    )

    DESIGN_SYSTEM_NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleNav = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="space-y-8">
      {/* Header and Sub-navigation */}
      <div className="flex flex-col gap-4 border-b border-border pb-5 sticky top-16 bg-background/95 backdrop-blur-md z-20 pt-2">
        <div className="flex flex-col gap-1">
          <div className="flex w-fit items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-success" />
            {APP_NAME} &middot; Brand Guidelines
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {APP_NAME} Design System
          </h1>
          <p className="max-w-2xl text-pretty leading-relaxed text-muted-foreground text-sm">
            A cohesive, enterprise-grade component library for building transport operations software.
            All components are responsive, support dark mode, and share design tokens.
          </p>
        </div>

        {/* Quick scroll sub-nav */}
        <div className="flex flex-wrap gap-1.5 border-t border-border pt-3">
          {DESIGN_SYSTEM_NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => handleNav(id)}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                active === id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Sections Container */}
      <div className="flex flex-col gap-16">
        <FoundationsSection />
        <ButtonsSection />
        <FormsSection />
        <DataDisplaySection />
        <FeedbackSection />
        <ChartsSection />
      </div>

      <footer className="mt-16 border-t border-border pt-6 pb-4">
        <p className="text-xs text-muted-foreground">
          {APP_NAME} Design System &middot; Built with Next.js, Tailwind CSS, and shadcn/ui.
        </p>
      </footer>
    </div>
  )
}
