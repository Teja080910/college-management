import React, { useState, useRef, useEffect } from 'react'
import { View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Animated, ScrollView, Dimensions } from 'react-native'
import { Text, TextInput, Button, Surface, Card } from 'react-native-paper'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '../context/AuthContext'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')
const CARD_HEIGHT = 440

export default function LoginScreen() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const insets = useSafeAreaInsets()
  const pwRef = useRef<any>(null)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start()
  }, [])

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    setTimeout(async () => {
      const result = await login(username, password)
      if (!result.success) setError('Invalid credentials. Try admin/admin.')
      setLoading(false)
    }, 600)
  }

  const topPad = Math.max(insets.top + 10, (SCREEN_HEIGHT - CARD_HEIGHT) / 2 - 20)

  const cardContent = (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <Card style={{
        backgroundColor: '#ffffff', borderRadius: 20, borderWidth: 1, borderColor: '#f1f5f9',
        shadowColor: '#6366f1', shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1, shadowRadius: 20, elevation: 10,
      }}>
        <Card.Content style={{ padding: 20 }}>
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <View style={{
              width: 68, height: 68, borderRadius: 18, backgroundColor: '#6366f1',
              alignItems: 'center', justifyContent: 'center', marginBottom: 20,
              shadowColor: '#6366f1', shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.35, shadowRadius: 14, elevation: 10,
            }}>
              <MaterialCommunityIcons name="school" size={34} color="#fff" />
            </View>
            <Text style={{ fontSize: 24, fontWeight: '700', color: '#1e293b' }}>Welcome back</Text>
            <Text style={{ fontSize: 14, color: '#64748b', marginTop: 6 }}>Sign in to your student portal</Text>
          </View>
          {error && (
            <Surface style={{
              padding: 12, borderRadius: 12, marginBottom: 20,
              backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fecaca',
            }} elevation={0}>
              <Text style={{ color: '#dc2626', fontSize: 14 }}>{error}</Text>
            </Surface>
          )}
          <TextInput label="Username" value={username} onChangeText={setUsername}
            mode="outlined" placeholder="admin" returnKeyType="next"
            onSubmitEditing={() => pwRef.current?.focus()} blurOnSubmit={false}
            style={{ marginBottom: 14, backgroundColor: '#ffffff' }}
            outlineStyle={{ borderRadius: 12, borderColor: '#e2e8f0' }}
            activeOutlineColor="#6366f1" contentStyle={{ fontSize: 15 }} />
          <TextInput ref={pwRef} label="Password" value={password} onChangeText={setPassword}
            mode="outlined" secureTextEntry={!showPw} placeholder="••••••"
            returnKeyType="done" onSubmitEditing={handleSubmit}
            style={{ marginBottom: 24, backgroundColor: '#ffffff' }}
            outlineStyle={{ borderRadius: 12, borderColor: '#e2e8f0' }}
            activeOutlineColor="#6366f1" contentStyle={{ fontSize: 15 }}
            right={<TextInput.Icon icon={showPw ? 'eye-off' : 'eye'} onPress={() => setShowPw(!showPw)} />} />
          <Button mode="contained" onPress={handleSubmit} loading={loading} disabled={loading}
            contentStyle={{ height: 50 }} style={{ borderRadius: 12 }} buttonColor="#6366f1">
            Sign In
          </Button>
          <Text style={{ fontSize: 12, color: '#64748b', textAlign: 'center', marginTop: 24 }}>
            Demo: admin / admin
          </Text>
        </Card.Content>
      </Card>
    </Animated.View>
  )

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f8fafc' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
            {cardContent}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}
