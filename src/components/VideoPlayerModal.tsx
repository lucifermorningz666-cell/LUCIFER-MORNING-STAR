import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Settings,
  Subtitles,
  Camera,
  Users,
  X,
  FastForward,
  SkipForward,
  Check,
  Headphones,
  Sliders
} from 'lucide-react';
import { Episode, MediaItem, Profile, StreamQuality } from '../types/media';
import { WatchPartyPanel } from './WatchPartyPanel';
import { WatchPartyRoom, formatVideoTime } from '../utils/watchPartyLogic';

interface VideoPlayerModalProps {
  media: MediaItem;
  episode?: Episode;
  activeProfile: Profile;
  onClose: () => void;
  onSaveProgress: (currentTime: number, duration: number) => void;
  onOpenSnippetCapture: (media: MediaItem, timestamp: number, currentTimeStr: string) => void;
  watchPartyRoom: WatchPartyRoom | null;
  onSendMessageToParty: (text: string, isSpoiler: boolean, reaction?: string) => void;
  onSyncPartyToHost: () => void;
  onHostSyncAllAttendees: () => void;
  onLeaveWatchParty: () => void;
  onStartWatchParty: (media: MediaItem) => void;
}

const RESOLUTIONS: { label: StreamQuality; resolution: string; bitrate: string }[] = [
  { label: '4K UHD', resolution: '3840x2160', bitrate: '18.4 Mbps' },
  { label: '1080p', resolution: '1920x1080', bitrate: '6.8 Mbps' },
  { label: '720p', resolution: '1280x720', bitrate: '3.2 Mbps' },
  { label: '480p', resolution: '854x480', bitrate: '1.4 Mbps' },
];

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  media,
  episode,
  activeProfile,
  onClose,
  onSaveProgress,
  onOpenSnippetCapture,
  watchPartyRoom,
  onSendMessageToParty,
  onSyncPartyToHost,
  onHostSyncAllAttendees,
  onLeaveWatchParty,
  onStartWatchParty
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(120);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(activeProfile.preferences.playbackSpeed || 1);
  const [selectedQuality, setSelectedQuality] = useState<StreamQuality>('4K UHD');
  const [selectedAudio, setSelectedAudio] = useState(media.audioTracks[0]?.id || 'a1');
  const [selectedSubtitle, setSelectedSubtitle] = useState<string>(activeProfile.preferences.subtitlesDefault ? media.subtitles[0]?.id || 'off' : 'off');
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showPartyDrawer, setShowPartyDrawer] = useState(!!watchPartyRoom);
  const [audioDescriptionActive, setAudioDescriptionActive] = useState(activeProfile.preferences.audioDescriptionDefault || false);
  const [activeAdCue, setActiveAdCue] = useState<string>('');

  // Subtitle styling from preferences
  const subtitleSizeClass = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl',
    xlarge: 'text-3xl'
  }[activeProfile.preferences.subtitleSize || 'medium'];

  const subtitleColorClass = {
    white: 'text-white',
    yellow: 'text-yellow-300',
    cyan: 'text-cyan-300'
  }[activeProfile.preferences.subtitleContrast || 'yellow'];

  const videoSource = episode?.videoUrl || media.videoUrl;
  const currentTitle = episode ? `${media.title} — S${episode.season}:E${episode.episodeNumber} "${episode.title}"` : media.title;

  // Controls auto-hide timer
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3500);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  const skipTime = (delta: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + delta));
  };

  const seek = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = seconds;
    setCurrentTime(seconds);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyM') {
        toggleMute();
      } else if (e.code === 'KeyF') {
        toggleFullscreen();
      } else if (e.code === 'KeyC') {
        setSelectedSubtitle(prev => (prev === 'off' ? media.subtitles[0]?.id || 's1' : 'off'));
      } else if (e.code === 'ArrowLeft') {
        skipTime(-10);
      } else if (e.code === 'ArrowRight') {
        skipTime(10);
      } else if (e.code === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isMuted, duration]);

  // Update progress
  const onTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime;
      setCurrentTime(cur);

      // Audio Description narration cues based on timestamp
      if (audioDescriptionActive) {
        if (cur > 5 && cur < 15) {
          setActiveAdCue(`[AD] Camera glides through neon rain, capturing towering holographic monoliths.`);
        } else if (cur > 25 && cur < 35) {
          setActiveAdCue(`[AD] The protagonist pauses, gazing up at the amber orbital sky.`);
        } else {
          setActiveAdCue('');
        }
      } else {
        setActiveAdCue('');
      }
    }
  };

  const onLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 120);
      videoRef.current.playbackRate = playbackSpeed;
    }
  };

  const handleCaptureSnippet = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    onOpenSnippetCapture(media, currentTime, formatVideoTime(currentTime));
  };

  // Save progress on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        onSaveProgress(videoRef.current.currentTime, videoRef.current.duration || 100);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={() => setShowControls(true)}
      className="fixed inset-0 z-50 bg-black flex flex-col md:flex-row overflow-hidden select-none"
    >
      {/* Video Surface Area */}
      <div className="relative flex-1 h-full bg-black flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          src={videoSource}
          className="w-full h-full object-contain pointer-events-auto"
          autoPlay
          playsInline
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onClick={togglePlay}
        />

        {/* Accessibility: Audio Description Narration Box */}
        {audioDescriptionActive && activeAdCue && (
          <div className="absolute top-16 left-6 max-w-md p-3 rounded-lg bg-black/85 border border-cyan-500/60 text-cyan-200 text-xs sm:text-sm font-medium backdrop-blur-md shadow-xl flex items-start gap-2 animate-fadeIn z-30 pointer-events-auto">
            <Headphones className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>{activeAdCue}</span>
          </div>
        )}

        {/* Subtitles Overlay */}
        {selectedSubtitle !== 'off' && (
          <div className="absolute bottom-20 left-4 right-4 text-center pointer-events-none z-20">
            <span
              className={`inline-block px-3 py-1.5 rounded bg-black/80 ${subtitleSizeClass} ${subtitleColorClass} font-semibold shadow-2xl subtitles-preview max-w-3xl leading-relaxed`}
            >
              {currentTime < 12
                ? `[${media.language}] "${media.tagline}"`
                : `[${currentTitle}] In time, memory returns to the stars.`}
            </span>
          </div>
        )}

        {/* Top Controls Overlay */}
        <div
          className={`absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between transition-opacity duration-300 z-40 pointer-events-auto ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              aria-label="Exit Cinema Player"
              className="p-2 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide">
                {currentTitle}
              </h2>
              <div className="text-[11px] text-neutral-400 flex items-center gap-2">
                <span className="font-mono text-amber-400 font-bold">{selectedQuality}</span>
                <span>•</span>
                <span>{RESOLUTIONS.find(r => r.label === selectedQuality)?.bitrate}</span>
                <span>•</span>
                <span className="border border-neutral-700 px-1 rounded text-[10px]">{media.rating}</span>
                {audioDescriptionActive && (
                  <span className="bg-cyan-500/20 text-cyan-300 px-1 rounded text-[10px] font-bold">
                    AD ON
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Snippet Frame Capture */}
            <button
              onClick={handleCaptureSnippet}
              title="Capture photo & quote snippet card"
              aria-label="Capture scene snippet"
              className="px-3 py-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 text-amber-300 hover:text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Capture Snippet</span>
            </button>

            {/* Watch Party Toggle Button */}
            <button
              onClick={() => {
                if (!watchPartyRoom) {
                  onStartWatchParty(media);
                }
                setShowPartyDrawer(!showPartyDrawer);
              }}
              title="Interactive Watch Party with friends"
              aria-label="Toggle Watch Party live chat"
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                watchPartyRoom
                  ? 'bg-amber-500 text-black border-amber-400 font-bold'
                  : 'bg-neutral-900/80 hover:bg-neutral-800 border-neutral-700 text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{watchPartyRoom ? `Party (${watchPartyRoom.attendees.length})` : 'Start Watch Party'}</span>
            </button>
          </div>
        </div>

        {/* Bottom Cinema Controls Overlay */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent transition-opacity duration-300 z-40 pointer-events-auto ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Progress Timeline Scrubber */}
          <div className="relative mb-3 flex items-center group/scrubber cursor-pointer">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              aria-label="Seek video playback time"
              className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div className="flex items-center justify-between">
            {/* Left Controls: Play/Pause, Skip, Time, Volume */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
                className="w-9 h-9 rounded-full bg-white text-black hover:bg-amber-400 flex items-center justify-center transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-black" /> : <Play className="w-4 h-4 fill-black ml-0.5" />}
              </button>

              <button
                onClick={() => skipTime(-10)}
                aria-label="Skip back 10 seconds"
                className="p-1.5 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => skipTime(10)}
                aria-label="Skip forward 10 seconds"
                className="p-1.5 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 group/volume">
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  className="p-1.5 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  aria-label="Adjust audio volume"
                  className="w-16 sm:w-20 h-1 bg-neutral-700 rounded appearance-none cursor-pointer accent-amber-500"
                />
              </div>

              {/* Timestamp Display */}
              <div className="text-xs font-mono text-neutral-300">
                <span>{formatVideoTime(currentTime)}</span>
                <span className="text-neutral-500 mx-1">/</span>
                <span className="text-neutral-400">{formatVideoTime(duration)}</span>
              </div>
            </div>

            {/* Right Controls: Audio Tracks, Subtitles, Quality, Speed, Fullscreen */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Audio Description toggle badge */}
              <button
                onClick={() => setAudioDescriptionActive(!audioDescriptionActive)}
                title="Toggle Audio Description for visually impaired users"
                aria-pressed={audioDescriptionActive}
                className={`px-2 py-1 rounded text-[11px] font-bold border transition-colors cursor-pointer ${
                  audioDescriptionActive
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                    : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white'
                }`}
              >
                AD
              </button>

              {/* Subtitles Menu Button */}
              <button
                onClick={() => setSelectedSubtitle(selectedSubtitle === 'off' ? media.subtitles[0]?.id || 's1' : 'off')}
                title={selectedSubtitle !== 'off' ? 'Subtitles On' : 'Subtitles Off'}
                aria-label="Toggle Subtitles"
                className={`p-1.5 rounded transition-colors cursor-pointer ${
                  selectedSubtitle !== 'off' ? 'text-amber-400' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Subtitles className="w-4 h-4" />
              </button>

              {/* Playback Settings Modal / Popover Button */}
              <div className="relative">
                <button
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                  aria-label="Playback Quality and Audio Settings"
                  className="p-1.5 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4" />
                </button>

                {showSettingsMenu && (
                  <div className="absolute bottom-12 right-0 w-64 rounded-xl bg-neutral-900 border border-neutral-700 shadow-2xl p-3 z-50 text-xs">
                    <div className="font-bold text-white mb-2 flex items-center justify-between pb-1.5 border-b border-neutral-800">
                      <span>Streaming Settings</span>
                      <button
                        onClick={() => setShowSettingsMenu(false)}
                        className="text-neutral-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Resolution Switcher */}
                    <div className="mb-2.5">
                      <div className="text-[11px] font-semibold text-neutral-400 mb-1">
                        Quality / Resolution:
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {RESOLUTIONS.map(res => (
                          <button
                            key={res.label}
                            onClick={() => setSelectedQuality(res.label)}
                            className={`p-1.5 rounded text-left transition-colors cursor-pointer ${
                              selectedQuality === res.label
                                ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                                : 'bg-neutral-800/60 text-neutral-300 hover:bg-neutral-800'
                            }`}
                          >
                            <div>{res.label}</div>
                            <div className="text-[10px] text-neutral-400">{res.bitrate}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Speed Switcher */}
                    <div className="mb-2.5">
                      <div className="text-[11px] font-semibold text-neutral-400 mb-1">Playback Speed:</div>
                      <div className="flex gap-1">
                        {[0.75, 1, 1.25, 1.5, 2].map(speed => (
                          <button
                            key={speed}
                            onClick={() => {
                              setPlaybackSpeed(speed);
                              if (videoRef.current) videoRef.current.playbackRate = speed;
                            }}
                            className={`flex-1 py-1 rounded text-center transition-colors cursor-pointer ${
                              playbackSpeed === speed
                                ? 'bg-amber-500 text-black font-bold'
                                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                            }`}
                          >
                            {speed}x
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Audio Track Selector */}
                    <div>
                      <div className="text-[11px] font-semibold text-neutral-400 mb-1">Audio Track:</div>
                      <select
                        value={selectedAudio}
                        onChange={(e) => setSelectedAudio(e.target.value)}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-neutral-200"
                      >
                        {media.audioTracks.map(track => (
                          <option key={track.id} value={track.id}>
                            {track.label} ({track.format})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                className="p-1.5 text-neutral-300 hover:text-white transition-colors cursor-pointer"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Interactive Watch Party Drawer */}
      {showPartyDrawer && (
        <WatchPartyPanel
          room={watchPartyRoom}
          activeProfile={activeProfile}
          currentVideoTime={currentTime}
          onSendMessage={onSendMessageToParty}
          onSyncToHost={onSyncPartyToHost}
          onHostSyncAll={onHostSyncAllAttendees}
          onLeaveParty={onLeaveWatchParty}
          onClosePanel={() => setShowPartyDrawer(false)}
          onSeekToTimestamp={seek}
        />
      )}
    </div>
  );
};
