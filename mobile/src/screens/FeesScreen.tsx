import React, { useState, useCallback } from 'react'
import { View, ScrollView, RefreshControl, Alert, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, Pressable } from 'react-native'
import { Text, Card, Button, TextInput, Chip } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { getFees, createFee, updateFee, deleteFee } from '../utils/store'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

interface Fee { id: number; studentName: string; totalFees: number; paid: number; due: number; status: string }

export default function FeesScreen() {
  const [fees, setFees] = useState<Fee[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Fee | null>(null)
  const [form, setForm] = useState({ studentName: '', totalFees: '', paid: '' })
  const [saving, setSaving] = useState(false)
  const insets = useSafeAreaInsets()

  const load = async () => setFees(await getFees())
  useFocusEffect(useCallback(() => { load() }, []))
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false) }

  const openAdd = () => { setEditing(null); setForm({ studentName: '', totalFees: '', paid: '' }); setDialogOpen(true) }
  const openEdit = (f: Fee) => { setEditing(f); setForm({ studentName: f.studentName, totalFees: String(f.totalFees), paid: String(f.paid) }); setDialogOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    const totalFees = parseInt(form.totalFees) || 0
    const paid = parseInt(form.paid) || 0
    const due = totalFees - paid
    const status = due === 0 ? 'paid' : paid > 0 ? 'partial' : 'unpaid'
    if (editing) await updateFee(editing.id, { studentName: form.studentName, totalFees, paid, due, status })
    else await createFee({ studentId: 0, studentName: form.studentName, totalFees, paid, due, status })
    setSaving(false)
    setDialogOpen(false)
    load()
  }

  const handleDelete = (id: number) => {
    Alert.alert('Delete fee record', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteFee(id); load() } },
    ])
  }

  const totalDue = fees.reduce((s, f) => s + f.due, 0)
  const totalCollected = fees.reduce((s, f) => s + f.paid, 0)
  const collectionRate = fees.length ? Math.round(totalCollected / fees.reduce((s, f) => s + f.totalFees, 0) * 100) : 0

  const statusColor = (s: string) => {
    switch(s) {
      case 'paid': return { bg: '#f0fdf4', text: '#16a34a' }
      case 'partial': return { bg: '#fffbeb', text: '#d97706' }
      case 'unpaid': return { bg: '#fef2f2', text: '#dc2626' }
      default: return { bg: '#f1f5f9', text: '#64748b' }
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: insets.top + 16, padding: 16, paddingBottom: insets.bottom + 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6366f1']} />}
      >
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#1e293b', marginBottom: 4 }}>Fees Status</Text>
        <Text style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>Track fee payments</Text>

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          {[{ label: 'Collected', value: totalCollected, color: '#16a34a' },
            { label: 'Pending', value: totalDue, color: '#dc2626' },
            { label: 'Total', value: fees.reduce((s,f) => s+f.totalFees, 0), color: '#6366f1' }
          ].map(item => (
            <Card key={item.label} style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: 16 }} elevation={1}>
              <Card.Content style={{ padding: 12 }}>
                <Text style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{item.label}</Text>
                <Text style={{ fontSize: 16, fontWeight: '700', color: item.color }}>₹{(item.value/1000).toFixed(1)}K</Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <Chip icon="currency-inr" style={{ backgroundColor: '#eef2ff' }} textStyle={{ color: '#6366f1', fontSize: 12 }}>
            {collectionRate}% collected
          </Chip>
          <Button mode="contained" onPress={openAdd} buttonColor="#6366f1"
            style={{ borderRadius: 12 }} contentStyle={{ height: 36 }}
            icon={() => <MaterialCommunityIcons name="plus" size={16} color="#fff" />}>
            Add
          </Button>
        </View>

        <Card style={{ backgroundColor: '#ffffff', borderRadius: 16 }} elevation={1}>
          <Card.Content style={{ paddingVertical: 4 }}>
            {fees.map(f => {
              const sc = statusColor(f.status)
              return (
                <TouchableOpacity key={f.id} onPress={() => openEdit(f)}>
                  <View style={{
                    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
                    paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
                  }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '500', color: '#1e293b' }}>{f.studentName}</Text>
                      <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>
                        ₹{f.totalFees.toLocaleString()} · Paid: ₹{f.paid.toLocaleString()}
                      </Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', gap: 4 }}>
                      <View style={{ backgroundColor: sc.bg, paddingHorizontal: 10, paddingVertical: 2, borderRadius: 20 }}>
                        <Text style={{ color: sc.text, fontSize: 12, fontWeight: '600', textTransform: 'capitalize' }}>{f.status}</Text>
                      </View>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: f.due > 0 ? '#dc2626' : '#16a34a' }}>
                        Due: ₹{f.due.toLocaleString()}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDelete(f.id)} style={{ padding: 4, marginLeft: 8 }}>
                      <MaterialCommunityIcons name="delete-outline" size={18} color="#dc2626" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              )
            })}
            {fees.length === 0 && (
              <Text style={{ fontSize: 14, color: '#64748b', textAlign: 'center', paddingVertical: 24 }}>No fee records</Text>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <Modal visible={dialogOpen} transparent animationType="slide" onRequestClose={() => setDialogOpen(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }} onPress={() => setDialogOpen(false)}>
            <Pressable onPress={() => {}} style={{
              backgroundColor: '#ffffff',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingTop: 8,
              paddingBottom: insets.bottom + 16,
              maxHeight: '80%',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.1,
              shadowRadius: 16,
              elevation: 20,
            }}>
              <View style={{ width: 36, height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, alignSelf: 'center', marginBottom: 4 }} />
              <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 400 }}>
                <View style={{ paddingHorizontal: 24, paddingTop: 12 }}>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: '#1e293b', marginBottom: 4 }}>
                    {editing ? 'Edit Fee Record' : 'New Fee Record'}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>
                    {editing ? 'Update the fee details below.' : 'Enter the fee details for a student.'}
                  </Text>

                  <TextInput label="Student name" value={form.studentName} onChangeText={t => setForm({ ...form, studentName: t })}
                    mode="outlined" style={{ marginBottom: 12, backgroundColor: '#f8fafc' }}
                    outlineStyle={{ borderRadius: 10, borderColor: '#e2e8f0' }} activeOutlineColor="#6366f1" />
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    <TextInput label="Total fees (₹)" value={form.totalFees} onChangeText={t => setForm({ ...form, totalFees: t })}
                      mode="outlined" keyboardType="numeric" style={{ marginBottom: 12, flex: 1, backgroundColor: '#f8fafc' }}
                      outlineStyle={{ borderRadius: 10, borderColor: '#e2e8f0' }} activeOutlineColor="#6366f1" />
                    <TextInput label="Paid (₹)" value={form.paid} onChangeText={t => setForm({ ...form, paid: t })}
                      mode="outlined" keyboardType="numeric" style={{ marginBottom: 12, flex: 1, backgroundColor: '#f8fafc' }}
                      outlineStyle={{ borderRadius: 10, borderColor: '#e2e8f0' }} activeOutlineColor="#6366f1" />
                  </View>

                  <View style={{ flexDirection: 'row', gap: 10, paddingTop: 4, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingBottom: 8 }}>
                    <Button mode="outlined" onPress={() => setDialogOpen(false)}
                      style={{ flex: 1, borderRadius: 10, borderColor: '#e2e8f0' }} textColor="#64748b">
                      Cancel
                    </Button>
                    <Button mode="contained" onPress={handleSave} loading={saving} disabled={saving}
                      style={{ flex: 1, borderRadius: 10 }} buttonColor="#6366f1">
                      {editing ? 'Update' : 'Create'}
                    </Button>
                  </View>
                </View>
              </ScrollView>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}
