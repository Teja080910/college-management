import React, { useState, useCallback, useEffect } from 'react'
import { View, ScrollView, RefreshControl, Alert, TouchableOpacity, Modal, Pressable, Keyboard } from 'react-native'
import { Text, Card, Button, TextInput, Chip, Searchbar } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { getStudents, createStudent, updateStudent, deleteStudent } from '../utils/store'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

interface Student { id: number; name: string; age: number; grade: string; email: string; phone: string; enrolled: boolean }

export default function StudentsScreen() {
  const [students, setStudents] = useState<Student[]>([])
  const [search, setSearch] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Student | null>(null)
  const [form, setForm] = useState({ name: '', age: '', grade: '', email: '', phone: '', enrolled: true })
  const [saving, setSaving] = useState(false)
  const insets = useSafeAreaInsets()
  const [keyboardHeight, setKeyboardHeight] = useState(0)

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => setKeyboardHeight(e.endCoordinates.height))
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0))
    return () => { showSub.remove(); hideSub.remove() }
  }, [])

  const load = async () => setStudents(await getStudents())
  useFocusEffect(useCallback(() => { load() }, []))
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false) }

  const openAdd = () => { setEditing(null); setForm({ name: '', age: '', grade: '', email: '', phone: '', enrolled: true }); setDialogOpen(true) }
  const openEdit = (s: Student) => { setEditing(s); setForm({ name: s.name, age: String(s.age), grade: s.grade, email: s.email, phone: s.phone, enrolled: s.enrolled }); setDialogOpen(true) }

  const handleSave = async () => {
    setSaving(true)
    const payload = { name: form.name, age: parseInt(form.age) || 0, grade: form.grade, email: form.email, phone: form.phone, enrolled: form.enrolled }
    if (editing) await updateStudent(editing.id, payload)
    else await createStudent(payload as any)
    setSaving(false)
    setDialogOpen(false)
    load()
  }

  const handleDelete = (id: number) => {
    Alert.alert('Delete student', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteStudent(id); load() } },
    ])
  }

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: insets.top + 16, padding: 16, paddingBottom: insets.bottom + 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6366f1']} />}
      >
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#1e293b', marginBottom: 4 }}>Students</Text>
        <Text style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>Manage all registered students</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16, alignItems: 'center' }}>
          <View style={{ flex: 1, height: 44, justifyContent: 'center' }}>
            <Searchbar placeholder="Search by name or email..." value={search} onChangeText={setSearch}
              style={{ backgroundColor: '#ffffff', borderRadius: 12, height: 44 }} inputStyle={{ fontSize: 14, minHeight: 0 }} />
          </View>
          <Button mode="contained" onPress={openAdd} buttonColor="#6366f1" contentStyle={{ height: 44 }}
            style={{ borderRadius: 12, height: 44 }} labelStyle={{ fontSize: 14, marginVertical: 0 }}
            icon={() => <MaterialCommunityIcons name="plus" size={18} color="#fff" />}>Add</Button>
        </View>
        <Card style={{ backgroundColor: '#ffffff', borderRadius: 16 }} elevation={1}>
          <Card.Content style={{ paddingVertical: 4 }}>
            {filtered.map(s => (
              <TouchableOpacity key={s.id} onPress={() => openEdit(s)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                    <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: '#6366f1' }}>{s.name.charAt(0)}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '500', color: '#1e293b' }}>{s.name}</Text>
                      <Text style={{ fontSize: 12, color: '#64748b' }}>{s.email}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, backgroundColor: s.enrolled ? '#f0fdf4' : '#f1f5f9' }}>
                      <Text style={{ fontSize: 12, fontWeight: '600', color: s.enrolled ? '#16a34a' : '#64748b' }}>{s.enrolled ? 'Active' : 'Inactive'}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleDelete(s.id)} style={{ padding: 4 }}>
                      <MaterialCommunityIcons name="delete-outline" size={18} color="#dc2626" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            {filtered.length === 0 && <Text style={{ fontSize: 14, color: '#64748b', textAlign: 'center', paddingVertical: 24 }}>No students found</Text>}
          </Card.Content>
        </Card>
      </ScrollView>

      <Modal visible={dialogOpen} transparent animationType="fade" onRequestClose={() => setDialogOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
          <Pressable style={{ flex: 1 }} onPress={() => setDialogOpen(false)} />
          <View style={{ backgroundColor: '#ffffff', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingTop: 10, maxHeight: '90%' }}>
            <View style={{ width: 40, height: 5, backgroundColor: '#d4d4d8', borderRadius: 3, alignSelf: 'center', marginBottom: 4 }} />
            <ScrollView keyboardShouldPersistTaps="handled" style={{ maxHeight: 500 }}>
              <View style={{ paddingHorizontal: 24, paddingTop: 12, paddingBottom: Math.max(insets.bottom, 16) + keyboardHeight }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#1e293b', marginBottom: 4 }}>{editing ? 'Edit Student' : 'New Student'}</Text>
                <Text style={{ fontSize: 14, color: '#64748b', marginBottom: 20 }}>{editing ? 'Update the student details below.' : 'Fill in the details to register a new student.'}</Text>
                <TextInput label="Full name" value={form.name} onChangeText={t => setForm({ ...form, name: t })} mode="outlined"
                  style={{ marginBottom: 12, backgroundColor: '#f8fafc' }} outlineStyle={{ borderRadius: 10, borderColor: '#e2e8f0' }} activeOutlineColor="#6366f1" />
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TextInput label="Age" value={form.age} onChangeText={t => setForm({ ...form, age: t })} mode="outlined" keyboardType="numeric"
                    style={{ marginBottom: 12, flex: 1, backgroundColor: '#f8fafc' }} outlineStyle={{ borderRadius: 10, borderColor: '#e2e8f0' }} activeOutlineColor="#6366f1" />
                  <TextInput label="Grade" value={form.grade} onChangeText={t => setForm({ ...form, grade: t })} mode="outlined"
                    style={{ marginBottom: 12, flex: 1, backgroundColor: '#f8fafc' }} outlineStyle={{ borderRadius: 10, borderColor: '#e2e8f0' }} activeOutlineColor="#6366f1" />
                </View>
                <TextInput label="Email" value={form.email} onChangeText={t => setForm({ ...form, email: t })} mode="outlined" keyboardType="email-address"
                  style={{ marginBottom: 12, backgroundColor: '#f8fafc' }} outlineStyle={{ borderRadius: 10, borderColor: '#e2e8f0' }} activeOutlineColor="#6366f1" />
                <TextInput label="Phone" value={form.phone} onChangeText={t => setForm({ ...form, phone: t })} mode="outlined"
                  style={{ marginBottom: 16, backgroundColor: '#f8fafc' }} outlineStyle={{ borderRadius: 10, borderColor: '#e2e8f0' }} activeOutlineColor="#6366f1" />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <Text style={{ fontSize: 14, color: '#1e293b', fontWeight: '500' }}>Status:</Text>
                  <Chip selected={form.enrolled} onPress={() => setForm({ ...form, enrolled: true })}
                    style={{ backgroundColor: form.enrolled ? '#eef2ff' : '#f1f5f9' }} textStyle={{ fontSize: 12, color: form.enrolled ? '#6366f1' : '#64748b' }}>Active</Chip>
                  <Chip selected={!form.enrolled} onPress={() => setForm({ ...form, enrolled: false })}
                    style={{ backgroundColor: !form.enrolled ? '#eef2ff' : '#f1f5f9' }} textStyle={{ fontSize: 12, color: !form.enrolled ? '#6366f1' : '#64748b' }}>Inactive</Chip>
                </View>
                <View style={{ flexDirection: 'row', gap: 10, paddingTop: 4, borderTopWidth: 1, borderTopColor: '#f1f5f9' }}>
                  <Button mode="outlined" onPress={() => setDialogOpen(false)}
                    style={{ flex: 1, borderRadius: 10, borderColor: '#e2e8f0' }} textColor="#64748b">Cancel</Button>
                  <Button mode="contained" onPress={handleSave} loading={saving} disabled={saving}
                    style={{ flex: 1, borderRadius: 10 }} buttonColor="#6366f1">{editing ? 'Update' : 'Create'}</Button>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}
