import { useState } from 'react'
import { toast } from 'sonner'
import { LockIcon, SunMoonIcon, ShieldCheckIcon, PhoneIcon, MailIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/shared/data/FormFields'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAuth } from '@/hooks/useAuth'

const PROFILE = {
  empId: 'DC-FIN-0205',
  phone: '+91 99001 23456',
  email: 'elena.rostova@drivecore.in',
  department: 'Finance & Analytics',
  experience: '5 Years',
}

export function FinanceProfilePage() {
  const { user } = useAuth()
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [darkTheme, setDarkTheme] = useState(true)
  const [alerts, setAlerts] = useState(false)

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault()
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all security fields.')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match.')
      return
    }
    toast.success('Security credentials updated successfully!')
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Analyst Profile</h1>
        <p className="text-sm text-muted-foreground">Manage account details, security settings and notification preferences.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-6">
          <Card className="border border-border/45 bg-card rounded-[20px] shadow-premium-sm text-center">
            <CardContent className="pt-6 flex flex-col items-center gap-4">
              <Avatar className="size-20 border border-border/40 shadow-premium-md rounded-2xl">
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                  {user?.avatarFallback || 'ER'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-bold text-foreground">{user?.name || 'Financial Analyst'}</h3>
                <span className="text-[10px] font-bold text-slate-400 block tracking-wider uppercase mt-0.5">{PROFILE.empId}</span>
              </div>
              <div className="w-full grid grid-cols-2 gap-2 text-xs border-y border-border/20 py-4 my-2">
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Department</span>
                  <span className="font-semibold text-white text-[11px]">{PROFILE.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Experience</span>
                  <span className="font-semibold text-white">{PROFILE.experience}</span>
                </div>
              </div>
              <div className="w-full text-left text-xs space-y-2">
                <div className="flex items-center gap-2 text-slate-300">
                  <MailIcon className="size-4 text-primary shrink-0" />
                  <span>{PROFILE.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <PhoneIcon className="size-4 text-primary shrink-0" />
                  <span>{PROFILE.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <Card className="border border-border/45 bg-card rounded-[20px] shadow-premium-sm">
            <CardHeader className="pb-3 border-b border-border/20">
              <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                <ShieldCheckIcon className="size-4.5 text-primary" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Full Name</span>
                  <span className="font-semibold text-white">{user?.name || 'Financial Analyst'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Role</span>
                  <span className="font-semibold text-white">Financial Analyst</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Email</span>
                  <span className="font-semibold text-white">{PROFILE.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9px] font-bold uppercase tracking-wider">Phone</span>
                  <span className="font-semibold text-white">{PROFILE.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <FormInput label="Current Password" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder="••••••••" />
                  <FormInput label="New Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" />
                  <FormInput label="Confirm New Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" />
                </div>
                <div className="flex justify-end pt-1">
                  <Button type="submit" className="h-9 px-6 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/95 text-white active:scale-[0.98]">
                    Change Credentials
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

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
                  <div className="text-[10px] text-slate-400 mt-0.5">Use low-contrast dark system backgrounds.</div>
                </div>
                <input type="checkbox" checked={darkTheme} onChange={(e) => setDarkTheme(e.target.checked)} className="rounded border-white/10 bg-slate-950 accent-primary size-4" />
              </div>
              <div className="flex items-center justify-between border-b border-border/20 pb-4">
                <div>
                  <div className="font-bold text-foreground">Budget Overage Alerts</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Notify when monthly expenses exceed threshold.</div>
                </div>
                <input type="checkbox" checked={alerts} onChange={(e) => setAlerts(e.target.checked)} className="rounded border-white/10 bg-slate-950 accent-primary size-4" />
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={() => toast.success('Preferences saved.')} className="h-9 px-6 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/95 text-white active:scale-[0.98]">
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
