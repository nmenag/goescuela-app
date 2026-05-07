import { useAuthStore } from '@/store/useAuthStore';

// We're keeping this for compatibility, but moving the logic to Zustand
export const useAuth = () => {
  const { isAuthenticated, user, login, logout } = useAuthStore();
  return { isAuthenticated, user, login, logout };
};

// Provider is now optional/empty but we keep it to avoid breaking _layout.tsx
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
