import * as FileSystem from 'expo-file-system/legacy';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OFFLINE_MAP_KEY = 'goescuela_offline_map';

export interface OfflineResource {
  originalUrl: string;
  localUri: string;
  filename: string;
  mimeType: string;
  downloadDate: string;
  size?: number;
}

class OfflineService {
  private static instance: OfflineService;
  private offlineMap: Record<string, OfflineResource> = {};
  private listeners: (() => void)[] = [];

  private constructor() {}

  public static getInstance(): OfflineService {
    if (!OfflineService.instance) {
      OfflineService.instance = new OfflineService();
    }
    return OfflineService.instance;
  }

  /**
   * Initialize the service by loading the offline map from storage
   */
  public async init(): Promise<void> {
    const mapJson = await AsyncStorage.getItem(OFFLINE_MAP_KEY);
    if (mapJson) {
      this.offlineMap = JSON.parse(mapJson);
    }

    // Create the offline directory if it doesn't exist
    const dirInfo = await FileSystem.getInfoAsync(this.getOfflineFolder());
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(this.getOfflineFolder(), { intermediates: true });
    }
  }

  private getOfflineFolder(): string {
    return (FileSystem as any).documentDirectory + 'offline_content/';
  }

  /**
   * Returns the local URI if the resource is downloaded, otherwise returns null
   */
  public getLocalUri(url: string): string | null {
    const resource = this.offlineMap[url];
    return resource ? resource.localUri : null;
  }

  /**
   * Check if a resource is already downloaded
   */
  public isDownloaded(url: string): boolean {
    return !!this.offlineMap[url];
  }

  /**
   * Download a resource and save it to the offline storage
   */
  public async downloadResource(url: string): Promise<OfflineResource | null> {
    if (this.isDownloaded(url)) {
      return this.offlineMap[url];
    }

    try {
      const filename = url.split('/').pop() || `resource_${Date.now()}`;
      const localUri = this.getOfflineFolder() + filename;

      const downloadRes = await FileSystem.downloadAsync(url, localUri);

      if (downloadRes.status !== 200) {
        throw new Error(`Download failed with status ${downloadRes.status}`);
      }

      const resource: OfflineResource = {
        originalUrl: url,
        localUri: downloadRes.uri,
        filename,
        mimeType: downloadRes.headers['content-type'] || 'application/octet-stream',
        downloadDate: new Date().toISOString(),
      };

      this.offlineMap[url] = resource;
      await this.saveMap();

      return resource;
    } catch (error) {
      console.error('Error downloading resource:', error);
      return null;
    }
  }

  /**
   * Remove a downloaded resource
   */
  public async removeResource(url: string): Promise<void> {
    const resource = this.offlineMap[url];
    if (resource) {
      try {
        await FileSystem.deleteAsync(resource.localUri, { idempotent: true });
        delete this.offlineMap[url];
        await this.saveMap();
      } catch (error) {
        console.error('Error removing resource:', error);
      }
    }
  }

  /**
   * Get all downloaded resources
   */
  public getAllDownloadedResources(): OfflineResource[] {
    return Object.values(this.offlineMap);
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private async saveMap(): Promise<void> {
    await AsyncStorage.setItem(OFFLINE_MAP_KEY, JSON.stringify(this.offlineMap));
    this.listeners.forEach((l) => l());
  }
}

export const offlineService = OfflineService.getInstance();
