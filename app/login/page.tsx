'use client'

import { useState, useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GraduationCap, Eye, EyeOff, Sparkles } from 'lucide-react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const ctx = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => { setLoaded(true) }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const result = ctx?.login(username, password)
    if (result?.success) {
      router.replace('/dashboard')
    } else {
      setError('Invalid credentials. Try admin/admin.')
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
      </div>

      <div className={`relative w-full max-w-md mx-4 transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-3xl blur-xl opacity-75 animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-primary/10 border border-white/50 p-8 sm:p-10">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative mb-5">
                <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-md animate-pulse" style={{ animationDuration: '4s' }} />
                <div className="relative size-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/25 flex items-center justify-center">
                  <GraduationCap className="size-8 text-white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
              <p className="text-sm text-muted-foreground mt-1.5">Sign in to access your student portal</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2.5 text-sm text-destructive bg-destructive/5 px-4 py-3 rounded-xl border border-destructive/10 animate-in slide-in-from-top-1 duration-300">
                  <span className="size-1.5 rounded-full bg-destructive shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm" />
                  <Input
                    id="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="admin"
                    required
                    className="relative h-11 bg-white/80 border-border/60 focus:bg-white transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/5 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 blur-sm" />
                  <div className="relative flex">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••"
                      required
                      className="h-11 bg-white/80 border-border/60 focus:bg-white transition-all duration-200 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="relative w-full h-11 text-base font-medium overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/90 transition-all duration-300" />
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin size-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4 group-hover:rotate-12 transition-transform duration-300" />
                      Sign In
                    </>
                  )}
                </span>
              </Button>
            </form>

            <p className="mt-6 text-xs text-center text-muted-foreground">
              Demo credentials: <span className="font-mono font-medium text-foreground">admin</span> / <span className="font-mono font-medium text-foreground">admin</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
