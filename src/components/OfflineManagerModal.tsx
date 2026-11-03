import React from 'react';
import {
  DownloadCloud,
  HardDrive,
  Play,
  Trash2,
  Pause,
  RotateCcw,
  WifiOff,
  CheckCircle,
  X,
  Plane,
  AlertCircle
} from 'lucide-react';
import { DownloadQuality, DownloadedItem, MediaItem } from '../types/media';
import { formatStorageSize, getStorageQuotaMetrics } from '../utils/offlineStorage';

interface OfflineManagerModalProps {
  downloads: DownloadedItem[];
  isOfflineMode: boolean;
  onToggleOfflineMode: () => void;
  onPlayDownloadedItem: (item: DownloadedItem) => void;
  onDeleteDownload: (id: string) => void;
  onTogglePauseDownload: (id: string) => void;
  onClose: () => void;
  currentDownloadQuality: DownloadQuality;
  onChangeDownloadQuality: (quality: DownloadQuality) => void;
}

export const OfflineManagerModal: React.FC<OfflineManagerModalProps> = ({
  downloads,
  isOfflineMode,
  onToggleOfflineMode,
  onPlayDownloadedItem,
  onDeleteDownload,
  onTogglePauseDownload,
  onClose,
  currentDownloadQuality,
  onChangeDownloadQuality
}) => {
  const metrics = getStorageQuotaMetrics(downloads);
  const percentUsed = Math.min(100, (metrics.usedByLumiereMb / metrics.totalCapacityMb) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Travel &amp; Offline Viewing</h3>
              <p className="text-xs text-neutral-400">Download high-definition media for zero-connection travel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close offline manager"
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Airplane / Travel Mode Toggle Card */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
              isOfflineMode
                ? 'bg-amber-500/15 border-amber-500/60'
                : 'bg-neutral-950 border-neutral-800'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${isOfflineMode ? 'bg-amber-500 text-black' : 'bg-neutral-800 text-neutral-400'}`}>
                <Plane className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Travel Airplane Mode</span>
                  {isOfflineMode && (
                    <span className="text-[10px] bg-amber-500 text-black font-extrabold px-1.5 py-0.2 rounded uppercase">
                      ACTIVE
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-400 mt-0.5 max-w-sm">
                  Simulate zero internet connectivity. Only your saved offline downloads will be playable with instant zero buffering.
                </p>
              </div>
            </div>

            <button
              onClick={onToggleOfflineMode}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isOfflineMode
                  ? 'bg-amber-500 text-black hover:bg-amber-400'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
              }`}
            >
              {isOfflineMode ? 'Disable Offline Mode' : 'Enable Travel Mode'}
            </button>
          </div>

          {/* Storage Quota Gauge */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800">
            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                <HardDrive className="w-4 h-4 text-amber-400" />
                <span>Internal Device Storage</span>
              </div>
              <div className="text-neutral-400 font-mono">
                {formatStorageSize(metrics.usedByLumiereMb)} used by Lumière Downloads
              </div>
            </div>

            {/* Gauge bar */}
            <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden flex">
              <div
                className="bg-amber-500 h-full transition-all duration-500"
                style={{ width: `${Math.max(3, percentUsed)}%` }}
                title={`Lumière: ${formatStorageSize(metrics.usedByLumiereMb)}`}
              />
              <div
                className="bg-neutral-600 h-full"
                style={{ width: '28%' }}
                title="System and other apps"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-2 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Lumière ({formatStorageSize(metrics.usedByLumiereMb)})
              </span>
              <span>Free Space: {formatStorageSize(metrics.freeSpaceMb)}</span>
            </div>
          </div>

          {/* Download Quality Preference */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              Default Download Quality Preset:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Standard', desc: '~420 MB / title • Faster' },
                { id: 'High', desc: '~950 MB / title • Recommended' },
                { id: 'Ultra (4K)', desc: '~2.4 GB / title • Crisp 4K' },
              ].map(q => (
                <button
                  key={q.id}
                  onClick={() => onChangeDownloadQuality(q.id as DownloadQuality)}
                  className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    currentDownloadQuality === q.id
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:bg-neutral-800'
                  }`}
                >
                  <div className="text-xs font-semibold text-white">{q.id}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">{q.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Downloaded Items List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
                Saved Offline Content ({downloads.length})
              </h4>
              {downloads.length > 0 && (
                <span className="text-[11px] text-emerald-400 font-medium">Ready for travel playback</span>
              )}
            </div>

            {downloads.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-neutral-800 rounded-xl text-neutral-400 text-xs">
                <DownloadCloud className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                <p>No downloads yet. Click the Download icon on any movie or series to save for offline flights.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {downloads.map(item => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between gap-3 hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.posterUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=100'}
                        alt={item.title}
                        className="w-12 h-16 rounded object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{item.title}</div>
                        {item.subtitle && (
                          <div className="text-[11px] text-amber-400/90 truncate">{item.subtitle}</div>
                        )}
                        <div className="text-[10px] text-neutral-400 font-mono mt-0.5 flex items-center gap-2">
                          <span>{item.quality}</span>
                          <span>•</span>
                          <span>{formatStorageSize(item.sizeMb)}</span>
                          <span>•</span>
                          <span className={item.status === 'completed' ? 'text-emerald-400 font-semibold' : 'text-amber-400'}>
                            {item.status === 'completed' ? 'Downloaded' : `${item.status} (${item.progress}%)`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.status === 'completed' ? (
                        <button
                          onClick={() => {
                            onPlayDownloadedItem(item);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-black" />
                          <span>Watch Offline</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onTogglePauseDownload(item.id)}
                          className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
                        >
                          {item.status === 'downloading' ? <Pause className="w-3.5 h-3.5" /> : <RotateCcw className="w-3.5 h-3.5" />}
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteDownload(item.id)}
                        title="Delete download to reclaim space"
                        aria-label={`Delete download ${item.title}`}
                        className="p-2 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
