import AsyncStorage from '@react-native-async-storage/async-storage'

export interface User {
  username: string
  name: string
  role: 'admin' | 'student'
}

const USERS = [
  { username: 'admin', password: 'admin', user: { username: 'admin', name: 'Administrator', role: 'admin' as const }, token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token-admin' },
  { username: 'student', password: 'student123', user: { username: 'student', name: 'Student User', role: 'student' as const }, token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token-student' },
]

const TOKEN_KEY = '@portal_token'
const USER_KEY = '@portal_user'

export async function login(username: string, password: string): Promise<{ success: boolean; user?: User }> {
  const match = USERS.find(u => u.username === username && u.password === password)
  if (match) {
    await AsyncStorage.setItem(TOKEN_KEY, match.token)
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(match.user))
    return { success: true, user: match.user }
  }
  return { success: false }
}

export async function logout(): Promise<void> {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY])
}

export async function getStoredUser(): Promise<User | null> {
  const raw = await AsyncStorage.getItem(USER_KEY)
  const token = await AsyncStorage.getItem(TOKEN_KEY)
  if (raw && token) return JSON.parse(raw)
  return null
}
