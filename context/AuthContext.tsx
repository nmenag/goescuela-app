import React from 'react';
import { useAuthStore } from '@/features/auth/application/useAuthStore';

// We're keeping this for compatibility, but moving the logic to Zustand
export const useAuth = () => {
  const { user, login, logout, token } = useAuthStore();
  const isAuthenticated = !!token;
  return { isAuthenticated, user, login, logout };
};

// Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
