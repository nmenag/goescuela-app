import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '../global.css';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const navigationRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated && !navigationRef.current) {
        navigationRef.current = true;
        router.replace('/(tabs)');
      } else if (!isAuthenticated && navigationRef.current) {
        navigationRef.current = false;
        router.replace('/login');
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isAuthenticated, router]);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="login"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
              // animationEnabled: true,
            }}
          />
          <Stack.Screen name="learning-view" options={{ headerShown: false }} />
          <Stack.Screen name="quiz" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>

        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} translucent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}
