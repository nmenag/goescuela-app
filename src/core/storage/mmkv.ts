// eslint-disable-next-line @typescript-eslint/no-require-imports
const { MMKV } = require('react-native-mmkv');
export const storage = new MMKV();

export const mmkvStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return value ?? null;
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
};
