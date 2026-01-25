import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/login" />;
}
