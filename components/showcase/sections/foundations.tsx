import { Section, Subsection } from '@/components/showcase/section'

interface Swatch {
  name: string
  token: string
  className: string
  border?: boolean
}

const brandSwatches: Swatch[] = [
  { name: 'Primary', token: 'bg-primary', className: 'bg-primary' },
  { name: 'Accent (Amber)', token: 'bg-accent-brand', className: 'bg-accent-brand' },
  { name: 'Foreground', token: 'bg-foreground', className: 'bg-foreground' },
  { name: 'Background', token: 'bg-background', className: 'bg-background', border: true },
  { name: 'Card', token: 'bg-card', className: 'bg-card', border: true },
  { name: 'Muted', token: 'bg-muted', className: 'bg-muted', border: true },
  { name: 'Border', token: 'bg-border', className: 'bg-border' },
]

const statusSwatches: Swatch[] = [
  { name: 'Success', token: 'bg-success', className: 'bg-success' },
  { name: 'Warning', token: 'bg-warning', className: 'bg-warning' },
  { name: 'Info', token: 'bg-info', className: 'bg-info' },
  { name: 'Destructive', token: 'bg-destructive', className: 'bg-destructive' },
]

const chartSwatches: Swatch[] = [
  { name: 'Chart 1', token: 'bg-chart-1', className: 'bg-chart-1' },
  { name: 'Chart 2', token: 'bg-chart-2', className: 'bg-chart-2' },
  { name: 'Chart 3', token: 'bg-chart-3', className: 'bg-chart-3' },
  { name: 'Chart 4', token: 'bg-chart-4', className: 'bg-chart-4' },
  { name: 'Chart 5', token: 'bg-chart-5', className: 'bg-chart-5' },
]

function SwatchGrid({ swatches }: { swatches: Swatch[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {swatches.map((s) => (
        <div
          key={s.name}
          className="overflow-hidden rounded-lg border border-border bg-card"
        >
          <div
            className={`h-16 w-full ${s.className} ${s.border ? 'border-b border-border' : ''}`}
          />
          <div className="flex flex-col gap-0.5 px-3 py-2">
            <span className="text-sm font-medium text-foreground">{s.name}</span>
            <span className="font-mono text-[11px] text-muted-foreground">
              {s.token}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

const typeScale = [
  { label: 'Display', className: 'text-4xl font-semibold tracking-tight', sample: 'Fleet operations at a glance' },
  { label: 'Heading 1', className: 'text-2xl font-semibold tracking-tight', sample: 'Vehicle Registry' },
  { label: 'Heading 2', className: 'text-lg font-semibold', sample: 'Active Dispatches' },
  { label: 'Body', className: 'text-sm leading-relaxed', sample: 'Register a vehicle, assign a driver, then validate and dispatch the trip.' },
  { label: 'Caption', className: 'text-xs text-muted-foreground', sample: 'Last updated 2 minutes ago' },
]

export function FoundationsSection() {
  return (
    <Section
      id="foundations"
      title="Foundations"
      description="Color palette and typography — the tokens every DriveCore component is built on. Toggle the theme in the top bar to preview light and dark."
    >
      <div className="flex flex-col gap-8">
        <Subsection title="Brand & Neutrals">
          <SwatchGrid swatches={brandSwatches} />
        </Subsection>

        <Subsection title="Status (Functional)">
          <SwatchGrid swatches={statusSwatches} />
        </Subsection>

        <Subsection title="Data Visualization">
          <SwatchGrid swatches={chartSwatches} />
        </Subsection>

        <Subsection title="Typography — Geist Sans / Geist Mono">
          <div className="flex flex-col divide-y divide-border rounded-lg border border-border bg-card">
            {typeScale.map((t) => (
              <div
                key={t.label}
                className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <span className="w-24 shrink-0 font-mono text-[11px] text-muted-foreground">
                  {t.label}
                </span>
                <span className={`text-foreground text-pretty ${t.className}`}>
                  {t.sample}
                </span>
              </div>
            ))}
          </div>
        </Subsection>
      </div>
    </Section>
  )
}
