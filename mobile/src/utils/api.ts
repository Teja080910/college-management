import AsyncStorage from '@react-native-async-storage/async-storage'

const BASE_URL = 'https://college.arkasodhara.tech'

async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem('@portal_token')
}

async function request<T>(method: string, name: string, body?: unknown, id?: number): Promise<T> {
  const token = await getToken()
  const url = id !== undefined ? `${BASE_URL}/api/data/${name}?id=${id}` : `${BASE_URL}/api/data/${name}`
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export function fetchData<T>(name: string): Promise<T> {
  return request<T>('GET', name)
}

export function createRecord<T>(name: string, data: unknown): Promise<T> {
  return request<T>('POST', name, data)
}

export function updateRecord<T>(name: string, data: unknown): Promise<T> {
  return request<T>('PUT', name, data)
}

export function deleteRecord<T>(name: string, id: number): Promise<T> {
  return request<T>('DELETE', name, undefined, id)
}
