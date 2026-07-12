import { mockRequest } from '@/api/client'
import { User } from '@/types'
import { STORAGE_KEYS } from '@/constants'

const MOCK_USER: User = {
  id: '1',
  username: 'admin',
  name: 'Ava Monroe',
  role: 'Fleet Manager',
  avatarFallback: 'AM',
}

export const authService = {
  async login(username: string, password: string): Promise<User> {
    let user: User | null = null
    if (password === 'password') {
      if (username === 'admin' || username === 'manager@drivecore.com') {
        user = { id: '1', username: 'admin', name: 'Ava Monroe', role: 'Fleet Manager', avatarFallback: 'AM' }
      } else if (username === 'driver' || username === 'driver@drivecore.com') {
        user = { id: '2', username: 'driver', name: 'Marcus Vance', role: 'Driver', avatarFallback: 'MV' }
      } else if (username === 'safety' || username === 'safety@drivecore.com') {
        user = { id: '3', username: 'safety', name: 'Sarah Jenkins', role: 'Safety Officer', avatarFallback: 'SJ' }
      } else if (username === 'finance' || username === 'finance@drivecore.com') {
        user = { id: '4', username: 'finance', name: 'Elena Rostova', role: 'Financial Analyst', avatarFallback: 'ER' }
      }
    }

    if (user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(user))
      }
      return mockRequest(user)
    }
    throw new Error('Invalid username or password. (Hint: password is "password")')
  },

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.AUTH)
    }
    return mockRequest(undefined)
  },

  async getCurrentUser(): Promise<User | null> {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem(STORAGE_KEYS.AUTH)
    if (!stored) return null
    try {
      return mockRequest(JSON.parse(stored) as User)
    } catch {
      return null
    }
  },
}
