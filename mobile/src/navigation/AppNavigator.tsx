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
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

const tabs = [
  { name: 'Dashboard', icon: 'view-dashboard', iconOutline: 'view-dashboard-outline', component: DashboardScreen },
  { name: 'Students', icon: 'account-group', iconOutline: 'account-group-outline', component: StudentsScreen },
  { name: 'Fees', icon: 'currency-inr', iconOutline: 'currency-inr', component: FeesScreen },
  { name: 'Timetable', icon: 'calendar-month', iconOutline: 'calendar-month-outline', component: TimetableScreen },
  { name: 'Courses', icon: 'book-open-variant', iconOutline: 'book-open-variant', component: CoursesScreen },
  { name: 'Tests', icon: 'clipboard-text', iconOutline: 'clipboard-text-outline', component: TestsScreen },
]

function MainTabs() {
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
      {tabs.map(t => (
        <Tab.Screen
          key={t.name}
          name={t.name}
          component={t.component}
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <View className={`items-center justify-center ${focused ? '-mt-0.5' : ''}`}>
                <MaterialCommunityIcons
                  name={focused ? t.icon : t.iconOutline}
                  color={color}
                  size={size || 24}
                />
              </View>
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  )
}

export default function AppNavigator() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-bg">
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Main" component={MainTabs} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
