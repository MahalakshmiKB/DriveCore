'use client'

import * as React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { TruckIcon, AlertCircleIcon, Loader2Icon } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FormInput } from '@/components/shared/data/FormFields'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { APP_NAME, APP_SUBTITLE } from '@/constants'

export function LoginPage() {
  const { login, error: authError, clearError } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = React.useState('admin')
  const [password, setPassword] = React.useState('password')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Get the redirect path from location state, default to "/dashboard"
  const from = (location.state as any)?.from?.pathname || '/dashboard'

  React.useEffect(() => {
    clearError()
  }, [clearError])

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
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-muted/65 via-background to-primary/8 p-6 md:p-10 overflow-hidden">
      
      {/* Background visual elements */}
      <div className="absolute top-[-20%] left-[-10%] size-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] size-96 rounded-full bg-accent-brand/5 blur-3xl pointer-events-none" />
      
      <div className="relative w-full max-w-md space-y-6 z-10">
        <div className="flex flex-col items-center gap-2.5 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-premium-sm">
            <TruckIcon className="size-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">{APP_NAME}</h1>
          <p className="text-xs text-muted-foreground font-semibold tracking-wide uppercase">{APP_SUBTITLE}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="border border-border/45 bg-card/85 backdrop-blur-md rounded-[20px] shadow-premium-md p-2">
            <CardHeader className="space-y-1.5 pb-4">
              <CardTitle className="text-xl font-bold">Sign In</CardTitle>
              <CardDescription className="text-xs text-muted-foreground/80">
                Enter your credentials to access operations management.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {(error || authError) && (
                <Alert variant="destructive" className="border-destructive/30 py-3 rounded-xl bg-destructive/5 text-destructive">
                  <AlertCircleIcon className="size-4 shrink-0" />
                  <div>
                    <AlertTitle className="text-xs font-bold leading-none">Sign In Failed</AlertTitle>
                    <AlertDescription className="text-[11px] leading-snug mt-1 text-destructive/90">
                      {error || authError}
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              <FormInput
                label="Username"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                disabled={loading}
                autoComplete="username"
                className="rounded-xl border-border/50 bg-background/50 focus:bg-background"
              />

              <FormInput
                label="Password"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                autoComplete="current-password"
                description="Demo account credentials: admin / password"
                className="rounded-xl border-border/50 bg-background/50 focus:bg-background"
              />
            </CardContent>
            <CardFooter className="pt-2">
              <Button type="submit" className="w-full h-10 rounded-xl font-semibold tracking-wide active:scale-[0.98] transition-all" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2Icon className="mr-2 size-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  )
}
