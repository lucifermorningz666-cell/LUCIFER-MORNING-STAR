import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  Play,
  Plus,
  Check,
  Star,
  Film,
  Tv,
  RotateCcw
} from 'lucide-react';
import { MediaFilterOptions, MediaItem } from '../types/media';
import { searchAndFilterMedia } from '../utils/recommendationEngine';

interface SearchOverlayProps {
  catalog: MediaItem[];
  onClose: () => void;
  onPlay: (item: MediaItem) => void;
  onOpenDetails: (item: MediaItem) => void;
  myList: string[];
  onToggleMyList: (id: string) => void;
}

const GENRES = [
  'All',
  'Sci-Fi',
  'Cyberpunk',
  'Neo-Noir',
  'Crime',
  'Drama',
  'Family',
  'Animation',
  'Thriller',
  'Romance',
  'Fantasy',
  'Mystery',
  'Adventure'
];

const LANGUAGES = [
  'All',
  'English',
  'Japanese',
  'Korean',
  'French',
  'Spanish',
  'Italian',
  'German',
  'Hindi'
];

export const SearchOverlay: React.FC<SearchOverlayProps> = ({
  catalog,
  onClose,
  onPlay,
  onOpenDetails,
  myList,
  onToggleMyList
}) => {
  const [query, setQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'series'>('all');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [minYear, setMinYear] = useState<number>(1980);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'newest' | 'title'>('recommended');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);

  const filters: MediaFilterOptions = {
    query,
    type: selectedType,
    genre: selectedGenre,
    language: selectedLanguage,
    minYear,
    minRating,
    sortBy
  };

  const results = useMemo(() => {
    return searchAndFilterMedia(catalog, filters);
  }, [catalog, query, selectedType, selectedGenre, selectedLanguage, minYear, minRating, sortBy]);

  const resetFilters = () => {
    setQuery('');
    setSelectedType('all');
    setSelectedGenre('All');
    setSelectedLanguage('All');
    setMinYear(1980);
    setMinRating(0);
    setSortBy('recommended');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col overflow-hidden text-neutral-100">
      {/* Search Header Bar */}
      <div className="p-4 sm:p-6 border-b border-neutral-800 bg-neutral-950">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search movies, series, cast, directors, genres..."
              className="w-full bg-neutral-900 border border-neutral-700/80 rounded-xl pl-11 pr-10 py-3 text-sm sm:text-base text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 shadow-inner"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="Clear search query"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className={`px-3.5 py-3 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer ${
              showAdvancedFilters
                ? 'bg-amber-500/20 border-amber-500/60 text-amber-300'
                : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Advanced Filters</span>
          </button>

          <button
            onClick={onClose}
            aria-label="Close search"
            className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Collapsible Advanced Filters Bar */}
        {showAdvancedFilters && (
          <div className="max-w-6xl mx-auto pt-4 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs">
              {/* Type Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Type:</label>
                <select
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value as any)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="all">All Content</option>
                  <option value="movie">Movies Only</option>
                  <option value="series">TV Series Only</option>
                </select>
              </div>

              {/* Genre Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Genre:</label>
                <select
                  value={selectedGenre}
                  onChange={e => setSelectedGenre(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  {GENRES.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              {/* Language Filter */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Audio Language:</label>
                <select
                  value={selectedLanguage}
                  onChange={e => setSelectedLanguage(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  {LANGUAGES.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              {/* Min Year */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                  Released Since ({minYear}):
                </label>
                <input
                  type="range"
                  min={1980}
                  max={2026}
                  value={minYear}
                  onChange={e => setMinYear(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Min IMDb Rating */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                  Minimum Score:
                </label>
                <select
                  value={minRating}
                  onChange={e => setMinRating(parseFloat(e.target.value))}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value={0}>Any Score</option>
                  <option value={7.5}>7.5+ IMDb</option>
                  <option value={8.0}>8.0+ IMDb</option>
                  <option value={8.5}>8.5+ Masterpiece</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Sort By:</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="recommended">Best Match %</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest Release</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-neutral-400 font-mono">
                Found {results.length} title{results.length === 1 ? '' : 's'} matching criteria
              </span>
              <button
                onClick={resetFilters}
                className="text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All Filters</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Search Results Grid */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">
          {results.length === 0 ? (
            <div className="text-center py-20 text-neutral-400 space-y-2">
              <Film className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
              <h3 className="text-base font-semibold text-white">No titles match your search criteria</h3>
              <p className="text-xs">Try adjusting genre, language, or minimum release year filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map(item => {
                const isInList = myList.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className="group rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 transition-all flex flex-col justify-between"
                  >
                    <div
                      className="relative aspect-[2/3] cursor-pointer overflow-hidden"
                      onClick={() => onOpenDetails(item)}
                    >
                      <img
                        src={item.posterUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold bg-black/80 rounded border border-neutral-700">
                          {item.rating}
                        </span>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className="px-1.5 py-0.5 text-[10px] bg-black/80 rounded text-neutral-300">
                          {item.language}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlay(item);
                          }}
                          aria-label={`Play ${item.title}`}
                          className="w-10 h-10 rounded-full bg-amber-500 text-black flex items-center justify-center cursor-pointer shadow-lg shadow-amber-500/40"
                        >
                          <Play className="w-4 h-4 fill-black ml-0.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3">
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                        <span className="text-emerald-400 font-bold">
                          {Math.min(99, Math.round(item.imdbScore * 10 + 4))}% Match
                        </span>
                        <span className="flex items-center gap-1 text-amber-300">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{item.imdbScore}</span>
                        </span>
                      </div>

                      <h4
                        onClick={() => onOpenDetails(item)}
                        className="text-xs font-bold text-white hover:text-amber-300 truncate cursor-pointer"
                      >
                        {item.title}
                      </h4>

                      <div className="text-[10px] text-neutral-400 truncate mt-0.5">
                        {item.genres.slice(0, 2).join(' • ')} • {item.year}
                      </div>

                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-neutral-800">
                        <button
                          onClick={() => onToggleMyList(item.id)}
                          className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          {isInList ? <Check className="w-3 h-3 text-amber-400" /> : <Plus className="w-3 h-3" />}
                          <span>{isInList ? 'Saved' : 'Save'}</span>
                        </button>

                        <button
                          onClick={() => onOpenDetails(item)}
                          className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
