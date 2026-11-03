import React, { useState } from 'react';
import {
  Play,
  Plus,
  Check,
  Download,
  Camera,
  Share2,
  Users,
  X,
  Star,
  MessageSquare,
  ThumbsUp,
  Eye,
  EyeOff,
  Send,
  Calendar,
  Clock,
  Award,
  Globe
} from 'lucide-react';
import { Episode, MediaItem, Profile, UserReview } from '../types/media';
import { getRecommendationsBasedOnItem } from '../utils/recommendationEngine';

interface MediaDetailModalProps {
  media: MediaItem;
  catalog: MediaItem[];
  isInMyList: boolean;
  onToggleMyList: (id: string) => void;
  onPlay: (media: MediaItem, episode?: Episode) => void;
  onDownload: (media: MediaItem, episode?: Episode) => void;
  onCaptureSnippet: (media: MediaItem) => void;
  onStartWatchParty: (media: MediaItem) => void;
  onClose: () => void;
  reviews: UserReview[];
  onAddReview: (mediaId: string, rating: number, content: string, sceneTimestamp?: string, isSpoiler?: boolean) => void;
  activeProfile: Profile;
  onSelectMedia: (item: MediaItem) => void;
}

export const MediaDetailModal: React.FC<MediaDetailModalProps> = ({
  media,
  catalog,
  isInMyList,
  onToggleMyList,
  onPlay,
  onDownload,
  onCaptureSnippet,
  onStartWatchParty,
  onClose,
  reviews,
  onAddReview,
  activeProfile,
  onSelectMedia
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'episodes' | 'discussions'>('overview');
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [revealedSpoilers, setRevealedSpoilers] = useState<Record<string, boolean>>({});

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newContent, setNewContent] = useState('');
  const [newTimestamp, setNewTimestamp] = useState('');
  const [isSpoilerReview, setIsSpoilerReview] = useState(false);

  const mediaReviews = reviews.filter(r => r.mediaId === media.id);
  const similarItems = getRecommendationsBasedOnItem(media, catalog, 4);

  const handlePostReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    onAddReview(media.id, newRating, newContent.trim(), newTimestamp.trim() || undefined, isSpoilerReview);
    setNewContent('');
    setNewTimestamp('');
    setIsSpoilerReview(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl my-auto text-neutral-100 flex flex-col">
        {/* Banner with Backdrop */}
        <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden">
          <img
            src={media.backdropUrl}
            alt={media.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-transparent to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close details modal"
            className="absolute top-4 right-4 p-2 rounded-full bg-black/70 hover:bg-black text-white transition-colors cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Banner bottom info */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-300 mb-2">
              <span className="px-1.5 py-0.5 font-mono text-[11px] bg-black/60 border border-neutral-700 rounded font-bold">
                {media.rating}
              </span>
              <span>{media.year}</span>
              <span>•</span>
              <span>{media.type === 'movie' ? media.duration : `${media.seasonsCount} Seasons`}</span>
              <span>•</span>
              <span className="text-amber-400 font-semibold">{media.language}</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{media.imdbScore} IMDb</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black font-['Cinzel'] tracking-tight text-white drop-shadow-md">
              {media.title}
            </h2>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 mt-3">
              <button
                onClick={() => onPlay(media)}
                className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Play {media.type === 'series' ? 'S1:E1' : 'Movie'}</span>
              </button>

              <button
                onClick={() => onToggleMyList(media.id)}
                className="px-3.5 py-2 rounded-lg bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 border border-neutral-700 transition-colors cursor-pointer"
              >
                {isInMyList ? <Check className="w-4 h-4 text-amber-400" /> : <Plus className="w-4 h-4" />}
                <span>{isInMyList ? 'In List' : 'Add to List'}</span>
              </button>

              <button
                onClick={() => onDownload(media)}
                title="Download for offline viewing"
                className="p-2 rounded-lg bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={() => onCaptureSnippet(media)}
                title="Capture still quote snippet card"
                className="p-2 rounded-lg bg-neutral-800/90 hover:bg-neutral-700 text-amber-300 border border-neutral-700 transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4" />
              </button>

              <button
                onClick={() => onStartWatchParty(media)}
                title="Start a synchronized watch party"
                className="px-3 py-2 rounded-lg bg-neutral-800/90 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 border border-neutral-700 transition-colors cursor-pointer"
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Host Watch Party</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs inside modal */}
        <div className="flex border-b border-neutral-800 px-6 bg-neutral-950">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 text-xs font-bold border-b-2 mr-6 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Overview &amp; Recommendations
          </button>
          {media.type === 'series' && media.episodes && (
            <button
              onClick={() => setActiveTab('episodes')}
              className={`py-3 text-xs font-bold border-b-2 mr-6 transition-colors cursor-pointer ${
                activeTab === 'episodes'
                  ? 'border-amber-500 text-amber-400'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              Episodes ({media.episodes.length})
            </button>
          )}
          <button
            onClick={() => setActiveTab('discussions')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'discussions'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Social Discussions ({mediaReviews.length})</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="p-6 space-y-6 overflow-y-auto max-h-[50vh]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-3">
                <p className="text-sm text-neutral-300 leading-relaxed">{media.synopsis}</p>
                {media.awards && (
                  <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-lg">
                    <Award className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>{media.awards}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-xs text-neutral-400 border-l border-neutral-800 pl-4">
                <div>
                  <span className="text-neutral-500">Director:</span>{' '}
                  <span className="text-white font-medium">{media.director}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Cast:</span>{' '}
                  <span className="text-neutral-300">{media.cast.join(', ')}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Genres:</span>{' '}
                  <span className="text-neutral-300">{media.genres.join(', ')}</span>
                </div>
                <div>
                  <span className="text-neutral-500">Audio:</span>{' '}
                  <span className="text-neutral-300">
                    {media.audioTracks.map(a => a.label).join(', ')}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500">Subtitles:</span>{' '}
                  <span className="text-neutral-300">
                    {media.subtitles.map(s => s.label).join(', ')}
                  </span>
                </div>
              </div>
            </div>

            {/* "Because you watched this" Recommendations */}
            {similarItems.length > 0 && (
              <div className="pt-4 border-t border-neutral-800">
                <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-3">
                  Because You Liked {media.title}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {similarItems.map(item => (
                    <div
                      key={item.id}
                      onClick={() => onSelectMedia(item)}
                      className="group cursor-pointer rounded-lg overflow-hidden bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 transition-all p-2"
                    >
                      <img
                        src={item.posterUrl}
                        alt={item.title}
                        className="w-full aspect-[2/3] object-cover rounded mb-2 group-hover:scale-105 transition-transform"
                      />
                      <div className="text-xs font-semibold text-white truncate">{item.title}</div>
                      <div className="text-[10px] text-neutral-400">{item.year} • {item.genres[0]}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Episodes (for Series) */}
        {activeTab === 'episodes' && media.episodes && (
          <div className="p-6 overflow-y-auto max-h-[50vh] space-y-3">
            {media.episodes.map(ep => (
              <div
                key={ep.id}
                className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="relative w-28 sm:w-36 aspect-video rounded overflow-hidden shrink-0">
                    <img src={ep.stillUrl} alt={ep.title} className="w-full h-full object-cover" />
                    <button
                      onClick={() => onPlay(media, ep)}
                      aria-label={`Play episode ${ep.episodeNumber}`}
                      className="absolute inset-0 bg-black/40 hover:bg-black/20 flex items-center justify-center text-white"
                    >
                      <Play className="w-6 h-6 fill-white" />
                    </button>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>{ep.episodeNumber}. {ep.title}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">{ep.duration}</span>
                    </div>
                    <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                      {ep.overview}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onPlay(media, ep)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-black" />
                    <span>Watch</span>
                  </button>
                  <button
                    onClick={() => onDownload(media, ep)}
                    title="Download episode"
                    className="p-2 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Social Discussions & Reviews */}
        {activeTab === 'discussions' && (
          <div className="p-6 overflow-y-auto max-h-[50vh] space-y-6">
            {/* Post Review Form */}
            <form onSubmit={handlePostReview} className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
              <div className="text-xs font-bold text-white flex items-center justify-between">
                <span>Join the Community Discussion for {media.title}</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="p-0.5 text-amber-400 cursor-pointer"
                    >
                      <Star className={`w-4 h-4 ${star <= newRating ? 'fill-amber-400' : 'text-neutral-600'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={2}
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                placeholder="Share your thoughts on the plot, cinematography, or soundtrack..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newTimestamp}
                    onChange={e => setNewTimestamp(e.target.value)}
                    placeholder="Timestamp (e.g. 00:45:20)"
                    className="w-36 bg-neutral-900 border border-neutral-800 rounded px-2.5 py-1 text-[11px] text-white"
                  />
                  <label className="flex items-center gap-1.5 text-neutral-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSpoilerReview}
                      onChange={e => setIsSpoilerReview(e.target.checked)}
                      className="rounded border-neutral-700 bg-neutral-800 text-amber-500"
                    />
                    <span>Contains Plot Spoiler</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={!newContent.trim()}
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold disabled:opacity-40 cursor-pointer"
                >
                  Post Review
                </button>
              </div>
            </form>

            {/* Existing Reviews List */}
            <div className="space-y-3">
              {mediaReviews.length === 0 ? (
                <div className="text-center py-6 text-neutral-500 text-xs">
                  No discussions yet. Be the first to start the conversation!
                </div>
              ) : (
                mediaReviews.map(rev => {
                  const isHidden = rev.isSpoiler && !revealedSpoilers[rev.id];

                  return (
                    <div
                      key={rev.id}
                      className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={rev.userAvatar}
                            alt={rev.userName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-xs font-semibold text-white">{rev.userName}</span>
                          <span className="text-[10px] text-neutral-500">• {rev.timestamp}</span>
                          {rev.sceneTimestamp && (
                            <span className="text-[10px] text-amber-400 font-mono bg-neutral-900 px-1 rounded">
                              @{rev.sceneTimestamp}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star
                              key={s}
                              className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-700'}`}
                            />
                          ))}
                        </div>
                      </div>

                      {isHidden ? (
                        <button
                          onClick={() => setRevealedSpoilers(p => ({ ...p, [rev.id]: true }))}
                          className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold py-1 cursor-pointer"
                        >
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>Contains Spoiler (Click to reveal comment)</span>
                        </button>
                      ) : (
                        <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-wrap">
                          {rev.content}
                        </p>
                      )}

                      <div className="flex items-center gap-3 pt-1 text-[11px] text-neutral-500">
                        <button className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{rev.likes}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
