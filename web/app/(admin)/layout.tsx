'use client'

import { useContext, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext } from '@/lib/auth'
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import AppSidebar from '@/components/layout/AppSidebar'
import { GraduationCap } from "lucide-react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const ctx = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    if (ctx && !ctx.loading) {
      if (!ctx.isAuthenticated) router.replace('/login')
      else if (ctx.user?.role !== 'admin') router.replace('/my-dashboard')
    }
  }, [ctx, router])

  if (!ctx || ctx.loading) return null
  if (!ctx.isAuthenticated) return null

  return (
    <SidebarProvider>
      <AppSidebar user={ctx.user} onLogout={() => { ctx.logout(); router.push('/login') }} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b border-border/50 bg-white/70 backdrop-blur-xl px-5 shadow-sm">
          <SidebarTrigger className="-ml-1.5 size-8 rounded-lg hover:bg-muted/50 transition-colors" />
          <Separator orientation="vertical" className="h-5" />
          <GraduationCap className="size-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Student Portal</span>
        </header>
        <div className="flex-1 p-6 lg:p-8 animate-in fade-in duration-500">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
