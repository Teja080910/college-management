import AsyncStorage from '@react-native-async-storage/async-storage'
import { Student, defaultStudents } from '../data/students'
import { Fee, defaultFees } from '../data/fees'
import { Course, defaultCourses } from '../data/courses'
import { Test, defaultTests } from '../data/tests'
import { DaySchedule, defaultTimetable } from '../data/timetable'

const KEYS = {
  students: '@portal_students',
  fees: '@portal_fees',
}

async function init<T>(key: string, defaults: T): Promise<void> {
  const existing = await AsyncStorage.getItem(key)
  if (!existing) {
    await AsyncStorage.setItem(key, JSON.stringify(defaults))
  }
}

export async function initStore(): Promise<void> {
  await Promise.all([
    init(KEYS.students, defaultStudents),
    init(KEYS.fees, defaultFees),
  ])
}

export async function getStudents(): Promise<Student[]> {
  const raw = await AsyncStorage.getItem(KEYS.students)
  return raw ? JSON.parse(raw) : defaultStudents
}

export async function createStudent(data: Omit<Student, 'id'>): Promise<Student> {
  const list = await getStudents()
  const id = Math.max(...list.map(s => s.id), 0) + 1
  const student: Student = { id, ...data }
  list.push(student)
  await AsyncStorage.setItem(KEYS.students, JSON.stringify(list))
  return student
}

export async function updateStudent(id: number, data: Partial<Student>): Promise<Student | null> {
  const list = await getStudents()
  const idx = list.findIndex(s => s.id === id)
  if (idx === -1) return null
  list[idx] = { ...list[idx], ...data, id }
  await AsyncStorage.setItem(KEYS.students, JSON.stringify(list))
  return list[idx]
}

export async function deleteStudent(id: number): Promise<boolean> {
  const list = await getStudents()
  const idx = list.findIndex(s => s.id === id)
  if (idx === -1) return false
  list.splice(idx, 1)
  await AsyncStorage.setItem(KEYS.students, JSON.stringify(list))
  return true
}

export async function getFees(): Promise<Fee[]> {
  const raw = await AsyncStorage.getItem(KEYS.fees)
  return raw ? JSON.parse(raw) : defaultFees
}

export async function createFee(data: Omit<Fee, 'id'>): Promise<Fee> {
  const list = await getFees()
  const id = Math.max(...list.map(f => f.id), 0) + 1
  const fee: Fee = { id, ...data }
  list.push(fee)
  await AsyncStorage.setItem(KEYS.fees, JSON.stringify(list))
  return fee
}

export async function updateFee(id: number, data: Partial<Fee>): Promise<Fee | null> {
  const list = await getFees()
  const idx = list.findIndex(f => f.id === id)
  if (idx === -1) return null
  list[idx] = { ...list[idx], ...data, id }
  await AsyncStorage.setItem(KEYS.fees, JSON.stringify(list))
  return list[idx]
}

export async function deleteFee(id: number): Promise<boolean> {
  const list = await getFees()
  const idx = list.findIndex(f => f.id === id)
  if (idx === -1) return false
  list.splice(idx, 1)
  await AsyncStorage.setItem(KEYS.fees, JSON.stringify(list))
  return true
}

export { defaultTimetable, defaultCourses, defaultTests }
export type { Fee, Student, Course, Test, DaySchedule }
