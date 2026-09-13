import React, { useState } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  Award, 
  Lock, 
  CheckCircle2, 
  Coins, 
  Sparkles,
  Gift
} from 'lucide-react';
import { UserProgress } from '../types';
import { BADGES } from '../data/badges';
import { soundEngine } from '../utils/audio';

interface BadgesScreenProps {
  progress: UserProgress;
  onClaimBadge: (badgeId: string, xp: number, coins: number) => void;
  onBack: () => void;
}

export const BadgesScreen: React.FC<BadgesScreenProps> = ({
  progress,
  onClaimBadge,
  onBack,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const unlockedBadges = progress.unlockedBadges || [];

  const handleClaim = (badgeId: string, xp: number, coins: number) => {
    soundEngine.playCoin();
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}
    onClaimBadge(badgeId, xp, coins);
  };

  const filteredBadges = BADGES.filter((b) => {
    if (filterCategory === 'all') return true;
    return b.category === filterCategory;
  });

  const categories = [
    { id: 'all', label: 'All Medals' },
    { id: 'general', label: 'General Sleuth' },
    { id: 'festivals', label: 'Festivals' },
    { id: 'clothes', label: 'Textiles' },
    { id: 'food', label: 'Cuisine' },
    { id: 'instruments', label: 'Music' },
    { id: 'art', label: 'Art & Craft' },
    { id: 'places', label: 'Monuments' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6">
      {/* Top Bar in Natural Tones */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            soundEngine.playClick();
            onBack();
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border-2 border-[#5D4037] text-[#5D4037] text-xs sm:text-sm font-black uppercase tracking-wider shadow-sm hover:bg-[#5D4037] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Expedition Hub</span>
        </button>

        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border-2 border-[#5D4037] text-[#5D4037] text-xs sm:text-sm font-black uppercase shadow-sm">
          <Award className="w-4 h-4 text-[#D4AF37]" />
          <span>{unlockedBadges.length} / {BADGES.length} Medals Unlocked</span>
        </div>
      </div>

      {/* Header Banner in Natural Tones */}
      <div className="bg-white border-b-8 border-r-8 border-[#5D4037] border-t-2 border-l-2 border-[#5D4037] rounded-2xl p-5 sm:p-7 shadow-sm text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4 text-[#4A3728]">
        <div>
          <span className="px-2.5 py-0.5 rounded bg-[#2E7D32] text-white text-xs font-black uppercase shadow-sm">
            HALL OF DISTINCTION
          </span>
          <h1 className="font-heading text-2xl sm:text-4xl font-black uppercase text-[#5D4037] mt-1.5">
            Cultural Medals & Accolades
          </h1>
          <p className="text-xs sm:text-sm text-[#8D6E63] font-bold mt-1 max-w-xl">
            Complete milestones across the 6 cultural trails, maintain your daily investigation streak, and earn coveted detective medals with rich coin & XP bounties!
          </p>
        </div>

        <div className="w-20 h-20 rounded-2xl bg-[#D4AF37] border-2 border-[#5D4037] flex items-center justify-center text-4xl shadow-md shrink-0">
          🎖️
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              soundEngine.playClick();
              setFilterCategory(c.id);
            }}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
              filterCategory === c.id
                ? 'bg-[#D4AF37] text-[#5D4037] font-black border-2 border-[#5D4037] scale-105'
                : 'bg-[#5D4037] text-[#FDF5E6] hover:bg-[#4A3728] border-2 border-[#5D4037]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {filteredBadges.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id);

          return (
            <motion.div
              key={badge.id}
              whileHover={{ y: -3 }}
              className={`bg-white rounded-xl p-5 border-b-6 border-r-6 border-t-2 border-l-2 border-[#5D4037] transition-all flex flex-col justify-between shadow-sm ${
                isUnlocked
                  ? 'opacity-100'
                  : 'opacity-65 grayscale bg-stone-100'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-[#FDF5E6] border-2 border-[#5D4037] flex items-center justify-center text-3xl shadow-sm">
                    {badge.icon}
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      isUnlocked
                        ? 'bg-[#2E7D32] text-white shadow-sm'
                        : 'bg-stone-200 text-stone-600 border border-stone-300'
                    }`}
                  >
                    {isUnlocked ? 'Unlocked' : 'Locked'}
                  </span>
                </div>

                <h3 className="font-heading text-base font-black uppercase text-[#5D4037] mt-3">
                  {badge.title || badge.name}
                </h3>
                <p className="text-xs text-[#8D6E63] font-bold mt-1 leading-snug">
                  {badge.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-xs font-black uppercase">
                <div className="flex items-center gap-1 text-[#D4AF37]">
                  <Coins className="w-4 h-4 fill-yellow-400" />
                  <span>+{badge.rewardCoins || (badge.reqValue ? badge.reqValue * 5 : 50)}</span>
                </div>

                <span className="text-[#5D4037]">
                  +{badge.rewardXp || (badge.reqValue ? badge.reqValue * 10 : 100)} XP
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
