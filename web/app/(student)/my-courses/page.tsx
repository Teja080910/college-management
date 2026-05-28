'use client'

import { useState, useEffect } from 'react'
import { fetchData } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock, User, GraduationCap } from 'lucide-react'

interface Course { id: number; name: string; code: string; duration: string; credits: number; hod: string; description: string }

const CARD_STYLES = [
  { gradient: 'from-violet-500/10 to-violet-500/5', badge: 'bg-violet-500/10 text-violet-600', hover: 'hover:border-violet-500/20' },
  { gradient: 'from-emerald-500/10 to-emerald-500/5', badge: 'bg-emerald-500/10 text-emerald-600', hover: 'hover:border-emerald-500/20' },
  { gradient: 'from-amber-500/10 to-amber-500/5', badge: 'bg-amber-500/10 text-amber-600', hover: 'hover:border-amber-500/20' },
  { gradient: 'from-rose-500/10 to-rose-500/5', badge: 'bg-rose-500/10 text-rose-600', hover: 'hover:border-rose-500/20' },
  { gradient: 'from-blue-500/10 to-blue-500/5', badge: 'bg-blue-500/10 text-blue-600', hover: 'hover:border-blue-500/20' },
]

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
    fetchData<Course[]>('courses').then(setCourses)
  }, [])

  return (
    <div className="space-y-8">
      <div className={`transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
        <p className="text-sm text-muted-foreground mt-1">Courses you are currently enrolled in</p>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((c, i) => {
          const style = CARD_STYLES[i % CARD_STYLES.length]
          return (
            <div
              key={c.id}
              className={`transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <Card className={`relative overflow-hidden border bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default ${style.hover}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-60`} />
                <CardHeader className="relative pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug">{c.name}</CardTitle>
                    <Badge variant="secondary" className={`shrink-0 border-0 font-mono text-xs ${style.badge}`}>
                      {c.code}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">{c.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5 bg-background/60 px-2.5 py-1 rounded-lg border border-border/30">
                      <Clock className="size-3.5" />
                      {c.duration}
                    </span>
                    <span className="flex items-center gap-1.5 bg-background/60 px-2.5 py-1 rounded-lg border border-border/30">
                      <BookOpen className="size-3.5" />
                      {c.credits} cr
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs pt-2 border-t border-border/30">
                    <User className="size-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">HOD: </span>
                    <span className="font-medium">{c.hod}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
