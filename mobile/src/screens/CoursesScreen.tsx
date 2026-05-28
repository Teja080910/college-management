import React, { useState, useCallback } from 'react'
import { View, ScrollView, Modal, Pressable, Alert, ActivityIndicator } from 'react-native'
import { Text, Card, Chip, Button, TextInput } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { fetchData, createRecord, updateRecord, deleteRecord } from '../utils/api'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const COLORS = [
  { bg: '#eef2ff', chip: '#6366f1' },
  { bg: '#f0fdf4', chip: '#16a34a' },
  { bg: '#fffbeb', chip: '#d97706' },
  { bg: '#fef2f2', chip: '#dc2626' },
  { bg: '#ecfeff', chip: '#0891b2' },
]

export default function CoursesScreen() {
  const [courses, setCourses] = useState<any[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', code: '', description: '', duration: '', credits: '', hod: '' })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const insets = useSafeAreaInsets()

  const load = () => { setLoading(true); fetchData<any[]>('courses').then(setCourses).catch(() => {}).finally(() => setLoading(false)) }
  useFocusEffect(useCallback(() => { load() }, []))

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', code: '', description: '', duration: '', credits: '', hod: '' })
    setDialogOpen(true)
  }

  const openEdit = (c: any) => {
    setEditing(c)
    setForm({ name: c.name, code: c.code, description: c.description, duration: c.duration, credits: String(c.credits), hod: c.hod })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const payload = { name: form.name, code: form.code, description: form.description, duration: form.duration, credits: parseInt(form.credits) || 0, hod: form.hod }
    if (editing) {
      await updateRecord('courses', { id: editing.id, ...payload })
    } else {
      await createRecord('courses', payload)
    }
    setSaving(false)
    setDialogOpen(false)
    load()
  }

  const handleDelete = (id: number) => {
    Alert.alert('Delete course', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteRecord('courses', id); load() } },
    ])
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 16, padding: 16, paddingBottom: insets.bottom + 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: '700', color: '#1e293b', marginBottom: 4 }}>Course Details</Text>
            <Text style={{ fontSize: 14, color: '#64748b' }}>Manage all offered programs</Text>
          </View>
          <Button mode="contained" onPress={openAdd} buttonColor="#6366f1" style={{ borderRadius: 12, height: 36 }} contentStyle={{ height: 36 }} icon="plus" labelStyle={{ fontSize: 12, marginVertical: 0 }}>
            Add
          </Button>
        </View>

        {loading && (
          <View style={{ padding: 40, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#6366f1" />
          </View>
        )}
        {courses.map((c: any, i: number) => {
          const color = COLORS[i % COLORS.length]
          return (
            <Card key={c.id} style={{ backgroundColor: '#ffffff', borderRadius: 16, marginBottom: 12 }} elevation={1}>
              <Card.Content>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#1e293b', flex: 1, marginRight: 8 }}>{c.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Chip style={{ backgroundColor: color.bg }}>
                      <Text style={{ color: color.chip, fontSize: 11, fontWeight: '600' }}>{c.code}</Text>
                    </Chip>
                    <Button icon="pencil" compact onPress={() => openEdit(c)} style={{ width: 28, height: 28, borderRadius: 8 }} contentStyle={{ width: 28, height: 28 }} labelStyle={{ fontSize: 11 }} />
                    <Button icon="delete" compact textColor="#dc2626" onPress={() => handleDelete(c.id)} style={{ width: 28, height: 28, borderRadius: 8 }} contentStyle={{ width: 28, height: 28 }} labelStyle={{ fontSize: 11 }} />
                  </View>
                </View>
                <Text style={{ fontSize: 14, color: '#64748b', lineHeight: 20, marginBottom: 12 }}>{c.description}</Text>
                <View style={{ flexDirection: 'row', gap: 12, marginBottom: 8 }}>
                  <View style={{ backgroundColor: '#f1f5f9', flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}>
                    <MaterialCommunityIcons name="clock-outline" size={14} color="#64748b" />
                    <Text style={{ fontSize: 12, color: '#64748b' }}>{c.duration}</Text>
                  </View>
                  <View style={{ backgroundColor: '#f1f5f9', flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}>
                    <MaterialCommunityIcons name="book-open-outline" size={14} color="#64748b" />
                    <Text style={{ fontSize: 12, color: '#64748b' }}>{c.credits} credits</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f1f5f9' }}>
                  <MaterialCommunityIcons name="account-outline" size={14} color="#64748b" />
                  <Text style={{ fontSize: 12, color: '#64748b' }}>HOD: <Text style={{ fontWeight: '500', color: '#1e293b' }}>{c.hod}</Text></Text>
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
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#1e293b', marginBottom: 4 }}>{editing ? 'Edit Course' : 'New Course'}</Text>
                <Text style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>{editing ? 'Update the course information below.' : 'Enter the details for a new course.'}</Text>
                <TextInput label="Course name" value={form.name} onChangeText={t => setForm({ ...form, name: t })} mode="outlined"
                  style={{ marginBottom: 12, backgroundColor: '#f8fafc' }} outlineStyle={{ borderRadius: 10, borderColor: '#e2e8f0' }} activeOutlineColor="#6366f1" />
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TextInput label="Code" value={form.code} onChangeText={t => setForm({ ...form, code: t })} mode="outlined" placeholder="CS101"
                    style={{ marginBottom: 12, flex: 1, backgroundColor: '#f8fafc' }} outlineStyle={{ borderRadius: 10, borderColor: '#e2e8f0' }} activeOutlineColor="#6366f1" />
                  <TextInput label="Credits" value={form.credits} onChangeText={t => setForm({ ...form, credits: t })} mode="outlined" keyboardType="numeric"
                    style={{ marginBottom: 12, flex: 1, backgroundColor: '#f8fafc' }} outlineStyle={{ borderRadius: 10, borderColor: '#e2e8f0' }} activeOutlineColor="#6366f1" />
                </View>
                <TextInput label="Duration" value={form.duration} onChangeText={t => setForm({ ...form, duration: t })} mode="outlined" placeholder="4 Years"
                  style={{ marginBottom: 12, backgroundColor: '#f8fafc' }} outlineStyle={{ borderRadius: 10, borderColor: '#e2e8f0' }} activeOutlineColor="#6366f1" />
                <TextInput label="HOD" value={form.hod} onChangeText={t => setForm({ ...form, hod: t })} mode="outlined" placeholder="Dr. Adams"
                  style={{ marginBottom: 12, backgroundColor: '#f8fafc' }} outlineStyle={{ borderRadius: 10, borderColor: '#e2e8f0' }} activeOutlineColor="#6366f1" />
                <TextInput label="Description" value={form.description} onChangeText={t => setForm({ ...form, description: t })} mode="outlined"
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
