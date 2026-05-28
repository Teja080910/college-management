'use client'

import { useState, useEffect } from 'react'
import { fetchData } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { BookOpen, Banknote, ClipboardList, TrendingUp } from 'lucide-react'

interface Student { id: number; name: string; age: number; grade: string; email: string; phone: string; enrolled: boolean }
interface Fee { id: number; studentName: string; totalFees: number; paid: number; due: number; status: string }
interface Test { id: number; title: string; course: string; date: string; time: string; venue: string }
interface Course { id: number; name: string; code: string; duration: string; credits: number; hod: string; description: string }

export default function StudentDashboardPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [fees, setFees] = useState<Fee[]>([])
  const [tests, setTests] = useState<Test[]>([])
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(true)
    Promise.all([
      fetchData<Course[]>('courses'),
      fetchData<Fee[]>('fees'),
      fetchData<Test[]>('tests'),
    ]).then(([c, f, t]) => {
      setCourses(c)
      setFees(f)
      setTests(t)
    })
  }, [])

  const upcomingTests = tests.filter(t => new Date(t.date) >= new Date()).length
  const myFee = fees.length > 0 ? fees[0] : null
  const feeStatus = myFee?.status === 'paid' ? 'Up to date' : myFee ? 'Pending' : 'No records'

  const stats = [
    { label: 'Enrolled Courses', value: courses.length, icon: BookOpen, color: '#6366f1', bg: 'bg-violet-500/10' },
    { label: 'Upcoming Exams', value: upcomingTests, icon: ClipboardList, color: '#d97706', bg: 'bg-amber-500/10' },
    { label: 'Fee Status', value: feeStatus, icon: Banknote, color: myFee?.status === 'paid' ? '#16a34a' : '#dc2626', bg: myFee?.status === 'paid' ? 'bg-emerald-500/10' : 'bg-red-500/10' },
  ]

  return (
    <div className="space-y-8">
      <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome back! Here&apos;s your academic overview.</p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <Card className="border bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
                <div className={`size-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <s.icon className="size-4" style={{ color: s.color }} />
                </div>
              </CardHeader>
              <CardContent>
                <span className="text-2xl font-bold tracking-tight">{s.value}</span>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <Card className={`border bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-700 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-lg">My Courses</CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-0 font-normal">
            {courses.length} enrolled
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="h-11 px-6">Course</TableHead>
                <TableHead className="h-11 px-6">Code</TableHead>
                <TableHead className="h-11 px-6">Duration</TableHead>
                <TableHead className="h-11 px-6">Credits</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((c, i) => (
                <TableRow key={c.id} className="border-border/50 hover:bg-muted/30 transition-colors" style={{ animationDelay: `${i * 50}ms` }}>
                  <TableCell className="px-6 py-3.5 font-medium">{c.name}</TableCell>
                  <TableCell className="px-6 py-3.5">
                    <span className="font-mono text-xs text-primary bg-primary/5 px-2 py-0.5 rounded-md">{c.code}</span>
                  </TableCell>
                  <TableCell className="px-6 py-3.5">{c.duration}</TableCell>
                  <TableCell className="px-6 py-3.5">{c.credits}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
