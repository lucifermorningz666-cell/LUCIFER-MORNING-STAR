import React from 'react';
import { Eye, Headphones, Subtitles, Volume2, X, Check, Keyboard, Sliders } from 'lucide-react';
import { Profile } from '../types/media';

interface AccessibilityModalProps {
  activeProfile: Profile;
  onUpdatePreferences: (updatedPrefs: Partial<Profile['preferences']>) => void;
  onClose: () => void;
  highContrastMode: boolean;
  onToggleHighContrast: () => void;
}

export const AccessibilityModal: React.FC<AccessibilityModalProps> = ({
  activeProfile,
  onUpdatePreferences,
  onClose,
  highContrastMode,
  onToggleHighContrast
}) => {
  const prefs = activeProfile.preferences;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Accessibility &amp; Assistive Features</h3>
              <p className="text-xs text-neutral-400">Customized visual, auditory, and cognitive viewing preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close accessibility settings"
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Visual Impairment Suite */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              <span>Vision &amp; Display Contrast</span>
            </h4>

            {/* High Contrast Mode Toggle */}
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">High Contrast UI Palette</div>
                <div className="text-[11px] text-neutral-400">
                  Amplifies borders, text luminescence, and distinct focus rings for low vision users.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={highContrastMode}
                  onChange={onToggleHighContrast}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
              </label>
            </div>

            {/* Audio Description Default */}
            <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">Default to Audio Description (AD) Track</div>
                <div className="text-[11px] text-neutral-400">
                  Automatically enables vocalized descriptions of facial expressions, costumes, and scene actions.
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={prefs.audioDescriptionDefault}
                  onChange={e => onUpdatePreferences({ audioDescriptionDefault: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
              </label>
            </div>
          </div>

          {/* Hearing & Subtitles Suite */}
          <div className="space-y-3 pt-3 border-t border-neutral-800">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Subtitles className="w-4 h-4" />
              <span>Hearing &amp; Closed Captions Customizer</span>
            </h4>

            {/* Subtitle Font Size */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Caption Font Scale:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'small', label: 'Small' },
                  { id: 'medium', label: 'Medium' },
                  { id: 'large', label: 'Large' },
                  { id: 'xlarge', label: 'Extra Large' },
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => onUpdatePreferences({ subtitleSize: s.id as any })}
                    className={`py-2 rounded-lg border text-xs font-medium text-center transition-colors cursor-pointer ${
                      prefs.subtitleSize === s.id
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:bg-neutral-800'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtitle Contrast Color */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Caption Color Contrast:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'yellow', label: 'High Contrast Yellow', preview: 'text-yellow-300' },
                  { id: 'white', label: 'Classic White', preview: 'text-white' },
                  { id: 'cyan', label: 'Luminous Cyan', preview: 'text-cyan-300' },
                ].map(c => (
                  <button
                    key={c.id}
                    onClick={() => onUpdatePreferences({ subtitleContrast: c.id as any })}
                    className={`py-2 px-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                      prefs.subtitleContrast === c.id
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:bg-neutral-800'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full bg-current ${c.preview}`} />
                    <span>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts Reference */}
          <div className="pt-3 border-t border-neutral-800">
            <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
              <Keyboard className="w-4 h-4 text-neutral-400" />
              <span>Full Keyboard Navigation Shortcuts</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <span className="text-neutral-400">Play / Pause</span>
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] font-mono text-white">Space</kbd>
              </div>
              <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <span className="text-neutral-400">Captions</span>
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] font-mono text-white">C</kbd>
              </div>
              <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <span className="text-neutral-400">Fullscreen</span>
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] font-mono text-white">F</kbd>
              </div>
              <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <span className="text-neutral-400">Mute Audio</span>
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] font-mono text-white">M</kbd>
              </div>
              <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <span className="text-neutral-400">Rewind 10s</span>
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] font-mono text-white">← Left</kbd>
              </div>
              <div className="p-2 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                <span className="text-neutral-400">Forward 10s</span>
                <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] font-mono text-white">→ Right</kbd>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
