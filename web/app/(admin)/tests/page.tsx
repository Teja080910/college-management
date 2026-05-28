'use client'

import { useState, useEffect } from 'react'
import { fetchData, createRecord, updateRecord, deleteRecord } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ClipboardList, Calendar, MapPin, AlertCircle, Plus, Pencil, Trash2, Check, Loader2 } from 'lucide-react'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'

interface Test { id: number; title: string; course: string; date: string; time: string; venue: string }

const emptyForm = { title: '', course: '', date: '', time: '', venue: '' }

export default function TestsPage() {
  const [tests, setTests] = useState<Test[]>([])
  const [loaded, setLoaded] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Test | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = () => fetchData<Test[]>('tests').then(setTests)
  useEffect(() => { setLoaded(true); load() }, [])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true) }
  const openEdit = (t: Test) => { setEditing(t); setForm({ title: t.title, course: t.course, date: t.date, time: t.time, venue: t.venue }); setDialogOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    if (editing) {
      await updateRecord('tests', { id: editing.id, ...form })
    } else {
      await createRecord('tests', form)
    }
    setSaving(false)
    setDialogOpen(false)
    load()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Delete this test?')) {
      await deleteRecord('tests', id)
      load()
    }
  }

  const sorted = [...tests].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const now = Date.now()
  const soonThreshold = 7 * 24 * 60 * 60 * 1000

  return (
    <div className="space-y-8">
      <div className={`flex items-center justify-between transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Test Schedule</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage examinations and tests</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm bg-muted/50 px-3.5 py-2 rounded-xl border border-border/50">
            <ClipboardList className="size-4 text-primary" />
            <span className="text-muted-foreground">{sorted.length} exams</span>
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
            <Plus className="size-4" />
            Add Test
          </button>
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
                {['Test','Course','Date','Time','Venue',''].map(h => (
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
                  <TableRow key={t.id} className={`border-border/50 hover:bg-muted/30 transition-colors group ${isPast ? 'opacity-50' : ''}`}>
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
                    <TableCell className="px-6 py-3.5">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button onClick={() => openEdit(t)} className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors">
                          <Pencil className="size-3.5" />
                        </button>
                        <button onClick={() => handleDelete(t.id)} className="size-8 rounded-lg hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors">
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden rounded-2xl border-border/50 shadow-2xl">
          <div className="px-7 pt-7 pb-0">
            <div className="flex items-center justify-between mb-1">
              <DialogTitle className="text-xl font-semibold tracking-tight">
                {editing ? 'Edit test' : 'New test'}
              </DialogTitle>
            </div>
            <DialogDescription className="text-sm text-muted-foreground">
              {editing ? 'Update the test details below.' : 'Schedule a new examination.'}
            </DialogDescription>
          </div>
          <div className="px-7 py-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Test title</Label>
                <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Midterm - Mathematics" className="h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Course</Label>
                <Input value={form.course} onChange={e => setForm({ ...form, course: e.target.value })} placeholder="Mathematics" className="h-10" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Date</Label>
                <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="h-10" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Time</Label>
                <Input value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} placeholder="10:00 - 12:00" className="h-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Venue</Label>
              <Input value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} placeholder="Hall A" className="h-10" />
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
