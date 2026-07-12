import { ShieldAlertIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export function AccessDeniedPage() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col gap-6 items-center justify-center min-h-[60vh] text-center p-8 bg-card border border-border/45 rounded-[20px] shadow-premium-sm">
      <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive shadow-[0_0_15px_rgba(239,68,68,0.2)]">
        <ShieldAlertIcon className="size-8 animate-pulse" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Access Denied</h1>
        <p className="text-sm text-slate-400 max-w-md leading-relaxed">
          You do not have the required permissions to access this administrative module. Please contact your operations supervisor if this is an error.
        </p>
      </div>
      <Button 
        onClick={() => navigate(-1)} 
        className="h-10 px-6 rounded-xl font-semibold bg-primary text-white active:scale-[0.98]"
      >
        Go Back
      </Button>
    </div>
  )
}
