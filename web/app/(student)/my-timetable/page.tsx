'use client'

import { useState, useEffect } from 'react'
import { fetchData } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Clock, MapPin } from 'lucide-react'

interface Period { time: string; subject: string; faculty: string }
interface DaySchedule { day: string; periods: Period[] }

const DAY_STYLES: Record<string, { gradient: string; dot: string; badge: string }> = {
  Monday:    { gradient: 'from-violet-500/10 to-violet-500/5', dot: 'bg-violet-500', badge: 'bg-violet-500/10 text-violet-600' },
  Tuesday:   { gradient: 'from-emerald-500/10 to-emerald-500/5', dot: 'bg-emerald-500', badge: 'bg-emerald-500/10 text-emerald-600' },
  Wednesday: { gradient: 'from-blue-500/10 to-blue-500/5', dot: 'bg-blue-500', badge: 'bg-blue-500/10 text-blue-600' },
  Thursday:  { gradient: 'from-amber-500/10 to-amber-500/5', dot: 'bg-amber-500', badge: 'bg-amber-500/10 text-amber-600' },
  Friday:    { gradient: 'from-rose-500/10 to-rose-500/5', dot: 'bg-rose-500', badge: 'bg-rose-500/10 text-rose-600' },
}

export default function StudentTimetablePage() {
  const [timetable, setTimetable] = useState<DaySchedule[]>([])
  const [loaded, setLoaded] = useState(false)
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  useEffect(() => {
    setLoaded(true)
    fetchData<DaySchedule[]>('timetable').then(setTimetable)
  }, [])

  return (
    <div className="space-y-8">
      <div className={`flex items-center justify-between transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Timetable</h1>
          <p className="text-sm text-muted-foreground mt-1">Your weekly class schedule</p>
        </div>
        <div className="flex items-center gap-2 text-sm bg-muted/50 px-3.5 py-2 rounded-xl border border-border/50">
          <CalendarDays className="size-4 text-primary" />
          <span className="text-muted-foreground">{todayName}</span>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {timetable.map((day, i) => {
          const style = DAY_STYLES[day.day] || DAY_STYLES.Monday
          const isToday = day.day === todayName
          return (
            <div
              key={day.day}
              className={`transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <Card className={`relative overflow-hidden border bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${isToday ? 'ring-2 ring-primary/20 shadow-primary/5' : ''}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-60`} />
                <CardHeader className="relative pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`size-2 rounded-full ${style.dot} ${isToday ? 'animate-pulse' : ''}`} />
                    <CardTitle className="text-base">{day.day}</CardTitle>
                    {isToday && (
                      <Badge variant="secondary" className={`ml-auto border-0 text-[10px] font-semibold uppercase tracking-wider ${style.badge}`}>
                        Today
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-2">
                  {day.periods.map((p, j) => (
                    <div
                      key={j}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/50 hover:bg-white/80 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{p.subject}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="size-3" />
                            {p.faculty}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 bg-background/80 px-2.5 py-1.5 rounded-lg border border-border/30">
                        <Clock className="size-3" />
                        {p.time}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
