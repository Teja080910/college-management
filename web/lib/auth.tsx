'use client'

import { createContext, useState, useEffect, useCallback, ReactNode } from 'react'

interface User {
  username: string
  name: string
  role: 'admin' | 'student'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => { success: boolean }
  logout: () => void
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)

const USERS = [
  { username: 'admin', password: 'admin', user: { username: 'admin', name: 'Administrator', role: 'admin' as const }, token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token-admin' },
  { username: 'student', password: 'student123', user: { username: 'student', name: 'Student User', role: 'student' as const }, token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token-student' },
]

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
    const match = USERS.find(u => u.username === username && u.password === password)
    if (match) {
      localStorage.setItem('portal_token', match.token)
      localStorage.setItem('portal_user', JSON.stringify(match.user))
      setUser(match.user)
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
