import React from 'react';
import { Camera, Trash2, Copy, Check, Play, Share2, Bookmark, Plus } from 'lucide-react';
import { MediaItem, WatchlistSnippet } from '../types/media';

interface SnippetsVaultProps {
  snippets: WatchlistSnippet[];
  catalog: MediaItem[];
  onPlayMedia: (item: MediaItem) => void;
  onDeleteSnippet: (id: string) => void;
  onOpenCreateSnippet: () => void;
}

export const SnippetsVault: React.FC<SnippetsVaultProps> = ({
  snippets,
  catalog,
  onPlayMedia,
  onDeleteSnippet,
  onOpenCreateSnippet
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (snip: WatchlistSnippet) => {
    const text = `🎬 "${snip.mediaTitle}" [${snip.timestampStr}]:\n${snip.quote}\n— Saved in Lumière Cinema`;
    navigator.clipboard.writeText(text);
    setCopiedId(snip.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black font-['Cinzel'] tracking-tight text-white flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-amber-400" />
            <span>Personalized Watchlist Snippets</span>
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Photo stills, memorable dialogues, and scene captures curated by you and your family.
          </p>
        </div>

        <button
          onClick={onOpenCreateSnippet}
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer self-start"
        >
          <Camera className="w-4 h-4" />
          <span>New Snippet Capture</span>
        </button>
      </div>

      {snippets.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-950/60 text-neutral-400">
          <Camera className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Your Snippets Vault is empty</h3>
          <p className="text-xs max-w-sm mx-auto mt-1 mb-4">
            While watching any movie or episode, click the Camera icon on the player HUD to capture a frame and preserve unforgettable quotes.
          </p>
          <button
            onClick={onOpenCreateSnippet}
            className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold"
          >
            Create Sample Snippet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snippets.map(snip => {
            const media = catalog.find(m => m.id === snip.mediaId);

            const themeCardStyle = {
              noir: 'bg-neutral-950 border-neutral-800 text-neutral-200 font-serif',
              neon: 'bg-[#060814] border-cyan-500/50 text-cyan-100 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-mono',
              editorial: 'bg-[#0f1115] border-neutral-700 text-amber-100 font-sans',
              vintage: 'bg-[#181310] border-amber-900/60 text-amber-200 font-serif'
            }[snip.theme];

            return (
              <div
                key={snip.id}
                className={`rounded-2xl border p-4 sm:p-5 flex flex-col justify-between transition-all hover:scale-[1.01] hover:shadow-2xl ${themeCardStyle}`}
              >
                <div>
                  {/* Still preview */}
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-3.5 border border-white/10 group">
                    <img
                      src={snip.captureUrl}
                      alt={snip.mediaTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                    <div className="absolute top-2.5 left-2.5 text-[10px] font-mono bg-black/80 px-2 py-0.5 rounded border border-neutral-700 text-white flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      <span>{snip.timestampStr}</span>
                    </div>

                    {media && (
                      <button
                        onClick={() => onPlayMedia(media)}
                        aria-label={`Play ${snip.mediaTitle}`}
                        className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40"
                      >
                        <div className="w-10 h-10 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-lg">
                          <Play className="w-4 h-4 fill-black ml-0.5" />
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Quote & details */}
                  <div className="space-y-2">
                    <p className="text-sm sm:text-base italic leading-relaxed line-clamp-4">
                      {snip.quote}
                    </p>
                    <div className="text-xs font-semibold text-white pt-1">
                      {snip.mediaTitle}
                    </div>
                  </div>
                </div>

                {/* Footer action bar */}
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-white/10 text-xs">
                  <span className="text-[10px] text-neutral-400">
                    By {snip.author} • {snip.createdAt}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(snip)}
                      title="Copy quote and citation"
                      aria-label="Copy snippet"
                      className="p-1.5 rounded-lg bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedId === snip.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => onDeleteSnippet(snip.id)}
                      title="Delete snippet"
                      aria-label="Delete snippet"
                      className="p-1.5 rounded-lg bg-neutral-900/60 hover:bg-neutral-800 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
