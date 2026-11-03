import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Plus, Check, Download, Camera, Info, Star } from 'lucide-react';
import { MediaItem, WatchProgress } from '../types/media';

interface MediaCarouselProps {
  title: string;
  subtitle?: string;
  items: MediaItem[];
  watchHistory?: WatchProgress[];
  myList: string[];
  onToggleMyList: (id: string) => void;
  onPlay: (item: MediaItem) => void;
  onOpenDetails: (item: MediaItem) => void;
  onDownload: (item: MediaItem) => void;
  onCaptureSnippet: (item: MediaItem) => void;
  activeProfileName: string;
  cardVariant?: 'backdrop' | 'poster';
}

export const MediaCarousel: React.FC<MediaCarouselProps> = ({
  title,
  subtitle,
  items,
  watchHistory = [],
  myList,
  onToggleMyList,
  onPlay,
  onOpenDetails,
  onDownload,
  onCaptureSnippet,
  activeProfileName,
  cardVariant = 'poster'
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  if (items.length === 0) return null;

  return (
    <section className="py-6 px-4 sm:px-8 max-w-7xl mx-auto w-full group/carousel">
      {/* Header with Title and Scroll Controls */}
      <div className="flex items-end justify-between mb-3.5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>{title}</span>
            {subtitle && (
              <span className="text-xs font-normal text-amber-400 font-mono tracking-normal">
                • {subtitle}
              </span>
            )}
          </h2>
        </div>

        {/* Scroll Buttons */}
        <div className="flex items-center gap-1.5 opacity-80 group-hover/carousel:opacity-100 transition-opacity">
          <button
            onClick={() => scroll('left')}
            aria-label={`Scroll ${title} left`}
            className="p-1.5 rounded-md bg-neutral-900 border border-neutral-700/80 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            aria-label={`Scroll ${title} right`}
            className="p-1.5 rounded-md bg-neutral-900 border border-neutral-700/80 text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-4 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
      >
        {items.map((item, index) => {
          const isInList = myList.includes(item.id);
          const historyEntry = watchHistory.find(w => w.mediaId === item.id);
          const hasProgress = historyEntry && historyEntry.progressPercent > 0;

          return (
            <div
              key={item.id}
              className={`shrink-0 group/card relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800/80 hover:border-amber-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 ${
                cardVariant === 'backdrop' ? 'w-[280px] sm:w-[320px]' : 'w-[180px] sm:w-[210px]'
              }`}
            >
              {/* Media Image Thumbnail */}
              <div
                className={`relative overflow-hidden cursor-pointer ${
                  cardVariant === 'backdrop' ? 'aspect-video' : 'aspect-[2/3]'
                }`}
                onClick={() => onOpenDetails(item)}
              >
                <img
                  src={cardVariant === 'backdrop' ? item.backdropUrl : item.posterUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Rating Badge Overlay */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-black/75 border border-neutral-700 text-neutral-200 rounded">
                    {item.rating}
                  </span>
                  {item.isOriginal && (
                    <span className="px-1.5 py-0.5 text-[9px] font-bold tracking-wider bg-amber-500 text-black rounded uppercase">
                      Lumière
                    </span>
                  )}
                </div>

                {/* Language Tag */}
                <div className="absolute top-2.5 right-2.5">
                  <span className="px-1.5 py-0.5 text-[10px] font-medium bg-black/70 backdrop-blur-sm text-neutral-300 rounded border border-neutral-700/60">
                    {item.language}
                  </span>
                </div>

                {/* Hover Quick Play Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlay(item);
                    }}
                    aria-label={`Play ${item.title}`}
                    className="w-12 h-12 rounded-full bg-amber-500 text-black flex items-center justify-center shadow-lg shadow-amber-500/40 transform scale-90 group-hover/card:scale-100 transition-transform cursor-pointer"
                  >
                    <Play className="w-5 h-5 fill-black ml-0.5" />
                  </button>
                </div>

                {/* Progress bar if partially watched */}
                {hasProgress && (
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-neutral-800">
                    <div
                      className="h-full bg-amber-500 transition-all"
                      style={{ width: `${historyEntry.progressPercent}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Card Metadata info */}
              <div className="p-3 flex flex-col justify-between gap-1.5">
                <div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="text-emerald-400 font-semibold">
                      {Math.min(99, Math.round(item.imdbScore * 10 + 5))}% Match
                    </span>
                    <span className="flex items-center gap-1 text-amber-300">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{item.imdbScore}</span>
                    </span>
                  </div>

                  <h3
                    onClick={() => onOpenDetails(item)}
                    className="font-semibold text-sm text-white hover:text-amber-300 truncate cursor-pointer transition-colors mt-0.5"
                    title={item.title}
                  >
                    {item.title}
                  </h3>

                  <div className="text-[11px] text-neutral-400 truncate">
                    {item.genres.slice(0, 2).join(' • ')} • {item.year}
                  </div>
                </div>

                {/* Card Quick Action Bar */}
                <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60 mt-1">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleMyList(item.id)}
                      title={isInList ? 'Remove from list' : 'Add to list'}
                      aria-label={isInList ? `Remove ${item.title}` : `Add ${item.title} to list`}
                      className="p-1 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {isInList ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Plus className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => onDownload(item)}
                      title="Download offline"
                      aria-label={`Download ${item.title}`}
                      className="p-1 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onCaptureSnippet(item)}
                      title="Capture photo & quote snippet"
                      aria-label={`Capture snippet for ${item.title}`}
                      className="p-1 rounded text-neutral-400 hover:text-amber-300 transition-colors cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onOpenDetails(item)}
                    aria-label={`Details for ${item.title}`}
                    className="p-1 rounded text-neutral-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
