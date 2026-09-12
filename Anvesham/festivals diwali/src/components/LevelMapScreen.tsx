import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Lock, 
  Star, 
  Trophy, 
  Sparkles, 
  Crown, 
  Compass, 
  Play,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { GameCategory, UserProgress, LevelData } from '../types';
import { CATEGORIES } from '../data/categories';
import { getLevelsForCategory } from '../data/levels';
import { CHARACTERS } from '../data/characters';
import { soundEngine } from '../utils/audio';

interface LevelMapScreenProps {
  progress: UserProgress;
  activeCategory: GameCategory;
  onSelectCategory: (cat: GameCategory) => void;
  onSelectLevel: (cat: GameCategory, levelNum: number) => void;
  onBack: () => void;
}

export const LevelMapScreen: React.FC<LevelMapScreenProps> = ({
  progress,
  activeCategory,
  onSelectCategory,
  onSelectLevel,
  onBack,
}) => {
  const categoryMeta = CATEGORIES.find((c) => c.id === activeCategory) || CATEGORIES[0];
  const levels = getLevelsForCategory(activeCategory);
  const catProgress = progress.categoryProgress[activeCategory] || {
    currentLevel: 1,
    completedLevels: [],
    starsEarned: 0,
  };

  const [selectedPreviewLevel, setSelectedPreviewLevel] = useState<LevelData | null>(null);

  // Character guide for this category
  const guideChar = CHARACTERS[activeCategory === 'festivals' ? 0 : activeCategory === 'clothes' ? 2 : activeCategory === 'food' ? 5 : activeCategory === 'instruments' ? 12 : activeCategory === 'art' ? 14 : 15];

  const handleNodeClick = (level: LevelData) => {
    const isUnlocked = level.level <= catProgress.currentLevel;
    if (isUnlocked) {
      soundEngine.playClick();
      setSelectedPreviewLevel(level);
    } else {
      soundEngine.playWrong();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6">
      {/* Top Bar: Back button & Category Quick Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <button
          id="map-back-btn"
          onClick={() => {
            soundEngine.playClick();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl wood-panel border border-amber-500/60 text-amber-200 text-xs sm:text-sm font-bold shadow hover:bg-amber-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Expedition Hub</span>
        </button>

        {/* Category Horizontal Pill Switcher in Natural Tones */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-thin">
          {CATEGORIES.map((c) => {
            const isActive = c.id === activeCategory;
            return (
              <button
                key={c.id}
                onClick={() => {
                  soundEngine.playClick();
                  onSelectCategory(c.id);
                  setSelectedPreviewLevel(null);
                }}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm ${
                  isActive
                    ? 'bg-[#D4AF37] text-[#5D4037] font-black border-2 border-[#5D4037] scale-105'
                    : 'bg-[#5D4037] text-[#FDF5E6] hover:bg-[#4A3728] border-2 border-[#5D4037]'
                }`}
              >
                <span>{c.emoji}</span>
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Banner Header in Natural Tones Tactile Card */}
      <div className="bg-white border-b-8 border-r-8 border-[#5D4037] border-t-2 border-l-2 border-[#5D4037] rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-[#4A3728]">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37] border-2 border-[#5D4037] text-white flex items-center justify-center text-3xl shadow-md shrink-0">
            {categoryMeta.emoji}
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase text-[#5D4037]">
                {categoryMeta.name} Trail
              </h1>
              <span className="px-2 py-0.5 rounded-md bg-[#2E7D32] text-white text-xs font-black uppercase shadow-sm">
                50 Levels
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#8D6E63] font-bold mt-0.5">
              {categoryMeta.tagline}
            </p>
          </div>
        </div>

        {/* Trail Progress Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-[#FDF5E6] px-3.5 py-2 rounded-xl border border-[#8D6E63]/30 text-center">
            <span className="text-xs text-[#8D6E63] font-bold uppercase block">Levels Solved</span>
            <span className="font-black text-base text-[#5D4037]">
              {catProgress.completedLevels?.length || 0} / 50
            </span>
          </div>

          <div className="bg-[#FDF5E6] px-3.5 py-2 rounded-xl border border-[#8D6E63]/30 text-center">
            <span className="text-xs text-[#8D6E63] font-bold uppercase block">Stars Earned</span>
            <div className="flex items-center justify-center gap-1 font-black text-base text-[#D4AF37]">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{catProgress.starsEarned || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Guide Companion Tip in Speech Bubble Card */}
      <div className="bg-white border-2 border-[#5D4037] rounded-xl p-3.5 sm:p-4 flex items-center gap-3 text-[#4A3728] text-xs sm:text-sm shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-[#FF9933] text-2xl flex items-center justify-center border-2 border-[#5D4037] shadow-sm shrink-0">
          {guideChar.avatar}
        </div>
        <p className="leading-snug font-medium">
          <strong className="text-[#5D4037] font-black uppercase">{guideChar.name} ({guideChar.role}):</strong> "Solve clues sequentially to unlock the cultural map of India. Every 10th level is a Grand Milestone challenge with extra coin rewards!"
        </p>
      </div>

      {/* Adventure Map Grid in Natural Tones Card */}
      <div className="relative bg-white border-b-8 border-r-8 border-[#5D4037] border-t-2 border-l-2 border-[#5D4037] rounded-3xl p-5 sm:p-8 shadow-sm">
        <div className="text-center mb-6">
          <h2 className="font-heading text-xl sm:text-2xl font-black uppercase text-[#5D4037] flex items-center justify-center gap-2">
            <span>Expedition Waypoints</span>
            <Compass className="w-5 h-5 text-[#D4AF37]" />
          </h2>
          <p className="text-xs text-[#8D6E63] font-bold mt-1">Tap any unlocked waypoint to review the case or begin investigation</p>
        </div>

        {/* 50 Levels Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2.5 sm:gap-4 justify-items-center">
          {levels.map((level) => {
            const isCompleted = catProgress.completedLevels?.includes(level.level);
            const isCurrent = level.level === catProgress.currentLevel;
            const isLocked = level.level > catProgress.currentLevel;
            const isMilestone = level.level % 10 === 0;

            return (
              <motion.button
                key={level.id}
                whileHover={!isLocked ? { scale: 1.08, y: -2 } : {}}
                whileTap={!isLocked ? { scale: 0.95 } : {}}
                onClick={() => handleNodeClick(level)}
                className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                  isCurrent
                    ? 'bg-[#2E7D32] text-white ring-4 ring-[#D4AF37] ring-offset-2 ring-offset-[#FDF5E6] shadow-xl animate-bounce border-2 border-[#1B5E20]'
                    : isCompleted
                    ? 'bg-[#D4AF37] text-[#5D4037] border-2 border-[#5D4037] font-black shadow-md'
                    : isLocked
                    ? 'bg-stone-200 text-stone-400 border border-stone-300 cursor-not-allowed opacity-70'
                    : 'bg-[#FDF5E6] text-[#5D4037] border-2 border-[#5D4037] shadow font-bold'
                }`}
                title={`Level ${level.level}: ${level.title}`}
              >
                {/* Milestone Crown indicator */}
                {isMilestone && (
                  <div className="absolute -top-2 -right-1 text-xs">
                    <Crown className="w-4 h-4 text-[#D4AF37] fill-[#FFD700] drop-shadow" />
                  </div>
                )}

                {/* Level content */}
                {isLocked ? (
                  <Lock className="w-4 h-4 text-stone-400" />
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-xs sm:text-sm font-black leading-tight">
                      {level.level}
                    </span>
                    {isCompleted ? (
                      <div className="flex items-center gap-0.5 -mt-0.5">
                        <Star className="w-2.5 h-2.5 fill-[#5D4037] text-[#5D4037]" />
                      </div>
                    ) : isCurrent ? (
                      <span className="text-[8px] font-black uppercase tracking-wider text-[#8BC34A]">
                        NOW
                      </span>
                    ) : null}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Level Preview Modal in Natural Tones */}
      {selectedPreviewLevel && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#FDF5E6] w-full max-w-md rounded-2xl p-6 border-4 border-[#5D4037] shadow-2xl space-y-4 text-[#4A3728]"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-[#2E7D32] text-white text-xs font-black uppercase shadow-sm">
                  Level {selectedPreviewLevel.level} • {categoryMeta.name}
                </span>
                <h3 className="font-heading text-xl font-black text-[#5D4037] mt-1.5 uppercase">
                  {selectedPreviewLevel.title}
                </h3>
                <p className="text-xs text-[#8D6E63] font-bold">
                  Region: {selectedPreviewLevel.region || 'India'}
                </p>
              </div>

              <button
                onClick={() => setSelectedPreviewLevel(null)}
                className="w-8 h-8 rounded-full bg-white border-2 border-[#5D4037] text-[#5D4037] font-black hover:bg-[#5D4037] hover:text-white flex items-center justify-center text-sm transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="bg-white p-3.5 rounded-xl border-2 border-[#5D4037]/20">
              <p className="text-xs text-[#4A3728] font-bold leading-relaxed">
                "{selectedPreviewLevel.question}"
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-[#8D6E63] font-bold uppercase tracking-wider">
              <span>Time: {selectedPreviewLevel.timeLimit || 30}s</span>
              <span>Reward: +100 XP, +25 🪙</span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setSelectedPreviewLevel(null)}
                className="flex-1 py-2.5 rounded-xl bg-white border-2 border-[#5D4037] text-[#5D4037] font-black uppercase text-xs hover:bg-stone-100 transition-colors"
              >
                Cancel
              </button>
              <button
                id="modal-start-investigation-btn"
                onClick={() => {
                  soundEngine.playLevelStart();
                  onSelectLevel(activeCategory, selectedPreviewLevel.level);
                  setSelectedPreviewLevel(null);
                }}
                className="flex-2 py-2.5 rounded-xl bg-[#2E7D32] hover:bg-[#388E3C] border-2 border-[#8BC34A] text-white font-black uppercase text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-transform"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Case</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
