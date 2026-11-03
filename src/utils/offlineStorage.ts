import { DownloadQuality, DownloadedItem } from '../types/media';

export interface StorageMetrics {
  totalCapacityMb: number;
  usedByLumiereMb: number;
  usedBySystemMb: number;
  freeSpaceMb: number;
  downloadsCount: number;
}

export const QUALITY_ESTIMATE_MB: Record<DownloadQuality, number> = {
  'Standard': 420,
  'High': 950,
  'Ultra (4K)': 2400,
};

/**
 * Calculates total MB consumed by completed or active downloads
 */
export function calculateTotalStorageUsed(downloads: DownloadedItem[]): number {
  return downloads.reduce((acc, item) => {
    // If completed, use full size; if downloading, use proportion of size
    if (item.status === 'completed') {
      return acc + item.sizeMb;
    } else if (item.status === 'downloading' || item.status === 'paused') {
      return acc + (item.sizeMb * (item.progress / 100));
    }
    return acc;
  }, 0);
}

/**
 * Returns formatted metrics for UI storage gauges
 */
export function getStorageQuotaMetrics(
  downloads: DownloadedItem[],
  totalCapacityMb = 64 * 1024 // 64 GB standard simulated device
): StorageMetrics {
  const usedByLumiereMb = Math.round(calculateTotalStorageUsed(downloads));
  const usedBySystemMb = 18 * 1024; // 18 GB system & other apps
  const freeSpaceMb = Math.max(0, totalCapacityMb - usedByLumiereMb - usedBySystemMb);
  const completedCount = downloads.filter(d => d.status === 'completed').length;

  return {
    totalCapacityMb,
    usedByLumiereMb,
    usedBySystemMb,
    freeSpaceMb,
    downloadsCount: completedCount,
  };
}

/**
 * Format megabytes to readable GB or MB string
 */
export function formatStorageSize(megabytes: number): string {
  if (megabytes >= 1024) {
    return `${(megabytes / 1024).toFixed(1)} GB`;
  }
  return `${Math.round(megabytes)} MB`;
}

/**
 * Download state machine transitions
 */
export function transitionDownloadState(
  item: DownloadedItem,
  action: 'pause' | 'resume' | 'complete' | 'progress' | 'fail',
  progressIncrement = 15
): DownloadedItem {
  switch (action) {
    case 'pause':
      return { ...item, status: 'paused' };
    case 'resume':
      return { ...item, status: 'downloading' };
    case 'complete':
      return { ...item, status: 'completed', progress: 100 };
    case 'fail':
      return { ...item, status: 'error' };
    case 'progress': {
      const nextProgress = Math.min(100, item.progress + progressIncrement);
      return {
        ...item,
        progress: nextProgress,
        status: nextProgress >= 100 ? 'completed' : 'downloading',
      };
    }
    default:
      return item;
  }
}
