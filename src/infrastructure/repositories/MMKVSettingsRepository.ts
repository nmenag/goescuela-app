import { StorageService } from '../storage/mmkv';
import { ISettingsRepository } from '../../domain/repositories/interfaces';

export class MMKVSettingsRepository implements ISettingsRepository {
  getSetting<T>(key: string): T | null {
    return StorageService.getSetting<T>(key);
  }

  saveSetting(key: string, value: any): void {
    StorageService.setSetting(key, value);
  }

  removeSetting(key: string): void {
    StorageService.removeItem(`setting_${key}`);
  }
}
