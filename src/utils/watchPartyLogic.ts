export interface PartyAttendee {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  currentTimestamp: number;
  isSynced: boolean;
  status: 'watching' | 'paused' | 'buffering';
  joinedAt: string;
}

export interface PartyChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  videoTimestamp?: number; // In seconds
  isSystem?: boolean;
  isSpoiler?: boolean;
  reaction?: string;
}

export interface WatchPartyRoom {
  code: string;
  mediaId: string;
  episodeId?: string;
  mediaTitle: string;
  hostId: string;
  hostName: string;
  playbackState: {
    isPlaying: boolean;
    currentTimestamp: number; // in seconds
    lastSyncedAt: number; // timestamp in ms
    playbackSpeed: number;
  };
  attendees: PartyAttendee[];
  messages: PartyChatMessage[];
  isLocked: boolean;
}

/**
 * Generate a friendly, memorable 6-character room code (e.g. "LUM-749")
 */
export function generatePartyRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomPart = '';
  for (let i = 0; i < 4; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `LUM-${randomPart}`;
}

/**
 * Calculate playback time drift between attendee and host in seconds.
 */
export function calculatePlaybackDrift(attendeeTime: number, hostTime: number): number {
  return Math.abs(attendeeTime - hostTime);
}

/**
 * Determines if an attendee should trigger automatic or prompt re-sync.
 * Threshold is typically 1.5 seconds.
 */
export function shouldTriggerSync(attendeeTime: number, hostTime: number, threshold = 1.5): boolean {
  return calculatePlaybackDrift(attendeeTime, hostTime) > threshold;
}

/**
 * Formats seconds into HH:MM:SS or MM:SS
 */
export function formatVideoTime(seconds: number): string {
  const total = Math.floor(seconds);
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  if (hrs > 0) {
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Creates a system announcement message for watch party events
 */
export function createPartySystemMessage(text: string, currentVideoTime?: number): PartyChatMessage {
  return {
    id: `sys-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    senderId: 'system',
    senderName: 'Lumière Party Bot',
    senderAvatar: '',
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    videoTimestamp: currentVideoTime,
    isSystem: true
  };
}
