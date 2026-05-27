import { StyleSheet } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import { PaperProvider, MD3LightTheme, configureFonts } from 'react-native-paper'
import { AuthProvider } from './src/context/AuthContext'
import { CrudProvider } from './src/context/CrudContext'
import AppNavigator from './src/navigation/AppNavigator'
import './global.css'

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6366f1',
    primaryContainer: '#e0e7ff',
    secondary: '#64748b',
    background: '#f8fafc',
    surface: '#ffffff',
    error: '#dc2626',
    onPrimary: '#ffffff',
    outline: '#e2e8f0',
    elevation: { ...MD3LightTheme.colors.elevation, level0: '#ffffff', level1: '#f8fafc' },
  },
  roundness: 12,
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="dark" />
        <AuthProvider>
          <CrudProvider>
            <AppNavigator />
          </CrudProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  )
}
