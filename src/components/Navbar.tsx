import React, { useState } from 'react';
import {
  Film,
  Search,
  Wifi,
  WifiOff,
  Sliders,
  Shield,
  Eye,
  Palette,
  ChevronDown,
  User,
  Lock,
  DownloadCloud,
  Bookmark
} from 'lucide-react';
import { Profile } from '../types/media';

interface NavbarProps {
  activeTab: 'browse' | 'movies' | 'series' | 'mylist' | 'snippets' | 'offline';
  setActiveTab: (tab: 'browse' | 'movies' | 'series' | 'mylist' | 'snippets' | 'offline') => void;
  activeProfile: Profile;
  profiles: Profile[];
  onSelectProfile: (profile: Profile) => void;
  onOpenSearch: () => void;
  onOpenAccessibility: () => void;
  onOpenParentalControls: () => void;
  onOpenOfflineManager: () => void;
  isOfflineMode: boolean;
  onToggleOfflineMode: () => void;
  theme: 'midnight' | 'obsidian' | 'warm';
  onChangeTheme: (theme: 'midnight' | 'obsidian' | 'warm') => void;
  savedSnippetsCount: number;
  offlineCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeProfile,
  profiles,
  onSelectProfile,
  onOpenSearch,
  onOpenAccessibility,
  onOpenParentalControls,
  onOpenOfflineManager,
  isOfflineMode,
  onToggleOfflineMode,
  theme,
  onChangeTheme,
  savedSnippetsCount,
  offlineCount
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-black/90 backdrop-blur-xl border-b border-neutral-800/80 transition-colors">
      {/* Offline travel banner notification when offline mode is engaged */}
      {isOfflineMode && (
        <div className="bg-amber-500 text-black px-4 py-1.5 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>
              Travel &amp; Offline Mode Active — Showing {offlineCount} saved movies and series ready for zero-internet playback.
            </span>
            <button
              onClick={onToggleOfflineMode}
              className="ml-auto underline text-xs font-bold hover:opacity-80 cursor-pointer"
            >
              Go Online
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Main Nav */}
        <div className="flex items-center gap-8">
          <button
            onClick={() => setActiveTab('browse')}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            aria-label="Lumière Cinema Home"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-black" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold tracking-wider text-lg leading-none text-white font-['Cinzel']">
                LUMIÈRE
              </span>
              <span className="text-[10px] tracking-widest text-amber-400 uppercase font-semibold">
                Cinema &amp; Stream
              </span>
            </div>
          </button>

          {/* Primary Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'browse'
                  ? 'text-white bg-neutral-800'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              Browse
            </button>
            <button
              onClick={() => setActiveTab('movies')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'movies'
                  ? 'text-white bg-neutral-800'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => setActiveTab('series')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'series'
                  ? 'text-white bg-neutral-800'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              Series
            </button>
            <button
              onClick={() => setActiveTab('mylist')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                activeTab === 'mylist'
                  ? 'text-white bg-neutral-800'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              My List
            </button>
            <button
              onClick={() => setActiveTab('snippets')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'snippets'
                  ? 'text-white bg-neutral-800'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>Snippets ({savedSnippetsCount})</span>
            </button>
          </nav>
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Offline Mode Toggle Button */}
          <button
            onClick={onToggleOfflineMode}
            title={isOfflineMode ? "Switch to Online Mode" : "Switch to Travel & Offline Mode"}
            aria-label="Toggle Travel Offline Mode"
            className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isOfflineMode
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'bg-neutral-900 border border-neutral-700/60 text-neutral-300 hover:text-white hover:border-neutral-500'
            }`}
          >
            {isOfflineMode ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
            <span className="hidden lg:inline">{isOfflineMode ? 'Travel Mode (Offline)' : 'Online'}</span>
          </button>

          {/* Offline Downloads Manager Button */}
          <button
            onClick={onOpenOfflineManager}
            title="Offline Downloads & Storage"
            aria-label="Open Downloads and Storage Manager"
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-700/60 text-neutral-300 hover:text-white hover:border-neutral-500 relative cursor-pointer"
          >
            <DownloadCloud className="w-4 h-4" />
            {offlineCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-[10px] font-bold text-black flex items-center justify-center">
                {offlineCount}
              </span>
            )}
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            title="Search Movies & Series"
            aria-label="Search Catalog"
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-700/60 text-neutral-300 hover:text-white hover:border-neutral-500 flex items-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span className="hidden xl:inline text-xs text-neutral-400">Search by genre, cast, year...</span>
          </button>

          {/* Accessibility Settings */}
          <button
            onClick={onOpenAccessibility}
            title="Accessibility: Captions, Audio Description, Contrast"
            aria-label="Open Accessibility Options"
            className="p-2 rounded-lg bg-neutral-900 border border-neutral-700/60 text-neutral-300 hover:text-white hover:border-neutral-500 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Dark Mode Theme Chooser */}
          <div className="relative">
            <button
              onClick={() => setShowThemeMenu(!showThemeMenu)}
              title="Theme: Midnight, Obsidian, Warm Sepia"
              aria-label="Change Display Theme"
              className="p-2 rounded-lg bg-neutral-900 border border-neutral-700/60 text-neutral-300 hover:text-white hover:border-neutral-500 cursor-pointer"
            >
              <Palette className="w-4 h-4 text-amber-400" />
            </button>
            {showThemeMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-neutral-900 border border-neutral-700 shadow-2xl p-2 z-50">
                <div className="text-xs font-semibold text-neutral-400 px-2 py-1 mb-1">
                  Dark Mode Aesthetics
                </div>
                <button
                  onClick={() => { onChangeTheme('midnight'); setShowThemeMenu(false); }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between cursor-pointer ${
                    theme === 'midnight' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>Midnight Cinema</span>
                  <span className="w-3 h-3 rounded-full bg-[#030407] border border-neutral-600" />
                </button>
                <button
                  onClick={() => { onChangeTheme('obsidian'); setShowThemeMenu(false); }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between cursor-pointer ${
                    theme === 'obsidian' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>Deep Obsidian (OLED)</span>
                  <span className="w-3 h-3 rounded-full bg-black border border-neutral-600" />
                </button>
                <button
                  onClick={() => { onChangeTheme('warm'); setShowThemeMenu(false); }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg flex items-center justify-between cursor-pointer ${
                    theme === 'warm' ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>Warm Sepia / Night Shift</span>
                  <span className="w-3 h-3 rounded-full bg-[#0c0908] border border-amber-800" />
                </button>
              </div>
            )}
          </div>

          {/* Parental Controls Shield Button */}
          <button
            onClick={onOpenParentalControls}
            title={`Parental Controls (Max Rating: ${activeProfile.maxRating})`}
            aria-label="Parental Controls and Safety"
            className={`p-2 rounded-lg border flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
              activeProfile.isKids
                ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300'
                : 'bg-neutral-900 border-neutral-700/60 text-neutral-300 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-[11px] font-mono">{activeProfile.maxRating}</span>
          </button>

