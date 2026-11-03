import React, { useState, useRef, useEffect } from 'react';
import {
  Users,
  MessageSquare,
  Share2,
  Copy,
  Check,
  Send,
  Eye,
  EyeOff,
  Crown,
  RotateCcw,
  Sparkles,
  X,
  Volume2
} from 'lucide-react';
import { PartyAttendee, PartyChatMessage, WatchPartyRoom, formatVideoTime } from '../utils/watchPartyLogic';
import { Profile } from '../types/media';

interface WatchPartyPanelProps {
  room: WatchPartyRoom | null;
  activeProfile: Profile;
  currentVideoTime: number;
  onSendMessage: (text: string, isSpoiler: boolean, reaction?: string) => void;
  onSyncToHost: () => void;
  onHostSyncAll: () => void;
  onLeaveParty: () => void;
  onClosePanel: () => void;
  onSeekToTimestamp?: (seconds: number) => void;
}

const REACTION_EMOJIS = ['🍿', '🔥', '😱', '🎉', '❤️', '👏', '😂'];

export const WatchPartyPanel: React.FC<WatchPartyPanelProps> = ({
  room,
  activeProfile,
  currentVideoTime,
  onSendMessage,
  onSyncToHost,
  onHostSyncAll,
  onLeaveParty,
  onClosePanel,
  onSeekToTimestamp
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'attendees'>('chat');
  const [inputText, setInputText] = useState('');
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [revealedSpoilers, setRevealedSpoilers] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [room?.messages]);

  if (!room) return null;

  const isHost = room.hostId === activeProfile.id;
  const currentAttendee = room.attendees.find(a => a.id === activeProfile.id);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim(), isSpoiler);
    setInputText('');
    setIsSpoiler(false);
  };

  const handleReactionClick = (emoji: string) => {
    onSendMessage(emoji, false, emoji);
  };

  const copyInvite = () => {
    const inviteUrl = `${window.location.origin}/?party=${room.code}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const toggleRevealSpoiler = (msgId: string) => {
    setRevealedSpoilers(prev => ({ ...prev, [msgId]: !prev[msgId] }));
  };

  return (
    <div className="w-full sm:w-84 md:w-96 bg-neutral-950/95 backdrop-blur-xl border-l border-neutral-800 flex flex-col h-full z-40 text-neutral-100 select-none">
      {/* Party Header */}
      <div className="p-3.5 border-b border-neutral-800/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <span>Watch Party</span>
              <span className="font-mono bg-neutral-900 border border-neutral-700 px-1.5 py-0.5 rounded text-[11px] text-white">
                {room.code}
              </span>
            </div>
            <div className="text-[11px] text-neutral-400 truncate max-w-[180px]">
              {room.mediaTitle}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={copyInvite}
            title="Copy invite link"
            aria-label="Copy watch party invite link"
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-700/70 hover:text-amber-400 text-neutral-300 transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onLeaveParty}
            title="Leave party"
            aria-label="Leave watch party"
            className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-700/70 hover:text-red-400 text-neutral-400 transition-colors cursor-pointer text-xs"
          >
            Leave
          </button>
          <button
            onClick={onClosePanel}
            aria-label="Collapse party panel"
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sync Control Banner */}
      <div className="px-3.5 py-2 bg-neutral-900/60 border-b border-neutral-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-neutral-300">
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>
            {isHost ? 'You are Host (Director)' : 'Host: ' + room.hostName}
          </span>
        </div>

        {isHost ? (
          <button
            onClick={onHostSyncAll}
            className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-medium text-[11px] transition-colors cursor-pointer"
          >
            Sync All ({room.attendees.length})
          </button>
        ) : (
          <button
            onClick={onSyncToHost}
            className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 font-medium text-[11px] transition-colors cursor-pointer"
          >
            Sync to Host ({formatVideoTime(room.playbackState.currentTimestamp)})
          </button>
        )}
      </div>

      {/* Tabs: Live Chat vs Attendees */}
      <div className="flex border-b border-neutral-800">
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'chat'
              ? 'text-amber-400 border-b-2 border-amber-500 bg-neutral-900/40'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Party Chat ({room.messages.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('attendees')}
          className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            activeTab === 'attendees'
              ? 'text-amber-400 border-b-2 border-amber-500 bg-neutral-900/40'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Attendees ({room.attendees.length})</span>
        </button>
      </div>

      {/* Tab 1: Live Chat Content */}
      {activeTab === 'chat' ? (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
            {room.messages.map(msg => {
              if (msg.isSystem) {
                return (
                  <div
                    key={msg.id}
                    className="text-center py-1 px-2.5 rounded-full bg-neutral-900/80 border border-neutral-800 text-[11px] text-neutral-400 italic"
                  >
                    <span>{msg.text}</span>
                    {msg.videoTimestamp !== undefined && (
                      <span className="ml-1 text-amber-500/80 font-mono">
                        [{formatVideoTime(msg.videoTimestamp)}]
                      </span>
                    )}
                  </div>
                );
              }

              const isMe = msg.senderId === activeProfile.id;
              const isHiddenSpoiler = msg.isSpoiler && !revealedSpoilers[msg.id];

              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-1.5 mb-0.5 text-[10px] text-neutral-400">
                    {!isMe && (
                      <img
                        src={msg.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60'}
                        alt={msg.senderName}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                    )}
                    <span className="font-semibold text-neutral-300">{isMe ? 'You' : msg.senderName}</span>
                    <span>• {msg.timestamp}</span>
                    {msg.videoTimestamp !== undefined && (
                      <button
                        onClick={() => onSeekToTimestamp && onSeekToTimestamp(msg.videoTimestamp!)}
                        title="Jump to scene timestamp"
                        className="text-amber-400/90 hover:underline font-mono cursor-pointer"
                      >
                        @{formatVideoTime(msg.videoTimestamp)}
                      </button>
                    )}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-xs relative ${
                      isMe
                        ? 'bg-amber-500 text-black font-medium'
                        : 'bg-neutral-900 border border-neutral-800 text-neutral-100'
                    }`}
                  >
                    {isHiddenSpoiler ? (
                      <button
                        onClick={() => toggleRevealSpoiler(msg.id)}
                        className="flex items-center gap-1.5 py-1 text-amber-300 font-semibold cursor-pointer"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Spoiler Warning (Click to reveal)</span>
                      </button>
                    ) : (
                      <div>
                        {msg.isSpoiler && (
                          <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5 opacity-80 flex items-center gap-1">
                            <Eye className="w-3 h-3" /> Spoiler Revealed
                          </div>
                        )}
                        <p className="whitespace-pre-wrap break-words leading-relaxed">{msg.text}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reaction Bar */}
          <div className="px-3 py-1.5 bg-neutral-900/50 border-t border-neutral-800/60 flex items-center gap-1 overflow-x-auto no-scrollbar">
            <span className="text-[10px] text-neutral-500 uppercase font-semibold mr-1">React:</span>
            {REACTION_EMOJIS.map(emoji => (
              <button
                key={emoji}
                onClick={() => handleReactionClick(emoji)}
                className="w-7 h-7 rounded hover:bg-neutral-800 flex items-center justify-center text-sm transition-transform transform active:scale-125 cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-neutral-800 bg-neutral-950">
            <div className="flex items-center justify-between mb-1.5 text-[11px] text-neutral-400">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isSpoiler}
                  onChange={e => setIsSpoiler(e.target.checked)}
                  className="rounded border-neutral-700 bg-neutral-800 text-amber-500 focus:ring-0"
                />
                <span className={isSpoiler ? 'text-amber-400 font-semibold' : ''}>Mark as Spoiler</span>
              </label>

              <span className="text-neutral-500 font-mono text-[10px]">
                Tag: {formatVideoTime(currentVideoTime)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Discuss scene or react..."
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                aria-label="Send party message"
                className="p-2 rounded-lg bg-amber-500 text-black hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Tab 2: Attendees List */
        <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
          <div className="text-xs text-neutral-400 mb-2">
            Watching together ({room.attendees.length} members):
          </div>

          {room.attendees.map(attendee => (
            <div
              key={attendee.id}
              className="p-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <img
                  src={attendee.avatar}
                  alt={attendee.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-neutral-700"
                />
                <div>
                  <div className="text-xs font-semibold text-white flex items-center gap-1">
                    <span>{attendee.name}</span>
                    {attendee.isHost && (
                      <span className="text-amber-400" title="Party Host">
                        <Crown className="w-3 h-3 fill-amber-400" />
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono">
                    {formatVideoTime(attendee.currentTimestamp)} •{' '}
                    <span className={attendee.isSynced ? 'text-emerald-400' : 'text-amber-400'}>
                      {attendee.isSynced ? 'Synced' : 'Buffering / Drift'}
                    </span>
                  </div>
                </div>
              </div>

              {attendee.id === activeProfile.id && (
                <span className="text-[10px] font-bold text-amber-400 px-1.5 py-0.5 rounded bg-amber-500/10">
                  YOU
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
