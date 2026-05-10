import NetInfo from '@react-native-community/netinfo';
import { create } from 'zustand';

interface SyncState {
  isOnline: boolean;
  lastSync: Date | null;
  syncStatus: 'idle' | 'syncing' | 'error';
  setOnline: (status: boolean) => void;
  performSync: () => Promise<void>;
}

export const useSyncStore = create<SyncState>((set, get) => ({
  isOnline: true,
  lastSync: null,
  syncStatus: 'idle',

  setOnline: (status) => set({ isOnline: status }),

  performSync: async () => {
    if (!get().isOnline) return;

    set({ syncStatus: 'syncing' });
    try {
      // 1. Sync Quiz Scores (Upstream)
      // 2. Sync Course Progress (Upstream)
      // 3. Sync Courses (Downstream)

      set({ syncStatus: 'idle', lastSync: new Date() });
    } catch {
      set({ syncStatus: 'error' });
    }
  },
}));

// Initialize listener
NetInfo.addEventListener((state) => {
  useSyncStore.getState().setOnline(!!state.isConnected);
  if (state.isConnected) {
    useSyncStore.getState().performSync();
  }
});
