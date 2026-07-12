import { useState } from 'react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/design-system/status-badge'
import { SparklesIcon } from 'lucide-react'

interface Recommendation {
  id: string
  route: string
  efficiency: string
  savings: string
  vehicle: string
  driver: string
  reason: string
}

const mockRecommendations: Recommendation[] = [
  { id: 'rec-1', route: 'Mumbai - Pune Corridor', efficiency: '+14.2%', savings: '₹4,200', vehicle: 'MH-12-GQ-4431', driver: 'Marcus Vance', reason: 'Avoids heavy congestion on NH-48 using real-time GPS dispatch data.' },
  { id: 'rec-2', route: 'Delhi - Jaipur Express', efficiency: '+18.5%', savings: '₹6,150', vehicle: 'DL-01-AX-9912', driver: 'Sarah Jenkins', reason: 'Optimizes refueling stop sequence based on market fuel rates.' },
  { id: 'rec-3', route: 'Bangalore Ring Road', efficiency: '+9.8%', savings: '₹2,300', vehicle: 'KA-03-MR-5521', driver: 'Elena Rostova', reason: 'Balances driver hours-of-service compliance requirements.' }
]

export function AiDispatchPage() {
  const [recs, setRecs] = useState<Recommendation[]>(mockRecommendations)

  const handleApprove = (id: string, route: string) => {
    toast.success(`AI Dispatch Recommendation approved for ${route}. Dispatch order launched.`)
    setRecs(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-sans">AI Dispatch Recommendations</h1>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/15 text-primary text-[10px] font-bold uppercase tracking-wider">
            <SparklesIcon className="size-3 animate-pulse" />
            AI Live
          </span>
        </div>
        <p className="text-sm text-muted-foreground">Smart dynamic route dispatches optimized for fuel economy and safety score.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recs.length === 0 ? (
          <Card className="col-span-full border border-border/45 bg-card/50 p-8 text-center rounded-[20px] shadow-premium-sm">
            <div className="text-muted-foreground mb-2">No recommendations pending approval.</div>
            <p className="text-xs text-slate-400">AI engine is analyzing real-time fleet coordinates for new optimizations.</p>
          </Card>
        ) : (
          recs.map((rec) => (
            <Card key={rec.id} className="border border-border/45 bg-card rounded-[20px] shadow-premium-sm flex flex-col justify-between hover:translate-y-[-2px] transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary tracking-wide uppercase">Optimization Suggested</span>
                  <StatusBadge tone="success">{rec.efficiency}</StatusBadge>
                </div>
                <CardTitle className="text-lg mt-2 font-bold text-foreground">{rec.route}</CardTitle>
                <CardDescription className="text-xs text-slate-400 mt-1">{rec.reason}</CardDescription>
              </CardHeader>
              <CardContent className="pt-2 flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-2 text-xs border-y border-border/20 py-3 my-1">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold tracking-wider uppercase font-sans">Projected Savings</span>
                    <span className="text-success font-extrabold text-sm">{rec.savings}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-bold tracking-wider uppercase font-sans">Assigned Asset</span>
                    <span className="font-semibold text-white">{rec.vehicle}</span>
                  </div>
                </div>
                <div className="flex gap-2.5">
                  <Button 
                    onClick={() => handleApprove(rec.id, rec.route)}
                    className="flex-1 h-9 rounded-xl text-xs font-semibold bg-primary text-white active:scale-[0.98]"
                  >
                    Approve & Dispatch
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
