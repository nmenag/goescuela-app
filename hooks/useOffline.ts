import { useState, useEffect, useCallback } from 'react';
import { offlineService, OfflineResource } from '@/services/offlineService';

export function useOffline() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [downloadedResources, setDownloadedResources] = useState<OfflineResource[]>([]);
  const [isDownloading, setIsDownloading] = useState<Record<string, boolean>>({});
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const init = async () => {
      await offlineService.init();
      setDownloadedResources(offlineService.getAllDownloadedResources());
      setIsInitialized(true);
    };
    init();

    // Subscribe to changes
    const unsubscribe = offlineService.subscribe(() => {
      setDownloadedResources(offlineService.getAllDownloadedResources());
    });

    return unsubscribe;
  }, []);

  const download = useCallback(async (url: string) => {
    if (!url) return;

    setIsDownloading((prev) => ({ ...prev, [url]: true }));
    try {
      const resource = await offlineService.downloadResource(url);
      if (resource) {
        setDownloadedResources(offlineService.getAllDownloadedResources());
      }
      return resource;
    } finally {
      setIsDownloading((prev) => ({ ...prev, [url]: false }));
    }
  }, []);

  const remove = useCallback(async (url: string) => {
    await offlineService.removeResource(url);
    setDownloadedResources(offlineService.getAllDownloadedResources());
  }, []);

  const isDownloaded = useCallback((url: string) => {
    return offlineService.isDownloaded(url);
  }, []);

  const getLocalUri = useCallback((url: string) => {
    return offlineService.getLocalUri(url);
  }, []);

  const sync = useCallback(async () => {
    setIsSyncing(true);
    try {
      return await offlineService.sync();
    } finally {
      setIsSyncing(false);
    }
  }, []);

  return {
    isInitialized,
    downloadedResources,
    isDownloading,
    download,
    remove,
    isDownloaded,
    getLocalUri,
    sync,
    isSyncing,
    // Use this to get either local or remote URI automatically
    getEffectiveUri: (url: string) => getLocalUri(url) || url,
  };
}
