'use client'

import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  TruckIcon, 
  AlertCircleIcon, 
  Loader2Icon, 
  ShieldCheckIcon, 
  CompassIcon, 
  Wallet as CoinsIcon, 
  UserRoundIcon, 
  XIcon, 
  ArrowRightIcon, 
  InfoIcon 
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { FormInput } from '@/components/shared/data/FormFields'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { APP_NAME, APP_SUBTITLE } from '@/constants'
import { authService } from '@/services/authService'

const ROLES = [
  {
    id: 'manager',
    label: 'Fleet Manager',
    icon: TruckIcon,
    username: 'admin',
    description: 'Control operations, dispatches & fleet analytics'
  },
  {
    id: 'driver',
    label: 'Driver',
    icon: CompassIcon,
    username: 'driver',
    description: 'View assigned trips, routes & dispatch status'
  },
  {
    id: 'safety',
    label: 'Safety Officer',
    icon: ShieldCheckIcon,
    username: 'safety',
    description: 'Monitor safety audits & certification logs'
  },
  {
    id: 'finance',
    label: 'Financial Analyst',
    icon: CoinsIcon,
    username: 'finance',
    description: 'Audit operational outflows & expense budgets'
  }
]

export function LoginPage() {
  const { login, isAuthenticated, user, error: authError, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [showModal, setShowModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState('manager')
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('password')
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect path, default to dashboard dispatch
  const from = (location.state as any)?.from?.pathname || '/dashboard'

  // Auto-redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'Driver') {
        navigate('/driver-dashboard', { replace: true })
      } else if (user.role === 'Safety Officer') {
        navigate('/safety-dashboard', { replace: true })
      } else if (user.role === 'Financial Analyst') {
        navigate('/finance-dashboard', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    }
  }, [isAuthenticated, user, navigate])

  useEffect(() => {
    clearError()
  }, [clearError])

  // Set credentials automatically when role selection changes
  const handleRoleSelect = (roleId: string, roleUsername: string) => {
    setSelectedRole(roleId)
    setUsername(roleUsername)
    setPassword('password')
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    try {
      await login(username, password)
      const currentUser = await authService.getCurrentUser()
      
      if (currentUser?.role === 'Driver') {
        navigate('/driver-dashboard', { replace: true })
      } else if (currentUser?.role === 'Safety Officer') {
        navigate('/safety-dashboard', { replace: true })
      } else if (currentUser?.role === 'Financial Analyst') {
        navigate('/finance-dashboard', { replace: true })
      } else {
        navigate(from, { replace: true })
      }
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-[#060a13] via-[#091122] to-[#0e1d3a] text-foreground font-sans flex flex-col justify-between select-none">
      
      <style>{`
        @keyframes routeFlow {
          to {
            stroke-dashoffset: -100;
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(0.3deg); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-12px) translateX(8px); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.25; transform: scale(1); }
          50% { opacity: 0.55; transform: scale(1.08); }
        }
        .animate-route-line-1 {
          animation: routeFlow 22s linear infinite;
        }
        .animate-route-line-2 {
          animation: routeFlow 16s linear infinite;
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 7s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>

      {/* BACKGROUND GRAPHICS */}
      {/* Mesh gradients */}
      <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-primary/10 blur-[130px] mix-blend-screen animate-pulse pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[140px] mix-blend-screen animate-pulse pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.012)_1px,transparent_1px)] bg-[size:40px_40px] opacity-70 pointer-events-none" />

      {/* Animated route lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
        <path d="M-100,250 Q250,500 700,320 T1400,650" fill="none" stroke="url(#route-grad)" strokeWidth="2" strokeDasharray="12 12" className="animate-route-line-1" />
        <path d="M400,-100 Q800,450 1000,220 T1700,550" fill="none" stroke="url(#route-grad)" strokeWidth="1.5" strokeDasharray="8 8" className="animate-route-line-2" />
        <defs>
          <linearGradient id="route-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      {/* Glass floating dust particles */}
      <div className="absolute top-[25%] left-[15%] w-2 h-2 rounded-full bg-white/20 blur-[1px] animate-float-slow pointer-events-none" />
      <div className="absolute bottom-[30%] right-[25%] w-3 h-3 rounded-full bg-white/10 blur-[1px] animate-float-slow [animation-delay:3s] pointer-events-none" />
      <div className="absolute top-[60%] left-[45%] w-2.5 h-2.5 rounded-full bg-white/15 blur-[0.5px] animate-float-slow [animation-delay:1.5s] pointer-events-none" />

      {/* TOP NAVIGATION */}
      <header className="w-full h-20 flex items-center justify-between px-6 lg:px-12 border-b border-white/5 bg-[#060a13]/30 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_2px_8px_rgba(59,130,246,0.4)]">
            <TruckIcon className="size-4.5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">{APP_NAME}</span>
            <span className="text-[10px] text-muted-foreground/80 font-bold tracking-wider uppercase ml-2 px-1.5 py-0.5 rounded bg-white/5 border border-white/5">{APP_SUBTITLE}</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
          <a href="#" className="text-white hover:text-white transition-colors">Home</a>
          <a href="#" className="hover:text-white transition-colors">Platform</a>
          <a href="#" className="hover:text-white transition-colors flex items-center gap-1.5">
            AI Dispatch
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          </a>
          <a href="#" className="hover:text-white transition-colors">About</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9 px-4 rounded-xl text-xs font-semibold border-white/10 hover:bg-white/5 text-slate-300">
            Request Demo
          </Button>
          <Button onClick={() => setShowModal(true)} className="h-9 px-4 rounded-xl text-xs font-semibold bg-primary hover:bg-primary/95 text-white shadow-premium-sm active:scale-[0.98]">
            Sign In
          </Button>
        </div>
      </header>

      {/* MAIN HERO */}
      <main className="flex-1 grid grid-cols-12 gap-8 px-6 lg:px-12 items-center relative overflow-hidden">
        
        {/* Left Hero */}
        <section className="col-span-12 lg:col-span-5 flex flex-col gap-6 text-left relative z-10 py-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[11px] font-semibold text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <span className="size-1.5 rounded-full bg-primary animate-ping" />
            Active Fleet Operations Core
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.08] text-white">
            DriveCore
            <span className="block text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-primary mt-3">
              AI-Powered Smart Transport Operations Platform
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-lg leading-relaxed">
            "Manage fleets, optimize dispatch, monitor maintenance and make intelligent operational decisions from one unified platform."
          </p>

          <div className="flex items-center gap-4 mt-2">
            <Button onClick={() => setShowModal(true)} className="h-11 px-6 rounded-xl font-bold tracking-wide text-xs bg-primary hover:bg-primary/95 text-white shadow-premium-sm active:scale-[0.98] flex items-center gap-2">
              Get Started
              <ArrowRightIcon className="size-4" />
            </Button>
            <Button variant="outline" className="h-11 px-6 rounded-xl font-bold tracking-wide text-xs border-white/10 hover:bg-white/5 text-slate-300">
              Learn More
            </Button>
          </div>

          {/* KPI Chips */}
          <div className="grid grid-cols-2 gap-4 mt-8 max-w-md">
            <div className="flex flex-col gap-1 p-3.5 rounded-2xl border border-white/5 bg-slate-900/35 backdrop-blur-md shadow-premium-sm hover:translate-y-[-2px] transition-all duration-200">
              <span className="text-2xl font-extrabold text-white">98%</span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">Fleet Availability</span>
            </div>
            <div className="flex flex-col gap-1 p-3.5 rounded-2xl border border-white/5 bg-slate-900/35 backdrop-blur-md shadow-premium-sm hover:translate-y-[-2px] transition-all duration-200">
              <span className="text-2xl font-extrabold text-success">24%</span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">Reduced Fuel Cost</span>
            </div>
            <div className="flex flex-col gap-1 p-3.5 rounded-2xl border border-white/5 bg-slate-900/35 backdrop-blur-md shadow-premium-sm hover:translate-y-[-2px] transition-all duration-200">
              <span className="text-2xl font-extrabold text-white">95%</span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">Dispatch Accuracy</span>
            </div>
            <div className="flex flex-col gap-1 p-3.5 rounded-2xl border border-white/5 bg-slate-900/35 backdrop-blur-md shadow-premium-sm hover:translate-y-[-2px] transition-all duration-200">
              <span className="text-2xl font-extrabold text-white">150+</span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wide uppercase">Fleet Assets Managed</span>
            </div>
          </div>
        </section>

        {/* Right Hero */}
        <section className="col-span-12 lg:col-span-7 hidden lg:flex relative h-full items-center justify-center overflow-hidden">
          
          {/* Map layout representation */}
          <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
            <svg className="w-[85%] h-[85%] text-primary/10" viewBox="0 0 800 600" fill="none" stroke="currentColor" strokeWidth={1}>
              <circle cx="400" cy="300" r="280" strokeDasharray="4 4" />
              <circle cx="400" cy="300" r="180" strokeDasharray="3 3" />
              <line x1="120" y1="300" x2="680" y2="300" strokeDasharray="2 4" />
              <line x1="400" y1="20" x2="400" y2="580" strokeDasharray="2 4" />
            </svg>
          </div>

          {/* Glowing markers */}
          <div className="absolute top-[28%] left-[28%] size-3 rounded-full bg-primary shadow-[0_0_12px_#3b82f6] animate-pulse-glow z-10" />
          <div className="absolute top-[62%] right-[22%] size-3 rounded-full bg-[#10b981] shadow-[0_0_12px_#10b981] animate-pulse-glow [animation-delay:1.5s] z-10" />
          <div className="absolute bottom-[24%] left-[34%] size-3 rounded-full bg-primary shadow-[0_0_12px_#3b82f6] animate-pulse-glow [animation-delay:0.8s] z-10" />

          {/* Truck Image */}
          <div className="relative w-full flex items-center justify-center z-10 select-none pointer-events-none">
            <img src="/truck_3d_render.png" className="w-[78%] max-w-[460px] h-auto drop-shadow-[0_24px_50px_rgba(59,130,246,0.3)] animate-float" />
          </div>

          {/* Floating Glass Widgets */}
          {/* Widget 1 */}
          <div className="absolute top-[12%] left-[12%] z-20 p-3 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-premium-md flex items-center gap-3 hover:translate-y-[-2px] transition-all duration-200 animate-float-slow select-none">
            <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <TruckIcon className="size-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fleet Overview</div>
              <div className="text-xs font-bold text-white">142 Active Assets</div>
            </div>
          </div>

          {/* Widget 2 */}
          <div className="absolute bottom-[16%] right-[8%] z-20 p-3 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-premium-md flex items-center gap-3 hover:translate-y-[-2px] transition-all duration-200 animate-float-slow [animation-delay:2s] select-none">
            <div className="size-8 rounded-xl bg-success/10 text-success flex items-center justify-center">
              <CompassIcon className="size-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Dispatch</div>
              <div className="text-xs font-bold text-white">Route CA-44 Optimized</div>
            </div>
          </div>

          {/* Widget 3 */}
          <div className="absolute top-[22%] right-[10%] z-20 p-3 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-premium-md flex items-center gap-3 hover:translate-y-[-2px] transition-all duration-200 animate-float-slow [animation-delay:1s] select-none">
            <div className="size-8 rounded-xl bg-[#eab308]/10 text-[#eab308] flex items-center justify-center">
              <ShieldCheckIcon className="size-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Fleet Health</div>
              <div className="text-xs font-bold text-white">98.2% Nominal</div>
            </div>
          </div>

          {/* Widget 4 */}
          <div className="absolute bottom-[28%] left-[8%] z-20 p-3 rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-premium-md flex items-center gap-3 hover:translate-y-[-2px] transition-all duration-200 animate-float-slow [animation-delay:3.2s] select-none">
            <div className="size-8 rounded-xl bg-[#06b6d4]/10 text-[#06b6d4] flex items-center justify-center">
              <UserRoundIcon className="size-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Drivers</div>
              <div className="text-xs font-bold text-white">176 Drivers On Duty</div>
            </div>
          </div>

        </section>
      </main>

      {/* ROLE LOGIN MODAL */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in zoom-in-95 duration-200"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="w-full max-w-[540px] border border-white/10 bg-slate-900/90 backdrop-blur-2xl rounded-[24px] shadow-premium-xl p-6 sm:p-8 relative flex flex-col gap-5 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-4 right-4 p-1.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors duration-150"
            >
              <XIcon className="size-4" />
            </button>

            {/* Title */}
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold tracking-tight text-white">Welcome to DriveCore</h2>
              <p className="text-xs text-slate-400 font-medium">Choose your role to continue</p>
            </div>

            {/* Role Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-1">
              {ROLES.map((role) => {
                const Icon = role.icon
                const isSelected = selectedRole === role.id
                return (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id, role.username)}
                    type="button"
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-150 border text-center ${
                      isSelected
                        ? 'border-primary/45 bg-primary/10 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),0_4px_12px_-2px_rgba(59,130,246,0.2)]'
                        : 'border-white/5 bg-slate-900/50 hover:bg-slate-900 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <Icon className="size-6 mb-2" />
                    <span className="text-[11px] font-bold tracking-wide">{role.label}</span>
                  </button>
                )
              })}
            </div>

            <div className="h-px bg-white/5 w-full my-1" />

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Errors */}
              {(error || authError) && (
                <Alert variant="destructive" className="border-destructive/30 py-2.5 rounded-xl bg-destructive/5 text-destructive animate-in shake duration-200">
                  <AlertCircleIcon className="size-4 shrink-0" />
                  <div>
                    <AlertTitle className="text-xs font-bold leading-none">Authentication Failed</AlertTitle>
                    <AlertDescription className="text-[11px] leading-snug mt-1 text-destructive/90">
                      {error || authError}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              <FormInput
                label="Username / Email"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                disabled={loading}
                autoComplete="username"
                className="rounded-xl border-white/10 bg-slate-950/40 text-slate-200 focus:bg-slate-950"
              />

              <div className="space-y-1">
                <FormInput
                  label="Password"
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="current-password"
                  className="rounded-xl border-white/10 bg-slate-950/40 text-slate-200 focus:bg-slate-950"
                />
                
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-[10px] text-slate-400 font-semibold select-none">
                    <input 
                      type="checkbox" 
                      checked={rememberMe} 
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-white/10 bg-slate-950 accent-primary size-3.5"
                    />
                    Remember Me
                  </label>
                  <a href="#" className="text-[10px] text-primary font-bold hover:underline" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
                </div>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full h-10 rounded-xl font-bold text-xs bg-primary hover:bg-primary/95 text-white tracking-wide active:scale-[0.98] transition-all flex items-center justify-center" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="text-center pt-2 border-t border-white/5">
              <span className="text-[11px] text-slate-400 font-medium">Need access? </span>
              <span className="text-[11px] text-slate-300 font-bold">Contact your system administrator.</span>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
