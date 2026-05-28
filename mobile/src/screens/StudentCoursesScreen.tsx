import React, { useState, useCallback } from 'react'
import { View, ScrollView, ActivityIndicator } from 'react-native'
import { Text, Card, Chip } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { fetchData } from '../utils/api'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const COLORS = [
  { bg: '#eef2ff', chip: '#6366f1' },
  { bg: '#f0fdf4', chip: '#16a34a' },
  { bg: '#fffbeb', chip: '#d97706' },
  { bg: '#fef2f2', chip: '#dc2626' },
  { bg: '#ecfeff', chip: '#0891b2' },
]

export default function StudentCoursesScreen() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const insets = useSafeAreaInsets()

  useFocusEffect(useCallback(() => {
    setLoading(true)
    fetchData<any[]>('courses').then(setCourses).catch(() => {}).finally(() => setLoading(false))
  }, []))

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 16, padding: 16, paddingBottom: insets.bottom + 24 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#1e293b', marginBottom: 4 }}>My Courses</Text>
        <Text style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>Courses you are enrolled in</Text>

        {loading && (
          <View style={{ padding: 40, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#6366f1" />
          </View>
        )}
        {courses.map((c, i) => {
          const color = COLORS[i % COLORS.length]
          return (
            <Card key={c.id} style={{ backgroundColor: '#ffffff', borderRadius: 16, marginBottom: 12 }} elevation={1}>
              <Card.Content>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#1e293b', flex: 1, marginRight: 8 }}>{c.name}</Text>
                  <Chip style={{ backgroundColor: color.bg }}>
                    <Text style={{ color: color.chip, fontSize: 11, fontWeight: '600' }}>{c.code}</Text>
                  </Chip>
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
    </View>
  )
}
