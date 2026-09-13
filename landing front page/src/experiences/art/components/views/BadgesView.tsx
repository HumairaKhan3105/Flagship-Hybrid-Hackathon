import React from 'react';
import { ALL_BADGES } from '../../data/craftsData';
import { sound } from '../../utils/soundEngine';
import { ChevronLeft, Trophy, CheckCircle2, Lock, Award, Sparkles } from 'lucide-react';

interface BadgesViewProps {
  unlockedBadgeIds: string[];
  onBack: () => void;
}

export const BadgesView: React.FC<BadgesViewProps> = ({
  unlockedBadgeIds,
  onBack,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col bg-stone-950 text-amber-50 select-none overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-stone-900 border-b border-amber-500/30 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/20 transition-all active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-amber-400 flex items-center gap-2">
              <Trophy size={20} />
              <span>Hall of Heritage Badges</span>
            </h2>
            <p className="text-xs text-stone-400">
              Honors awarded for artistic excellence, cultural discovery, and craftsmanship
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800 border border-amber-500/20 text-xs font-semibold text-amber-300">
          <Award size={14} className="text-yellow-400" />
          <span>
            {unlockedBadgeIds.length} / {ALL_BADGES.length} Badges Unlocked
          </span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="p-6 max-w-5xl mx-auto w-full flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id);

            return (
              <div
                key={badge.id}
                className={`rounded-3xl p-6 border-2 transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-gradient-to-b from-stone-900 to-amber-950/40 border-amber-400 shadow-xl glow-heritage scale-102'
                    : 'bg-stone-900/40 border-stone-800 opacity-65'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl border-2 ${
                        isUnlocked
                          ? 'bg-amber-950/70 border-amber-400 shadow-lg'
                          : 'bg-stone-800 border-stone-700'
                      }`}
                    >
                      {badge.icon}
                    </div>

                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 ${
                        isUnlocked
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {isUnlocked ? <CheckCircle2 size={12} /> : <Lock size={12} />}
                      {isUnlocked ? 'Earned' : 'Locked'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold font-heading text-amber-100 mb-1">
                    {badge.name}
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed mb-4">
                    {badge.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-800 text-[11px]">
                  <span className="text-stone-400 block mb-0.5">Requirement:</span>
                  <span className="text-amber-300 font-medium">
                    {badge.requirement}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
