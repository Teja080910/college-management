import type { ReactNode } from 'react'
import { AuthProvider } from '@/lib/auth'
import './globals.css'
import { Geist } from "next/font/google"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const metadata = {
  title: 'Student Portal',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
