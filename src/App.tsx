import React, { useState, useEffect, useMemo } from 'react';
import {
  MOCK_CATALOG,
  INITIAL_REVIEWS
} from './data/mockCatalog';
import {
  INITIAL_PROFILES,
  INITIAL_SNIPPETS
} from './data/mockProfiles';
import {
  DownloadedItem,
  DownloadQuality,
  Episode,
  MediaItem,
  Profile,
  UserReview,
  WatchProgress,
  WatchlistSnippet
} from './types/media';
import {
  calculatePersonalizedMatchScore,
  filterAndRankByMood
} from './utils/recommendationEngine';
import {
  filterCatalogForProfile,
  isBedtimeRestricted
} from './utils/parentalFilter';
import {
  transitionDownloadState,
  QUALITY_ESTIMATE_MB
} from './utils/offlineStorage';
import {
  generatePartyRoomCode,
  WatchPartyRoom,
  createPartySystemMessage
} from './utils/watchPartyLogic';
import {
  UserWallet,
  calculateEarnedCredits
} from './utils/earningLogic';

// Components
import { Navbar } from './components/Navbar';
import { MoodQuizBar } from './components/MoodQuizBar';
import { HeroBanner } from './components/HeroBanner';
import { MediaCarousel } from './components/MediaCarousel';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { MediaDetailModal } from './components/MediaDetailModal';
import { SearchOverlay } from './components/SearchOverlay';
import { OfflineManagerModal } from './components/OfflineManagerModal';
import { ParentalControlsModal } from './components/ParentalControlsModal';
import { AccessibilityModal } from './components/AccessibilityModal';
import { SnippetCaptureModal } from './components/SnippetCaptureModal';
import { SocialShareModal } from './components/SocialShareModal';
import { WatchToEarnModal } from './components/WatchToEarnModal';
import { SnippetsVault } from './components/SnippetsVault';

