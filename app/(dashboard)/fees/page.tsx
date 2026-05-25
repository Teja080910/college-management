'use client'

import { useState, useEffect } from 'react'
import { loadData } from '@/lib/data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Banknote, TrendingDown, TrendingUp } from 'lucide-react'

interface Fee { id: number; studentName: string; totalFees: number; paid: number; due: number; status: string }

const badgeClass = (s: string) => {
  switch(s) {
    case 'paid': return 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 border-0 font-normal'
    case 'partial': return 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/15 border-0 font-normal'
    case 'unpaid': return 'bg-red-500/10 text-red-600 hover:bg-red-500/15 border-0 font-normal'
    default: return ''
  }
}

export default function FeesPage() {
  const [fees, setFees] = useState<Fee[]>([])
  const [loaded, setLoaded] = useState(false)
  const totalDue = fees.reduce((s, f) => s + f.due, 0)
  const totalCollected = fees.reduce((s, f) => s + f.paid, 0)
  const collectionRate = fees.length ? Math.round(totalCollected / fees.reduce((s, f) => s + f.totalFees, 0) * 100) : 0

  useEffect(() => {
    setLoaded(true)
    loadData<Fee[]>('fees').then(setFees)
  }, [])

  return (
    <div className="space-y-8">
      <div className={`flex items-center justify-between transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fees Status</h1>
          <p className="text-sm text-muted-foreground mt-1">Track fee payments across students</p>
        </div>
        <div className="flex items-center gap-2 text-sm bg-muted/50 px-3.5 py-2 rounded-xl border border-border/50">
          <Banknote className="size-4 text-primary" />
          <span className="text-muted-foreground">{collectionRate}% collected</span>
        </div>
      </div>

      <div className={`grid gap-4 grid-cols-1 sm:grid-cols-3 transition-all duration-500 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <Card className="border bg-white/80 backdrop-blur-sm shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-emerald-600">₹{(totalCollected / 1000).toFixed(1)}K</span>
              <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600">
                <TrendingUp className="size-3" />+{collectionRate}%
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="border bg-white/80 backdrop-blur-sm shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-red-600">₹{(totalDue / 1000).toFixed(1)}K</span>
              <span className="flex items-center gap-0.5 text-xs font-medium text-red-600">
                <TrendingDown className="size-3" />{fees.filter(f => f.due > 0).length} defaulters
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="border bg-white/80 backdrop-blur-sm shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">₹{(fees.reduce((s, f) => s + f.totalFees, 0) / 1000).toFixed(1)}K</span>
              <span className="text-xs text-muted-foreground">{fees.length} students</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className={`border bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Fee Records</CardTitle>
          <CardDescription>Detailed breakdown of all student payments</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                {['Student','Total Fees','Paid','Due','Status'].map(h => (
                  <TableHead key={h} className="h-11 px-6">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {fees.map(f => (
                <TableRow key={f.id} className="border-border/50 hover:bg-muted/30 transition-colors">
                  <TableCell className="px-6 py-3.5 font-medium">{f.studentName}</TableCell>
                  <TableCell className="px-6 py-3.5">₹{f.totalFees.toLocaleString()}</TableCell>
                  <TableCell className="px-6 py-3.5">₹{f.paid.toLocaleString()}</TableCell>
                  <TableCell className={`px-6 py-3.5 font-semibold ${f.due > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    ₹{f.due.toLocaleString()}
                  </TableCell>
                  <TableCell className="px-6 py-3.5">
                    <Badge className={badgeClass(f.status)}>{f.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
