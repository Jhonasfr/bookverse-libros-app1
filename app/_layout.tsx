import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as NavigationBar from 'expo-navigation-bar';
import { Platform } from 'react-native';
import { AuthProvider } from '@/context/AuthContext';

import './global.css';

const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setBackgroundColorAsync('#F7F1E8');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#F7F1E8' } }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth/login/index" />
          <Stack.Screen name="auth/register/index" />
          <Stack.Screen name="products/index" />
          <Stack.Screen name="products/create/index" />
          <Stack.Screen name="products/edit/[id]" />
          <Stack.Screen name="profile/index" />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
}
