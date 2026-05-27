'use client'

import { useState, useEffect } from 'react'
import { fetchData, createRecord, updateRecord, deleteRecord } from '@/lib/api'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Banknote, TrendingUp, TrendingDown, Plus, Pencil, Trash2, X, Check, Loader2 } from 'lucide-react'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'

interface Fee { id: number; studentName: string; totalFees: number; paid: number; due: number; status: string }

const emptyForm = { studentName: '', totalFees: '', paid: '' }

const badgeClass = (s: string) => {
  switch(s) {
    case 'paid': return 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/15 border-0 font-normal'
    case 'partial': return 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/15 border-0 font-normal'
    case 'unpaid': return 'bg-red-500/10 text-red-600 hover:bg-red-500/15 border-0 font-normal'
    default: return ''
  }
}

function FeeDialog({ open, onOpenChange, editing, form, setForm, onSave, saving }: {
  open: boolean; onOpenChange: (v: boolean) => void; editing: Fee | null
  form: typeof emptyForm; setForm: (f: typeof emptyForm) => void; onSave: () => void; saving: boolean
}) {
  const total = parseInt(form.totalFees) || 0
  const paid = parseInt(form.paid) || 0
  const due = Math.max(0, total - paid)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden rounded-2xl border-border/50 shadow-2xl">
        <div className="px-7 pt-7 pb-0">
          <div className="flex items-center justify-between mb-1">
            <DialogTitle className="text-xl font-semibold tracking-tight">
              {editing ? 'Edit fee record' : 'New fee record'}
            </DialogTitle>
            <button onClick={() => onOpenChange(false)} className="size-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            {editing ? 'Update the fee details below.' : 'Enter the fee details for a student.'}
          </DialogDescription>
        </div>

        <div className="px-7 py-6 space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Student name</Label>
            <Input value={form.studentName} onChange={e => setForm({ ...form, studentName: e.target.value })} placeholder="Alice Johnson" className="h-10" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Total fees (₹)</Label>
              <Input type="number" value={form.totalFees} onChange={e => setForm({ ...form, totalFees: e.target.value })} placeholder="50000" className="h-10" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Paid amount (₹)</Label>
              <Input type="number" value={form.paid} onChange={e => setForm({ ...form, paid: e.target.value })} placeholder="35000" className="h-10" />
            </div>
          </div>

          {form.totalFees && (
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="text-center p-3 rounded-xl bg-muted/50 border border-border/50">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium mb-0.5">Total</p>
                <p className="text-base font-bold">₹{total.toLocaleString()}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <p className="text-[11px] text-emerald-600 uppercase tracking-wider font-medium mb-0.5">Paid</p>
                <p className="text-base font-bold text-emerald-600">₹{paid.toLocaleString()}</p>
              </div>
              <div className={`text-center p-3 rounded-xl ${due > 0 ? 'bg-red-500/5 border border-red-500/10' : 'bg-emerald-500/5 border border-emerald-500/10'}`}>
                <p className={`text-[11px] uppercase tracking-wider font-medium mb-0.5 ${due > 0 ? 'text-red-600' : 'text-emerald-600'}`}>Due</p>
                <p className={`text-base font-bold ${due > 0 ? 'text-red-600' : 'text-emerald-600'}`}>₹{due.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        <div className="px-7 py-4 bg-muted/30 border-t border-border/50 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {editing ? 'Changes will be saved immediately.' : 'A new fee record will be created.'}
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

export default function FeesPage() {
  const [fees, setFees] = useState<Fee[]>([])
  const [loaded, setLoaded] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Fee | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = () => fetchData<Fee[]>('fees').then(setFees)
  useEffect(() => { setLoaded(true); load() }, [])

  const openAdd = () => { setEditing(null); setForm(emptyForm); setDialogOpen(true) }
  const openEdit = (f: Fee) => { setEditing(f); setForm({ studentName: f.studentName, totalFees: String(f.totalFees), paid: String(f.paid) }); setDialogOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    const totalFees = parseInt(form.totalFees) || 0
    const paid = parseInt(form.paid) || 0
    const due = totalFees - paid
    const status = due === 0 ? 'paid' : paid > 0 ? 'partial' : 'unpaid'
    const payload = { studentName: form.studentName, totalFees, paid, due, status }
    if (editing) {
      await updateRecord('fees', { id: editing.id, ...payload })
    } else {
      await createRecord('fees', payload)
    }
    setSaving(false)
    setDialogOpen(false)
    load()
  }

  const handleDelete = async (id: number) => {
    if (confirm('Delete this fee record?')) {
      await deleteRecord('fees', id)
      load()
    }
  }

  const totalDue = fees.reduce((s, f) => s + f.due, 0)
  const totalCollected = fees.reduce((s, f) => s + f.paid, 0)
  const collectionRate = fees.length ? Math.round(totalCollected / fees.reduce((s, f) => s + f.totalFees, 0) * 100) : 0

  return (
    <div className="space-y-8">
      <div className={`flex items-center justify-between transition-all duration-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fees Status</h1>
          <p className="text-sm text-muted-foreground mt-1">Track fee payments across students</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-sm font-medium text-primary border border-primary/15">
            <Banknote className="size-4" />
            {collectionRate}% collected
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm">
            <Plus className="size-4" />
            Add Record
          </button>
        </div>
      </div>

      <div className={`grid gap-4 grid-cols-1 sm:grid-cols-3 transition-all duration-500 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <Card className="border bg-white/80 backdrop-blur-sm shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Collected</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-emerald-600">₹{(totalCollected / 1000).toFixed(1)}K</span>
              <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600"><TrendingUp className="size-3" />{collectionRate}%</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border bg-white/80 backdrop-blur-sm shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pending Amount</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-red-600">₹{(totalDue / 1000).toFixed(1)}K</span>
              <span className="flex items-center gap-0.5 text-xs font-medium text-red-600"><TrendingDown className="size-3" />{fees.filter(f => f.due > 0).length} defaulters</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border bg-white/80 backdrop-blur-sm shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Expected</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">₹{(fees.reduce((s, f) => s + f.totalFees, 0) / 1000).toFixed(1)}K</span>
              <span className="text-xs text-muted-foreground">{fees.length} students</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className={`border bg-white/80 backdrop-blur-sm shadow-sm transition-all duration-700 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Fee Records</CardTitle>
          <CardDescription>Detailed breakdown of all student payments</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                {['Student','Total Fees','Paid','Due','Status',''].map(h => (
                  <TableHead key={h} className="h-11 px-6">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {fees.map(f => (
                <TableRow key={f.id} className="border-border/50 hover:bg-muted/30 transition-colors group">
                  <TableCell className="px-6 py-3.5 font-medium">{f.studentName}</TableCell>
                  <TableCell className="px-6 py-3.5">₹{f.totalFees.toLocaleString()}</TableCell>
                  <TableCell className="px-6 py-3.5">₹{f.paid.toLocaleString()}</TableCell>
                  <TableCell className={`px-6 py-3.5 font-semibold ${f.due > 0 ? 'text-red-600' : 'text-emerald-600'}`}>₹{f.due.toLocaleString()}</TableCell>
                  <TableCell className="px-6 py-3.5"><Badge className={badgeClass(f.status)}>{f.status}</Badge></TableCell>
                  <TableCell className="px-6 py-3.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button onClick={() => openEdit(f)} className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors">
                        <Pencil className="size-3.5" />
                      </button>
                      <button onClick={() => handleDelete(f.id)} className="size-8 rounded-lg hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors">
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

      <FeeDialog
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
