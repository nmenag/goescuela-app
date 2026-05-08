import { Platform } from 'react-native';

// In some environments (like Web or Expo Go), MMKV might not be available
// We provide a fallback to local storage or a mock for those cases
const createMMKV = () => {
  if (Platform.OS === 'web') {
    if (typeof localStorage !== 'undefined') {
      return {
        set: (key: string, value: string | number | boolean) => localStorage.setItem(key, String(value)),
        getString: (key: string) => localStorage.getItem(key) || undefined,
        getNumber: (key: string) => Number(localStorage.getItem(key)) || undefined,
        getBoolean: (key: string) => localStorage.getItem(key) === 'true',
        delete: (key: string) => localStorage.removeItem(key),
        clearAll: () => localStorage.clear(),
        contains: (key: string) => localStorage.getItem(key) !== null,
        getAllKeys: () => Object.keys(localStorage),
      } as any;
    }
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { MMKV } = require('react-native-mmkv');
    return new MMKV();
  } catch (error) {
    console.warn('MMKV native module not found, falling back to in-memory storage. Rebuild your app if you are on mobile.', error);
    const mockStorage: Record<string, string> = {};
    return {
      set: (key: string, value: string | number | boolean) => { mockStorage[key] = String(value); },
      getString: (key: string) => mockStorage[key],
      getNumber: (key: string) => Number(mockStorage[key]) || undefined,
      getBoolean: (key: string) => mockStorage[key] === 'true',
      delete: (key: string) => { delete mockStorage[key]; },
      clearAll: () => { for (const key in mockStorage) delete mockStorage[key]; },
      contains: (key: string) => key in mockStorage,
      getAllKeys: () => Object.keys(mockStorage),
    } as any;
  }
};

export const mmkv = createMMKV();

export const StorageService = {
  // Generic methods
  setItem: (key: string, value: any) => {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    mmkv.set(key, stringValue);
  },
  getItem: <T>(key: string): T | null => {
    const value = mmkv.getString(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  },
  removeItem: (key: string) => {
    mmkv.delete(key);
  },
  clear: () => {
    mmkv.clearAll();
  },

  // Auth specific
  setToken: (token: string) => {
    mmkv.set('auth_token', token);
  },
  getToken: () => {
    return mmkv.getString('auth_token');
  },
  removeToken: () => {
    mmkv.delete('auth_token');
  },

  // Settings specific
  setSetting: (key: string, value: any) => {
    mmkv.set(`setting_${key}`, JSON.stringify(value));
  },
  getSetting: <T>(key: string): T | null => {
    const value = mmkv.getString(`setting_${key}`);
    return value ? JSON.parse(value) : null;
  },
};
