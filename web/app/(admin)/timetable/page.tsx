'use client'

import { useState, useEffect } from 'react'
import { fetchData, updateRecord } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CalendarDays, Clock, MapPin, Plus, Pencil, Trash2, Check, Loader2 } from 'lucide-react'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'

interface Period { time: string; subject: string; faculty: string }
interface DaySchedule { id: number; day: string; periods: Period[] }

const DAY_STYLES: Record<string, { gradient: string; dot: string; badge: string }> = {
  Monday:    { gradient: 'from-violet-500/10 to-violet-500/5', dot: 'bg-violet-500', badge: 'bg-violet-500/10 text-violet-600' },
  Tuesday:   { gradient: 'from-emerald-500/10 to-emerald-500/5', dot: 'bg-emerald-500', badge: 'bg-emerald-500/10 text-emerald-600' },
  Wednesday: { gradient: 'from-blue-500/10 to-blue-500/5', dot: 'bg-blue-500', badge: 'bg-blue-500/10 text-blue-600' },
  Thursday:  { gradient: 'from-amber-500/10 to-amber-500/5', dot: 'bg-amber-500', badge: 'bg-amber-500/10 text-amber-600' },
  Friday:    { gradient: 'from-rose-500/10 to-rose-500/5', dot: 'bg-rose-500', badge: 'bg-rose-500/10 text-rose-600' },
}

export default function TimetablePage() {
  const [timetable, setTimetable] = useState<DaySchedule[]>([])
  const [loaded, setLoaded] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDay, setEditingDay] = useState<DaySchedule | null>(null)
  const [periodForm, setPeriodForm] = useState({ time: '', subject: '', faculty: '' })
  const [editingPeriodIdx, setEditingPeriodIdx] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  const load = () => fetchData<DaySchedule[]>('timetable').then(setTimetable)
  useEffect(() => { setLoaded(true); load() }, [])

  const openAddPeriod = (day: DaySchedule) => {
    setEditingDay(day)
    setEditingPeriodIdx(null)
    setPeriodForm({ time: '', subject: '', faculty: '' })
    setDialogOpen(true)
  }

  const openEditPeriod = (day: DaySchedule, idx: number) => {
    setEditingDay(day)
    setEditingPeriodIdx(idx)
    setPeriodForm(day.periods[idx])
    setDialogOpen(true)
  }

  const handleSavePeriod = async () => {
    if (!editingDay) return
    setSaving(true)
    const periods = [...editingDay.periods]
    if (editingPeriodIdx !== null) {
      periods[editingPeriodIdx] = periodForm
    } else {
      periods.push(periodForm)
    }
    await updateRecord('timetable', { id: editingDay.id, day: editingDay.day, periods })
    setSaving(false)
    setDialogOpen(false)
    load()
  }

  const handleDeletePeriod = async (day: DaySchedule, idx: number) => {
    if (confirm('Delete this period?')) {
      const periods = day.periods.filter((_, i) => i !== idx)
      await updateRecord('timetable', { id: day.id, day: day.day, periods })
      load()
    }
  }

  return (
    <div className="space-y-8">
      <div className={`flex items-center justify-between transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timetable</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage weekly class schedule</p>
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
              key={day.id}
              className={`transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <Card className={`relative overflow-hidden border bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-300 ${isToday ? 'ring-2 ring-primary/20 shadow-primary/5' : 'hover:shadow-lg hover:-translate-y-0.5'}`}>
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
                    <button onClick={() => openAddPeriod(day)} className="ml-auto size-7 rounded-lg hover:bg-white/60 flex items-center justify-center transition-colors">
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-2">
                  {day.periods.map((p, j) => (
                    <div
                      key={j}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/50 hover:bg-white/80 hover:shadow-sm transition-all duration-200 group"
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
                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0 bg-background/80 px-2.5 py-1.5 rounded-lg border border-border/30">
                          <Clock className="size-3" />
                          {p.time}
                        </div>
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEditPeriod(day, j)} className="size-7 rounded-lg hover:bg-primary/10 hover:text-primary flex items-center justify-center">
                            <Pencil className="size-3" />
                          </button>
                          <button onClick={() => handleDeletePeriod(day, j)} className="size-7 rounded-lg hover:bg-destructive/10 hover:text-destructive flex items-center justify-center">
                            <Trash2 className="size-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[420px] p-0 gap-0 overflow-hidden rounded-2xl border-border/50 shadow-2xl">
          <div className="px-7 pt-7 pb-0">
            <div className="flex items-center justify-between mb-1">
              <DialogTitle className="text-xl font-semibold tracking-tight">
                {editingPeriodIdx !== null ? 'Edit period' : 'Add period'}
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-muted-foreground">
              {editingDay?.day} — {editingPeriodIdx !== null ? 'Update period details' : 'Add a new class period'}
            </DialogDescription>
          </div>
          <div className="px-7 py-6 space-y-5">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Subject</Label>
              <Input value={periodForm.subject} onChange={e => setPeriodForm({ ...periodForm, subject: e.target.value })} placeholder="Mathematics" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Faculty</Label>
              <Input value={periodForm.faculty} onChange={e => setPeriodForm({ ...periodForm, faculty: e.target.value })} placeholder="Dr. Adams" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Time</Label>
              <Input value={periodForm.time} onChange={e => setPeriodForm({ ...periodForm, time: e.target.value })} placeholder="08:00 - 09:00" className="h-10" />
            </div>
          </div>
          <div className="px-7 py-4 bg-muted/30 border-t border-border/50 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Changes are saved immediately.</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="h-9 px-4">Cancel</Button>
              <Button onClick={handleSavePeriod} disabled={saving} className="h-9 px-5 gap-1.5">
                {saving && <Loader2 className="size-3.5 animate-spin" />}
                {!saving && <Check className="size-3.5" />}
                {editingPeriodIdx !== null ? 'Update' : 'Add'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
