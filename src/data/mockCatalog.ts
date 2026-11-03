import { MediaItem, UserReview } from '../types/media';

export const MOCK_CATALOG: MediaItem[] = [
  {
    id: 'm1',
    title: 'Neon Odyssey 2099',
    type: 'movie',
    tagline: 'When memory is synthetic, humanity is the last rebellion.',
    synopsis: 'In a rain-drenched Neo-Veridia, synthetic detective Kaelen Cross investigates the murder of a quantum memory architect, uncovering a corporate syndicate ready to rewrite human consciousness.',
    year: 2026,
    rating: 'R',
    genres: ['Sci-Fi', 'Cyberpunk', 'Neo-Noir', 'Thriller'],
    duration: '2h 19m',
    language: 'English',
    audioTracks: [
      { id: 'a1', label: 'English (Dolby Atmos)', format: 'Dolby Atmos' },
      { id: 'a2', label: 'English [Audio Description]', isAudioDescription: true, format: 'Stereo' },
      { id: 'a3', label: 'Japanese 5.1 (Dub)', format: '5.1' },
      { id: 'a4', label: 'Spanish 5.1 (Dub)', format: '5.1' },
      { id: 'a5', label: 'French 5.1 (Dub)', format: '5.1' }
    ],
    subtitles: [
      { id: 's1', label: 'English [CC]', languageCode: 'en', isSDH: true },
      { id: 's2', label: 'Spanish', languageCode: 'es' },
      { id: 's3', label: 'French', languageCode: 'fr' },
      { id: 's4', label: 'Japanese', languageCode: 'ja' },
      { id: 's5', label: 'German', languageCode: 'de' }
    ],
    director: 'Elena Vance',
    cast: ['Kaelen Cross', 'Mira Chen', 'Stellan Skarsgård', 'Hiroyuki Sanada'],
    imdbScore: 8.9,
    rottenTomatoesScore: 94,
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    moodAffinity: ['Adrenaline Surge', 'Cerebral Mystery', 'Late Night Nostalgia'],
    isFeatured: true,
    isTrending: true,
    isOriginal: true,
    awards: 'Winner - 4 Visual Effects Guild Awards',
    releaseDate: '2026-02-14'
  },
  {
    id: 's1',
    title: 'Chronicles of Solaria',
    type: 'series',
    tagline: 'The dynastic war for the dying sun has begun.',
    synopsis: 'Across the seven orbiting ring-citadels, political intrigue, solar alchemy, and ancient alien terraforming awaken as the sovereign matriarch falls gravely ill.',
    year: 2025,
    rating: 'TV-MA',
    genres: ['Sci-Fi', 'Epic Fantasy', 'Drama', 'Adventure'],
    seasonsCount: 2,
    episodesCount: 16,
    episodes: [
      {
        id: 's1-e1',
        season: 1,
        episodeNumber: 1,
        title: 'The Eclipse Herald',
        duration: '58m',
        overview: 'Commander Vane returns from the deep corona with an ominous relic that defies solar mechanics.',
        stillUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
      },
      {
        id: 's1-e2',
        season: 1,
        episodeNumber: 2,
        title: 'Ashes of the Sovereign',
        duration: '54m',
        overview: 'Betrayal inside the High Council forces Princess Lyra into hiding amongst the lower mining levels.',
        stillUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
      },
      {
        id: 's1-e3',
        season: 1,
        episodeNumber: 3,
        title: 'Fractured Orbit',
        duration: '62m',
        overview: 'A planetary shield failure tests the loyalties of the orbital fleet.',
        stillUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      }
    ],
    language: 'English',
    audioTracks: [
      { id: 'a1', label: 'English (Dolby Atmos)', format: 'Dolby Atmos' },
      { id: 'a2', label: 'English [Audio Description]', isAudioDescription: true, format: 'Stereo' },
      { id: 'a3', label: 'Spanish 5.1', format: '5.1' }
    ],
    subtitles: [
      { id: 's1', label: 'English [CC]', languageCode: 'en', isSDH: true },
      { id: 's2', label: 'Spanish', languageCode: 'es' },
      { id: 's3', label: 'French', languageCode: 'fr' }
    ],
    director: 'Marcus Thorne',
    cast: ['Lyra Sterling', 'Cassian Royce', 'Gemma Chan', 'Dev Patel'],
    imdbScore: 8.7,
    rottenTomatoesScore: 92,
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    moodAffinity: ['Cerebral Mystery', 'Adrenaline Surge'],
    isTrending: true,
    isOriginal: true,
    awards: 'Emmy Award Nominee - Best Drama Series',
    releaseDate: '2025-10-04'
  },
  {
    id: 'm2',
    title: 'Whispers of Kyoto',
    type: 'movie',
    tagline: 'In the stillness between seasons, secrets are born.',
    synopsis: 'An elderly tea master and an estranged jazz musician granddaughter reunite in the historic Gion district to decipher a century-old diary left behind after the Great Kanto earthquake.',
    year: 2024,
    rating: 'PG',
    genres: ['Drama', 'Family', 'Mystery'],
    duration: '1h 52m',
    language: 'Japanese',
    audioTracks: [
      { id: 'a1', label: 'Japanese 5.1 (Original)', format: '5.1' },
      { id: 'a2', label: 'Japanese [Audio Description]', isAudioDescription: true, format: 'Stereo' },
      { id: 'a3', label: 'English (Dub)', format: '5.1' }
    ],
    subtitles: [
      { id: 's1', label: 'English [CC]', languageCode: 'en', isSDH: true },
      { id: 's2', label: 'Japanese [CC]', languageCode: 'ja', isSDH: true },
      { id: 's3', label: 'French', languageCode: 'fr' },
      { id: 's4', label: 'Spanish', languageCode: 'es' }
    ],
    director: 'Kenji Sato',
    cast: ['Ren Takahashi', 'Hana Matsuoka', 'Ken Watanabe'],
    imdbScore: 8.4,
    rottenTomatoesScore: 96,
    backdropUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    moodAffinity: ['Cozy Comfort', 'Late Night Nostalgia'],
    isFeatured: false,
    isTrending: false,
    awards: 'Cannes Film Festival - Jury Prize',
    releaseDate: '2024-05-18'
  },
  {
    id: 'm3',
    title: 'The Forest Whisperer',
    type: 'movie',
    tagline: 'Nature speaks in frequencies only the pure can hear.',
    synopsis: 'A spirited 10-year-old girl discovers a hidden gateway beneath the ancient redwood forest where mechanical bioluminescent creatures safeguard the Earth’s seasonal clock.',
    year: 2025,
    rating: 'G',
    genres: ['Animation', 'Family', 'Adventure', 'Fantasy'],
    duration: '1h 38m',
    language: 'English',
    audioTracks: [
      { id: 'a1', label: 'English (Dolby Atmos)', format: 'Dolby Atmos' },
      { id: 'a2', label: 'English [Audio Description]', isAudioDescription: true, format: 'Stereo' },
      { id: 'a3', label: 'Spanish (Latin America)', format: '5.1' },
      { id: 'a4', label: 'French (Canadian)', format: '5.1' }
    ],
    subtitles: [
      { id: 's1', label: 'English [CC]', languageCode: 'en', isSDH: true },
      { id: 's2', label: 'Spanish', languageCode: 'es' },
      { id: 's3', label: 'French', languageCode: 'fr' }
    ],
    director: 'Aria Dubois',
    cast: ['Saoirse Ronan (Voice)', 'Jacob Tremblay (Voice)', 'Mark Rylance (Voice)'],
    imdbScore: 8.2,
    rottenTomatoesScore: 95,
    backdropUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    moodAffinity: ['Family Adventure', 'Cozy Comfort'],
    isFeatured: true,
    awards: 'Academy Award Nominee - Best Animated Feature',
    releaseDate: '2025-11-20'
  },
  {
    id: 'm4',
    title: 'Midnight in Montmartre',
    type: 'movie',
    tagline: 'Art, passion, and the heist that seduced Paris.',
    synopsis: 'A Parisian art restorer and a charismatic cat burglar team up to pull off an impossible zero-trace retrieval of a hidden Monet masterpiece before it is sold at a black market auction.',
    year: 2024,
    rating: 'PG-13',
    genres: ['Crime', 'Romance', 'Comedy', 'Thriller'],
    duration: '2h 04m',
    language: 'French',
    audioTracks: [
      { id: 'a1', label: 'French 5.1 (Original)', format: '5.1' },
      { id: 'a2', label: 'English (Dub)', format: '5.1' },
      { id: 'a3', label: 'French [Audio Description]', isAudioDescription: true, format: 'Stereo' }
    ],
    subtitles: [
      { id: 's1', label: 'English [CC]', languageCode: 'en', isSDH: true },
      { id: 's2', label: 'French [CC]', languageCode: 'fr', isSDH: true },
      { id: 's3', label: 'Spanish', languageCode: 'es' }
    ],
    director: 'Jean-Luc Laurent',
    cast: ['Camille Cottin', 'Louis Garrel', 'Marion Cotillard'],
    imdbScore: 7.8,
    rottenTomatoesScore: 89,
    backdropUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    moodAffinity: ['Late Night Nostalgia', 'Cozy Comfort'],
    awards: 'César Award - Best Cinematography',
    releaseDate: '2024-09-12'
  },
  {
    id: 's2',
    title: 'Seoul Cyber Syndicate',
    type: 'series',
    tagline: 'When the algorithm predicts murder, whom do you trust?',
    synopsis: 'An underground ethical hacker collective in Gangnam battles an omniscient state AI system that flags citizens as future criminals before offenses occur.',
    year: 2025,
    rating: 'TV-14',
    genres: ['Sci-Fi', 'Crime', 'Cyberpunk', 'Mystery'],
    seasonsCount: 1,
    episodesCount: 8,
    episodes: [
      {
        id: 's2-e1',
        season: 1,
        episodeNumber: 1,
        title: 'Zero-Day Genesis',
        duration: '52m',
        overview: 'Hacker ghost "Echo" finds an anomalous anomaly in the municipal surveillance mesh.',
        stillUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
      },
      {
        id: 's2-e2',
        season: 1,
        episodeNumber: 2,
        title: 'Ghost Node',
        duration: '49m',
        overview: 'A chase through Seoul’s subterranean hyper-transit corridors exposes an inside leak.',
        stillUrl: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
      }
    ],
    language: 'Korean',
    audioTracks: [
      { id: 'a1', label: 'Korean 5.1 (Original)', format: '5.1' },
      { id: 'a2', label: 'English (Dub)', format: '5.1' },
      { id: 'a3', label: 'Spanish (Dub)', format: '5.1' }
    ],
    subtitles: [
      { id: 's1', label: 'English [CC]', languageCode: 'en', isSDH: true },
      { id: 's2', label: 'Korean [CC]', languageCode: 'ko' },
      { id: 's3', label: 'Japanese', languageCode: 'ja' }
    ],
    director: 'Park Chan-wook',
    cast: ['Bae Doona', 'Park Hae-soo', 'Han So-hee'],
    imdbScore: 8.6,
    rottenTomatoesScore: 93,
    backdropUrl: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    moodAffinity: ['Adrenaline Surge', 'Cerebral Mystery'],
    isTrending: true,
    releaseDate: '2025-08-22'
  },
  {
    id: 'm5',
    title: 'Abyssal Trench: Deep Horizon',
    type: 'movie',
    tagline: 'At 11,000 meters, darkness has teeth.',
    synopsis: 'A deep-sea scientific research outpost stationed in the Mariana Trench detects unnatural acoustic pulses originating from miles beneath the tectonic plate.',
    year: 2026,
    rating: 'PG-13',
    genres: ['Sci-Fi', 'Thriller', 'Mystery'],
    duration: '2h 11m',
    language: 'English',
    audioTracks: [
      { id: 'a1', label: 'English (Dolby Atmos)', format: 'Dolby Atmos' },
      { id: 'a2', label: 'English [Audio Description]', isAudioDescription: true, format: 'Stereo' },
      { id: 'a3', label: 'German 5.1', format: '5.1' }
    ],
    subtitles: [
      { id: 's1', label: 'English [CC]', languageCode: 'en', isSDH: true },
      { id: 's2', label: 'German', languageCode: 'de' },
      { id: 's3', label: 'Spanish', languageCode: 'es' }
    ],
    director: 'Guillermo del Toro',
    cast: ['Rebecca Ferguson', 'David Oyelowo', 'Daniel Brühl'],
    imdbScore: 8.1,
    rottenTomatoesScore: 87,
    backdropUrl: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    moodAffinity: ['Cerebral Mystery', 'Adrenaline Surge'],
    releaseDate: '2026-01-20'
  },
  {
    id: 'm6',
    title: 'La Sinfonía de Madrid',
    type: 'movie',
    tagline: 'Every beat echoes a love once lost.',
    synopsis: 'A passionate flamenco guitarist and a world-renowned classical cellist clash and fall in love while composing Madrid’s centennial royal overture.',
    year: 2023,
    rating: 'PG',
    genres: ['Drama', 'Romance', 'Music'],
    duration: '1h 48m',
    language: 'Spanish',
    audioTracks: [
      { id: 'a1', label: 'Spanish 5.1 (Original)', format: '5.1' },
      { id: 'a2', label: 'English (Dub)', format: '5.1' },
      { id: 'a3', label: 'Spanish [Audio Description]', isAudioDescription: true, format: 'Stereo' }
    ],
    subtitles: [
      { id: 's1', label: 'Spanish [CC]', languageCode: 'es', isSDH: true },
      { id: 's2', label: 'English [CC]', languageCode: 'en' },
      { id: 's3', label: 'French', languageCode: 'fr' }
    ],
    director: 'Pedro Almodóvar',
    cast: ['Penélope Cruz', 'Antonio Banderas', 'Blanca Suárez'],
    imdbScore: 8.3,
    rottenTomatoesScore: 92,
    backdropUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    moodAffinity: ['Cozy Comfort', 'Late Night Nostalgia'],
    awards: 'Goya Awards - Best Original Score',
    releaseDate: '2023-11-17'
  },
  {
    id: 's3',
    title: 'Tales of the Starlight Caravan',
    type: 'series',
    tagline: 'Adventure awaits across the cosmic frontier.',
    synopsis: 'Follow a cheerful family of cosmic cartographers as they explore luminous nebulae, meet friendly planetary species, and fix constellation lighthouses.',
    year: 2025,
    rating: 'TV-Y7',
    genres: ['Animation', 'Family', 'Adventure', 'Sci-Fi'],
    seasonsCount: 1,
    episodesCount: 12,
    episodes: [
      {
        id: 's3-e1',
        season: 1,
        episodeNumber: 1,
        title: 'The Singing Asteroid',
        duration: '24m',
        overview: 'Pip and Luna track a harmonic frequency that turns out to be a baby space whale.',
        stillUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      }
    ],
    language: 'English',
    audioTracks: [
      { id: 'a1', label: 'English 5.1', format: '5.1' },
      { id: 'a2', label: 'English [Audio Description]', isAudioDescription: true, format: 'Stereo' },
      { id: 'a3', label: 'Spanish', format: 'Stereo' }
    ],
    subtitles: [
      { id: 's1', label: 'English [CC]', languageCode: 'en', isSDH: true },
      { id: 's2', label: 'Spanish', languageCode: 'es' }
    ],
    director: 'Chloe Zhao',
    cast: ['Tara Strong (Voice)', 'Tom Kenny (Voice)'],
    imdbScore: 8.5,
    rottenTomatoesScore: 97,
    backdropUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    moodAffinity: ['Family Adventure', 'Cozy Comfort'],
    releaseDate: '2025-06-01'
  },
  {
    id: 'm-retro-blade',
    title: 'Blade Runner (1982 Classic)',
    type: 'movie',
    tagline: 'Man has made his match... now it\'s his problem.',
    synopsis: 'A blade runner must pursue and terminate four replicants who stole a ship in space and have returned to Earth to find their creator.',
    year: 1982,
    rating: 'R',
    genres: ['Sci-Fi', 'Neo-Noir', 'Thriller'],
    duration: '1h 57m',
    language: 'English',
    audioTracks: [
      { id: 'a1', label: 'English 5.1 (Remastered)', format: '5.1' },
      { id: 'a2', label: 'English [Audio Description]', isAudioDescription: true, format: 'Stereo' },
      { id: 'a3', label: 'French 5.1', format: '5.1' }
    ],
    subtitles: [
      { id: 's1', label: 'English [CC]', languageCode: 'en', isSDH: true },
      { id: 's2', label: 'Spanish', languageCode: 'es' },
      { id: 's3', label: 'French', languageCode: 'fr' }
    ],
    director: 'Ridley Scott',
    cast: ['Harrison Ford', 'Rutger Hauer', 'Sean Young'],
    imdbScore: 8.1,
    rottenTomatoesScore: 89,
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    moodAffinity: ['Late Night Nostalgia', 'Cerebral Mystery'],
    isFeatured: false,
    awards: 'BAFTA Film Award - Best Cinematography',
    releaseDate: '1982-06-25'
  },
  {
    id: 'm-retro-paradiso',
    title: 'Cinema Paradiso (1988 Classic)',
    type: 'movie',
    tagline: 'A celebration of the magic of the movies.',
    synopsis: 'A filmmaker recalls his childhood when falling in love with the pictures at the cinema of his home village and forms a deep friendship with the projectionist.',
    year: 1988,
    rating: 'PG',
    genres: ['Drama', 'Romance', 'Family'],
    duration: '2h 04m',
    language: 'Italian',
    audioTracks: [
      { id: 'a1', label: 'Italian 5.1 (Original)', format: '5.1' },
      { id: 'a2', label: 'English (Dub)', format: 'Stereo' }
    ],
    subtitles: [
      { id: 's1', label: 'English [CC]', languageCode: 'en', isSDH: true },
      { id: 's2', label: 'Italian [CC]', languageCode: 'it' }
    ],
    director: 'Giuseppe Tornatore',
    cast: ['Philippe Noiret', 'Enzo Cannavale', 'Antonella Attili'],
    imdbScore: 8.5,
    rottenTomatoesScore: 90,
    backdropUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    moodAffinity: ['Late Night Nostalgia', 'Cozy Comfort'],
    awards: 'Academy Award Winner - Best Foreign Language Film',
    releaseDate: '1988-11-17'
  },
  {
    id: 'm-retro-matrix',
    title: 'The Matrix (1999 Classic)',
    type: 'movie',
    tagline: 'Welcome to the Real World.',
    synopsis: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.',
    year: 1999,
    rating: 'R',
    genres: ['Sci-Fi', 'Cyberpunk', 'Action', 'Thriller'],
    duration: '2h 16m',
    language: 'English',
    audioTracks: [
      { id: 'a1', label: 'English (Dolby Atmos)', format: 'Dolby Atmos' },
      { id: 'a2', label: 'English [Audio Description]', isAudioDescription: true, format: 'Stereo' },
      { id: 'a3', label: 'Spanish 5.1', format: '5.1' }
    ],
    subtitles: [
      { id: 's1', label: 'English [CC]', languageCode: 'en', isSDH: true },
      { id: 's2', label: 'Spanish', languageCode: 'es' }
    ],
    director: 'Lana & Lilly Wachowski',
    cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
    imdbScore: 8.7,
    rottenTomatoesScore: 83,
    backdropUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    moodAffinity: ['Adrenaline Surge', 'Cerebral Mystery'],
    awards: 'Winner of 4 Academy Awards',
    releaseDate: '1999-03-31'
  },
  {
    id: 's-retro-twinpeaks',
    title: 'Twin Peaks: The Vintage Mystery',
    type: 'series',
    tagline: 'The owls are not what they seem.',
    synopsis: 'An idiosyncratic FBI agent investigates the murder of a young woman in the even more idiosyncratic town of Twin Peaks.',
    year: 1990,
    rating: 'TV-14',
    genres: ['Mystery', 'Drama', 'Thriller'],
    seasonsCount: 3,
    episodesCount: 30,
    episodes: [
      {
        id: 's-tp-e1',
        season: 1,
        episodeNumber: 1,
        title: 'Pilot: Northwest Passage',
        duration: '94m',
        overview: 'Special Agent Dale Cooper arrives in the Pacific Northwest timber town to solve a mystery.',
        stillUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
      }
    ],
    language: 'English',
    audioTracks: [
      { id: 'a1', label: 'English 5.1', format: '5.1' },
      { id: 'a2', label: 'English [Audio Description]', isAudioDescription: true, format: 'Stereo' }
    ],
    subtitles: [
      { id: 's1', label: 'English [CC]', languageCode: 'en', isSDH: true }
    ],
    director: 'David Lynch & Mark Frost',
    cast: ['Kyle MacLachlan', 'Michael Ontkean', 'Mädchen Amick'],
    imdbScore: 8.8,
    rottenTomatoesScore: 89,
    backdropUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    moodAffinity: ['Cerebral Mystery', 'Late Night Nostalgia'],
    releaseDate: '1990-04-08'
  },
  {
    id: 'm-retro-interstellar',
    title: 'Interstellar: Deep Orbit (2014)',
    type: 'movie',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    synopsis: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
    year: 2014,
    rating: 'PG-13',
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    duration: '2h 49m',
    language: 'English',
    audioTracks: [
      { id: 'a1', label: 'English (Dolby Atmos)', format: 'Dolby Atmos' },
      { id: 'a2', label: 'English [Audio Description]', isAudioDescription: true, format: 'Stereo' }
    ],
    subtitles: [
      { id: 's1', label: 'English [CC]', languageCode: 'en', isSDH: true },
      { id: 's2', label: 'Spanish', languageCode: 'es' }
    ],
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    imdbScore: 8.7,
    rottenTomatoesScore: 73,
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80',
    posterUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    moodAffinity: ['Cerebral Mystery', 'Family Adventure'],
    awards: 'Academy Award Winner - Best Visual Effects',
    releaseDate: '2014-11-07'
  }
];

export const INITIAL_REVIEWS: UserReview[] = [
  {
    id: 'rev-1',
    mediaId: 'm1',
    userName: 'CinemaArchitect',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
    rating: 5,
    timestamp: '2 hours ago',
    content: 'The cinematography in the rainy neon market sequence is legendary. The Dolby Atmos audio mix makes every drop of rain feel tactile!',
    sceneTimestamp: '00:42:18',
    likes: 42,
    isSpoiler: false
  },
  {
    id: 'rev-2',
    mediaId: 'm1',
    userName: 'KaelenFan99',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    rating: 5,
    timestamp: 'Yesterday',
    content: 'WARNING: The twist in act three completely re-contextualizes the memories from the first 20 minutes! Keep an eye on the pocket watch reflections.',
    sceneTimestamp: '01:38:05',
    likes: 19,
    isSpoiler: true
  },
  {
    id: 'rev-3',
    mediaId: 's1',
    userName: 'SciFi_Oracle',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100',
    rating: 5,
    timestamp: '3 days ago',
    content: 'Best worldbuilding since Dune. Episode 3 is pure masterclass pacing.',
    sceneTimestamp: '00:54:10',
    likes: 31,
    isSpoiler: false
  }
];
