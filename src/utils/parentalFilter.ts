import { MaturityRating, MediaItem, Profile } from '../types/media';

export const MATURITY_RANK_MAP: Record<string, number> = {
  'G': 1,
  'TV-Y': 1,
  'TV-Y7': 2,
  'PG': 3,
  'TV-PG': 3,
  'PG-13': 4,
  'TV-14': 4,
  'R': 5,
  'TV-MA': 5,
  'NC-17': 6,
};

export const MATURITY_DESCRIPTIONS: Record<string, string> = {
  'G': 'General Audiences. All ages admitted.',
  'TV-Y': 'All Children. Specifically designed for young children.',
  'TV-Y7': 'Directed to older children (7+). Mild fantasy or comedic violence.',
  'PG': 'Parental Guidance Suggested. Some material may not be suitable for children.',
  'TV-PG': 'Parental Guidance Suggested. May contain infrequent coarse language or mild violence.',
  'PG-13': 'Parents Strongly Cautioned. Some material may be inappropriate for children under 13.',
  'TV-14': 'Parents Strongly Cautioned. May contain intense violence or suggestive themes.',
  'R': 'Restricted. Under 17 requires accompanying parent or adult guardian.',
  'TV-MA': 'Mature Audience Only. Specifically designed to be viewed by adults (17+).',
  'NC-17': 'No One 17 and Under Admitted. Clearly adult content.',
};

/**
 * Checks if a media item's maturity rating is allowed for the given profile's ceiling.
 */
export function isContentAllowedForProfile(
  itemRating: MaturityRating | string,
  profileMaxRating?: MaturityRating | string | null
): boolean {
  if (!profileMaxRating) return true; // Unrestricted

  const itemRank = MATURITY_RANK_MAP[itemRating] || 4;
  const maxRank = MATURITY_RANK_MAP[profileMaxRating] || 6;

  return itemRank <= maxRank;
}

/**
 * Filter an array of media items to only those permitted by the profile
 */
export function filterCatalogForProfile(
  items: MediaItem[],
  profile?: Profile | null
): MediaItem[] {
  if (!profile || !profile.maxRating) return items;

  return items.filter(item => isContentAllowedForProfile(item.rating, profile.maxRating));
}

/**
 * Check if current time falls within bedtime / curfew hours.
 * If bedtime is 21:00, curfew is active from 21:00 until 06:00.
 */
export function isBedtimeRestricted(
  bedtimeHour?: number,
  bedtimeMinute?: number,
  currentHour?: number,
  currentMinute?: number
): boolean {
  if (bedtimeHour === undefined || bedtimeMinute === undefined) return false;

  const nowH = currentHour !== undefined ? currentHour : new Date().getHours();
  const nowM = currentMinute !== undefined ? currentMinute : new Date().getMinutes();

  const currentTimeInMinutes = nowH * 60 + nowM;
  const bedtimeInMinutes = bedtimeHour * 60 + bedtimeMinute;
  const morningWakeupInMinutes = 6 * 60; // 06:00 AM

  if (bedtimeInMinutes > morningWakeupInMinutes) {
    // Standard night curfew (e.g. 21:00 to 06:00 next day)
    return currentTimeInMinutes >= bedtimeInMinutes || currentTimeInMinutes < morningWakeupInMinutes;
  } else {
    // Curfew spans early morning
    return currentTimeInMinutes >= bedtimeInMinutes && currentTimeInMinutes < morningWakeupInMinutes;
  }
}

/**
 * Verifies if entered PIN matches the profile PIN
 */
export function verifyPin(inputPin: string, storedPin?: string): boolean {
  if (!storedPin) return true;
  return inputPin.trim() === storedPin.trim();
}
