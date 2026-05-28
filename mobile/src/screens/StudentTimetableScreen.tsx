import React, { useState, useCallback } from 'react'
import { View, ScrollView, ActivityIndicator } from 'react-native'
import { Text, Card, Chip } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { fetchData } from '../utils/api'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const DAY_COLORS: Record<string, { dot: string; bg: string }> = {
  Monday: { dot: '#6366f1', bg: '#eef2ff' },
  Tuesday: { dot: '#16a34a', bg: '#f0fdf4' },
  Wednesday: { dot: '#d97706', bg: '#fffbeb' },
  Thursday: { dot: '#dc2626', bg: '#fef2f2' },
  Friday: { dot: '#0891b2', bg: '#ecfeff' },
}

export default function StudentTimetableScreen() {
  const [timetable, setTimetable] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const insets = useSafeAreaInsets()
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  useFocusEffect(useCallback(() => {
    setLoading(true)
    fetchData<any[]>('timetable').then(setTimetable).catch(() => {}).finally(() => setLoading(false))
  }, []))

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 16, padding: 16, paddingBottom: insets.bottom + 24 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#1e293b', marginBottom: 4 }}>My Timetable</Text>
        <Text style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>Your weekly class schedule</Text>

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
                </View>
                {day.periods.map((p: any, j: number) => (
                  <View key={j} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: j < day.periods.length - 1 ? 1 : 0, borderBottomColor: '#f8fafc' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '500', color: '#1e293b' }}>{p.subject}</Text>
                      <Text style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{p.faculty}</Text>
                    </View>
                    <View style={{ backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}>
                      <Text style={{ fontSize: 12, fontFamily: 'monospace', color: '#64748b' }}>{p.time}</Text>
                    </View>
                  </View>
                ))}
              </Card.Content>
            </Card>
          )
        })}
      </ScrollView>
    </View>
  )
}
