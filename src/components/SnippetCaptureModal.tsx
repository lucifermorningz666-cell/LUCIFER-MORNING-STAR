import React, { useState } from 'react';
import { Camera, Download, Copy, Check, X, Sparkles, Bookmark, Share2 } from 'lucide-react';
import { MediaItem, WatchlistSnippet } from '../types/media';

interface SnippetCaptureModalProps {
  media: MediaItem;
  timestamp: number;
  timestampStr: string;
  authorName: string;
  onSaveSnippet: (snippet: WatchlistSnippet) => void;
  onClose: () => void;
}

export const SnippetCaptureModal: React.FC<SnippetCaptureModalProps> = ({
  media,
  timestamp,
  timestampStr,
  authorName,
  onSaveSnippet,
  onClose
}) => {
  const [quote, setQuote] = useState(
    media.tagline ? `"${media.tagline}"` : `An unforgettable moment in ${media.title}.`
  );
  const [selectedTheme, setSelectedTheme] = useState<'noir' | 'neon' | 'editorial' | 'vintage'>('noir');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const themeStyles = {
    noir: 'bg-neutral-950 border-neutral-700 text-neutral-100 font-serif',
    neon: 'bg-[#060814] border-cyan-500/60 text-cyan-100 shadow-[0_0_25px_rgba(6,182,212,0.25)] font-mono',
    editorial: 'bg-[#0f1115] border-neutral-600 text-amber-100 font-sans tracking-wide',
    vintage: 'bg-[#181310] border-amber-800/80 text-amber-200 font-serif'
  }[selectedTheme];

  const handleSave = () => {
    const newSnippet: WatchlistSnippet = {
      id: `snip-${Date.now()}`,
      mediaId: media.id,
      mediaTitle: media.title,
      timestampStr,
      quote,
      theme: selectedTheme,
      captureUrl: media.backdropUrl,
      createdAt: new Date().toISOString().split('T')[0],
      author: authorName
    };
    onSaveSnippet(newSnippet);
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleCopy = () => {
    const textToCopy = `🎬 "${media.title}" [${timestampStr}]:\n${quote}\n— Watched via Lumière Cinema`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadImage = () => {
    // Generate a simple simulated download of the card
    const link = document.createElement('a');
    link.href = media.backdropUrl;
    link.download = `${media.title.toLowerCase().replace(/\s+/g, '-')}-snippet-${timestampStr.replace(/:/g, '')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Create Watchlist Snippet Card</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close snippet modal"
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Card Live Preview */}
          <div>
            <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Card Live Preview
            </div>
            <div
              className={`relative rounded-xl border p-4 sm:p-5 overflow-hidden transition-all duration-300 ${themeStyles}`}
            >
              {/* Card Still Background */}
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4 border border-white/10">
                <img
                  src={media.backdropUrl}
                  alt={media.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-2 text-[10px] font-mono bg-black/80 px-2 py-0.5 rounded border border-neutral-700">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>FRAME {timestampStr}</span>
                </div>
                <div className="absolute bottom-2.5 right-2.5 text-[10px] text-amber-300 font-semibold tracking-wider uppercase">
                  Lumière Cinema
                </div>
              </div>

              {/* Quote / Commentary text */}
              <div className="space-y-2">
                <p className="text-sm sm:text-base italic leading-relaxed">
                  {quote || '"(Your dialogue or thought here)"'}
                </p>
                <div className="flex items-center justify-between text-xs text-neutral-400 pt-2 border-t border-neutral-800/80">
                  <span className="font-bold text-white">{media.title} ({media.year})</span>
                  <span>Curated by {authorName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Selector */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-2">
              Visual Aesthetic Theme:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'noir', name: 'Cinematic Noir' },
                { id: 'neon', name: 'Cyberpunk Neon' },
                { id: 'editorial', name: 'Editorial Minimal' },
                { id: 'vintage', name: 'Warm Vintage' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTheme(t.id as any)}
                  className={`px-3 py-2 text-xs rounded-lg border text-center transition-colors cursor-pointer ${
                    selectedTheme === t.id
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                      : 'border-neutral-700 bg-neutral-800/60 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Quote / Caption Input */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Snippet Quote or Scene Commentary:
            </label>
            <textarea
              rows={2}
              value={quote}
              onChange={e => setQuote(e.target.value)}
              placeholder="Enter a memorable line or personal insight..."
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 border border-neutral-700 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Quote'}</span>
              </button>

              <button
                onClick={handleDownloadImage}
                className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium flex items-center gap-1.5 border border-neutral-700 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Save Still Image</span>
              </button>
            </div>

            <button
              onClick={handleSave}
              disabled={saved}
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              {saved ? <Check className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              <span>{saved ? 'Saved to Snippets!' : 'Add to My Snippets Vault'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
