import { create } from 'zustand';
import { Student } from '@/data/mockData';

interface AuthState {
  user: Student | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // For now, mock login
      const mockUser = {
        id: 'student-1',
        name: 'Alejo',
        email,
        avatar: 'https://i.pravatar.cc/150?img=1',
        school: 'Colegio San José',
        grade: '10° Grado',
      };
      const mockToken = 'mock-jwt-token';

      set({ user: mockUser as any, token: mockToken, isLoading: false });
    } catch {
      set({ error: 'Login failed', isLoading: false });
    }
  },

  logout: () => {
    set({ user: null, token: null });
  },
}));
