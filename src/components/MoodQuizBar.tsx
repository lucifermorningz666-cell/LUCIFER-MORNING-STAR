import React from 'react';
import { Flame, Compass, Moon, Coffee, Sparkles } from 'lucide-react';

interface MoodQuizBarProps {
  currentMood: string;
  onSelectMood: (mood: string) => void;
  activeProfileName?: string;
}

const MOODS = [
  { id: 'All', label: 'All Vibes', icon: Sparkles, desc: 'Complete curated collection' },
  { id: 'Adrenaline Surge', label: 'Adrenaline Surge', icon: Flame, desc: 'High-octane action & sci-fi thrillers' },
  { id: 'Cerebral Mystery', label: 'Cerebral Mystery', icon: Compass, desc: 'Mind-bending plots & neo-noir' },
  { id: 'Late Night Nostalgia', label: 'Late Night Nostalgia', icon: Moon, desc: 'Atmospheric drama & vintage vibes' },
  { id: 'Cozy Comfort', label: 'Cozy Comfort', icon: Coffee, desc: 'Heartwarming drama & serene cinema' },
  { id: 'Family Adventure', label: 'Family Adventure', icon: Sparkles, desc: 'Wholesome journeys for all ages' },
];

export const MoodQuizBar: React.FC<MoodQuizBarProps> = ({
  currentMood,
  onSelectMood,
  activeProfileName,
}) => {
  return (
    <div className="w-full bg-neutral-900/60 border-y border-neutral-800/80 backdrop-blur-md px-4 sm:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-medium tracking-wide text-neutral-400 uppercase">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Mood Resonance Engine {activeProfileName ? `• ${activeProfileName}` : ''}</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          {MOODS.map(m => {
            const Icon = m.icon;
            const isSelected = currentMood === m.id;
            return (
              <button
                key={m.id}
                onClick={() => onSelectMood(m.id)}
                aria-pressed={isSelected}
                title={m.desc}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-black font-semibold shadow-lg shadow-amber-500/20'
                    : 'bg-neutral-800/80 text-neutral-300 hover:bg-neutral-700 hover:text-white border border-neutral-700/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-amber-400'}`} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
