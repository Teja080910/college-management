import React, { createContext, useState, useEffect, useContext } from 'react'
import { User, login as authLogin, logout as authLogout, getStoredUser } from '../utils/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (u: string, p: string) => Promise<{ success: boolean }>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>(null!)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStoredUser().then(u => {
      if (u) setUser(u)
      setLoading(false)
    })
  }, [])

  const login = async (username: string, password: string) => {
    const result = await authLogin(username, password)
    if (result.success && result.user) setUser(result.user)
    return { success: result.success }
  }

  const logout = async () => {
    await authLogout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
