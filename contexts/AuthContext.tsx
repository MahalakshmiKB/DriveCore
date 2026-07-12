'use client'

import * as React from 'react'
import { User } from '@/types'
import { authService } from '@/services/authService'

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

export const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function initAuth() {
      try {
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
      } catch (err) {
        console.error('Failed to restore auth session:', err)
      } finally {
        setLoading(false)
      }
    }
    initAuth()
  }, [])

  const login = React.useCallback(async (username: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const loggedUser = await authService.login(username, password)
      setUser(loggedUser)
    } catch (err: any) {
      setError(err.message || 'Login failed')
      throw err;
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = React.useCallback(async () => {
    setLoading(true)
    try {
      await authService.logout()
      setUser(null)
    } catch (err) {
      console.error('Failed to log out:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  const value = React.useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      error,
      login,
      logout,
      clearError,
    }),
    [user, loading, error, login, logout, clearError]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
