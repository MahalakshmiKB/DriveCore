import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatOdometer(km: number): string {
  return `${new Intl.NumberFormat('en-US').format(km)} km`
}

export function formatCurrency(value: number): string {
  return `₹${new Intl.NumberFormat('en-IN').format(value)}`
}

export function getInitials(name: string): string {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
