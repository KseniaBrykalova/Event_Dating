import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type User = {
  name: string
  email: string
}

type AuthContextValue = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>
  deleteAccount: () => Promise<void>
}

const STORAGE_KEY = 'event_dating_user'

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredUser(): User | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as unknown
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'name' in parsed &&
      'email' in parsed &&
      typeof (parsed as { name: unknown }).name === 'string' &&
      typeof (parsed as { email: unknown }).email === 'string'
    ) {
      return {
        name: (parsed as { name: string }).name,
        email: (parsed as { email: string }).email,
      }
    }
    return null
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => readStoredUser())

  const value = useMemo<AuthContextValue>(() => {
    const login = async (email: string, _password: string) => {
      const nextUser: User = { name: 'Пользователь', email }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
      setUser(nextUser)
    }

    const register = async (name: string, email: string, _password: string) => {
      const nextUser: User = { name: name.trim() || 'Пользователь', email }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser))
      setUser(nextUser)
    }

    const logout = async () => {
      localStorage.removeItem(STORAGE_KEY)
      setUser(null)
    }

    const updatePassword = async (_oldPassword: string, _newPassword: string) => {
      if (!user) return
    }

    const deleteAccount = async () => {
      localStorage.removeItem(STORAGE_KEY)
      setUser(null)
    }

    return { user, login, register, logout, updatePassword, deleteAccount }
  }, [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth должен использоваться внутри AuthProvider')
  }
  return ctx
}
