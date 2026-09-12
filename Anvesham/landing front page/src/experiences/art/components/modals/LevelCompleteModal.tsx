import React, { useEffect } from 'react';
import { CraftRegion, PlayerProfile } from '../../types';
import { sound } from '../../utils/soundEngine';
import confetti from 'canvas-confetti';
import { Trophy, Award, Map, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LevelCompleteModalProps {
  region: CraftRegion;
  profile: PlayerProfile;
  nextRegionName?: string;
  onContinueJourney: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  region,
  profile,
  nextRegionName = 'Warli Folk Art (Maharashtra)',
  onContinueJourney,
}) => {
  useEffect(() => {
    sound.playLevelVictory();
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#f59e0b', '#dc2626', '#10b981', '#3b82f6', '#ec4899'],
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 border-2 border-amber-500/70 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative glow-heritage text-center animate-in zoom-in-95 duration-300">
        {/* Celebration Trophy Icon */}
        <div className="w-20 h-20 rounded-3xl mx-auto mb-4 bg-gradient-to-tr from-amber-600 to-yellow-400 flex items-center justify-center text-4xl shadow-xl border-2 border-yellow-200">
          🏆
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-1">
          🎉 LEVEL COMPLETE
        </span>

        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-amber-200 mb-1">
          {region.craftName} Master
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 mb-6">
          You preserved and mastered the sacred heritage of {region.state}!
        </p>

        {/* Quest Summary Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-stone-800/80 border border-amber-500/20 rounded-2xl p-3 text-left">
            <span className="text-[11px] text-stone-400 block">Total XP Earned</span>
            <span className="text-lg font-extrabold text-amber-400">+{region.xpReward} XP</span>
          </div>

          <div className="bg-stone-800/80 border border-amber-500/20 rounded-2xl p-3 text-left">
            <span className="text-[11px] text-stone-400 block">Artifacts Collected</span>
            <span className="text-lg font-extrabold text-emerald-400">
              {region.artifacts.length} / {region.artifacts.length} Relics
            </span>
          </div>

          <div className="bg-stone-800/80 border border-amber-500/20 rounded-2xl p-3 text-left">
            <span className="text-[11px] text-stone-400 block">Painting Created</span>
            <span className="text-lg font-extrabold text-amber-200">1 Sacred Canvas</span>
          </div>

          <div className="bg-stone-800/80 border border-amber-500/20 rounded-2xl p-3 text-left">
            <span className="text-[11px] text-stone-400 block">Pattern Puzzle</span>
            <span className="text-lg font-extrabold text-teal-400">100% Solved</span>
          </div>
        </div>

        {/* Unlocked Rewards List */}
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 mb-6 text-left space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
            Rewards Unlocked:
          </span>
          <div className="flex items-center gap-2 text-xs text-amber-100">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>🏆 <strong>{region.craftName} Master Badge</strong> added to Trophy Hall</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-amber-100">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>🎨 <strong>Artist Explorer Rank +1</strong> (Level {profile.level + 1})</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-amber-100">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>🗺️ <strong>Next Region Unlocked:</strong> {nextRegionName}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            sound.playClick();
            onContinueJourney();
          }}
          className="w-full py-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-base rounded-2xl shadow-xl shadow-orange-950/60 border border-amber-400/50 flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98 glow-heritage"
        >
          <span>CONTINUE JOURNEY</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
