export interface EarningMilestone {
  id: string;
  title: string;
  description: string;
  rewardUsd: number;
  rewardCoins: number;
  thresholdSeconds: number;
  isClaimed: boolean;
}

export interface WalletTransaction {
  id: string;
  type: 'earn' | 'withdraw' | 'streak_bonus' | 'referral';
  title: string;
  amountUsd: number;
  amountCoins: number;
  timestamp: string;
  status: 'completed' | 'processing';
}

export interface UserWallet {
  balanceUsd: number;
  balanceCoins: number;
  totalEarnedUsd: number;
  streakDays: number;
  streakMultiplier: number;
  todayWatchSeconds: number;
  claimedMilestones: string[];
  transactions: WalletTransaction[];
}

export const BASE_EARNING_RATE_PER_MINUTE = 0.08; // $0.08 per active minute watched

export const DEFAULT_MILESTONES: EarningMilestone[] = [
  {
    id: 'm-starter',
    title: 'First Flight: 3 Minutes Streamed',
    description: 'Watch any movie or trailer for 3 minutes',
    rewardUsd: 1.50,
    rewardCoins: 150,
    thresholdSeconds: 180,
    isClaimed: false
  },
  {
    id: 'm-binge',
    title: 'Cinema Connoisseur: 15 Minutes Streamed',
    description: 'Stream continuous HD cinema',
    rewardUsd: 3.50,
    rewardCoins: 350,
    thresholdSeconds: 900,
    isClaimed: false
  },
  {
    id: 'm-feature',
    title: 'Feature Premiere: 30 Minutes Streamed',
    description: 'Complete half an hour of entertainment',
    rewardUsd: 7.00,
    rewardCoins: 700,
    thresholdSeconds: 1800,
    isClaimed: false
  }
];

/**
 * Calculates earnings for watched duration in seconds with streak multiplier
 */
export function calculateEarnedCredits(
  secondsWatched: number,
  streakMultiplier = 1.0
): { earnedUsd: number; earnedCoins: number } {
  if (secondsWatched <= 0) return { earnedUsd: 0, earnedCoins: 0 };
  const minutes = secondsWatched / 60;
  const rawUsd = minutes * BASE_EARNING_RATE_PER_MINUTE * streakMultiplier;
  const earnedUsd = Math.round(rawUsd * 100) / 100;
  const earnedCoins = Math.round(earnedUsd * 100);
  return { earnedUsd, earnedCoins };
}

/**
 * Validates and processes a simulated cash withdrawal
 */
export function processWithdrawal(
  currentBalanceUsd: number,
  withdrawalAmount: number,
  method: 'paypal' | 'giftcard' | 'crypto' | 'vip'
): { success: boolean; newBalanceUsd: number; txId?: string; error?: string } {
  if (withdrawalAmount <= 0) {
    return { success: false, newBalanceUsd: currentBalanceUsd, error: 'Amount must be greater than $0' };
  }
  if (withdrawalAmount > currentBalanceUsd) {
    return { success: false, newBalanceUsd: currentBalanceUsd, error: 'Insufficient wallet balance' };
  }

  const newBalanceUsd = Math.round((currentBalanceUsd - withdrawalAmount) * 100) / 100;
  const txId = `TX-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

  return { success: true, newBalanceUsd, txId };
}
