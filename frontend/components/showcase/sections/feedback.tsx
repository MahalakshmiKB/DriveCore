'use client'

import { toast } from 'sonner'
import {
  CheckCircle2Icon,
  InboxIcon,
  InfoIcon,
  OctagonAlertIcon,
  PlusIcon,
  TriangleAlertIcon,
  WrenchIcon,
} from 'lucide-react'

import { Section, Subsection } from '@/components/showcase/section'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

export function FeedbackSection() {
  return (
    <Section
      id="feedback"
      title="Feedback & Navigation"
      description="Alerts, toasts, dialogs, tabs, breadcrumbs, loading, and empty states."
    >
      <div className="flex flex-col gap-8">
        <Subsection title="Breadcrumbs">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Vehicles</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>MH-12-AB-1234</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Subsection>

        <Subsection title="Tabs">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trips">Trips</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="pt-3 text-sm text-muted-foreground">
              Fleet-wide KPIs, utilization, and cost summaries.
            </TabsContent>
            <TabsContent value="trips" className="pt-3 text-sm text-muted-foreground">
              Dispatch history and active deliveries for this vehicle.
            </TabsContent>
            <TabsContent value="maintenance" className="pt-3 text-sm text-muted-foreground">
              Open and resolved maintenance logs, with in-shop status locks.
            </TabsContent>
          </Tabs>
        </Subsection>

        <Subsection title="Alerts">
          <div className="grid gap-3 lg:grid-cols-2">
            <Alert className="border-success/30 text-success [&>svg]:text-success">
              <CheckCircle2Icon />
              <AlertTitle>Trip dispatched</AlertTitle>
              <AlertDescription>
                Vehicle and driver are now marked On Trip.
              </AlertDescription>
            </Alert>
            <Alert className="border-warning/40 text-warning-foreground [&>svg]:text-warning">
              <TriangleAlertIcon />
              <AlertTitle>License expiring soon</AlertTitle>
              <AlertDescription>
                Driver Liam Carter&apos;s license expires in 12 days.
              </AlertDescription>
            </Alert>
            <Alert className="border-info/30 text-info [&>svg]:text-info">
              <InfoIcon />
              <AlertTitle>Scheduled maintenance</AlertTitle>
              <AlertDescription>
                3 vehicles are due for servicing this week.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive" className="border-destructive/30">
              <OctagonAlertIcon />
              <AlertTitle>Dispatch blocked</AlertTitle>
              <AlertDescription>
                Cargo weight exceeds the vehicle&apos;s max load capacity.
              </AlertDescription>
            </Alert>
          </div>
        </Subsection>

        <Subsection title="Toasts">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => toast.success('Trip completed. Vehicle now Available.')}
            >
              Success
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast.warning('License expires in 12 days.', {
                  description: 'Renew before the next dispatch.',
                })
              }
            >
              Warning
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.info('Daily reminder job completed.')}
            >
              Info
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast.error('Dispatch failed — driver is Suspended.', {
                  action: { label: 'Retry', onClick: () => {} },
                })
              }
            >
              Error
            </Button>
          </div>
        </Subsection>

        <div className="grid gap-8 lg:grid-cols-2">
          <Subsection title="Dialog & tooltip">
            <div className="flex flex-wrap items-center gap-3">
              <Dialog>
                <DialogTrigger
                  render={
                    <Button variant="outline">
                      <WrenchIcon data-icon="inline-start" />
                      Log maintenance
                    </Button>
                  }
                />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Log maintenance</DialogTitle>
                    <DialogDescription>
                      Opening an active record sets the vehicle status to In Shop.
                    </DialogDescription>
                  </DialogHeader>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="desc">Description</FieldLabel>
                      <Input id="desc" placeholder="Brake pad replacement" />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="cost">Estimated cost</FieldLabel>
                      <Input id="cost" type="number" placeholder="0.00" />
                    </Field>
                  </FieldGroup>
                  <DialogFooter>
                    <DialogClose render={<Button variant="ghost" />}>
                      Cancel
                    </DialogClose>
                    <DialogClose
                      render={<Button />}
                      onClick={() => toast.success('Maintenance record opened.')}
                    >
                      Open record
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger
                    render={<Button variant="outline">Hover for info</Button>}
                  />
                  <TooltipContent>
                    Retired &amp; In Shop vehicles are hidden from dispatch.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </Subsection>

          <Subsection title="Loading skeleton">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
          </Subsection>
        </div>

        <Subsection title="Empty state">
          <Empty className="border border-border bg-card">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <InboxIcon />
              </EmptyMedia>
              <EmptyTitle>No trips yet</EmptyTitle>
              <EmptyDescription>
                Create a trip draft, validate capacity and availability, then
                dispatch it to your fleet.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button>
                <PlusIcon data-icon="inline-start" />
                Create trip
              </Button>
            </EmptyContent>
          </Empty>
        </Subsection>
      </div>
    </Section>
  )
}
