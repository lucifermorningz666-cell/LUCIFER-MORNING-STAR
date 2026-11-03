import React from 'react';
import { Play, Plus, Check, Download, Camera, Share2, Info, Star } from 'lucide-react';
import { MediaItem } from '../types/media';

interface HeroBannerProps {
  item: MediaItem;
  matchScore: number;
  isInMyList: boolean;
  onToggleMyList: (id: string) => void;
  onPlay: (item: MediaItem) => void;
  onOpenDetails: (item: MediaItem) => void;
  onDownload: (item: MediaItem) => void;
  onCaptureSnippet: (item: MediaItem) => void;
  onShare: (item: MediaItem) => void;
  activeProfileName: string;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  item,
  matchScore,
  isInMyList,
  onToggleMyList,
  onPlay,
  onOpenDetails,
  onDownload,
  onCaptureSnippet,
  onShare,
  activeProfileName
}) => {
  return (
    <section className="relative w-full min-h-[550px] lg:min-h-[640px] flex items-end pb-12 sm:pb-16 overflow-hidden">
      {/* Background Image with Cinematic Vignettes */}
      <div className="absolute inset-0 -z-10">
        <img
          src={item.backdropUrl}
          alt={item.title}
          className="w-full h-full object-cover object-top scale-105 transform motion-safe:transition-transform motion-safe:duration-1000"
        />
        {/* Gradients to blend seamlessly into background */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent w-full md:w-3/4" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full z-10">
        <div className="max-w-2xl flex flex-col gap-3">
          {/* Top metadata row with zero-pill discipline */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-300">
            {item.isOriginal && (
              <span className="font-extrabold tracking-widest text-amber-400 uppercase text-[11px]">
                Lumière Original
              </span>
            )}
            <span className="text-emerald-400 font-bold">
              {matchScore}% Match for {activeProfileName}
            </span>
            <span className="text-neutral-500">•</span>
            <span className="px-1.5 py-0.5 text-[11px] font-mono border border-neutral-600 rounded bg-black/40 text-neutral-200">
              {item.rating}
            </span>
            <span className="text-neutral-500">•</span>
            <span>{item.year}</span>
            <span className="text-neutral-500">•</span>
            <span>{item.type === 'movie' ? item.duration : `${item.seasonsCount} Seasons`}</span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-400 font-mono text-[11px]">4K UHD • Dolby Atmos</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-['Cinzel'] leading-tight drop-shadow-md">
            {item.title}
          </h1>

          {/* Tagline */}
          <p className="text-sm sm:text-base italic font-light text-amber-200/90 max-w-xl">
            "{item.tagline}"
          </p>

          {/* Genres as clean unboxed text with subtle separator */}
          <div className="text-xs text-neutral-400 flex items-center gap-2">
            {item.genres.join(' • ')}
          </div>

          {/* Synopsis */}
          <p className="text-xs sm:text-sm text-neutral-300 line-clamp-3 leading-relaxed max-w-xl">
            {item.synopsis}
          </p>

          {/* Action Button Row */}
          <div className="flex flex-wrap items-center gap-2.5 pt-3">
            {/* Play Button */}
            <button
              onClick={() => onPlay(item)}
              aria-label={`Play ${item.title}`}
              className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all transform hover:scale-[1.02] cursor-pointer"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>Watch Now</span>
            </button>

            {/* My List Button */}
            <button
              onClick={() => onToggleMyList(item.id)}
              aria-label={isInMyList ? `Remove ${item.title} from list` : `Add ${item.title} to list`}
              className="px-4 py-2.5 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 text-white font-medium text-sm flex items-center gap-2 border border-neutral-700/80 transition-colors cursor-pointer"
            >
              {isInMyList ? <Check className="w-4 h-4 text-amber-400" /> : <Plus className="w-4 h-4" />}
              <span>{isInMyList ? 'In My List' : 'Add to List'}</span>
            </button>

            {/* Travel Download Button */}
            <button
              onClick={() => onDownload(item)}
              title="Download for offline travel viewing"
              aria-label={`Download ${item.title} for offline`}
              className="p-2.5 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700/80 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Snippet Frame Capture */}
            <button
              onClick={() => onCaptureSnippet(item)}
              title="Capture frame quote snippet card"
              aria-label="Capture scene photo snippet"
              className="p-2.5 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 text-amber-300 hover:text-amber-200 border border-neutral-700/80 transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4" />
            </button>

            {/* Social Share & Watch Party */}
            <button
              onClick={() => onShare(item)}
              title="Share or start Watch Party"
              aria-label="Share movie"
              className="p-2.5 rounded-lg bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700/80 transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Info / Synopsis */}
            <button
              onClick={() => onOpenDetails(item)}
              aria-label={`More details about ${item.title}`}
              className="px-4 py-2.5 rounded-lg bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300 hover:text-white text-sm font-medium border border-neutral-700/60 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Info className="w-4 h-4" />
              <span>Details &amp; Cast</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
