import { create } from 'zustand';
import { Student } from '@/data/mockData';
import { StorageService } from '@/infrastructure/storage/mmkv';

interface AuthState {
  user: Student | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  init: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: StorageService.getItem<Student>('user'),
  token: StorageService.getToken(),
  isLoading: false,
  error: null,

  init: () => {
    const user = StorageService.getItem<Student>('user');
    const token = StorageService.getToken();
    set({ user, token });
  },

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

      StorageService.setItem('user', mockUser);
      StorageService.setToken(mockToken);

      set({ user: mockUser as any, token: mockToken, isLoading: false });
    } catch {
      set({ error: 'Login failed', isLoading: false });
    }
  },

  logout: () => {
    StorageService.removeItem('user');
    StorageService.removeToken();
    set({ user: null, token: null });
  },
}));
