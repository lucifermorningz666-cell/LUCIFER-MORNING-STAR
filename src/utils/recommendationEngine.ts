import { MediaFilterOptions, MediaItem, Profile, WatchProgress } from '../types/media';

/**
 * Calculates a personalized affinity match percentage (60 - 99%)
 * based on user profile's favorite genres, viewing history, and mood preference.
 */
export function calculatePersonalizedMatchScore(
  item: MediaItem,
  profile?: Profile | null,
  watchHistory: WatchProgress[] = []
): number {
  if (!profile) {
    return Math.round(item.imdbScore * 10);
  }

  let score = 70; // baseline

  // 1. Genre affinity bonus (+15 max)
  const favoriteGenres = profile.preferences?.favoriteGenres || [];
  const genreMatches = item.genres.filter(g =>
    favoriteGenres.some(fg => fg.toLowerCase() === g.toLowerCase())
  ).length;

  if (genreMatches >= 2) {
    score += 16;
  } else if (genreMatches === 1) {
    score += 10;
  }

  // 2. Mood affinity bonus (+10 max)
  const currentMood = profile.preferences?.mood;
  if (currentMood && item.moodAffinity.some(m => m.toLowerCase() === currentMood.toLowerCase())) {
    score += 10;
  }

  // 3. Language preference (+5)
  const favoriteLanguages = profile.preferences?.favoriteLanguages || [];
  if (favoriteLanguages.some(l => l.toLowerCase() === item.language.toLowerCase())) {
    score += 4;
  }

  // 4. Critically acclaimed bonus (+4)
  if (item.imdbScore >= 8.4 || item.rottenTomatoesScore >= 90) {
    score += 4;
  }

  // 5. Viewing history bonus: if already watching, slight boost for familiarity
  const isWatched = watchHistory.some(w => w.mediaId === item.id);
  if (isWatched) {
    score += 3;
  }

  // Cap score between 65 and 99
  return Math.min(99, Math.max(65, score));
}

/**
 * Filter and rank media by selected mood
 */
export function filterAndRankByMood(
  items: MediaItem[],
  mood: string,
  profile?: Profile | null
): MediaItem[] {
  if (!mood || mood === 'All') return items;

  return [...items].sort((a, b) => {
    const aMoodMatch = a.moodAffinity.includes(mood) ? 1 : 0;
    const bMoodMatch = b.moodAffinity.includes(mood) ? 1 : 0;
    if (aMoodMatch !== bMoodMatch) return bMoodMatch - aMoodMatch;

    const aScore = calculatePersonalizedMatchScore(a, profile);
    const bScore = calculatePersonalizedMatchScore(b, profile);
    return bScore - aScore;
  });
}

/**
 * Generate "Because you watched [Title]" recommendations
 */
export function getRecommendationsBasedOnItem(
  targetItem: MediaItem,
  allItems: MediaItem[],
  limit = 6
): MediaItem[] {
  return allItems
    .filter(item => item.id !== targetItem.id)
    .map(item => {
      // Calculate similarity score
      let similarity = 0;
      // Common genres (+3 per match)
      const commonGenres = item.genres.filter(g => targetItem.genres.includes(g)).length;
      similarity += commonGenres * 3;

      // Same director (+4)
      if (item.director === targetItem.director) similarity += 4;

      // Same language (+2)
      if (item.language === targetItem.language) similarity += 2;

      // Overlapping mood (+2 per match)
      const commonMoods = item.moodAffinity.filter(m => targetItem.moodAffinity.includes(m)).length;
      similarity += commonMoods * 2;

      return { item, similarity };
    })
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(res => res.item);
}

/**
 * Advanced search and filter logic
 */
export function searchAndFilterMedia(
  items: MediaItem[],
  filters: MediaFilterOptions
): MediaItem[] {
  return items.filter(item => {
    // 1. Text query
    if (filters.query && filters.query.trim()) {
      const q = filters.query.trim().toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSynopsis = item.synopsis.toLowerCase().includes(q);
      const matchCast = item.cast.some(actor => actor.toLowerCase().includes(q));
      const matchDirector = item.director.toLowerCase().includes(q);
      const matchGenre = item.genres.some(genre => genre.toLowerCase().includes(q));

      if (!matchTitle && !matchSynopsis && !matchCast && !matchDirector && !matchGenre) {
        return false;
      }
    }

    // 2. Type filter
    if (filters.type && filters.type !== 'all') {
      if (item.type !== filters.type) return false;
    }

    // 3. Genre filter
    if (filters.genre && filters.genre !== 'All') {
      if (!item.genres.some(g => g.toLowerCase() === filters.genre!.toLowerCase())) {
        return false;
      }
    }

    // 4. Language filter
    if (filters.language && filters.language !== 'All') {
      if (item.language.toLowerCase() !== filters.language.toLowerCase()) {
        return false;
      }
    }

    // 5. Year bounds
    if (filters.minYear && item.year < filters.minYear) return false;
    if (filters.maxYear && item.year > filters.maxYear) return false;

    // 6. Minimum score
    if (filters.minRating && item.imdbScore < filters.minRating) return false;

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'rating') {
      return b.imdbScore - a.imdbScore;
    }
    if (filters.sortBy === 'newest') {
      return b.year - a.year;
    }
    if (filters.sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    // Default: prioritize featured & rating
    return (b.imdbScore * 10) - (a.imdbScore * 10);
  });
}
