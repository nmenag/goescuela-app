import { documentDirectory, createDownloadResumable, getInfoAsync } from 'expo-file-system';
import { create } from 'zustand';

interface DownloadState {
  downloads: Record<string, number>; // URL -> Progress
  isDownloaded: (url: string) => Promise<boolean>;
  downloadContent: (url: string) => Promise<void>;
}

export const useDownloadStore = create<DownloadState>((set) => ({
  downloads: {},

  isDownloaded: async (url) => {
    const filename = url.split('/').pop();
    const fileUri = `${documentDirectory}${filename}`;
    const info = await getInfoAsync(fileUri);
    return info.exists;
  },

  downloadContent: async (url) => {
    const filename = url.split('/').pop();
    const fileUri = `${documentDirectory}${filename}`;

    const downloadResumable = createDownloadResumable(url, fileUri, {}, (progress) => {
      const p = progress.totalBytesWritten / progress.totalBytesExpectedToWrite;
      set((state) => ({
        downloads: { ...state.downloads, [url]: p },
      }));
    });

    try {
      await downloadResumable.downloadAsync();
      set((state) => {
        const newDownloads = { ...state.downloads };
        delete newDownloads[url];
        return { downloads: newDownloads };
      });
    } catch (e) {
      console.error(e);
    }
  },
}));
