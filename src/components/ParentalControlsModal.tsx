import React, { useState } from 'react';
import { Shield, Lock, Unlock, Clock, AlertTriangle, Check, X, User } from 'lucide-react';
import { MaturityRating, Profile } from '../types/media';
import { MATURITY_DESCRIPTIONS, MATURITY_RANK_MAP, verifyPin } from '../utils/parentalFilter';

interface ParentalControlsModalProps {
  activeProfile: Profile;
  profiles: Profile[];
  onUpdateProfile: (updatedProfile: Profile) => void;
  onClose: () => void;
}

const RATINGS_ORDER: MaturityRating[] = ['G', 'PG', 'PG-13', 'R', 'TV-MA', 'NC-17'];

export const ParentalControlsModal: React.FC<ParentalControlsModalProps> = ({
  activeProfile,
  profiles,
  onUpdateProfile,
  onClose
}) => {
  const [selectedProfileId, setSelectedProfileId] = useState(activeProfile.id);
  const profileToEdit = profiles.find(p => p.id === selectedProfileId) || activeProfile;

  const [pinUnlocked, setPinUnlocked] = useState(!profileToEdit.pinProtected);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  // Editable settings
  const [maxRating, setMaxRating] = useState<MaturityRating>(profileToEdit.maxRating);
  const [isKids, setIsKids] = useState(profileToEdit.isKids);
  const [pinProtected, setPinProtected] = useState(profileToEdit.pinProtected);
  const [newPin, setNewPin] = useState(profileToEdit.pinCode || '1234');
  const [bedtimeHour, setBedtimeHour] = useState(profileToEdit.bedtimeHour ?? 21);
  const [bedtimeMinute, setBedtimeMinute] = useState(profileToEdit.bedtimeMinute ?? 0);
  const [dailyLimit, setDailyLimit] = useState(profileToEdit.dailyTimeLimitMinutes ?? 120);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleUnlockPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyPin(pinInput, profileToEdit.pinCode)) {
      setPinUnlocked(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSaveSettings = () => {
    const updated: Profile = {
      ...profileToEdit,
      isKids,
      maxRating: isKids ? 'TV-Y7' : maxRating,
      pinProtected,
      pinCode: newPin,
      bedtimeHour,
      bedtimeMinute,
      dailyTimeLimitMinutes: dailyLimit
    };

    onUpdateProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Parental Controls &amp; Family Safety</h3>
              <p className="text-xs text-neutral-400">Manage maturity ceilings, curfew limits, and profile PINs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close parental controls"
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Tabs */}
        <div className="flex border-b border-neutral-800 px-5 pt-3 gap-2 bg-neutral-950/60 overflow-x-auto">
          {profiles.map(p => (
            <button
              key={p.id}
              onClick={() => {
                setSelectedProfileId(p.id);
                setPinUnlocked(!p.pinProtected);
                setMaxRating(p.maxRating);
                setIsKids(p.isKids);
                setPinProtected(p.pinProtected);
                setNewPin(p.pinCode || '1234');
                setBedtimeHour(p.bedtimeHour ?? 21);
                setBedtimeMinute(p.bedtimeMinute ?? 0);
              }}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                p.id === selectedProfileId
                  ? 'border-emerald-500 text-emerald-300 bg-neutral-900'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <img src={p.avatar} alt={p.name} className="w-5 h-5 rounded-full object-cover" />
              <span>{p.name}</span>
              {p.pinProtected && <Lock className="w-3 h-3 text-amber-400" />}
            </button>
          ))}
        </div>

        {/* PIN Gate if locked */}
        {!pinUnlocked ? (
          <form onSubmit={handleUnlockPin} className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Security PIN Required</h4>
              <p className="text-xs text-neutral-400 mt-1">
                Enter the 4-digit PIN for {profileToEdit.name} to modify parental safety rules.
              </p>
            </div>

            <div className="max-w-xs mx-auto">
              <input
                type="password"
                maxLength={4}
                autoFocus
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                placeholder="4-digit PIN (default: 1234)"
                className="w-full text-center tracking-widest text-lg font-mono py-2 rounded-lg bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
              />
              {pinError && (
                <p className="text-xs text-red-400 mt-1 font-medium">Incorrect PIN. Please try again.</p>
              )}
            </div>

            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-colors cursor-pointer"
            >
              Unlock Settings
            </button>
          </form>
        ) : (
          /* Controls Content */
          <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
            {/* Kids Mode Toggle */}
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Kids-Safe Dedicated Experience</div>
                <div className="text-[11px] text-neutral-400">
                  Restricts all catalog content to TV-Y, TV-Y7, and G rated animations and family titles.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isKids}
                  onChange={e => setIsKids(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
              </label>
            </div>

            {/* Maximum Allowed Maturity Rating */}
            {!isKids && (
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Maximum Maturity Rating Ceiling:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 mb-2">
                  {RATINGS_ORDER.map(rating => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setMaxRating(rating)}
                      className={`py-2 px-1 text-center rounded-lg border text-xs font-mono font-bold transition-colors cursor-pointer ${
                        maxRating === rating
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:bg-neutral-800'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-neutral-400 italic">
                  {MATURITY_DESCRIPTIONS[maxRating]}
                </p>
              </div>
            )}

            {/* Bedtime Curfew & Screen Time */}
            <div className="space-y-3 pt-2 border-t border-neutral-800">
              <div className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Viewing Time &amp; Bedtime Curfew</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
                  <div className="text-xs font-semibold text-white mb-1">Evening Bedtime Curfew</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      max={23}
                      value={bedtimeHour}
                      onChange={e => setBedtimeHour(parseInt(e.target.value) || 0)}
                      className="w-16 bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs text-white text-center font-mono"
                    />
                    <span className="text-neutral-400">:</span>
                    <input
                      type="number"
                      min={0}
                      max={59}
                      step={15}
                      value={bedtimeMinute}
                      onChange={e => setBedtimeMinute(parseInt(e.target.value) || 0)}
                      className="w-16 bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs text-white text-center font-mono"
                    />
                    <span className="text-xs text-neutral-400">hrs (24h)</span>
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-1">
                    Streaming will show a bedtime reminder banner during curfew hours.
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800">
                  <div className="text-xs font-semibold text-white mb-1">Daily Limit (Minutes)</div>
                  <input
                    type="range"
                    min={30}
                    max={360}
                    step={15}
                    value={dailyLimit}
                    onChange={e => setDailyLimit(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <div className="text-[11px] text-emerald-400 font-mono mt-1">
                    {Math.floor(dailyLimit / 60)}h {dailyLimit % 60}m per day
                  </div>
                </div>
              </div>
            </div>

            {/* Profile PIN Protection */}
            <div className="pt-2 border-t border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-xs font-bold text-white">Require 4-Digit Profile PIN</div>
                  <div className="text-[11px] text-neutral-400">
                    Prevents other family members from accessing this profile.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pinProtected}
                    onChange={e => setPinProtected(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
                </label>
              </div>

              {pinProtected && (
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-neutral-400">PIN Code:</span>
                  <input
                    type="text"
                    maxLength={4}
                    value={newPin}
                    onChange={e => setNewPin(e.target.value)}
                    className="w-24 bg-neutral-950 border border-neutral-700 rounded px-2.5 py-1 text-xs text-center font-mono text-white tracking-widest"
                  />
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="pt-3">
              <button
                onClick={handleSaveSettings}
                className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                {savedSuccess ? <Check className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                <span>{savedSuccess ? 'Parental Settings Updated!' : 'Apply Parental Controls'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
