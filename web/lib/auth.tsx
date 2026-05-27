'use client'

import { createContext, useState, useEffect, useCallback, ReactNode } from 'react'

interface User {
  username: string
  name: string
  role: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => { success: boolean }
  logout: () => void
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)

const AUTH_DATA = {
  user: { username: 'admin', name: 'Administrator', role: 'Admin' },
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token-for-demo',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = localStorage.getItem('portal_user')
    const token = localStorage.getItem('portal_token')
    if (raw && token) {
      setUser(JSON.parse(raw))
    }
    setLoading(false)
  }, [])

  const login = useCallback((username: string, password: string) => {
    if (username === 'admin' && password === 'admin') {
      const { user, token } = AUTH_DATA
      localStorage.setItem('portal_token', token)
      localStorage.setItem('portal_user', JSON.stringify(user))
      setUser(user)
      return { success: true }
    }
    return { success: false }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('portal_token')
    localStorage.removeItem('portal_user')
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}
