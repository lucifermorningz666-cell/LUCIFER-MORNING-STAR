import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePersonalizedMatchScore, filterAndRankByMood, searchAndFilterMedia } from './recommendationEngine';
import { MediaItem, Profile } from '../types/media';

const mockProfile: Profile = {
  id: 'p1',
  name: 'Alex',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120',
  isKids: false,
  pinProtected: false,
  maxRating: 'NC-17',
  preferences: {
    favoriteGenres: ['Sci-Fi', 'Cyberpunk'],
    mood: 'Adrenaline Surge',
    favoriteLanguages: ['English', 'Japanese'],
    playbackSpeed: 1,
    autoplayNext: true,
    audioDescriptionDefault: false,
    subtitlesDefault: true,
    subtitleSize: 'medium',
    subtitleContrast: 'yellow',
    theme: 'midnight'
  },
  watchHistory: [],
  myList: []
};

const mockItem1: MediaItem = {
  id: 'm1',
  title: 'Neon Odyssey 2099',
  type: 'movie',
  tagline: 'Memory is the currency of the future.',
  synopsis: 'A synthetic detective uncovers an underworld conspiracy.',
  year: 2026,
  rating: 'R',
  genres: ['Sci-Fi', 'Cyberpunk', 'Thriller'],
  language: 'English',
  audioTracks: [{ id: 'a1', label: 'English Atmos', format: 'Dolby Atmos' }],
  subtitles: [{ id: 's1', label: 'English [CC]', languageCode: 'en' }],
  director: 'Elena Vance',
  cast: ['Kaelen Cross', 'Mira Chen'],
  imdbScore: 8.8,
  rottenTomatoesScore: 94,
  backdropUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=1200',
  posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600',
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  moodAffinity: ['Adrenaline Surge', 'Cerebral Mystery'],
  releaseDate: '2026-03-15'
};

const mockItem2: MediaItem = {
  id: 'm2',
  title: 'Whispers of Kyoto',
  type: 'movie',
  tagline: 'Some traditions defy eternity.',
  synopsis: 'A quiet meditation on time and family in Kyoto.',
  year: 2024,
  rating: 'PG',
  genres: ['Drama', 'Family'],
  language: 'Japanese',
  audioTracks: [{ id: 'a2', label: 'Japanese Stereo', format: 'Stereo' }],
  subtitles: [{ id: 's2', label: 'English', languageCode: 'en' }],
  director: 'Kenji Sato',
  cast: ['Ren Takahashi'],
  imdbScore: 7.9,
  rottenTomatoesScore: 88,
  backdropUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200',
  posterUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600',
  videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  moodAffinity: ['Cozy Comfort'],
  releaseDate: '2024-05-10'
};

test('calculates high affinity match score for matching genres and mood', () => {
  const score = calculatePersonalizedMatchScore(mockItem1, mockProfile, []);
  assert.ok(score >= 90, `Score should be >= 90, got ${score}`);
});

test('ranks mood matching items higher when filtered by mood', () => {
  const ranked = filterAndRankByMood([mockItem2, mockItem1], 'Adrenaline Surge', mockProfile);
  assert.equal(ranked[0].id, 'm1');
});

test('filters media by genre and language correctly', () => {
  const filtered = searchAndFilterMedia([mockItem1, mockItem2], {
    genre: 'Sci-Fi',
    language: 'English'
  });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].title, 'Neon Odyssey 2099');
});

test('filters media by text search against cast, director, title', () => {
  const searchDirector = searchAndFilterMedia([mockItem1, mockItem2], { query: 'Kenji Sato' });
  assert.equal(searchDirector.length, 1);
  assert.equal(searchDirector[0].id, 'm2');

  const searchCast = searchAndFilterMedia([mockItem1, mockItem2], { query: 'Mira Chen' });
  assert.equal(searchCast.length, 1);
  assert.equal(searchCast[0].id, 'm1');
});
