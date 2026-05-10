import { create } from 'zustand';

interface User {
  email: string;
  name: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (email, password) => {
    // Demo mode
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        set({
          isAuthenticated: true,
          user: {
            email: email || 'demo@example.com',
            name: 'Alejo',
          },
        });
        resolve();
      }, 800);
    });
  },
  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
}));
