'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
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

interface BaseFieldProps {
  label: string
  description?: string
  error?: string
  invalid?: boolean
  disabled?: boolean
}

interface FormInputProps extends React.ComponentProps<typeof Input>, BaseFieldProps {}

export function FormInput({
  label,
  description,
  error,
  invalid,
  disabled,
  id,
  ...props
}: FormInputProps) {
  const fieldId = id || React.useId()
  const isInvalid = !!error || invalid

  return (
    <Field data-invalid={isInvalid ? '' : undefined} data-disabled={disabled ? '' : undefined}>
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      <Input id={fieldId} disabled={disabled} aria-invalid={isInvalid} {...props} />
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}

interface FormTextareaProps extends React.ComponentProps<typeof Textarea>, BaseFieldProps {}

export function FormTextarea({
  label,
  description,
  error,
  invalid,
  disabled,
  id,
  ...props
}: FormTextareaProps) {
  const fieldId = id || React.useId()
  const isInvalid = !!error || invalid

  return (
    <Field data-invalid={isInvalid ? '' : undefined} data-disabled={disabled ? '' : undefined}>
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      <Textarea id={fieldId} disabled={disabled} aria-invalid={isInvalid} {...props} />
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}

interface FormSelectProps extends BaseFieldProps {
  options: { label: string; value: string }[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function FormSelect({
  label,
  description,
  error,
  invalid,
  disabled,
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Select an option',
  className,
}: FormSelectProps) {
  const isInvalid = !!error || invalid

  return (
    <Field data-invalid={isInvalid ? '' : undefined} data-disabled={disabled ? '' : undefined}>
      <FieldLabel>{label}</FieldLabel>
      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger className={className || 'w-full'}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {description && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}

interface FormToggleFieldProps extends BaseFieldProps {
  id?: string
  checked?: boolean
  defaultChecked?: boolean
  onCheckedChange?: (checked: boolean) => void
  type?: 'checkbox' | 'switch'
}

export function FormToggleField({
  label,
  description,
  error,
  invalid,
  disabled,
  id,
  checked,
  defaultChecked,
  onCheckedChange,
  type = 'checkbox',
}: FormToggleFieldProps) {
  const fieldId = id || React.useId()
  const isInvalid = !!error || invalid

  return (
    <Field
      orientation="horizontal"
      data-invalid={isInvalid ? '' : undefined}
      data-disabled={disabled ? '' : undefined}
    >
      {type === 'checkbox' ? (
        <Checkbox
          id={fieldId}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        />
      ) : (
        <Switch
          id={fieldId}
          checked={checked}
          defaultChecked={defaultChecked}
          onCheckedChange={onCheckedChange}
          disabled={disabled}
        />
      )}
      <FieldContent>
        <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
        {error && <FieldError>{error}</FieldError>}
      </FieldContent>
    </Field>
  )
}