import {
  Flame,
  Coins,
  AlertTriangle,
  Moon,
  Sparkles,
  Film,
  DownloadCloud,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function App() {
  // Profiles and active profile
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [activeProfile, setActiveProfile] = useState<Profile>(INITIAL_PROFILES[0]);

  // Main navigation tab
  const [activeTab, setActiveTab] = useState<'browse' | 'movies' | 'series' | 'mylist' | 'snippets' | 'offline'>('browse');

  // Mood filter
  const [currentMood, setCurrentMood] = useState<string>('All');

  // Theme & Accessibility
  const [theme, setTheme] = useState<'midnight' | 'obsidian' | 'warm'>(activeProfile.preferences.theme || 'midnight');
  const [highContrastMode, setHighContrastMode] = useState<boolean>(false);

  // Offline Travel Mode
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [downloadQuality, setDownloadQuality] = useState<DownloadQuality>('High');

  // Downloads collection
  const [downloads, setDownloads] = useState<DownloadedItem[]>([
    {
      id: 'd-1',
      mediaId: 'm1',
      title: 'Neon Odyssey 2099',
      type: 'movie',
      quality: 'High',
      sizeMb: 950,
      downloadedAt: '2026-11-01',
      progress: 100,
      status: 'completed',
      posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
    },
    {
      id: 'd-2',
      mediaId: 'm3',
      title: 'The Forest Whisperer',
      type: 'movie',
      quality: 'Standard',
      sizeMb: 420,
      downloadedAt: '2026-11-02',
      progress: 100,
      status: 'completed',
      posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    }
  ]);

  // Snippets vault collection
  const [snippets, setSnippets] = useState<WatchlistSnippet[]>(INITIAL_SNIPPETS);

  // Community reviews
  const [reviews, setReviews] = useState<UserReview[]>(INITIAL_REVIEWS);

  // Watch-to-Earn wallet state
  const [wallet, setWallet] = useState<UserWallet>({
    balanceUsd: 14.80,
    balanceCoins: 1480,
    totalEarnedUsd: 22.40,
    streakDays: 4,
    streakMultiplier: 1.5,
    todayWatchSeconds: 240,
    claimedMilestones: [],
    transactions: [
      {
        id: 'tx-1',
        type: 'earn',
        title: 'Streamed Neon Odyssey (45 mins)',
        amountUsd: 3.60,
        amountCoins: 360,
        timestamp: 'Yesterday',
        status: 'completed'
      },
      {
        id: 'tx-2',
        type: 'streak_bonus',
        title: '4-Day Binge Streak Reward',
        amountUsd: 2.50,
        amountCoins: 250,
        timestamp: 'Today',
        status: 'completed'
      }
    ]
  });
  const [sessionEarnedUsd, setSessionEarnedUsd] = useState(0);

  // Active Modals state
  const [selectedMediaForDetails, setSelectedMediaForDetails] = useState<MediaItem | null>(null);
  const [playingMedia, setPlayingMedia] = useState<{ media: MediaItem; episode?: Episode } | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [showParentalModal, setShowParentalModal] = useState(false);
  const [showAccessibilityModal, setShowAccessibilityModal] = useState(false);
  const [showWatchToEarnModal, setShowWatchToEarnModal] = useState(false);
  const [sharingMedia, setSharingMedia] = useState<MediaItem | null>(null);
  const [snippetCaptureMedia, setSnippetCaptureMedia] = useState<{
    media: MediaItem;
    timestamp: number;
    timestampStr: string;
  } | null>(null);

  // Watch Party State
  const [watchPartyRoom, setWatchPartyRoom] = useState<WatchPartyRoom | null>(null);

  // Bedtime alert notification check
  const isBedtimeActive = useMemo(() => {
    return isBedtimeRestricted(activeProfile.bedtimeHour, activeProfile.bedtimeMinute);
  }, [activeProfile.bedtimeHour, activeProfile.bedtimeMinute]);

  // Apply theme and accessibility classes to HTML root
  useEffect(() => {
    document.body.className = `theme-${theme} ${highContrastMode ? 'high-contrast' : ''} antialiased`;
  }, [theme, highContrastMode]);

  // Real-time watch-to-earn tick during active playback
  useEffect(() => {
    if (!playingMedia) return;
    const interval = setInterval(() => {
      setWallet(prev => {
        const nextSeconds = prev.todayWatchSeconds + 3;
        const addUsd = (3 / 60) * 0.08 * prev.streakMultiplier;
        const roundedAdd = Math.round(addUsd * 100) / 100;
        setSessionEarnedUsd(s => Math.round((s + roundedAdd) * 100) / 100);

        return {
          ...prev,
          todayWatchSeconds: nextSeconds,
          balanceUsd: Math.round((prev.balanceUsd + roundedAdd) * 100) / 100,
          balanceCoins: Math.round((prev.balanceCoins + Math.round(roundedAdd * 100))),
          totalEarnedUsd: Math.round((prev.totalEarnedUsd + roundedAdd) * 100) / 100
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [playingMedia]);

  // Catalog filtered by parental restrictions
  const permittedCatalog = useMemo(() => {
    return filterCatalogForProfile(MOCK_CATALOG, activeProfile);
  }, [activeProfile]);

  // Catalog items filtered if Travel Offline Mode is engaged
  const availableCatalog = useMemo(() => {
    if (isOfflineMode) {
      const downloadedIds = downloads.filter(d => d.status === 'completed').map(d => d.mediaId);
      return permittedCatalog.filter(item => downloadedIds.includes(item.id));
    }
    return permittedCatalog;
  }, [permittedCatalog, isOfflineMode, downloads]);

  // Re-rank items by selected mood
  const moodRankedCatalog = useMemo(() => {
    return filterAndRankByMood(availableCatalog, currentMood, activeProfile);
  }, [availableCatalog, currentMood, activeProfile]);

  // Featured Hero Item
  const featuredItem = useMemo(() => {
    return moodRankedCatalog.find(m => m.isFeatured) || moodRankedCatalog[0] || MOCK_CATALOG[0];
  }, [moodRankedCatalog]);

  const featuredMatchScore = useMemo(() => {
    return calculatePersonalizedMatchScore(featuredItem, activeProfile, activeProfile.watchHistory);
  }, [featuredItem, activeProfile]);

  // Continue Watching media items
  const continueWatchingItems = useMemo(() => {
    const historyIds = activeProfile.watchHistory.map(w => w.mediaId);
    return availableCatalog.filter(m => historyIds.includes(m.id));
  }, [availableCatalog, activeProfile.watchHistory]);

  // Handlers
  const handleToggleMyList = (mediaId: string) => {
    setActiveProfile(prev => {
      const exists = prev.myList.includes(mediaId);
      const updatedList = exists
        ? prev.myList.filter(id => id !== mediaId)
        : [...prev.myList, mediaId];
      return { ...prev, myList: updatedList };
    });
  };

  const handlePlayMedia = (media: MediaItem, episode?: Episode) => {
    setPlayingMedia({ media, episode });
    setSelectedMediaForDetails(null);
  };

  const handleSaveProgress = (currentTime: number, duration: number) => {
    if (!playingMedia) return;
    const progressPercent = Math.min(100, Math.round((currentTime / (duration || 100)) * 100));

    setActiveProfile(prev => {
      const existingIdx = prev.watchHistory.findIndex(w => w.mediaId === playingMedia.media.id);
      const entry: WatchProgress = {
        mediaId: playingMedia.media.id,
        episodeId: playingMedia.episode?.id,
        progressPercent,
        currentTimeSeconds: Math.round(currentTime),
        totalDurationSeconds: Math.round(duration),
        lastWatchedAt: new Date().toISOString()
      };

      const updatedHistory = existingIdx >= 0
        ? prev.watchHistory.map((w, idx) => (idx === existingIdx ? entry : w))
        : [entry, ...prev.watchHistory];

      return { ...prev, watchHistory: updatedHistory };
    });
  };

  const handleDownload = (media: MediaItem, episode?: Episode) => {
    const existing = downloads.find(d => d.mediaId === media.id && d.episodeId === episode?.id);
    if (existing) {
      setShowOfflineModal(true);
      return;
    }

    const sizeMb = QUALITY_ESTIMATE_MB[downloadQuality] || 850;
    const newItem: DownloadedItem = {
      id: `d-${Date.now()}`,
      mediaId: media.id,
      episodeId: episode?.id,
      title: media.title,
      subtitle: episode ? `S${episode.season}:E${episode.episodeNumber} ${episode.title}` : undefined,
      type: media.type,
      quality: downloadQuality,
      sizeMb,
      downloadedAt: new Date().toISOString().split('T')[0],
      progress: 100,
      status: 'completed',
      posterUrl: media.posterUrl,
      videoUrl: episode?.videoUrl || media.videoUrl
    };

    setDownloads(prev => [newItem, ...prev]);
    setShowOfflineModal(true);
  };

  const handleDeleteDownload = (id: string) => {
    setDownloads(prev => prev.filter(d => d.id !== id));
  };

  const handleTogglePauseDownload = (id: string) => {
    setDownloads(prev =>
      prev.map(d => {
        if (d.id === id) {
          const action = d.status === 'downloading' ? 'pause' : 'resume';
          return transitionDownloadState(d, action);
        }
        return d;
      })
    );
  };

  const handleSaveSnippet = (snippet: WatchlistSnippet) => {
    setSnippets(prev => [snippet, ...prev]);
  };

  const handleDeleteSnippet = (id: string) => {
    setSnippets(prev => prev.filter(s => s.id !== id));
  };

  const handleAddReview = (
    mediaId: string,
    rating: number,
    content: string,
    sceneTimestamp?: string,
    isSpoiler?: boolean
  ) => {
    const newRev: UserReview = {
      id: `rev-${Date.now()}`,
      mediaId,
      userName: activeProfile.name,
      userAvatar: activeProfile.avatar,
      rating,
      timestamp: 'Just now',
      content,
      sceneTimestamp,
      likes: 1,
      isSpoiler
    };
    setReviews(prev => [newRev, ...prev]);
  };

  // Watch Party Handlers
  const handleStartWatchParty = (media: MediaItem) => {
    const newRoom: WatchPartyRoom = {
      code: generatePartyRoomCode(),
      mediaId: media.id,
      mediaTitle: media.title,
      hostId: activeProfile.id,
      hostName: activeProfile.name,
      playbackState: {
        isPlaying: true,
        currentTimestamp: 0,
        lastSyncedAt: Date.now(),
        playbackSpeed: 1
      },
      attendees: [
        {
          id: activeProfile.id,
          name: activeProfile.name,
          avatar: activeProfile.avatar,
          isHost: true,
          currentTimestamp: 0,
          isSynced: true,
          status: 'watching',
          joinedAt: 'Just now'
        },
        {
          id: 'user-kai',
          name: 'Kai Vance (Friend)',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
          isHost: false,
          currentTimestamp: 0,
          isSynced: true,
          status: 'watching',
          joinedAt: '1m ago'
        }
      ],
      messages: [
        createPartySystemMessage(`${activeProfile.name} launched the Watch Party for ${media.title}!`),
        {
          id: 'msg-seed',
          senderId: 'user-kai',
          senderName: 'Kai Vance',
          senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
          text: 'Grab the popcorn! Ready for this movie!',
          timestamp: 'Just now',
          videoTimestamp: 0,
          isSpoiler: false
        }
      ],
      isLocked: false
    };

    setWatchPartyRoom(newRoom);
    setPlayingMedia({ media });
  };

  const handleSendPartyMessage = (text: string, isSpoiler: boolean, reaction?: string) => {
    if (!watchPartyRoom) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: activeProfile.id,
      senderName: activeProfile.name,
      senderAvatar: activeProfile.avatar,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      videoTimestamp: watchPartyRoom.playbackState.currentTimestamp,
      isSpoiler,
      reaction
    };

    setWatchPartyRoom(prev => prev ? { ...prev, messages: [...prev.messages, newMsg] } : null);
  };

  const handleSyncPartyToHost = () => {
    if (!watchPartyRoom) return;
    setWatchPartyRoom(prev => {
      if (!prev) return null;
      return {
        ...prev,
        attendees: prev.attendees.map(a => (a.id === activeProfile.id ? { ...a, isSynced: true } : a)),
        messages: [...prev.messages, createPartySystemMessage(`${activeProfile.name} synchronized with Host`)]
      };
    });
  };

  const handleHostSyncAllAttendees = () => {
    if (!watchPartyRoom) return;
    setWatchPartyRoom(prev => {
      if (!prev) return null;
      return {
        ...prev,
        attendees: prev.attendees.map(a => ({ ...a, isSynced: true })),
        messages: [...prev.messages, createPartySystemMessage(`Host synchronized all attendees to the director's cue`)]
      };
    });
  };

  const handleClaimMilestone = (milestoneId: string, amountUsd: number) => {
    setWallet(prev => ({
      ...prev,
      balanceUsd: Math.round((prev.balanceUsd + amountUsd) * 100) / 100,
      balanceCoins: prev.balanceCoins + Math.round(amountUsd * 100),
      totalEarnedUsd: Math.round((prev.totalEarnedUsd + amountUsd) * 100) / 100,
      claimedMilestones: [...prev.claimedMilestones, milestoneId],
      transactions: [
        {
          id: `tx-${Date.now()}`,
          type: 'earn',
          title: `Stream Milestone Reward Claimed`,
          amountUsd,
          amountCoins: Math.round(amountUsd * 100),
          timestamp: 'Just now',
          status: 'completed'
        },
        ...prev.transactions
      ]
    }));
  };

  const handleWithdrawWallet = (amountUsd: number, method: string, txId: string) => {
    setWallet(prev => ({
      ...prev,
      balanceUsd: Math.round((prev.balanceUsd - amountUsd) * 100) / 100,
      balanceCoins: Math.max(0, prev.balanceCoins - Math.round(amountUsd * 100)),
      transactions: [
        {
          id: txId,
          type: 'withdraw',
          title: `Cash Out via ${method.toUpperCase()}`,
          amountUsd,
          amountCoins: Math.round(amountUsd * 100),
          timestamp: 'Just now',
          status: 'completed'
        },
        ...prev.transactions
      ]
    }));
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Banner: Bedtime Curfew Warning if triggered for profile */}
      {isBedtimeActive && (
        <div className="bg-amber-600/90 text-black px-4 py-1.5 text-xs font-bold flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <Moon className="w-4 h-4 shrink-0" />
            <span>
              Bedtime Curfew Active for {activeProfile.name} (Curfew: {activeProfile.bedtimeHour}:
              {activeProfile.bedtimeMinute?.toString().padStart(2, '0')}). Late-night viewing warning.
            </span>
            <button
              onClick={() => setShowParentalModal(true)}
              className="ml-auto underline text-xs font-extrabold cursor-pointer"
            >
              Adjust Safety
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeProfile={activeProfile}
        profiles={profiles}
        onSelectProfile={setActiveProfile}
        onOpenSearch={() => setShowSearchModal(true)}
        onOpenAccessibility={() => setShowAccessibilityModal(true)}
        onOpenParentalControls={() => setShowParentalModal(true)}
        onOpenOfflineManager={() => setShowOfflineModal(true)}
        isOfflineMode={isOfflineMode}
        onToggleOfflineMode={() => setIsOfflineMode(!isOfflineMode)}
        theme={theme}
        onChangeTheme={setTheme}
        savedSnippetsCount={snippets.length}
        offlineCount={downloads.length}
      />

      {/* Watch-to-Earn Floating Sticky Ticker Bar */}
      <div className="w-full bg-gradient-to-r from-amber-950/80 via-black to-neutral-950 border-b border-amber-500/20 px-4 sm:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-semibold text-white">
              Watch-to-Earn Rewards:
            </span>
            <span className="text-amber-300 font-mono">
              Earn $0.08 / min active stream • {wallet.streakDays}-Day Streak ({wallet.streakMultiplier}x Boost)
            </span>
          </div>

          <button
            onClick={() => setShowWatchToEarnModal(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 hover:bg-amber-400 text-black font-extrabold shadow-md shadow-amber-500/30 transition-all cursor-pointer"
          >
            <Coins className="w-3.5 h-3.5 fill-black" />
            <span>Balance: ${wallet.balanceUsd.toFixed(2)}</span>
            <span className="text-[10px] opacity-75">Cash Out →</span>
          </button>
        </div>
      </div>

      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col pb-16">
        {/* VIEW 1: Browse / Home */}
        {activeTab === 'browse' && (
          <>
            {/* Dynamic Mood Quiz Engine Bar */}
            <MoodQuizBar
              currentMood={currentMood}
              onSelectMood={setCurrentMood}
              activeProfileName={activeProfile.name}
            />

            {/* Cinematic Hero Featured Item */}
            {availableCatalog.length > 0 && (
              <HeroBanner
                item={featuredItem}
                matchScore={featuredMatchScore}
                isInMyList={activeProfile.myList.includes(featuredItem.id)}
                onToggleMyList={handleToggleMyList}
                onPlay={handlePlayMedia}
                onOpenDetails={setSelectedMediaForDetails}
                onDownload={handleDownload}
                onCaptureSnippet={m =>
                  setSnippetCaptureMedia({ media: m, timestamp: 45, timestampStr: '00:45:10' })
                }
                onShare={setSharingMedia}
                activeProfileName={activeProfile.name}
              />
            )}

            {/* Continue Watching Row (if user has active history) */}
            {continueWatchingItems.length > 0 && (
              <MediaCarousel
                title={`Continue Watching for ${activeProfile.name}`}
                subtitle="Resume where you paused"
                items={continueWatchingItems}
                watchHistory={activeProfile.watchHistory}
                myList={activeProfile.myList}
                onToggleMyList={handleToggleMyList}
                onPlay={handlePlayMedia}
                onOpenDetails={setSelectedMediaForDetails}
                onDownload={handleDownload}
                onCaptureSnippet={m =>
                  setSnippetCaptureMedia({ media: m, timestamp: 60, timestampStr: '01:00:22' })
                }
                activeProfileName={activeProfile.name}
                cardVariant="backdrop"
              />
            )}

            {/* Personalized Recommendations Row */}
            <MediaCarousel
              title="Personalized Recommendations"
              subtitle={`${calculatePersonalizedMatchScore(moodRankedCatalog[0] || featuredItem, activeProfile)}% Affinity Match`}
              items={moodRankedCatalog}
              watchHistory={activeProfile.watchHistory}
              myList={activeProfile.myList}
              onToggleMyList={handleToggleMyList}
              onPlay={handlePlayMedia}
              onOpenDetails={setSelectedMediaForDetails}
              onDownload={handleDownload}
              onCaptureSnippet={m =>
                setSnippetCaptureMedia({ media: m, timestamp: 20, timestampStr: '00:20:15' })
              }
              activeProfileName={activeProfile.name}
              cardVariant="poster"
            />

            {/* Trending & Originals Row */}
            <MediaCarousel
              title="Top Trending & Lumière Originals"
              subtitle="4K UHD • Spatial Audio"
              items={availableCatalog.filter(m => m.isTrending || m.isOriginal)}
              watchHistory={activeProfile.watchHistory}
              myList={activeProfile.myList}
              onToggleMyList={handleToggleMyList}
              onPlay={handlePlayMedia}
              onOpenDetails={setSelectedMediaForDetails}
              onDownload={handleDownload}
              onCaptureSnippet={m =>
                setSnippetCaptureMedia({ media: m, timestamp: 35, timestampStr: '00:35:10' })
              }
              activeProfileName={activeProfile.name}
              cardVariant="backdrop"
            />

            {/* International Cinema Row (Multilingual) */}
            <MediaCarousel
              title="Critically Acclaimed World Cinema"
              subtitle="Japanese, French, Korean, Spanish, Italian & German"
              items={availableCatalog.filter(m => m.language !== 'English')}
              watchHistory={activeProfile.watchHistory}
              myList={activeProfile.myList}
              onToggleMyList={handleToggleMyList}
              onPlay={handlePlayMedia}
              onOpenDetails={setSelectedMediaForDetails}
              onDownload={handleDownload}
              onCaptureSnippet={m =>
                setSnippetCaptureMedia({ media: m, timestamp: 40, timestampStr: '00:40:00' })
              }
              activeProfileName={activeProfile.name}
              cardVariant="poster"
            />

            {/* Timeless Classics & Vintage Era (1980s – 2014) */}
            <MediaCarousel
              title="Timeless Classics & Vintage Cinema"
              subtitle="1980s, 90s, and 2000s Milestones"
              items={availableCatalog.filter(m => m.year < 2020)}
              watchHistory={activeProfile.watchHistory}
              myList={activeProfile.myList}
              onToggleMyList={handleToggleMyList}
              onPlay={handlePlayMedia}
              onOpenDetails={setSelectedMediaForDetails}
              onDownload={handleDownload}
              onCaptureSnippet={m =>
                setSnippetCaptureMedia({ media: m, timestamp: 25, timestampStr: '00:25:30' })
              }
              activeProfileName={activeProfile.name}
              cardVariant="backdrop"
            />
          </>
        )}

        {/* VIEW 2: Movies */}
        {activeTab === 'movies' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">
            <h2 className="text-2xl sm:text-3xl font-black font-['Cinzel'] tracking-tight text-white mb-2">
              Feature Films Collection
            </h2>
            <p className="text-xs text-neutral-400 mb-6">
              Curated full-length cinema with high dynamic range and pristine surround sound
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {availableCatalog.filter(m => m.type === 'movie').map(item => (
                <div
                  key={item.id}
                  onClick={() => setSelectedMediaForDetails(item)}
                  className="group rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 transition-all cursor-pointer"
                >
                  <img src={item.posterUrl} alt={item.title} className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform" />
                  <div className="p-3">
                    <div className="text-xs font-bold text-white truncate">{item.title}</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">{item.year} • {item.genres[0]} • {item.language}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: TV Series */}
        {activeTab === 'series' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">
            <h2 className="text-2xl sm:text-3xl font-black font-['Cinzel'] tracking-tight text-white mb-2">
              Original TV Series &amp; Sagas
            </h2>
            <p className="text-xs text-neutral-400 mb-6">
              Episodic stories and multi-season epics ready for uninterrupted binge watching
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {availableCatalog.filter(m => m.type === 'series').map(item => (
                <div
                  key={item.id}
                  onClick={() => setSelectedMediaForDetails(item)}
                  className="group rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 transition-all cursor-pointer"
                >
                  <img src={item.posterUrl} alt={item.title} className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform" />
                  <div className="p-3">
                    <div className="text-xs font-bold text-white truncate">{item.title}</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">{item.seasonsCount} Seasons • {item.language}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: My List */}
        {activeTab === 'mylist' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full">
            <h2 className="text-2xl sm:text-3xl font-black font-['Cinzel'] tracking-tight text-white mb-2">
              {activeProfile.name}'s Watchlist
            </h2>
            <p className="text-xs text-neutral-400 mb-6">
              Saved titles synced across all your connected devices
            </p>
            {activeProfile.myList.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-dashed border-neutral-800 text-neutral-400 text-xs">
                Your watchlist is empty. Click "+ Add to List" on any title to save it here.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {availableCatalog.filter(m => activeProfile.myList.includes(m.id)).map(item => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedMediaForDetails(item)}
                    className="group rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 transition-all cursor-pointer"
                  >
                    <img src={item.posterUrl} alt={item.title} className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform" />
                    <div className="p-3">
                      <div className="text-xs font-bold text-white truncate">{item.title}</div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">{item.year} • {item.genres[0]}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: Snippets Vault */}
        {activeTab === 'snippets' && (
          <SnippetsVault
            snippets={snippets}
            catalog={MOCK_CATALOG}
            onPlayMedia={handlePlayMedia}
            onDeleteSnippet={handleDeleteSnippet}
            onOpenCreateSnippet={() =>
              setSnippetCaptureMedia({ media: featuredItem, timestamp: 30, timestampStr: '00:30:15' })
            }
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 py-8 px-4 sm:px-8 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-['Cinzel'] font-bold text-white tracking-widest text-sm">LUMIÈRE</span>
            <span>• Next-Gen Cinema Streaming &amp; Travel Offline Platform</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-400">
            <span>High Dynamic Range (4K)</span>
            <span>Dolby Atmos</span>
            <span>Audio Description (AD)</span>
            <span>Watch Party Synced</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Fullscreen / Cinema Video Player Modal */}
      {playingMedia && (
        <VideoPlayerModal
          media={playingMedia.media}
          episode={playingMedia.episode}
          activeProfile={activeProfile}
          onClose={() => setPlayingMedia(null)}
          onSaveProgress={handleSaveProgress}
          onOpenSnippetCapture={(media, timestamp, str) =>
            setSnippetCaptureMedia({ media, timestamp, timestampStr: str })
          }
          watchPartyRoom={watchPartyRoom}
          onSendMessageToParty={handleSendPartyMessage}
          onSyncPartyToHost={handleSyncPartyToHost}
          onHostSyncAllAttendees={handleHostSyncAllAttendees}
          onLeaveWatchParty={() => setWatchPartyRoom(null)}
          onStartWatchParty={handleStartWatchParty}
        />
      )}

      {/* 2. Media Overview & Social Discussion Modal */}
      {selectedMediaForDetails && (
        <MediaDetailModal
          media={selectedMediaForDetails}
          catalog={availableCatalog}
          isInMyList={activeProfile.myList.includes(selectedMediaForDetails.id)}
          onToggleMyList={handleToggleMyList}
          onPlay={handlePlayMedia}
          onDownload={handleDownload}
          onCaptureSnippet={m =>
            setSnippetCaptureMedia({ media: m, timestamp: 45, timestampStr: '00:45:00' })
          }
          onStartWatchParty={handleStartWatchParty}
          onClose={() => setSelectedMediaForDetails(null)}
          reviews={reviews}
          onAddReview={handleAddReview}
          activeProfile={activeProfile}
          onSelectMedia={setSelectedMediaForDetails}
        />
      )}

      {/* 3. Search & Advanced Filtering Overlay */}
      {showSearchModal && (
        <SearchOverlay
          catalog={permittedCatalog}
          onClose={() => setShowSearchModal(false)}
          onPlay={handlePlayMedia}
          onOpenDetails={setSelectedMediaForDetails}
          myList={activeProfile.myList}
          onToggleMyList={handleToggleMyList}
        />
      )}

      {/* 4. Travel & Offline Download Manager Modal */}
      {showOfflineModal && (
        <OfflineManagerModal
          downloads={downloads}
          isOfflineMode={isOfflineMode}
          onToggleOfflineMode={() => setIsOfflineMode(!isOfflineMode)}
          onPlayDownloadedItem={item => {
            const media = MOCK_CATALOG.find(m => m.id === item.mediaId);
            if (media) handlePlayMedia(media);
          }}
          onDeleteDownload={handleDeleteDownload}
          onTogglePauseDownload={handleTogglePauseDownload}
          onClose={() => setShowOfflineModal(false)}
          currentDownloadQuality={downloadQuality}
          onChangeDownloadQuality={setDownloadQuality}
        />
      )}

      {/* 5. Parental Controls & Safety Settings Modal */}
      {showParentalModal && (
        <ParentalControlsModal
          activeProfile={activeProfile}
          profiles={profiles}
          onUpdateProfile={updated => {
            setProfiles(prev => prev.map(p => (p.id === updated.id ? updated : p)));
            if (updated.id === activeProfile.id) setActiveProfile(updated);
          }}
          onClose={() => setShowParentalModal(false)}
        />
      )}

      {/* 6. Accessibility & Assistive Features Modal */}
      {showAccessibilityModal && (
        <AccessibilityModal
          activeProfile={activeProfile}
          onUpdatePreferences={prefs => {
            setActiveProfile(prev => ({
              ...prev,
              preferences: { ...prev.preferences, ...prefs }
            }));
          }}
          onClose={() => setShowAccessibilityModal(false)}
          highContrastMode={highContrastMode}
          onToggleHighContrast={() => setHighContrastMode(!highContrastMode)}
        />
      )}

      {/* 7. Snippet Frame & Quote Creator Modal */}
      {snippetCaptureMedia && (
        <SnippetCaptureModal
          media={snippetCaptureMedia.media}
          timestamp={snippetCaptureMedia.timestamp}
          timestampStr={snippetCaptureMedia.timestampStr}
          authorName={activeProfile.name}
          onSaveSnippet={handleSaveSnippet}
          onClose={() => setSnippetCaptureMedia(null)}
        />
      )}

      {/* 8. Social Share Dialog */}
      {sharingMedia && (
        <SocialShareModal
          media={sharingMedia}
          onStartWatchParty={handleStartWatchParty}
          onClose={() => setSharingMedia(null)}
        />
      )}

      {/* 9. Watch-to-Earn Rewards Vault Modal */}
      {showWatchToEarnModal && (
        <WatchToEarnModal
          wallet={wallet}
          onClaimMilestone={handleClaimMilestone}
          onWithdraw={handleWithdrawWallet}
          onClose={() => setShowWatchToEarnModal(false)}
          sessionEarnedUsd={sessionEarnedUsd}
        />
      )}
    </div>
  );
}
