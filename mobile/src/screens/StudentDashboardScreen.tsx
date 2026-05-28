import React, { useState, useCallback } from 'react'
import { View, ScrollView, RefreshControl, ActivityIndicator } from 'react-native'
import { Text, Card, Chip } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { fetchData } from '../utils/api'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useAuth } from '../context/AuthContext'

export default function StudentDashboardScreen() {
  const [courses, setCourses] = useState<any[]>([])
  const [fees, setFees] = useState<any[]>([])
  const [tests, setTests] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)
  const insets = useSafeAreaInsets()
  const { logout } = useAuth()

  const load = async () => {
    setLoading(true)
    const [c, f, t] = await Promise.all([
      fetchData<any[]>('courses').catch(() => []),
      fetchData<any[]>('fees').catch(() => []),
      fetchData<any[]>('tests').catch(() => []),
    ])
    setCourses(c)
    setFees(f)
    setTests(t)
    setLoading(false)
  }

  useFocusEffect(useCallback(() => { load() }, []))
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false) }

  const upcomingTests = tests.filter((t: any) => new Date(t.date) >= new Date()).length
  const myFee = fees.length > 0 ? fees[0] : null
  const feeStatus = myFee?.status === 'paid' ? 'Up to date' : myFee ? 'Pending' : 'No records'
  const feeColor = myFee?.status === 'paid' ? '#16a34a' : '#dc2626'
  const feeBg = myFee?.status === 'paid' ? '#f0fdf4' : '#fef2f2'

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: insets.top + 16, padding: 16, paddingBottom: insets.bottom + 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6366f1']} />}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: '700', color: '#1e293b' }}>My Dashboard</Text>
            <Text style={{ fontSize: 14, color: '#64748b', marginTop: 2 }}>Your academic overview</Text>
          </View>
          <Chip icon={() => <MaterialCommunityIcons name="logout" size={18} color="#64748b" />} onPress={logout} mode="outlined" style={{ borderColor: '#e2e8f0' }}>
            Logout
          </Chip>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: -6 }}>
          {[
            { label: 'Enrolled Courses', value: courses.length, icon: 'book-open-variant', color: '#6366f1', bg: '#eef2ff' },
            { label: 'Upcoming Exams', value: upcomingTests, icon: 'clipboard-text', color: '#d97706', bg: '#fffbeb' },
            { label: 'Fee Status', value: feeStatus, icon: 'currency-inr', color: feeColor, bg: feeBg },
          ].map(s => (
            <View key={s.label} style={{ width: '50%', padding: 6 }}>
              <Card style={{ backgroundColor: '#ffffff', borderRadius: 16 }} elevation={2}>
                <Card.Content style={{ padding: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ fontSize: 12, color: '#64748b', fontWeight: '500' }}>{s.label}</Text>
                    <View style={{ backgroundColor: s.bg, width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
                      <MaterialCommunityIcons name={s.icon} size={18} color={s.color} />
                    </View>
                  </View>
                  <Text style={{ fontSize: 24, fontWeight: '700', color: '#1e293b' }}>{s.value}</Text>
                </Card.Content>
              </Card>
            </View>
          ))}
        </View>

        <Card style={{ marginTop: 20, backgroundColor: '#ffffff', borderRadius: 16 }} elevation={2}>
          <Card.Content>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 12 }}>My Courses</Text>
            {loading && (
              <View style={{ padding: 40, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="small" color="#6366f1" />
              </View>
            )}
            {courses.map((c: any) => (
              <View key={c.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: '#1e293b' }}>{c.name}</Text>
                  <Text style={{ fontSize: 12, color: '#64748b' }}>{c.duration} · {c.credits} cr</Text>
                </View>
                <View style={{ backgroundColor: '#eef2ff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#6366f1' }}>{c.code}</Text>
                </View>
              </View>
            ))}
            {!loading && courses.length === 0 && (
              <Text style={{ fontSize: 14, color: '#64748b', textAlign: 'center', paddingVertical: 16 }}>No courses enrolled</Text>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  )
}
