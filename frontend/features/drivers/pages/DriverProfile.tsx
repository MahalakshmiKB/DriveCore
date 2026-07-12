import { StatusBadge } from '@/components/design-system/status-badge'
import { useState } from 'react'
import { toast } from 'sonner'
import {
  UserIcon,
  LockIcon,
  BellIcon,
  SunMoonIcon,
  ShieldCheckIcon,
  FileTextIcon,
  PhoneIcon,
  MailIcon,
  FlameIcon,
  CheckCircle2Icon
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/shared/data/FormFields'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'

export function DriverProfile() {
  const { user } = useAuth()

  // Profile details state
  const [profile] = useState({
    empId: 'DC-DRV-0881',
    licenseNo: 'DL-1420180029341',
    licenseExpiry: '2028-11-15',
    phone: '+91 98765 43210',
    email: 'marcus.vance@drivecore.in',
    emergencyContact: 'Sarah Vance (+91 98765 43219)',
    bloodGroup: 'O+ Positive',
    experience: '8 Years',
    safetyScore: '96%'
  })

  // Change Password state
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Preference settings state
  const [darkTheme, setDarkTheme] = useState(true)
  const [alerts, setAlerts] = useState(true)

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all security fields.")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.")
      return
    }
    toast.success("Security credentials updated successfully!")
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleSavePreferences = () => {
    toast.success("System configurations saved.")
  }

  return (
    <div className="flex flex-col gap-8">

      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Driver Profile</h1>
        <p className="text-sm text-muted-foreground">Manage emergency contacts, security configurations, and notification controls.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">

        {/* Left Column: Avatar & Summary Profile */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border border-border/45 bg-card rounded-[20px] shadow-premium-sm text-center">
            <CardContent className="pt-6 flex flex-col items-center gap-4">
              <Avatar className="size-20 border border-border/40 shadow-premium-md rounded-2xl">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                  {user?.avatarFallback || 'MV'}
                </AvatarFallback>
              </Avatar>

              <div>
                <h3 className="text-lg font-bold text-foreground">{user?.name || 'Marcus Vance'}</h3>
                <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase font-sans mt-0.5">{profile.empId}</span>
              </div>

              <div className="w-full grid grid-cols-2 gap-2 text-xs border-y border-border/20 py-4 my-2">
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold tracking-wider uppercase font-sans">Safety Index</span>
                  <span className="text-success font-extrabold text-sm">{profile.safetyScore}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold tracking-wider uppercase font-sans">Experience</span>
                  <span className="font-semibold text-white">{profile.experience}</span>
                </div>
              </div>

              <div className="w-full text-left text-xs space-y-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <MailIcon className="size-4 text-primary shrink-0" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <PhoneIcon className="size-4 text-primary shrink-0" />
                  <span>{profile.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification documents widget */}
          <Card className="border border-border/45 bg-card rounded-[20px] shadow-premium-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold flex items-center gap-1.5">
                <FileTextIcon className="size-4 text-primary" />
                Verified Credentials & Files
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-border/40 bg-muted/40 dark:bg-slate-950/20">
                <span className="font-semibold text-foreground">Commercial Driver License (CDL)</span>
                <StatusBadge tone="success">Verified</StatusBadge>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-border/40 bg-muted/40 dark:bg-slate-950/20">
                <span className="font-semibold text-foreground">Medical Fitness Certificate</span>
                <StatusBadge tone="success">Verified</StatusBadge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Account Details, Password & Preferences */}
        <div className="lg:col-span-8 space-y-6">

          {/* Card: Account details */}
          <Card className="border border-border/45 bg-card rounded-[20px] shadow-premium-sm">
            <CardHeader className="pb-3 border-b border-border/20">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <ShieldCheckIcon className="size-4.5 text-primary" />
                Licensing & Emergency Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider font-sans">License Number</span>
                  <span className="font-semibold text-white">{profile.licenseNo}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider font-sans">License Expiry</span>
                  <span className="font-semibold text-white">{profile.licenseExpiry}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider font-sans">Blood Group</span>
                  <span className="font-semibold text-white">{profile.bloodGroup}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider font-sans">Emergency Contact Person</span>
                  <span className="font-semibold text-white">{profile.emergencyContact}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card: Password Change */}
          <Card className="border border-border/45 bg-card rounded-[20px] shadow-premium-sm">
            <CardHeader className="pb-3 border-b border-border/20">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <LockIcon className="size-4.5 text-primary" />
                Authentication Security
              </CardTitle>
              <CardDescription className="text-[10px]">Update account credentials.</CardDescription>
            </CardHeader>
            <CardContent className="pt-5">
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <FormInput
                    label="Current Password"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <FormInput
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <FormInput
                    label="Confirm New Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <Button
                    type="submit"
                    className="h-9 px-6 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/95 text-white active:scale-[0.98]"
                  >
                    Change Credentials
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Card: Preferences */}
          <Card className="border border-border/45 bg-card rounded-[20px] shadow-premium-sm">
            <CardHeader className="pb-3 border-b border-border/20">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <SunMoonIcon className="size-4.5 text-primary" />
                Portal Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-border/20 pb-4">
                <div>
                  <div className="font-bold text-foreground">Dark Display Theme Mode</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Use low-contrast dark system backgrounds.</div>
                </div>
                <input
                  type="checkbox"
                  checked={darkTheme}
                  onChange={(e) => setDarkTheme(e.target.checked)}
                  className="rounded border-slate-300 dark:border-white/10 bg-white dark:bg-slate-950 accent-primary size-4.5"
                />
              </div>

              <div className="flex items-center justify-between border-b border-border/20 pb-4">
                <div>
                  <div className="font-bold text-foreground">Real-Time Dispatch Push dispatches</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">Receive audio/popup alerts when new route is assigned.</div>
                </div>
                <input
                  type="checkbox"
                  checked={alerts}
                  onChange={(e) => setAlerts(e.target.checked)}
                  className="rounded border-slate-300 dark:border-white/10 bg-white dark:bg-slate-950 accent-primary size-4.5"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleSavePreferences}
                  className="h-9 px-6 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/95 text-white active:scale-[0.98]"
                >
                  Save Configurations
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

    </div>
  )
}
