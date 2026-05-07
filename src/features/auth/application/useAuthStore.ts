import { create } from 'zustand';
import { Student } from '@/domain/entities/Student';
import { AuthRepository } from '../infrastructure/AuthRepository';

interface AuthState {
  user: Student | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const authRepo = new AuthRepository();

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authRepo.login(email, password);
      set({ user, isLoading: false });
    } catch (e) {
      set({ error: 'Login failed', isLoading: false });
    }
  },

  logout: () => {
    authRepo.logout();
    set({ user: null });
  },
}));
