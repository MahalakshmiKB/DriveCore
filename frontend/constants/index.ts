import { 
  LayoutGridIcon, 
  TruckIcon, 
  UsersIcon, 
  RouteIcon, 
  BarChart3Icon,
  WrenchIcon,
  FuelIcon,
  SettingsIcon,
  Wallet as CoinsIcon
} from 'lucide-react'
import { StatusTone } from '@/components/design-system/status-badge'

export const APP_NAME = 'DriveCore'
export const APP_SUBTITLE = 'Smart Transport Operations Platform'
export const APP_DESCRIPTION = 'DriveCore Design System — A cohesive, enterprise-grade component library for building transport operations software.'

export const STORAGE_KEYS = {
  THEME: 'drivecore-theme',
  AUTH: 'drivecore-auth',
}

export const VEHICLE_STATUS_TONE: Record<string, StatusTone> = {
  Available: 'success',
  'On Trip': 'info',
  Maintenance: 'warning',
  Outage: 'danger',
}

export const DRIVER_STATUS_TONE: Record<string, StatusTone> = {
  Available: 'success',
  'On Trip': 'info',
  'Off Duty': 'neutral',
  Suspended: 'danger',
}

export const TRIP_STATUS_TONE: Record<string, StatusTone> = {
  Draft: 'neutral',
  Dispatched: 'info',
  Completed: 'success',
  Cancelled: 'danger',
}

export const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutGridIcon },
  { path: '/vehicles', label: 'Vehicles', icon: TruckIcon },
  { path: '/drivers', label: 'Drivers', icon: UsersIcon },
  { path: '/trips', label: 'Trips', icon: RouteIcon },
  { path: '/ai-dispatch', label: 'AI Dispatch', icon: RouteIcon },
  { path: '/maintenance', label: 'Maintenance', icon: WrenchIcon },
  { path: '/fuel', label: 'Fuel logs', icon: FuelIcon },
  { path: '/expenses', label: 'Expenses', icon: CoinsIcon },
  { path: '/reports', label: 'Reports', icon: BarChart3Icon },
  { path: '/settings', label: 'Settings', icon: SettingsIcon },
]
