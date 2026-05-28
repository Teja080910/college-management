'use client'

import { useState, useEffect } from 'react'
import { fetchData } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Banknote, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react'

interface Fee { id: number; studentName: string; totalFees: number; paid: number; due: number; status: string }

export default function StudentFeesPage() {
  const [fees, setFees] = useState<Fee[]>([])
  const [loaded, setLoaded] = useState(false)
  const [paidId, setPaidId] = useState<number | null>(null)

  useEffect(() => {
    setLoaded(true)
    fetchData<Fee[]>('fees').then(setFees)
  }, [])

  const handlePay = async (id: number) => {
    setPaidId(id)
    await new Promise(r => setTimeout(r, 1000))
    setFees(prev => prev.map(f => f.id === id ? { ...f, paid: f.totalFees, due: 0, status: 'paid' as const } : f))
    setPaidId(null)
  }

  const totalDue = fees.reduce((s, f) => s + f.due, 0)
  const totalPaid = fees.reduce((s, f) => s + f.paid, 0)

  return (
    <div className="space-y-8">
      <div className={`transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h1 className="text-3xl font-bold tracking-tight">My Fees</h1>
        <p className="text-sm text-muted-foreground mt-1">View your fee status and make payments</p>
      </div>

      <div className={`grid gap-4 grid-cols-1 sm:grid-cols-2 transition-all duration-500 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <Card className="border bg-white/80 backdrop-blur-sm shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Paid</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-emerald-600">₹{(totalPaid / 1000).toFixed(1)}K</span>
              <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600"><TrendingUp className="size-3" />Cleared</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border bg-white/80 backdrop-blur-sm shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pending Dues</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-red-600">₹{(totalDue / 1000).toFixed(1)}K</span>
              <span className="flex items-center gap-0.5 text-xs font-medium text-red-600"><TrendingDown className="size-3" />Due</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className={`border bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Fee Records</CardTitle>
          <CardDescription>Your payment history and status</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                {['Student','Total Fees','Paid','Due','Status',''].map(h => (
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
                  <TableCell className={`px-6 py-3.5 font-semibold ${f.due > 0 ? 'text-red-600' : 'text-emerald-600'}`}>₹{f.due.toLocaleString()}</TableCell>
                  <TableCell className="px-6 py-3.5">
                    <Badge className={`border-0 font-normal ${f.status === 'paid' ? 'bg-emerald-500/10 text-emerald-600' : f.status === 'partial' ? 'bg-amber-500/10 text-amber-600' : 'bg-red-500/10 text-red-600'}`}>
                      {f.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-3.5">
                    {f.due > 0 && (
                      <Button
                        size="sm"
                        onClick={() => handlePay(f.id)}
                        disabled={paidId === f.id}
                        className="h-8 gap-1.5"
                      >
                        {paidId === f.id ? (
                          <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <CheckCircle className="size-3.5" />
                        )}
                        Pay Now
                      </Button>
                    )}
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
