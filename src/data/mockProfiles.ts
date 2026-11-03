import { Profile, WatchlistSnippet } from '../types/media';

export const INITIAL_PROFILES: Profile[] = [
  {
    id: 'prof-alex',
    name: 'Alex Morgan',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
    isKids: false,
    pinProtected: false,
    pinCode: '1234',
    maxRating: 'NC-17',
    preferences: {
      favoriteGenres: ['Sci-Fi', 'Cyberpunk', 'Thriller'],
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
    watchHistory: [
      {
        mediaId: 'm1',
        progressPercent: 68,
        currentTimeSeconds: 5670,
        totalDurationSeconds: 8340,
        lastWatchedAt: '2026-11-01T20:15:00Z'
      },
      {
        mediaId: 's1',
        episodeId: 's1-e1',
        progressPercent: 45,
        currentTimeSeconds: 1560,
        totalDurationSeconds: 3480,
        lastWatchedAt: '2026-10-30T19:00:00Z'
      }
    ],
    myList: ['m1', 's1', 's2', 'm5']
  },
  {
    id: 'prof-elena',
    name: 'Elena',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=80',
    isKids: false,
    pinProtected: true,
    pinCode: '7788',
    maxRating: 'PG-13',
    preferences: {
      favoriteGenres: ['Drama', 'Romance', 'Mystery'],
      mood: 'Cozy Comfort',
      favoriteLanguages: ['Spanish', 'French', 'English'],
      playbackSpeed: 1,
      autoplayNext: true,
      audioDescriptionDefault: false,
      subtitlesDefault: true,
      subtitleSize: 'medium',
      subtitleContrast: 'white',
      theme: 'obsidian'
    },
    watchHistory: [
      {
        mediaId: 'm2',
        progressPercent: 82,
        currentTimeSeconds: 5500,
        totalDurationSeconds: 6720,
        lastWatchedAt: '2026-10-31T21:00:00Z'
      }
    ],
    myList: ['m2', 'm4', 'm6']
  },
  {
    id: 'prof-leo',
    name: 'Leo (Kids)',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=160&q=80',
    isKids: true,
    pinProtected: false,
    maxRating: 'TV-Y7',
    dailyTimeLimitMinutes: 90,
    bedtimeHour: 20,
    bedtimeMinute: 30,
    preferences: {
      favoriteGenres: ['Animation', 'Family', 'Adventure'],
      mood: 'Family Adventure',
      favoriteLanguages: ['English'],
      playbackSpeed: 1,
      autoplayNext: false,
      audioDescriptionDefault: true,
      subtitlesDefault: true,
      subtitleSize: 'large',
      subtitleContrast: 'cyan',
      theme: 'midnight'
    },
    watchHistory: [
      {
        mediaId: 'm3',
        progressPercent: 50,
        currentTimeSeconds: 2940,
        totalDurationSeconds: 5880,
        lastWatchedAt: '2026-11-01T15:30:00Z'
      }
    ],
    myList: ['m3', 's3']
  }
];

export const INITIAL_SNIPPETS: WatchlistSnippet[] = [
  {
    id: 'snip-1',
    mediaId: 'm1',
    mediaTitle: 'Neon Odyssey 2099',
    timestampStr: '01:14:22',
    quote: '"We are not the memories we inherit; we are the choices we refuse to delete."',
    theme: 'noir',
    captureUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-11-01',
    author: 'Alex Morgan'
  },
  {
    id: 'snip-2',
    mediaId: 'm2',
    mediaTitle: 'Whispers of Kyoto',
    timestampStr: '00:38:15',
    quote: '"The tea cup holds the season. Drink before the rain ceases."',
    theme: 'editorial',
    captureUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
    createdAt: '2026-10-31',
    author: 'Elena'
  }
];
