'use client'

import { LayoutGridIcon, ListIcon, MapIcon, SearchIcon } from 'lucide-react'

import { Section, Subsection } from '@/components/showcase/section'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'

export function FormsSection() {
  return (
    <Section
      id="forms"
      title="Inputs & Forms"
      description="Form controls composed with Field for labels, descriptions, and validation states."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <Subsection title="Text fields">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="reg">Registration number</FieldLabel>
              <Input id="reg" placeholder="MH-12-AB-1234" defaultValue="MH-12-AB-1234" />
              <FieldDescription>Must be unique across the fleet.</FieldDescription>
            </Field>

            <Field data-invalid>
              <FieldLabel htmlFor="capacity">Max load capacity (kg)</FieldLabel>
              <Input id="capacity" type="number" defaultValue={-500} aria-invalid />
              <FieldError>Capacity must be greater than 0.</FieldError>
            </Field>

            <Field data-disabled>
              <FieldLabel htmlFor="vin">VIN (locked)</FieldLabel>
              <Input id="vin" defaultValue="1HGCM82633A004352" disabled />
            </Field>
          </FieldGroup>
        </Subsection>

        <Subsection title="Select & textarea">
          <FieldGroup>
            <Field>
              <FieldLabel>Assign driver</FieldLabel>
              <Select defaultValue="ava">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="ava">Ava Monroe</SelectItem>
                    <SelectItem value="liam">Liam Carter</SelectItem>
                    <SelectItem value="noah">Noah Blake</SelectItem>
                    <SelectItem value="mia">Mia Torres</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel htmlFor="notes">Dispatch notes</FieldLabel>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Handling instructions, route constraints, cargo details…"
              />
            </Field>
          </FieldGroup>
        </Subsection>

        <Subsection title="Search bar">
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search vehicles by plate, model, or region…" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton variant="default" size="xs">
                Search
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Subsection>

        <Subsection title="View toggle">
          <ToggleGroup defaultValue={['grid']} variant="outline" spacing={0}>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGridIcon data-icon="inline-start" />
              Grid
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <ListIcon data-icon="inline-start" />
              List
            </ToggleGroupItem>
            <ToggleGroupItem value="map" aria-label="Map view">
              <MapIcon data-icon="inline-start" />
              Map
            </ToggleGroupItem>
          </ToggleGroup>
        </Subsection>

        <Subsection title="Checkbox & switch" className="lg:col-span-2">
          <FieldGroup className="sm:flex-row sm:gap-10">
            <Field orientation="horizontal">
              <Checkbox id="expired" defaultChecked />
              <FieldContent>
                <FieldLabel htmlFor="expired">Hide expired licenses</FieldLabel>
                <FieldDescription>
                  Exclude drivers who can&apos;t be dispatched.
                </FieldDescription>
              </FieldContent>
            </Field>

            <Field orientation="horizontal">
              <Switch id="reminders" defaultChecked />
              <FieldContent>
                <FieldLabel htmlFor="reminders">
                  License-expiry email reminders
                </FieldLabel>
                <FieldDescription>Daily digest at 08:00.</FieldDescription>
              </FieldContent>
            </Field>
          </FieldGroup>
        </Subsection>
      </div>
    </Section>
  )
}
