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
    if (username === 'admin' && password === 'password') {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(MOCK_USER))
      }
      return mockRequest(MOCK_USER)
    }
    throw new Error('Invalid username or password. (Hint: admin / password)')
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
