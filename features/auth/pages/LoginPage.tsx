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
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/30 p-6 md:p-10">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <TruckIcon className="size-5.5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">{APP_NAME}</h1>
          <p className="text-xs text-muted-foreground">{APP_SUBTITLE}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="border border-border shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl">Sign in</CardTitle>
              <CardDescription>
                Enter your credentials to access operations management.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {(error || authError) && (
                <Alert variant="destructive" className="border-destructive/30 py-2.5">
                  <AlertCircleIcon className="size-4" />
                  <AlertTitle className="text-xs font-semibold">Sign In Failed</AlertTitle>
                  <AlertDescription className="text-[11px] leading-snug">
                    {error || authError}
                  </AlertDescription>
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
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
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
