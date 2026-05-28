import React, { useState, useCallback } from 'react'
import { View, ScrollView, ActivityIndicator } from 'react-native'
import { Text, Card, Chip } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { fetchData } from '../utils/api'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

export default function StudentTestsScreen() {
  const [tests, setTests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const insets = useSafeAreaInsets()

  useFocusEffect(useCallback(() => {
    setLoading(true)
    fetchData<any[]>('tests').then(setTests).catch(() => {}).finally(() => setLoading(false))
  }, []))

  const sorted = [...tests].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  const now = Date.now()
  const soonThreshold = 7 * 24 * 60 * 60 * 1000

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 16, padding: 16, paddingBottom: insets.bottom + 24 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#1e293b', marginBottom: 4 }}>My Tests</Text>
        <Text style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>Upcoming exams and test schedule</Text>

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
                  <View style={{ backgroundColor: '#eef2ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: '#6366f1' }}>{t.venue}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f1f5f9' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <MaterialCommunityIcons name="calendar" size={14} color="#64748b" />
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
    </View>
  )
}
