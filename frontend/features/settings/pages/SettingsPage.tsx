import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [api, setApi] = useState(false)

  const handleSave = () => {
    toast.success("Settings saved successfully")
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">Settings & Configurations</h1>
        <p className="text-sm text-muted-foreground">Manage integration options, alert hub settings, and display preferences.</p>
      </div>

      <Card className="border border-border/45 bg-card max-w-2xl rounded-[20px] shadow-premium-sm">
        <CardHeader>
          <CardTitle className="text-lg">System Preferences</CardTitle>
          <CardDescription>Configure operations center and background integration dispatches.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between border-b border-border/20 pb-4">
            <div>
              <div className="text-sm font-bold text-foreground">Alert Hub Notifications</div>
              <div className="text-xs text-slate-400 mt-0.5">Receive real-time push dispatches and fleet triggers.</div>
            </div>
            <input 
              type="checkbox" 
              checked={notifications} 
              onChange={(e) => setNotifications(e.target.checked)}
              className="rounded border-white/10 bg-slate-950/40 text-primary focus:ring-primary size-4.5 accent-primary" 
            />
          </div>

          <div className="flex items-center justify-between border-b border-border/20 pb-4">
            <div>
              <div className="text-sm font-bold text-foreground">API Integrations</div>
              <div className="text-xs text-slate-400 mt-0.5">Enable Webhooks & Fleet GPS SDK connections.</div>
            </div>
            <input 
              type="checkbox" 
              checked={api} 
              onChange={(e) => setApi(e.target.checked)}
              className="rounded border-white/10 bg-slate-950/40 text-primary focus:ring-primary size-4.5 accent-primary" 
            />
          </div>

          <div className="pt-2">
            <Button onClick={handleSave} className="h-10 rounded-xl font-semibold px-6 bg-primary hover:bg-primary/95 text-white active:scale-[0.98]">
              Save Configurations
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
