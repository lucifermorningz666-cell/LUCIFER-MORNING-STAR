export type MediaType = 'movie' | 'series';

export type MaturityRating = 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17' | 'TV-Y' | 'TV-Y7' | 'TV-PG' | 'TV-14' | 'TV-MA';

export type StreamQuality = '480p' | '720p' | '1080p' | '4K UHD';

export type DownloadQuality = 'Standard' | 'High' | 'Ultra (4K)';

export interface Episode {
  id: string;
  season: number;
  episodeNumber: number;
  title: string;
  duration: string;
  overview: string;
  stillUrl: string;
  videoUrl: string;
}

export interface MediaItem {
  id: string;
  title: string;
  type: MediaType;
  tagline: string;
  synopsis: string;
  year: number;
  rating: MaturityRating;
  genres: string[];
  duration?: string; // For movies (e.g. "2h 18m")
  seasonsCount?: number; // For series
  episodesCount?: number;
  episodes?: Episode[];
  language: string; // e.g. "English", "Japanese", "French", "Korean", "Spanish", "German", "Hindi"
  audioTracks: {
    id: string;
    label: string;
    isAudioDescription?: boolean;
    format: string; // "Dolby Atmos", "5.1", "Stereo"
  }[];
  subtitles: {
    id: string;
    label: string;
    languageCode: string;
    isSDH?: boolean; // Subtitles for the Deaf and Hard of Hearing
  }[];
  director: string;
  cast: string[];
  imdbScore: number;
  lumiereMatchScore?: number;
  rottenTomatoesScore: number;
  backdropUrl: string;
  posterUrl: string;
  videoUrl: string;
  moodAffinity: string[]; // e.g. "Adrenaline Surge", "Cerebral Mystery", "Late Night Nostalgia", "Cozy Comfort", "Family Adventure"
  isTrending?: boolean;
  isFeatured?: boolean;
  isOriginal?: boolean;
  awards?: string;
  releaseDate: string;
}

export interface WatchProgress {
  mediaId: string;
  episodeId?: string;
  progressPercent: number; // 0 - 100
  currentTimeSeconds: number;
  totalDurationSeconds: number;
  lastWatchedAt: string;
}

export interface DownloadedItem {
  id: string;
  mediaId: string;
  episodeId?: string;
  title: string;
  subtitle?: string; // e.g. "S1:E3 The Signal"
  type: MediaType;
  quality: DownloadQuality;
  sizeMb: number;
  downloadedAt: string;
  progress: number; // 0 to 100
  status: 'completed' | 'downloading' | 'paused' | 'error';
  posterUrl: string;
  videoUrl: string;
}

export interface ProfilePreferences {
  favoriteGenres: string[];
  mood: string;
  favoriteLanguages: string[];
  playbackSpeed: number;
  autoplayNext: boolean;
  audioDescriptionDefault: boolean;
  subtitlesDefault: boolean;
  subtitleSize: 'small' | 'medium' | 'large' | 'xlarge';
  subtitleContrast: 'white' | 'yellow' | 'cyan';
  theme: 'midnight' | 'obsidian' | 'warm';
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  isKids: boolean;
  pinProtected: boolean;
  pinCode?: string; // 4-digit
  maxRating: MaturityRating;
  dailyTimeLimitMinutes?: number;
  bedtimeHour?: number; // 24hr format
  bedtimeMinute?: number;
  preferences: ProfilePreferences;
  watchHistory: WatchProgress[];
  myList: string[]; // media IDs
}

export interface UserReview {
  id: string;
  mediaId: string;
  userName: string;
  userAvatar: string;
  rating: number; // 1-5
  timestamp: string;
  content: string;
  sceneTimestamp?: string; // e.g. "01:24:12"
  likes: number;
  isSpoiler?: boolean;
}

export interface WatchlistSnippet {
  id: string;
  mediaId: string;
  mediaTitle: string;
  timestampStr: string;
  quote: string;
  theme: 'noir' | 'neon' | 'editorial' | 'vintage';
  captureUrl: string;
  createdAt: string;
  author: string;
}

export interface MediaFilterOptions {
  query?: string;
  type?: 'all' | 'movie' | 'series';
  genre?: string;
  language?: string;
  minYear?: number;
  maxYear?: number;
  minRating?: number; // IMDb score e.g. 7.5
  maturityRating?: string;
  sortBy?: 'recommended' | 'rating' | 'newest' | 'title';
}
