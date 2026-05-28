'use client'

import { useState, useEffect } from 'react'
import { fetchData, createRecord, updateRecord, deleteRecord } from '@/lib/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BookOpen, Clock, User, Plus, Pencil, Trash2, Check, Loader2 } from 'lucide-react'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'

interface Course { id: number; name: string; code: string; duration: string; credits: number; hod: string; description: string }

const CARD_STYLES = [
  { gradient: 'from-violet-500/10 to-violet-500/5', badge: 'bg-violet-500/10 text-violet-600', hover: 'hover:border-violet-500/20 hover:shadow-violet-500/5' },
  { gradient: 'from-emerald-500/10 to-emerald-500/5', badge: 'bg-emerald-500/10 text-emerald-600', hover: 'hover:border-emerald-500/20 hover:shadow-emerald-500/5' },
  { gradient: 'from-amber-500/10 to-amber-500/5', badge: 'bg-amber-500/10 text-amber-600', hover: 'hover:border-amber-500/20 hover:shadow-amber-500/5' },
  { gradient: 'from-rose-500/10 to-rose-500/5', badge: 'bg-rose-500/10 text-rose-600', hover: 'hover:border-rose-500/20 hover:shadow-rose-500/5' },
  { gradient: 'from-blue-500/10 to-blue-500/5', badge: 'bg-blue-500/10 text-blue-600', hover: 'hover:border-blue-500/20 hover:shadow-blue-500/5' },
]

const emptyForm = { name: '', code: '', duration: '', credits: '', hod: '', description: '' }

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loaded, setLoaded] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Course | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = () => fetchData<Course[]>('courses').then(setCourses)
  useEffect(() => { setLoaded(true); load() }, [])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true) }
  const openEdit = (c: Course) => { setEditing(c); setForm({ name: c.name, code: c.code, duration: c.duration, credits: String(c.credits), hod: c.hod, description: c.description }); setDialogOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    const payload = { name: form.name, code: form.code, duration: form.duration, credits: parseInt(form.credits) || 0, hod: form.hod, description: form.description }
    if (editing) {
      await updateRecord('courses', { id: editing.id, ...payload })
    } else {
      await createRecord('courses', payload)
    }
    setSaving(false)
    setDialogOpen(false)
    load()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Delete this course?')) {
      await deleteRecord('courses', id)
      load()
    }
  }

  return (
    <div className="space-y-8">
      <div className={`flex items-center justify-between transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Course Details</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all offered programs</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="size-4" />
          Add Course
        </button>
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
              <Card className={`relative overflow-hidden border bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group ${style.hover}`}>
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
                      <Clock className="size-3.5" />{c.duration}
                    </span>
                    <span className="flex items-center gap-1.5 bg-background/60 px-2.5 py-1 rounded-lg border border-border/30">
                      <BookOpen className="size-3.5" />{c.credits} cr
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-border/30">
                    <div className="flex items-center gap-1.5">
                      <User className="size-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">HOD: </span>
                      <span className="font-medium">{c.hod}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(c)} className="size-7 rounded-lg hover:bg-primary/10 hover:text-primary flex items-center justify-center">
                        <Pencil className="size-3" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="size-7 rounded-lg hover:bg-destructive/10 hover:text-destructive flex items-center justify-center">
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[520px] p-0 gap-0 overflow-hidden rounded-2xl border-border/50 shadow-2xl">
          <div className="px-7 pt-7 pb-0">
            <div className="flex items-center justify-between mb-1">
              <DialogTitle className="text-xl font-semibold tracking-tight">
                {editing ? 'Edit course' : 'New course'}
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-muted-foreground">
              {editing ? 'Update the course information below.' : 'Enter the details for a new course.'}
            </DialogDescription>
          </div>
          <div className="px-7 py-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Course name</Label>
                <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="B.Tech Computer Science" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Code</Label>
                <Input value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} placeholder="CS101" className="h-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Description</Label>
              <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Program description..." className="h-10" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Duration</Label>
                <Input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="4 Years" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Credits</Label>
                <Input type="number" value={form.credits} onChange={e => setForm({ ...form, credits: e.target.value })} placeholder="160" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">HOD</Label>
                <Input value={form.hod} onChange={e => setForm({ ...form, hod: e.target.value })} placeholder="Dr. Adams" className="h-10" />
              </div>
            </div>
          </div>
          <div className="px-7 py-4 bg-muted/30 border-t border-border/50 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Changes are saved immediately.</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="h-9 px-4">Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="h-9 px-5 gap-1.5">
                {saving && <Loader2 className="size-3.5 animate-spin" />}
                {!saving && <Check className="size-3.5" />}
                {editing ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
