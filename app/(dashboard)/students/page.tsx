'use client'

import { useState, useEffect } from 'react'
import { loadData } from '@/lib/data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Search, Users, SlidersHorizontal } from 'lucide-react'

interface Student { id: number; name: string; age: number; grade: string; email: string; phone: string; enrolled: boolean }

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [search, setSearch] = useState('')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
    loadData<Student[]>('students').then(setStudents)
  }, [])

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className={`flex items-center justify-between transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all registered students</p>
        </div>
        <div className="flex items-center gap-2 text-sm bg-muted/50 px-3.5 py-2 rounded-xl border border-border/50">
          <Users className="size-4 text-primary" />
          <span className="text-muted-foreground">{students.length} total</span>
        </div>
      </div>

      <div className={`flex items-center gap-3 transition-all duration-500 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-10 bg-white/80 border-border/60 focus:bg-white transition-all duration-200"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg border border-border/50">
          <SlidersHorizontal className="size-3.5" />
          Filters
        </div>
      </div>

      <Card className={`border bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">All Students</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                {['ID','Name','Age','Grade','Email','Phone','Status'].map(h => (
                  <TableHead key={h} className="h-11 px-6">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(s => (
                <TableRow key={s.id} className="border-border/50 hover:bg-muted/30 transition-colors">
                  <TableCell className="px-6 py-3.5 text-muted-foreground font-mono text-xs">{s.id}</TableCell>
                  <TableCell className="px-6 py-3.5 font-medium">{s.name}</TableCell>
                  <TableCell className="px-6 py-3.5">{s.age}</TableCell>
                  <TableCell className="px-6 py-3.5">
                    <span className="font-mono font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded-md">{s.grade}</span>
                  </TableCell>
                  <TableCell className="px-6 py-3.5 text-muted-foreground">{s.email}</TableCell>
                  <TableCell className="px-6 py-3.5 text-muted-foreground font-mono text-xs">{s.phone}</TableCell>
                  <TableCell className="px-6 py-3.5">
                    <Badge variant={s.enrolled ? 'default' : 'secondary'} className={`border-0 font-normal ${s.enrolled ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15' : ''}`}>
                      {s.enrolled ? 'Active' : 'Inactive'}
                    </Badge>
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
