'use client'

import { useState, useEffect } from 'react'
import { loadData } from '@/lib/data'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ClipboardList, Calendar, MapPin, AlertCircle } from 'lucide-react'

interface Test { id: number; title: string; course: string; date: string; time: string; venue: string }

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
    loadData<Test[]>('tests').then(setTests)
  }, [])

  const sorted = [...tests].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const now = Date.now()
  const soonThreshold = 7 * 24 * 60 * 60 * 1000

  return (
    <div className="space-y-8">
      <div className={`flex items-center justify-between transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Test Schedule</h1>
          <p className="text-sm text-muted-foreground mt-1">Upcoming examinations and tests</p>
        </div>
        <div className="flex items-center gap-2 text-sm bg-muted/50 px-3.5 py-2 rounded-xl border border-border/50">
          <ClipboardList className="size-4 text-primary" />
          <span className="text-muted-foreground">{sorted.length} exams</span>
        </div>
      </div>

      <Card className={`border bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-700 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Examinations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                {['Test','Course','Date','Time','Venue'].map(h => (
                  <TableHead key={h} className="h-11 px-6">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map(t => {
                const d = new Date(t.date).getTime()
                const isSoon = d - now < soonThreshold && d >= now
                const isPast = d < now
                return (
                  <TableRow key={t.id} className={`border-border/50 hover:bg-muted/30 transition-colors ${isPast ? 'opacity-50' : ''}`}>
                    <TableCell className="px-6 py-3.5 font-medium">
                      <div className="flex items-center gap-2">
                        {t.title}
                        {isSoon && (
                          <Badge className="bg-amber-500/10 text-amber-600 border-0 text-[10px] px-1.5 py-0 font-normal flex items-center gap-1">
                            <AlertCircle className="size-3" />
                            Soon
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-3.5">{t.course}</TableCell>
                    <TableCell className="px-6 py-3.5">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-3.5 text-muted-foreground shrink-0" />
                        <span className={isPast ? 'text-muted-foreground line-through' : ''}>{t.date}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-3.5 font-mono text-sm">{t.time}</TableCell>
                    <TableCell className="px-6 py-3.5">
                      <Badge variant="secondary" className="bg-primary/5 text-primary border-0 font-normal flex items-center gap-1.5 w-fit">
                        <MapPin className="size-3" />
                        {t.venue}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
