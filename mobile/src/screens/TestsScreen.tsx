import React, { useState, useCallback } from 'react'
import { View, ScrollView, Modal, Pressable, Alert, ActivityIndicator } from 'react-native'
import { Text, Card, Chip, Button, TextInput } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { fetchData, createRecord, updateRecord, deleteRecord } from '../utils/api'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

export default function TestsScreen() {
  const [tests, setTests] = useState<any[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ title: '', course: '', date: '', time: '', venue: '' })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const insets = useSafeAreaInsets()

  const load = () => { setLoading(true); fetchData<any[]>('tests').then(setTests).catch(() => {}).finally(() => setLoading(false)) }
  useFocusEffect(useCallback(() => { load() }, []))

  const openAdd = () => {
    setEditing(null)
    setForm({ title: '', course: '', date: '', time: '', venue: '' })
    setDialogOpen(true)
  }

  const openEdit = (t: any) => {
    setEditing(t)
    setForm({ title: t.title, course: t.course, date: t.date, time: t.time, venue: t.venue })
    setDialogOpen(true)
  }

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

  const handleDelete = (id: number) => {
    Alert.alert('Delete test', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteRecord('tests', id); load() } },
    ])
  }

  const sorted = [...tests].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const now = Date.now()
  const soonThreshold = 7 * 24 * 60 * 60 * 1000

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 16, padding: 16, paddingBottom: insets.bottom + 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: '700', color: '#1e293b', marginBottom: 4 }}>Test Schedule</Text>
            <Text style={{ fontSize: 14, color: '#64748b' }}>Manage examinations and tests</Text>
          </View>
          <Button mode="contained" onPress={openAdd} buttonColor="#6366f1" style={{ borderRadius: 12, height: 36 }} contentStyle={{ height: 36 }} icon="plus" labelStyle={{ fontSize: 12, marginVertical: 0 }}>
            Add
          </Button>
        </View>

        <Chip icon="clipboard-text-outline" style={{ backgroundColor: '#eef2ff', marginBottom: 16, alignSelf: 'flex-start' }}>
          <Text style={{ color: '#6366f1', fontSize: 12 }}>{sorted.length} exams</Text>
        </Chip>

        {loading && (
          <View style={{ padding: 40, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#6366f1" />
          </View>
        )}
        {sorted.map((t: any) => {
          const d = new Date(t.date).getTime()
          const isSoon = d - now < soonThreshold && d >= now
          const isPast = d < now
          return (
            <Card key={t.id} style={{ backgroundColor: '#ffffff', borderRadius: 16, marginBottom: 12, opacity: isPast ? 0.6 : 1 }} elevation={1}>
              <Card.Content>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#1e293b' }}>{t.title}</Text>
                      {isSoon && (
                        <Chip icon="alert-circle" style={{ backgroundColor: '#fffbeb' }}>
                          <Text style={{ color: '#d97706', fontSize: 10 }}>Soon</Text>
                        </Chip>
                      )}
                    </View>
                    <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{t.course}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <View style={{ backgroundColor: '#eef2ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                      <Text style={{ fontSize: 12, fontWeight: '600', color: '#6366f1' }}>{t.venue}</Text>
                    </View>
                    <Button icon="pencil" compact onPress={() => openEdit(t)} style={{ width: 28, height: 28, borderRadius: 8 }} contentStyle={{ width: 28, height: 28 }} labelStyle={{ fontSize: 11 }} />
                    <Button icon="delete" compact textColor="#dc2626" onPress={() => handleDelete(t.id)} style={{ width: 28, height: 28, borderRadius: 8 }} contentStyle={{ width: 28, height: 28 }} labelStyle={{ fontSize: 11 }} />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f1f5f9' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <MaterialCommunityIcons name="calendar" size={14} color={isPast ? '#94a3b8' : '#64748b'} />
                    <Text style={{ fontSize: 12, color: isPast ? '#94a3b8' : '#64748b', textDecorationLine: isPast ? 'line-through' : 'none' }}>{t.date}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <MaterialCommunityIcons name="clock-outline" size={14} color="#64748b" />
                    <Text style={{ fontSize: 12, color: '#64748b' }}>{t.time}</Text>
                  </View>
                </View>
              </Card.Content>
            </Card>
          )
        })}
      </ScrollView>

      <Modal visible={dialogOpen} transparent animationType="fade" onRequestClose={() => setDialogOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
          <Pressable style={{ flex: 1 }} onPress={() => setDialogOpen(false)} />
          <View style={{ backgroundColor: '#ffffff', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingTop: 10, maxHeight: '90%' }}>
            <View style={{ width: 40, height: 5, backgroundColor: '#d4d4d8', borderRadius: 3, alignSelf: 'center', marginBottom: 4 }} />
            <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 500 }}>
              <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: insets.bottom + 16 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#1e293b', marginBottom: 4 }}>{editing ? 'Edit Test' : 'New Test'}</Text>
                <Text style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>{editing ? 'Update the test details below.' : 'Schedule a new examination.'}</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TextInput label="Title" value={form.title} onChangeText={t => setForm({ ...form, title: t })} mode="outlined" placeholder="Midterm - Mathematics"
                    style={{ marginBottom: 12, flex: 1, backgroundColor: '#f8fafc' }} outlineStyle={{ borderRadius: 10, borderColor: '#e2e8f0' }} activeOutlineColor="#6366f1" />
                  <TextInput label="Course" value={form.course} onChangeText={t => setForm({ ...form, course: t })} mode="outlined" placeholder="Mathematics"
                    style={{ marginBottom: 12, flex: 1, backgroundColor: '#f8fafc' }} outlineStyle={{ borderRadius: 10, borderColor: '#e2e8f0' }} activeOutlineColor="#6366f1" />
                </View>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TextInput label="Date" value={form.date} onChangeText={t => setForm({ ...form, date: t })} mode="outlined" placeholder="2026-06-15"
                    style={{ marginBottom: 12, flex: 1, backgroundColor: '#f8fafc' }} outlineStyle={{ borderRadius: 10, borderColor: '#e2e8f0' }} activeOutlineColor="#6366f1" />
                  <TextInput label="Time" value={form.time} onChangeText={t => setForm({ ...form, time: t })} mode="outlined" placeholder="10:00 - 12:00"
                    style={{ marginBottom: 12, flex: 1, backgroundColor: '#f8fafc' }} outlineStyle={{ borderRadius: 10, borderColor: '#e2e8f0' }} activeOutlineColor="#6366f1" />
                </View>
                <TextInput label="Venue" value={form.venue} onChangeText={t => setForm({ ...form, venue: t })} mode="outlined" placeholder="Hall A"
                  style={{ marginBottom: 16, backgroundColor: '#f8fafc' }} outlineStyle={{ borderRadius: 10, borderColor: '#e2e8f0' }} activeOutlineColor="#6366f1" />
                <View style={{ flexDirection: 'row', gap: 10, paddingTop: 4, borderTopWidth: 1, borderTopColor: '#f1f5f9' }}>
                  <Button mode="outlined" onPress={() => setDialogOpen(false)} style={{ flex: 1, borderRadius: 10, borderColor: '#e2e8f0' }} textColor="#64748b">Cancel</Button>
                  <Button mode="contained" onPress={handleSave} loading={saving} disabled={saving} style={{ flex: 1, borderRadius: 10 }} buttonColor="#6366f1">{editing ? 'Update' : 'Create'}</Button>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}
