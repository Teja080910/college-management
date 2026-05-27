import AsyncStorage from '@react-native-async-storage/async-storage'

export interface User {
  username: string
  name: string
  role: string
}

const AUTH_DATA = {
  user: { username: 'admin', name: 'Administrator', role: 'Admin' } as User,
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token',
}

const TOKEN_KEY = '@portal_token'
const USER_KEY = '@portal_user'

export async function login(username: string, password: string): Promise<{ success: boolean; user?: User }> {
  if (username === 'admin' && password === 'admin') {
    await AsyncStorage.setItem(TOKEN_KEY, AUTH_DATA.token)
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(AUTH_DATA.user))
    return { success: true, user: AUTH_DATA.user }
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
