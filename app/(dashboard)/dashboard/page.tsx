'use client'

import { useState, useEffect } from 'react'
import { loadData } from '@/lib/data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users, Banknote, DollarSign, ClipboardList, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface Student { id: number; name: string; age: number; grade: string; email: string; phone: string; enrolled: boolean }
interface Fee { id: number; studentName: string; totalFees: number; paid: number; due: number; status: string }
interface Test { id: number; title: string; course: string; date: string; time: string; venue: string }

const statCardClass = (index: number) => {
  const colors = [
    'from-violet-500/10 to-violet-500/5 border-violet-500/10 hover:border-violet-500/20 shadow-violet-500/5',
    'from-emerald-500/10 to-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/20 shadow-emerald-500/5',
    'from-amber-500/10 to-amber-500/5 border-amber-500/10 hover:border-amber-500/20 shadow-amber-500/5',
    'from-rose-500/10 to-rose-500/5 border-rose-500/10 hover:border-rose-500/20 shadow-rose-500/5',
  ]
  return colors[index]
}

export default function DashboardPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [fees, setFees] = useState<Fee[]>([])
  const [tests, setTests] = useState<Test[]>([])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    loadData<Student[]>('students').then(setStudents)
    loadData<Fee[]>('fees').then(setFees)
    loadData<Test[]>('tests').then(setTests)
  }, [])

  const paidCount = fees.filter(f => f.status === 'paid').length
  const totalRevenue = fees.reduce((s, f) => s + f.paid, 0)
  const upcomingTests = tests.filter(t => new Date(t.date) >= new Date()).length

  const stats = [
    { label: 'Total Students', value: students.length, icon: Users, change: '+12%', trend: 'up', sub: 'vs last month' },
    { label: 'Fees Collected', value: `${paidCount}/${fees.length}`, icon: Banknote, change: `${fees.length ? Math.round(paidCount/fees.length*100) : 0}%`, trend: 'up', sub: 'payment rate' },
    { label: 'Total Revenue', value: `₹${(totalRevenue / 1000).toFixed(1)}K`, icon: DollarSign, change: '+18%', trend: 'up', sub: 'vs last month' },
    { label: 'Tests Upcoming', value: upcomingTests, icon: ClipboardList, change: tests.length ? `${Math.round(upcomingTests/tests.length*100)}%` : '0%', trend: 'down', sub: 'of total exams' },
  ]

  return (
    <div className="space-y-8">
      <div className={`flex items-center justify-between transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm bg-muted/50 px-3.5 py-2 rounded-xl border border-border/50">
          <TrendingUp className="size-4 text-primary" />
          <span className="text-muted-foreground">This semester</span>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <div
              key={s.label}
              className={`transition-all duration-500 delay-${i * 100} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <Card className={`relative overflow-hidden border bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${statCardClass(i)}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${statCardClass(i).split(' ')[0]} ${statCardClass(i).split(' ')[1]} opacity-50`} />
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                  <div className="size-8 rounded-lg bg-background/80 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold tracking-tight">{s.value}</span>
                    <span className={`flex items-center gap-0.5 text-xs font-medium mb-1.5 ${s.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {s.trend === 'up' ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                      {s.change}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      <Card className={`border bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-700 delay-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Enrolled Students</CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-0 font-normal">
            {students.filter(s => s.enrolled).length} active
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="h-11 px-6">Name</TableHead>
                <TableHead className="h-11 px-6">Age</TableHead>
                <TableHead className="h-11 px-6">Grade</TableHead>
                <TableHead className="h-11 px-6">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.filter(s => s.enrolled).map((s, i) => (
                <TableRow key={s.id} className="border-border/50 transition-colors hover:bg-muted/30" style={{ animationDelay: `${i * 50}ms` }}>
                  <TableCell className="px-6 py-3.5 font-medium">{s.name}</TableCell>
                  <TableCell className="px-6 py-3.5">{s.age}</TableCell>
                  <TableCell className="px-6 py-3.5">
                    <span className="font-mono font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded-md">{s.grade}</span>
                  </TableCell>
                  <TableCell className="px-6 py-3.5">
                    <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 border-0">Active</Badge>
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
