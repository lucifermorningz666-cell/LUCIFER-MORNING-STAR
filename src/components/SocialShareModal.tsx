import React, { useState } from 'react';
import { Share2, Copy, Check, Users, MessageCircle, X, ExternalLink } from 'lucide-react';
import { MediaItem } from '../types/media';

interface SocialShareModalProps {
  media: MediaItem;
  onStartWatchParty: (media: MediaItem) => void;
  onClose: () => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  media,
  onStartWatchParty,
  onClose
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [includeTimestamp, setIncludeTimestamp] = useState(false);

  const shareUrl = `${window.location.origin}/?media=${media.id}${includeTimestamp ? '&t=0' : ''}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareToSocial = (platform: string) => {
    const text = encodeURIComponent(`Streaming "${media.title}" on Lumière Cinema! Check it out:`);
    const url = encodeURIComponent(shareUrl);
    let href = '';

    if (platform === 'twitter') {
      href = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    } else if (platform === 'whatsapp') {
      href = `https://api.whatsapp.com/send?text=${text}%20${url}`;
    } else if (platform === 'telegram') {
      href = `https://t.me/share/url?url=${url}&text=${text}`;
    }

    if (href) {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col text-neutral-100">
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Share &amp; Watch Together</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close share modal"
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Media Header */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-950 border border-neutral-800">
            <img
              src={media.posterUrl}
              alt={media.title}
              className="w-12 h-16 rounded object-cover"
            />
            <div>
              <div className="text-sm font-bold text-white">{media.title}</div>
              <div className="text-xs text-neutral-400">{media.year} • {media.genres.slice(0, 2).join(', ')}</div>
              <div className="text-[11px] text-amber-400 font-mono mt-0.5">{media.rating} • {media.language}</div>
            </div>
          </div>

          {/* Watch Party Quick Trigger */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-transparent border border-amber-500/30 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Host Private Watch Party</span>
              </div>
              <div className="text-[11px] text-neutral-400 mt-0.5">
                Synchronized video playback + live in-player group chat.
              </div>
            </div>
            <button
              onClick={() => {
                onStartWatchParty(media);
                onClose();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors cursor-pointer"
            >
              Start Room
            </button>
          </div>

          {/* Direct Link Share */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-neutral-300">Shareable Cinema Link:</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-300 font-mono select-all"
              />
              <button
                onClick={copyUrl}
                className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-medium flex items-center gap-1.5 border border-neutral-700 transition-colors cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Social Quick Share Buttons */}
          <div>
            <div className="text-xs font-semibold text-neutral-400 mb-2">Share Directly To:</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => shareToSocial('whatsapp')}
                className="py-2 px-3 rounded-lg bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 text-xs font-medium text-emerald-400 text-center transition-colors cursor-pointer"
              >
                WhatsApp
              </button>
              <button
                onClick={() => shareToSocial('twitter')}
                className="py-2 px-3 rounded-lg bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 text-xs font-medium text-cyan-400 text-center transition-colors cursor-pointer"
              >
                X (Twitter)
              </button>
              <button
                onClick={() => shareToSocial('telegram')}
                className="py-2 px-3 rounded-lg bg-neutral-950 border border-neutral-800 hover:bg-neutral-800 text-xs font-medium text-sky-400 text-center transition-colors cursor-pointer"
              >
                Telegram
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
