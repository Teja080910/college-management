import React, { useState, useCallback } from 'react'
import { View, ScrollView, RefreshControl, ActivityIndicator } from 'react-native'
import { Text, Card, Button } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useFocusEffect } from '@react-navigation/native'
import { fetchData } from '../utils/api'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

export default function StudentFeesScreen() {
  const [fees, setFees] = useState<any[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [paidId, setPaidId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const insets = useSafeAreaInsets()

  const load = async () => {
    setLoading(true)
    setFees(await fetchData<any[]>('fees').catch(() => []))
    setLoading(false)
  }

  useFocusEffect(useCallback(() => { load() }, []))
  const onRefresh = async () => { setRefreshing(true); await load(); setRefreshing(false) }

  const handlePay = async (id: number) => {
    setPaidId(id)
    await new Promise(r => setTimeout(r, 1000))
    setFees(prev => prev.map((f: any) => f.id === id ? { ...f, paid: f.totalFees, due: 0, status: 'paid' } : f))
    setPaidId(null)
  }

  const totalDue = fees.reduce((s: number, f: any) => s + f.due, 0)
  const totalPaid = fees.reduce((s: number, f: any) => s + f.paid, 0)

  const statusStyle = (s: string) => {
    switch(s) {
      case 'paid': return { bg: '#f0fdf4', text: '#16a34a' }
      case 'partial': return { bg: '#fffbeb', text: '#d97706' }
      default: return { bg: '#fef2f2', text: '#dc2626' }
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingTop: insets.top + 16, padding: 16, paddingBottom: insets.bottom + 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6366f1']} />}
      >
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#1e293b', marginBottom: 4 }}>My Fees</Text>
        <Text style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>View fee status and make payments</Text>

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'Total Paid', value: totalPaid, color: '#16a34a' },
            { label: 'Pending Dues', value: totalDue, color: '#dc2626' },
          ].map(item => (
            <Card key={item.label} style={{ flex: 1, backgroundColor: '#ffffff', borderRadius: 16 }} elevation={1}>
              <Card.Content style={{ padding: 12 }}>
                <Text style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{item.label}</Text>
                <Text style={{ fontSize: 16, fontWeight: '700', color: item.color }}>₹{(item.value/1000).toFixed(1)}K</Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        {loading && (
          <View style={{ padding: 40, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="small" color="#6366f1" />
          </View>
        )}
        <Card style={{ backgroundColor: '#ffffff', borderRadius: 16 }} elevation={1}>
          <Card.Content style={{ paddingVertical: 4 }}>
            {fees.map((f: any) => {
              const sc = statusStyle(f.status)
              return (
                <View key={f.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
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
                    {f.due > 0 && (
                      <Button
                        mode="contained"
                        buttonColor="#6366f1"
                        onPress={() => handlePay(f.id)}
                        loading={paidId === f.id}
                        style={{ borderRadius: 8, height: 30 }}
                        contentStyle={{ height: 30, paddingHorizontal: 8 }}
                        labelStyle={{ fontSize: 11, marginVertical: 0 }}
                      >
                        Pay Now
                      </Button>
                    )}
                  </View>
                </View>
              )
            })}
            {!loading && fees.length === 0 && (
              <Text style={{ fontSize: 14, color: '#64748b', textAlign: 'center', paddingVertical: 24 }}>No fee records</Text>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  )
}
