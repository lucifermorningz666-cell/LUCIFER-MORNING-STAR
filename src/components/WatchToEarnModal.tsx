import React, { useState } from 'react';
import {
  Coins,
  DollarSign,
  Flame,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Gift,
  CreditCard,
  X,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { UserWallet, processWithdrawal } from '../utils/earningLogic';

interface WatchToEarnModalProps {
  wallet: UserWallet;
  onClaimMilestone: (milestoneId: string, amountUsd: number) => void;
  onWithdraw: (amountUsd: number, method: string, txId: string) => void;
  onClose: () => void;
  sessionEarnedUsd: number;
}

export const WatchToEarnModal: React.FC<WatchToEarnModalProps> = ({
  wallet,
  onClaimMilestone,
  onWithdraw,
  onClose,
  sessionEarnedUsd
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'withdraw' | 'history'>('overview');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(10);
  const [withdrawMethod, setWithdrawMethod] = useState<'paypal' | 'giftcard' | 'crypto' | 'vip'>('paypal');
  const [targetAccount, setTargetAccount] = useState('user@example.com');
  const [withdrawStatus, setWithdrawStatus] = useState<{ success: boolean; txId?: string; msg?: string } | null>(null);

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = processWithdrawal(wallet.balanceUsd, withdrawAmount, withdrawMethod);
    if (result.success && result.txId) {
      onWithdraw(withdrawAmount, withdrawMethod, result.txId);
      setWithdrawStatus({
        success: true,
        txId: result.txId,
        msg: `Successfully transferred $${withdrawAmount.toFixed(2)} to ${targetAccount} via ${withdrawMethod.toUpperCase()}!`
      });
    } else {
      setWithdrawStatus({
        success: false,
        msg: result.error || 'Withdrawal failed. Check balance.'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl my-auto text-neutral-100 flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between bg-gradient-to-r from-amber-950/40 via-neutral-900 to-neutral-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold shadow-lg shadow-amber-500/30">
              <Coins className="w-5 h-5 fill-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">Watch &amp; Earn Rewards Vault</h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  REAL PAYOUTS
                </span>
              </div>
              <p className="text-xs text-neutral-400">Earn real money &amp; gift credits just by streaming cinema</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close rewards vault"
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Balance Hero Card */}
        <div className="p-5 bg-neutral-950 border-b border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Available Wallet Balance
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono flex items-baseline gap-2 mt-0.5">
              <span>${wallet.balanceUsd.toFixed(2)}</span>
              <span className="text-sm font-normal text-amber-400">({wallet.balanceCoins} Coins)</span>
            </div>
            <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 mt-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Session Current Earnings: +${sessionEarnedUsd.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>{wallet.streakDays} Day Streak</span>
              </div>
              <div className="text-[10px] text-neutral-400 mt-0.5">
                {wallet.streakMultiplier}x Earning Boost
              </div>
            </div>

            <button
              onClick={() => setActiveTab('withdraw')}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Cash Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 px-5 bg-neutral-950">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 text-xs font-bold border-b-2 mr-6 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Watch Milestones
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`py-3 text-xs font-bold border-b-2 mr-6 transition-colors cursor-pointer ${
              activeTab === 'withdraw'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Withdraw Cash / Gift Cards
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Earnings History ({wallet.transactions.length})
          </button>
        </div>

        {/* Tab 1: Milestones */}
        {activeTab === 'overview' && (
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[60vh]">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-200">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                <strong>Earn While Watching:</strong> Stream any video in full screen or theater mode. You earn $0.08 per active minute plus milestone bonuses below!
              </span>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: 'm-starter',
                  title: 'First Flight: 3 Minutes Streamed',
                  desc: 'Stream any movie or series for 3 minutes',
                  reward: 1.50,
                  progressPercent: Math.min(100, Math.round((wallet.todayWatchSeconds / 180) * 100)),
                  needed: '180s',
                },
                {
                  id: 'm-binge',
                  title: 'Cinema Connoisseur: 15 Minutes Streamed',
                  desc: 'Stream continuous high-definition playback',
                  reward: 3.50,
                  progressPercent: Math.min(100, Math.round((wallet.todayWatchSeconds / 900) * 100)),
                  needed: '900s',
                },
                {
                  id: 'm-feature',
                  title: 'Feature Premiere: 30 Minutes Streamed',
                  desc: 'Complete half an hour of binge watching',
                  reward: 7.00,
                  progressPercent: Math.min(100, Math.round((wallet.todayWatchSeconds / 1800) * 100)),
                  needed: '1800s',
                },
              ].map(item => {
                const isClaimed = wallet.claimedMilestones.includes(item.id);
                const isReady = item.progressPercent >= 100 && !isClaimed;

                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">{item.title}</span>
                        <span className="text-[11px] font-bold text-emerald-400 font-mono">
                          +${item.reward.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{item.desc}</p>

                      {/* Progress bar */}
                      <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-300"
                          style={{ width: `${item.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isClaimed ? (
                        <span className="px-3 py-1.5 rounded-lg bg-neutral-800 text-neutral-500 text-xs font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Claimed</span>
                        </span>
                      ) : isReady ? (
                        <button
                          onClick={() => onClaimMilestone(item.id, item.reward)}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold shadow-md shadow-emerald-500/30 hover:scale-105 transition-transform cursor-pointer"
                        >
                          Claim ${item.reward.toFixed(2)}
                        </button>
                      ) : (
                        <span className="text-[11px] font-mono text-neutral-400">
                          {item.progressPercent}%
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Withdraw */}
        {activeTab === 'withdraw' && (
          <form onSubmit={handleWithdrawSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto max-h-[60vh]">
            {withdrawStatus && (
              <div
                className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-xs ${
                  withdrawStatus.success
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-red-500/15 border-red-500/40 text-red-300'
                }`}
              >
                {withdrawStatus.success ? (
                  <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                )}
                <span>{withdrawStatus.msg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-2">
                Select Payout Method:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'paypal', label: 'PayPal Instant', icon: CreditCard },
                  { id: 'giftcard', label: 'Amazon Card', icon: Gift },
                  { id: 'crypto', label: 'USDC Crypto', icon: Coins },
                  { id: 'vip', label: 'VIP Cinema Pass', icon: Sparkles },
                ].map(m => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setWithdrawMethod(m.id as any)}
                      className={`p-3 rounded-xl border text-center transition-colors cursor-pointer ${
                        withdrawMethod === m.id
                          ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:bg-neutral-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 mx-auto mb-1 text-amber-400" />
                      <div className="text-xs">{m.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Amount to Cash Out ($ USD):
              </label>
              <div className="flex gap-2 mb-2">
                {[5, 10, 20, 50].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setWithdrawAmount(amt)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-mono font-bold transition-colors cursor-pointer ${
                      withdrawAmount === amt
                        ? 'border-amber-400 bg-amber-500 text-black'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min={1}
                max={wallet.balanceUsd}
                step={0.5}
                value={withdrawAmount}
                onChange={e => setWithdrawAmount(parseFloat(e.target.value) || 0)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Destination Address / Email:
              </label>
              <input
                type="text"
                value={targetAccount}
                onChange={e => setTargetAccount(e.target.value)}
                placeholder="PayPal email or wallet address..."
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              disabled={withdrawAmount > wallet.balanceUsd || wallet.balanceUsd <= 0}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <DollarSign className="w-4 h-4" />
              <span>Confirm Instant Withdrawal of ${withdrawAmount.toFixed(2)}</span>
            </button>
          </form>
        )}

        {/* Tab 3: History */}
        {activeTab === 'history' && (
          <div className="p-5 sm:p-6 space-y-2.5 overflow-y-auto max-h-[60vh]">
            {wallet.transactions.map(tx => (
              <div
                key={tx.id}
                className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{tx.title}</div>
                  <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                    {tx.timestamp} • Status: {tx.status}
                  </div>
                </div>

                <div className={`font-bold font-mono ${tx.type === 'withdraw' ? 'text-neutral-400' : 'text-emerald-400'}`}>
                  {tx.type === 'withdraw' ? `-$${tx.amountUsd.toFixed(2)}` : `+$${tx.amountUsd.toFixed(2)}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
