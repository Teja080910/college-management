'use client'

import { useState, useCallback } from 'react'
import { View, ScrollView, RefreshControl } from 'react-native'
import { Text, Card, Chip } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { getStudents, getFees, defaultTests } from '../utils/store'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { useAuth } from '../context/AuthContext'

export default function DashboardScreen() {
  const [students, setStudents] = useState<any[]>([])
  const [fees, setFees] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const insets = useSafeAreaInsets()
  const { logout } = useAuth()

  const load = async () => {
    setStudents(await getStudents())
    setFees(await getFees())
  }

  useFocusEffect(useCallback(() => { load() }, []))

  const onRefresh = async () => {
    setRefreshing(true)
    await load()
    setRefreshing(false)
  }

  const paidCount = fees.filter(f => f.status === 'paid').length
  const totalRevenue = fees.reduce((s, f) => s + f.paid, 0)
  const upcomingTests = defaultTests.filter(t => new Date(t.date) >= new Date()).length

  const stats = [
    { label: 'Total Students', value: students.length, icon: 'account-group', color: '#6366f1', bg: '#eef2ff' },
    { label: 'Fees Paid', value: `${paidCount}/${fees.length}`, icon: 'currency-inr', color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Revenue', value: `₹${(totalRevenue / 1000).toFixed(1)}K`, icon: 'trending-up', color: '#d97706', bg: '#fffbeb' },
    { label: 'Tests', value: upcomingTests, icon: 'clipboard-text', color: '#dc2626', bg: '#fef2f2' },
  ]

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: insets.top + 16, padding: 16, paddingBottom: insets.bottom + 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6366f1']} />}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <View>
            <Text style={{ fontSize: 24, fontWeight: '700', color: '#1e293b' }}>Dashboard</Text>
            <Text style={{ fontSize: 14, color: '#64748b', marginTop: 2 }}>Overview of the institution</Text>
          </View>
          <Chip icon={() => <MaterialCommunityIcons name="logout" size={18} color="#64748b" />} onPress={logout} mode="outlined" style={{ borderColor: '#e2e8f0' }}>
            Logout
          </Chip>
        </View>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', margin: -6 }}>
          {stats.map(s => (
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
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 12 }}>Enrolled Students</Text>
            {students.filter(s => s.enrolled).map(s => (
              <View key={s.id} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#eef2ff', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#6366f1' }}>{s.name.charAt(0)}</Text>
                  </View>
                  <View>
                    <Text style={{ fontSize: 14, fontWeight: '500', color: '#1e293b' }}>{s.name}</Text>
                    <Text style={{ fontSize: 12, color: '#64748b' }}>{s.age} yrs · {s.grade}</Text>
                  </View>
                </View>
                <View style={{ backgroundColor: '#f0fdf4', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: '#16a34a' }}>Active</Text>
                </View>
              </View>
            ))}
            {students.filter(s => s.enrolled).length === 0 && (
              <Text style={{ fontSize: 14, color: '#64748b', textAlign: 'center', paddingVertical: 16 }}>No students enrolled</Text>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  )
}
