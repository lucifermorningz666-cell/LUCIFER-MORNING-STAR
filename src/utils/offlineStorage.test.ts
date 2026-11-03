import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateTotalStorageUsed, getStorageQuotaMetrics, formatStorageSize, transitionDownloadState } from './offlineStorage';
import { DownloadedItem } from '../types/media';

const mockDownloads: DownloadedItem[] = [
  {
    id: 'd1',
    mediaId: 'm1',
    title: 'Neon Odyssey 2099',
    type: 'movie',
    quality: 'High',
    sizeMb: 950,
    downloadedAt: '2026-11-01',
    progress: 100,
    status: 'completed',
    posterUrl: '',
    videoUrl: ''
  },
  {
    id: 'd2',
    mediaId: 'm2',
    title: 'Whispers of Kyoto',
    type: 'movie',
    quality: 'Standard',
    sizeMb: 400,
    downloadedAt: '2026-11-02',
    progress: 50, // halfway downloading
    status: 'downloading',
    posterUrl: '',
    videoUrl: ''
  }
];

test('calculateTotalStorageUsed accounts for completed and in-progress downloads', () => {
  // 950 (completed) + 400 * 0.5 (200 in-progress) = 1150
  const total = calculateTotalStorageUsed(mockDownloads);
  assert.equal(total, 1150);
});

test('formatStorageSize formats both MB and GB accurately', () => {
  assert.equal(formatStorageSize(450), '450 MB');
  assert.equal(formatStorageSize(1024), '1.0 GB');
  assert.equal(formatStorageSize(2560), '2.5 GB');
});

test('getStorageQuotaMetrics calculates accurate quota breakdowns', () => {
  const metrics = getStorageQuotaMetrics(mockDownloads, 64 * 1024);
  assert.equal(metrics.downloadsCount, 1);
  assert.equal(metrics.usedByLumiereMb, 1150);
  assert.ok(metrics.freeSpaceMb > 0);
});

test('transitionDownloadState transitions status and advances progress correctly', () => {
  const item: DownloadedItem = { ...mockDownloads[1], progress: 80 };
  const updated = transitionDownloadState(item, 'progress', 25);
  assert.equal(updated.progress, 100);
  assert.equal(updated.status, 'completed');

  const paused = transitionDownloadState(item, 'pause');
  assert.equal(paused.status, 'paused');
});