          {/* Active Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              aria-label={`Profile Menu for ${activeProfile.name}`}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-neutral-800/80 transition-colors cursor-pointer"
            >
              <img
                src={activeProfile.avatar}
                alt={activeProfile.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-amber-500/50"
              />
              <span className="hidden sm:inline text-xs font-semibold text-neutral-200 max-w-[80px] truncate">
                {activeProfile.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-neutral-900 border border-neutral-700 shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-neutral-800">
                  <div className="text-xs text-neutral-400">Signed in as</div>
                  <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                    <span>{activeProfile.name}</span>
                    {activeProfile.isKids && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                        KIDS
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                    Max: {activeProfile.maxRating} • {activeProfile.preferences.mood}
                  </div>
                </div>

                <div className="py-2">
                  <div className="text-[11px] font-semibold text-neutral-400 px-3 py-1 uppercase tracking-wider">
                    Switch Family Member
                  </div>
                  {profiles.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        onSelectProfile(p);
                        setShowProfileMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded-lg flex items-center justify-between cursor-pointer ${
                        p.id === activeProfile.id
                          ? 'bg-neutral-800 text-amber-400 font-semibold'
                          : 'text-neutral-300 hover:bg-neutral-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={p.avatar} alt={p.name} className="w-6 h-6 rounded-full object-cover" />
                        <span>{p.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                        {p.pinProtected && <Lock className="w-3 h-3 text-amber-400" />}
                        <span>{p.maxRating}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="pt-2 border-t border-neutral-800">
                  <button
                    onClick={() => {
                      onOpenParentalControls();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-neutral-300 hover:bg-neutral-800 rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Parental Controls &amp; PIN</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
