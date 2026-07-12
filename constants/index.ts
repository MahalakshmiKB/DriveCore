import { 
  LayoutGridIcon, 
  TruckIcon, 
  UsersIcon, 
  RouteIcon, 
  LayersIcon, 
  MousePointerClickIcon, 
  TextCursorInputIcon, 
  BellRingIcon, 
  BarChart3Icon,
  WrenchIcon,
  FuelIcon,
  DollarSignIcon,
  SettingsIcon
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
  'In Shop': 'warning',
  Retired: 'neutral',
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
  { path: '/maintenance', label: 'Maintenance', icon: WrenchIcon },
  { path: '/fuel', label: 'Fuel logs', icon: FuelIcon },
  { path: '/expenses', label: 'Expenses', icon: DollarSignIcon },
  { path: '/reports', label: 'Reports', icon: BarChart3Icon },
  { path: '/design-system', label: 'Design System', icon: LayersIcon },
]


export const DESIGN_SYSTEM_NAV_ITEMS = [
  { id: 'foundations', label: 'Foundations', icon: LayersIcon },
  { id: 'buttons', label: 'Buttons', icon: MousePointerClickIcon },
  { id: 'forms', label: 'Forms & Inputs', icon: TextCursorInputIcon },
  { id: 'data-display', label: 'Data Display', icon: LayoutGridIcon },
  { id: 'feedback', label: 'Feedback & Nav', icon: BellRingIcon },
  { id: 'charts', label: 'Charts', icon: BarChart3Icon },
]
