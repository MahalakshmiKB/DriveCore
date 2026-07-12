import { sleep } from '@/utils'

export async function mockRequest<T>(data: T, shouldFail = false, delayMs = 400): Promise<T> {
  await sleep(delayMs)
  if (shouldFail) {
    throw new Error('API request failed. Please try again.')
  }
  return data
}

// LocalStorage helpers to simulate database storage client-side
export const storageDb = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue
    const stored = localStorage.getItem(`drivecore_db_${key}`)
    if (!stored) {
      localStorage.setItem(`drivecore_db_${key}`, JSON.stringify(defaultValue))
      return defaultValue
    }
    try {
      return JSON.parse(stored) as T
    } catch {
      return defaultValue
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(`drivecore_db_${key}`, JSON.stringify(value))
  },
}
