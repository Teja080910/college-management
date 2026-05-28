import React, { useState, useCallback } from 'react'
import { View, ScrollView, Modal, Pressable, Alert, ActivityIndicator } from 'react-native'
import { Text, Card, Chip, Button, TextInput } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { fetchData, updateRecord } from '../utils/api'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const DAY_COLORS: Record<string, { dot: string; bg: string }> = {
  Monday:    { dot: '#6366f1', bg: '#eef2ff' },
  Tuesday:   { dot: '#16a34a', bg: '#f0fdf4' },
  Wednesday: { dot: '#d97706', bg: '#fffbeb' },
  Thursday:  { dot: '#dc2626', bg: '#fef2f2' },
  Friday:    { dot: '#0891b2', bg: '#ecfeff' },
}

export default function TimetableScreen() {
  const [timetable, setTimetable] = useState<any[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingDay, setEditingDay] = useState<any>(null)
  const [editingPeriodIdx, setEditingPeriodIdx] = useState<number | null>(null)
  const [periodForm, setPeriodForm] = useState({ subject: '', faculty: '', time: '' })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const insets = useSafeAreaInsets()
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  const load = () => { setLoading(true); fetchData<any[]>('timetable').then(setTimetable).catch(() => {}).finally(() => setLoading(false)) }
  useFocusEffect(useCallback(() => { load() }, []))

  const openAdd = (day: any) => {
    setEditingDay(day)
    setEditingPeriodIdx(null)
    setPeriodForm({ subject: '', faculty: '', time: '' })
    setDialogOpen(true)
  }

  const openEdit = (day: any, idx: number) => {
    setEditingDay(day)
    setEditingPeriodIdx(idx)
    setPeriodForm(day.periods[idx])
    setDialogOpen(true)
  }

  const handleSave = async () => {
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

  const handleDelete = (day: any, idx: number) => {
    Alert.alert('Delete period', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        const periods = day.periods.filter((_: any, i: number) => i !== idx)
        await updateRecord('timetable', { id: day.id, day: day.day, periods })
        load()
      }},
    ])
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 16, padding: 16, paddingBottom: insets.bottom + 24 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#1e293b', marginBottom: 4 }}>Timetable</Text>
        <Text style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>Manage weekly class schedule</Text>

        <Chip icon="calendar" style={{ backgroundColor: '#eef2ff', marginBottom: 16, alignSelf: 'flex-start' }}>
          <Text style={{ color: '#6366f1', fontSize: 12 }}>{todayName}</Text>
        </Chip>

        {loading && (
          <View style={{ padding: 40, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#6366f1" />
          </View>
        )}
        {timetable.map((day: any) => {
          const colors = DAY_COLORS[day.day] || DAY_COLORS.Monday
          const isToday = day.day === todayName
          return (
            <Card key={day.id || day.day} style={{ backgroundColor: '#ffffff', borderRadius: 16, marginBottom: 12, borderWidth: isToday ? 1 : 0, borderColor: '#6366f1' }} elevation={isToday ? 3 : 1}>
              <Card.Content>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.dot }} />
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#1e293b', flex: 1 }}>{day.day}</Text>
                  {isToday && (
                    <View style={{ backgroundColor: colors.bg, paddingHorizontal: 10, paddingVertical: 2, borderRadius: 20 }}>
                      <Text style={{ fontSize: 11, fontWeight: '600', color: colors.dot }}>Today</Text>
                    </View>
                  )}
                  <Button mode="contained" compact buttonColor="#6366f1" icon="plus" onPress={() => openAdd(day)} style={{ borderRadius: 8, height: 28 }} contentStyle={{ height: 28 }} labelStyle={{ fontSize: 11, marginVertical: 0 }}>
                    Add
                  </Button>
                </View>
                {day.periods.map((p: any, j: number) => (
                  <View key={j} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: j < day.periods.length - 1 ? 1 : 0, borderBottomColor: '#f8fafc' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '500', color: '#1e293b' }}>{p.subject}</Text>
                      <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{p.faculty}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <View style={{ backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}>
                        <Text style={{ fontSize: 12, fontFamily: 'monospace', color: '#64748b' }}>{p.time}</Text>
                      </View>
                      <Button icon="pencil" compact onPress={() => openEdit(day, j)} style={{ width: 28, height: 28, borderRadius: 8 }} contentStyle={{ width: 28, height: 28 }} labelStyle={{ fontSize: 11 }} />
                      <Button icon="delete" compact textColor="#dc2626" onPress={() => handleDelete(day, j)} style={{ width: 28, height: 28, borderRadius: 8 }} contentStyle={{ width: 28, height: 28 }} labelStyle={{ fontSize: 11 }} />
                    </View>
                  </View>
                ))}
              </Card.Content>
            </Card>
          )
        })}
      </ScrollView>

      <Modal visible={dialogOpen} transparent animationType="fade" onRequestClose={() => setDialogOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
          <Pressable style={{ flex: 1 }} onPress={() => setDialogOpen(false)} />
          <View style={{ backgroundColor: '#ffffff', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingTop: 10, maxHeight: '85%' }}>
            <View style={{ width: 40, height: 5, backgroundColor: '#d4d4d8', borderRadius: 3, alignSelf: 'center', marginBottom: 4 }} />
            <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 400 }}>
              <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: insets.bottom + 16 }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#1e293b', marginBottom: 4 }}>
                  {editingPeriodIdx !== null ? 'Edit Period' : 'Add Period'}
                </Text>
                <Text style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>{editingDay?.day} — {editingPeriodIdx !== null ? 'Update period details' : 'Add a new class period'}</Text>
                <TextInput label="Subject" value={periodForm.subject} onChangeText={t => setPeriodForm({ ...periodForm, subject: t })} mode="outlined"
                  style={{ marginBottom: 12, backgroundColor: '#f8fafc' }} outlineStyle={{ borderRadius: 10, borderColor: '#e2e8f0' }} activeOutlineColor="#6366f1" />
                <TextInput label="Faculty" value={periodForm.faculty} onChangeText={t => setPeriodForm({ ...periodForm, faculty: t })} mode="outlined"
                  style={{ marginBottom: 12, backgroundColor: '#f8fafc' }} outlineStyle={{ borderRadius: 10, borderColor: '#e2e8f0' }} activeOutlineColor="#6366f1" />
                <TextInput label="Time" value={periodForm.time} onChangeText={t => setPeriodForm({ ...periodForm, time: t })} mode="outlined" placeholder="08:00 - 09:00"
                  style={{ marginBottom: 16, backgroundColor: '#f8fafc' }} outlineStyle={{ borderRadius: 10, borderColor: '#e2e8f0' }} activeOutlineColor="#6366f1" />
                <View style={{ flexDirection: 'row', gap: 10, paddingTop: 4, borderTopWidth: 1, borderTopColor: '#f1f5f9' }}>
                  <Button mode="outlined" onPress={() => setDialogOpen(false)} style={{ flex: 1, borderRadius: 10, borderColor: '#e2e8f0' }} textColor="#64748b">Cancel</Button>
                  <Button mode="contained" onPress={handleSave} loading={saving} disabled={saving} style={{ flex: 1, borderRadius: 10 }} buttonColor="#6366f1">{editingPeriodIdx !== null ? 'Update' : 'Add'}</Button>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}
