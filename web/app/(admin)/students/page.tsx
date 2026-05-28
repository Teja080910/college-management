'use client'

import { useState, useEffect } from 'react'
import { fetchData, createRecord, updateRecord, deleteRecord } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Users, Plus, Pencil, Trash2, GraduationCap, X, Check, Loader2 } from 'lucide-react'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface Student { id: number; name: string; age: number; grade: string; email: string; phone: string; enrolled: boolean }

const emptyForm = { name: '', age: '', grade: '', email: '', phone: '', enrolled: true }

function StudentDialog({ open, onOpenChange, editing, form, setForm, onSave, saving }: {
  open: boolean; onOpenChange: (v: boolean) => void; editing: Student | null
  form: typeof emptyForm; setForm: (f: typeof emptyForm) => void; onSave: () => void; saving: boolean
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden rounded-2xl border-border/50 shadow-2xl">
        <div className="px-7 pt-7 pb-0">
          <div className="flex items-center justify-between mb-1">
            <DialogTitle className="text-xl font-semibold tracking-tight">
              {editing ? 'Edit student' : 'New student'}
            </DialogTitle>
            <button onClick={() => onOpenChange(false)} className="size-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            {editing ? 'Update the student information below.' : 'Enter the details to register a new student.'}
          </DialogDescription>
        </div>

        <div className="px-7 py-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Full name</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Age</Label>
              <Input type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} placeholder="20" className="h-10" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Grade</Label>
              <Input value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} placeholder="A" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Email</Label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" className="h-10" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Phone</Label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="555-0100" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <select
                value={String(form.enrolled)}
                onChange={e => setForm({ ...form, enrolled: e.target.value === 'true' })}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="px-7 py-4 bg-muted/30 border-t border-border/50 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {editing ? 'Changes will be saved immediately.' : 'A new record will be created.'}
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="h-9 px-4">Cancel</Button>
            <Button onClick={onSave} disabled={saving} className="h-9 px-5 gap-1.5">
              {saving && <Loader2 className="size-3.5 animate-spin" />}
              {!saving && <Check className="size-3.5" />}
              {editing ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [search, setSearch] = useState('')
  const [loaded, setLoaded] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Student | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = () => fetchData<Student[]>('students').then(setStudents)
  useEffect(() => { setLoaded(true); load() }, [])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true) }
  const openEdit = (s: Student) => { setEditing(s); setForm({ name: s.name, age: String(s.age), grade: s.grade, email: s.email, phone: s.phone, enrolled: s.enrolled }); setDialogOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    const payload = { name: form.name, age: parseInt(form.age) || 0, grade: form.grade, email: form.email, phone: form.phone, enrolled: form.enrolled }
    if (editing) {
      await updateRecord('students', { id: editing.id, ...payload })
    } else {
      await createRecord('students', payload)
    }
    setSaving(false)
    setDialogOpen(false)
    load()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Delete this student?')) {
      await deleteRecord('students', id)
      load()
    }
  }

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
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-sm font-medium text-primary border border-primary/15">
            <Users className="size-4" />
            {students.length} total
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
            <Plus className="size-4" />
            Add Student
          </button>
        </div>
      </div>

      <div className={`flex items-center gap-3 transition-all duration-500 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10 bg-white/80 border-border/60 focus:bg-white transition-all duration-200 rounded-xl" />
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
                {['ID','Name','Age','Grade','Email','Phone','Status',''].map(h => (
                  <TableHead key={h} className="h-11 px-6">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(s => (
                <TableRow key={s.id} className="border-border/50 hover:bg-muted/30 transition-colors group">
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
                  <TableCell className="px-6 py-3.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button onClick={() => openEdit(s)} className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors">
                        <Pencil className="size-3.5" />
                      </button>
                      <button onClick={() => handleDelete(s.id)} className="size-8 rounded-lg hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors">
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <StudentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        form={form}
        setForm={setForm}
        onSave={handleSave}
        saving={saving}
      />
    </div>
  )
}
