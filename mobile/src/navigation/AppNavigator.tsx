import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { ActivityIndicator, View, Platform } from 'react-native'
import { useAuth } from '../context/AuthContext'
import LoginScreen from '../screens/LoginScreen'
import DashboardScreen from '../screens/DashboardScreen'
import StudentsScreen from '../screens/StudentsScreen'
import FeesScreen from '../screens/FeesScreen'
import TimetableScreen from '../screens/TimetableScreen'
import CoursesScreen from '../screens/CoursesScreen'
import TestsScreen from '../screens/TestsScreen'
import StudentDashboardScreen from '../screens/StudentDashboardScreen'
import StudentCoursesScreen from '../screens/StudentCoursesScreen'
import StudentTimetableScreen from '../screens/StudentTimetableScreen'
import StudentFeesScreen from '../screens/StudentFeesScreen'
import StudentTestsScreen from '../screens/StudentTestsScreen'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          height: Platform.OS === 'ios' ? 95 : 72,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#6366f1',
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3, marginTop: 2 },
        tabBarIconStyle: { marginBottom: 0 },
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{
        tabBarIcon: ({ color, size, focused }) => (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons name={focused ? 'view-dashboard' : 'view-dashboard-outline'} color={color} size={size || 24} />
          </View>
        ),
      }} />
      <Tab.Screen name="Students" component={StudentsScreen} options={{
        tabBarIcon: ({ color, size, focused }) => (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons name={focused ? 'account-group' : 'account-group-outline'} color={color} size={size || 24} />
          </View>
        ),
      }} />
      <Tab.Screen name="Fees" component={FeesScreen} options={{
        tabBarIcon: ({ color, size, focused }) => (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons name={focused ? 'currency-inr' : 'currency-inr'} color={color} size={size || 24} />
          </View>
        ),
      }} />
      <Tab.Screen name="Timetable" component={TimetableScreen} options={{
        tabBarIcon: ({ color, size, focused }) => (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons name={focused ? 'calendar-month' : 'calendar-month-outline'} color={color} size={size || 24} />
          </View>
        ),
      }} />
      <Tab.Screen name="Courses" component={CoursesScreen} options={{
        tabBarIcon: ({ color, size, focused }) => (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons name={focused ? 'book-open-variant' : 'book-open-variant'} color={color} size={size || 24} />
          </View>
        ),
      }} />
      <Tab.Screen name="Tests" component={TestsScreen} options={{
        tabBarIcon: ({ color, size, focused }) => (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons name={focused ? 'clipboard-text' : 'clipboard-text-outline'} color={color} size={size || 24} />
          </View>
        ),
      }} />
    </Tab.Navigator>
  )
}

function StudentTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          height: Platform.OS === 'ios' ? 95 : 72,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#6366f1',
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3, marginTop: 2 },
        tabBarIconStyle: { marginBottom: 0 },
      }}
    >
      <Tab.Screen name="Dashboard" component={StudentDashboardScreen} options={{
        tabBarIcon: ({ color, size, focused }) => (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons name={focused ? 'view-dashboard' : 'view-dashboard-outline'} color={color} size={size || 24} />
          </View>
        ),
      }} />
      <Tab.Screen name="My Courses" component={StudentCoursesScreen} options={{
        tabBarIcon: ({ color, size, focused }) => (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons name={focused ? 'book-open-variant' : 'book-open-variant'} color={color} size={size || 24} />
          </View>
        ),
      }} />
      <Tab.Screen name="My Timetable" component={StudentTimetableScreen} options={{
        tabBarIcon: ({ color, size, focused }) => (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons name={focused ? 'calendar-month' : 'calendar-month-outline'} color={color} size={size || 24} />
          </View>
        ),
      }} />
      <Tab.Screen name="My Fees" component={StudentFeesScreen} options={{
        tabBarIcon: ({ color, size, focused }) => (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons name={focused ? 'currency-inr' : 'currency-inr'} color={color} size={size || 24} />
          </View>
        ),
      }} />
      <Tab.Screen name="My Tests" component={StudentTestsScreen} options={{
        tabBarIcon: ({ color, size, focused }) => (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <MaterialCommunityIcons name={focused ? 'clipboard-text' : 'clipboard-text-outline'} color={color} size={size || 24} />
          </View>
        ),
      }} />
    </Tab.Navigator>
  )
}

export default function AppNavigator() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen
            name="Main"
            component={user.role === 'student' ? StudentTabs : AdminTabs}
          />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
