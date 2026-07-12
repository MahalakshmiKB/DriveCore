import {
  DownloadIcon,
  Loader2Icon,
  PlusIcon,
  TrashIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Section, Subsection } from '@/components/showcase/section'

export function ButtonsSection() {
  return (
    <Section
      id="buttons"
      title="Buttons"
      description="Action hierarchy for the platform — variants, sizes, icon affordances, and states."
    >
      <div className="flex flex-col gap-8">
        <Subsection title="Variants">
          <div className="flex flex-wrap items-center gap-3">
            <Button>Dispatch trip</Button>
            <Button variant="secondary">Save draft</Button>
            <Button variant="outline">Filter</Button>
            <Button variant="ghost">Cancel</Button>
            <Button variant="destructive">Retire vehicle</Button>
            <Button variant="link">View details</Button>
          </div>
        </Subsection>

        <Subsection title="Sizes">
          <div className="flex flex-wrap items-center gap-3">
            <Button size="xs">Extra small</Button>
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </Subsection>

        <Subsection title="With icons">
          <div className="flex flex-wrap items-center gap-3">
            <Button>
              <PlusIcon data-icon="inline-start" />
              New vehicle
            </Button>
            <Button variant="outline">
              <DownloadIcon data-icon="inline-start" />
              Export CSV
            </Button>
            <Button variant="destructive">
              <TrashIcon data-icon="inline-start" />
              Delete
            </Button>
            <Button size="icon" variant="outline" aria-label="Add">
              <PlusIcon />
            </Button>
          </div>
        </Subsection>

        <Subsection title="States">
          <div className="flex flex-wrap items-center gap-3">
            <Button disabled>Disabled</Button>
            <Button variant="outline" disabled>
              <Loader2Icon data-icon="inline-start" className="animate-spin" />
              Dispatching…
            </Button>
          </div>
        </Subsection>
      </div>
    </Section>
  )
}
