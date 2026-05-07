import { MMKV } from 'react-native-mmkv';

export const mmkv = new MMKV();

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
