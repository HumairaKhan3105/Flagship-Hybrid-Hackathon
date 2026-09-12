import React from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Sparkles, 
  Compass, 
  MapPin, 
  Star, 
  CheckCircle2, 
  ArrowRight,
  Flame,
  Award,
  BookOpen,
  Volume2
} from 'lucide-react';
import { GameCategory, UserProgress } from '../types';
import { CATEGORIES } from '../data/categories';
import { CHARACTERS } from '../data/characters';
import { soundEngine } from '../utils/audio';

interface HomeScreenProps {
  progress: UserProgress;
  onSelectCategory: (category: GameCategory) => void;
  onStartAdventure: () => void;
  onOpenDaily: () => void;
  onNavigate: (screen: 'home' | 'map' | 'badges' | 'facts' | 'leaderboard' | 'profile') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  progress,
  onSelectCategory,
  onStartAdventure,
  onOpenDaily,
  onNavigate,
}) => {
  // Companion character based on progress
  const companion = CHARACTERS.find((c) => c.id === 'kedar') || CHARACTERS[0];

  // Calculate total stars collected
  const totalStars = Object.values(progress.categoryProgress || {}).reduce(
    (acc: number, cat: any) => acc + (cat?.starsEarned || 0),
    0
  );

  // Calculate total levels completed
  const totalCompleted = Object.values(progress.categoryProgress || {}).reduce(
    (acc: number, cat: any) => acc + (cat?.completedLevels?.length || 0),
    0
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-10">
      {/* Hero Welcome Banner with Royal Natural Earth & Gold Frame */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#5D4037] border-4 border-[#D4AF37] p-5 sm:p-8 shadow-2xl overflow-hidden text-[#FDF5E6]">
        {/* Decorative corner mandalas */}
        <div className="absolute -top-12 -left-12 w-32 h-32 rounded-full border-4 border-[#D4AF37]/20 bg-[#D4AF37]/5 pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-36 h-36 rounded-full border-4 border-[#D4AF37]/20 bg-[#D4AF37]/5 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Hero Left: Text & Pitch */}
          <div className="text-center lg:text-left space-y-3 sm:space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#4A3728] border-2 border-[#D4AF37] text-[#D4AF37] text-xs sm:text-sm font-bold uppercase tracking-wider shadow">
              <span>✨</span>
              <span>An Illustrated Indian Heritage Adventure</span>
              <span>✨</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl text-[#FDF5E6] font-black italic tracking-tight drop-shadow-md leading-tight">
              CULTURE DETECTIVE
            </h1>
            <p className="text-[#D4AF37] text-sm sm:text-lg font-bold uppercase tracking-wider">
              Discover India Through 300+ Playable Mysteries & Cultural Challenges
            </p>

            <p className="text-[#FDF5E6]/90 text-xs sm:text-sm leading-relaxed max-w-xl">
              From the vibrant fires of Lohri and Kanchipuram bridal silks to the royal Nizami biryanis, temple veenas, and centuries-old stepwells—test your wit and earn the title of <strong className="text-[#D4AF37] font-black">Grand Cultural Detective of India</strong>!
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <button
                id="hero-play-adventure-btn"
                onClick={() => {
                  soundEngine.playLevelStart();
                  onStartAdventure();
                }}
                className="bg-[#2E7D32] hover:bg-[#388E3C] border-2 border-[#8BC34A] text-white px-6 sm:px-8 py-3 rounded-xl font-black text-base sm:text-lg flex items-center gap-2.5 shadow-xl hover:scale-105 active:scale-95 transition-transform uppercase tracking-wider"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>PLAY ADVENTURE</span>
              </button>

              <button
                id="hero-daily-challenge-btn"
                onClick={() => {
                  soundEngine.playClick();
                  onOpenDaily();
                }}
                className="bg-[#D4AF37] hover:bg-[#B8962D] text-[#5D4037] border-2 border-white/60 px-5 sm:px-6 py-3 rounded-xl font-black text-sm sm:text-base flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-transform uppercase tracking-wider"
              >
                <Sparkles className="w-4 h-4 text-[#5D4037]" />
                <span>Daily Case</span>
              </button>

              <button
                id="hero-view-map-btn"
                onClick={() => {
                  soundEngine.playClick();
                  onNavigate('map');
                }}
                className="px-4 py-3 rounded-xl bg-[#4A3728] hover:bg-[#382618] border-2 border-[#D4AF37] text-[#FDF5E6] font-bold text-sm flex items-center gap-2 transition-colors uppercase tracking-wider shadow"
              >
                <Compass className="w-4 h-4 text-[#D4AF37]" />
                <span>Expedition Map</span>
              </button>
            </div>
          </div>

          {/* Hero Right: Detective Companion & Quick Stats Card in Natural Tones */}
          <div className="w-full lg:w-auto flex flex-col items-center">
            <div className="relative bg-white border-2 border-[#5D4037] p-4 sm:p-5 rounded-2xl w-full max-w-sm shadow-2xl text-[#4A3728]">
              {/* Character speech bubble */}
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FF9933] border-4 border-white shadow-lg flex items-center justify-center text-3xl">
                    {companion.avatar}
                  </div>
                  <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded bg-[#5D4037] text-[#FDF5E6] text-[10px] font-black uppercase">
                    Guide
                  </span>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-[#5D4037] text-sm uppercase">{companion.name}</span>
                    <span className="text-[10px] text-[#8D6E63] font-bold uppercase tracking-widest">{companion.state}</span>
                  </div>
                  <p className="text-xs leading-relaxed font-bold italic text-[#4A3728] mt-1">
                    "{companion.greeting}"
                  </p>
                </div>
              </div>

              {/* Detective Stats Summary */}
              <div className="mt-4 pt-3 border-t border-stone-200 grid grid-cols-3 gap-2 text-center">
                <div className="bg-[#FDF5E6] p-2 rounded-xl border border-[#8D6E63]/30">
                  <div className="flex items-center justify-center gap-1 text-[#5D4037] font-black text-sm sm:text-base">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span>{totalStars}</span>
                  </div>
                  <span className="text-[10px] text-[#8D6E63] font-bold uppercase">Total Stars</span>
                </div>

                <div className="bg-[#FDF5E6] p-2 rounded-xl border border-[#8D6E63]/30">
                  <div className="flex items-center justify-center gap-1 text-[#2E7D32] font-black text-sm sm:text-base">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2E7D32]" />
                    <span>{totalCompleted}/300</span>
                  </div>
                  <span className="text-[10px] text-[#8D6E63] font-bold uppercase">Solved</span>
                </div>

                <div className="bg-[#FDF5E6] p-2 rounded-xl border border-[#8D6E63]/30">
                  <div className="flex items-center justify-center gap-1 text-[#FF9933] font-black text-sm sm:text-base">
                    <Flame className="w-3.5 h-3.5 text-[#FF9933] fill-[#FF9933]" />
                    <span>{progress.streak}d</span>
                  </div>
                  <span className="text-[10px] text-[#8D6E63] font-bold uppercase">Day Streak</span>
                </div>
              </div>

              {/* XP Rank Progress bar */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#5D4037] mb-1 uppercase tracking-wider">
                  <span>Level {progress.level}: {progress.rankTitle}</span>
                  <span>{progress.xp} XP</span>
                </div>
                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200">
                  <div
                    className="h-full bg-[#8BC34A] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (progress.xp % 500) / 5)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Game Categories Grid - Styled as Select Mission in Natural Tones */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-[#5D4037] border-b-4 border-[#D4AF37] inline-block pr-6 pb-1">
              Select Mission
            </h3>
            <p className="text-xs sm:text-sm text-[#8D6E63] font-bold mt-1 uppercase tracking-wider">
              6 thematic trails, 50 levels each with interactive detective puzzles
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="view-map-trail-btn"
              onClick={() => {
                soundEngine.playClick();
                onNavigate('map');
              }}
              className="bg-[#FDF5E6] border-2 border-[#5D4037] px-4 py-1.5 rounded-full text-xs font-bold text-[#5D4037] hover:bg-[#5D4037] hover:text-white transition-colors uppercase tracking-wider shadow-sm"
            >
              Maps View
            </button>
            <button
              id="view-all-medals-btn"
              onClick={() => {
                soundEngine.playClick();
                onNavigate('badges');
              }}
              className="bg-[#5D4037] text-[#FDF5E6] border-2 border-[#5D4037] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
            >
              <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Medals</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {CATEGORIES.map((cat) => {
            const catProgress = progress.categoryProgress[cat.id] || {
              currentLevel: 1,
              completedLevels: [],
              starsEarned: 0,
            };
            const completedCount = catProgress.completedLevels?.length || 0;
            const progressPercent = Math.round((completedCount / cat.totalLevels) * 100);

            // Category accent themes
            const bgBadgeColor = 
              cat.id === 'festivals' ? 'bg-orange-100 border-orange-200' :
              cat.id === 'food' ? 'bg-green-100 border-green-200' :
              cat.id === 'clothes' ? 'bg-amber-100 border-amber-200' :
              cat.id === 'instruments' ? 'bg-purple-100 border-purple-200' :
              cat.id === 'art' ? 'bg-yellow-100 border-yellow-200' :
              'bg-sky-100 border-sky-200';

            const barColor = 
              cat.id === 'festivals' ? 'bg-[#FF9933]' :
              cat.id === 'food' ? 'bg-[#2E7D32]' :
              cat.id === 'clothes' ? 'bg-[#D4AF37]' :
              cat.id === 'instruments' ? 'bg-[#8E24AA]' :
              cat.id === 'art' ? 'bg-[#E65100]' :
              'bg-[#0288D1]';

            return (
              <motion.div
                key={cat.id}
                whileHover={{ y: -4, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  soundEngine.playClick();
                  onSelectCategory(cat.id);
                }}
                className="bg-white border-b-8 border-r-8 border-[#5D4037] border-t-2 border-l-2 border-[#5D4037] rounded-xl p-5 flex flex-col items-center gap-3 relative hover:-translate-y-1 transition-all cursor-pointer group shadow-sm text-center"
              >
                {/* Unlock status badge in top right */}
                <div className="absolute top-3 right-3 text-lg opacity-40 group-hover:opacity-100 transition-opacity">
                  {completedCount >= cat.totalLevels ? '👑' : '🔓'}
                </div>

                {/* Main Emoji Circle Badge */}
                <div className={`w-20 h-20 ${bgBadgeColor} rounded-full flex items-center justify-center text-4xl shadow-inner border-2 group-hover:scale-105 transition-transform`}>
                  {cat.emoji}
                </div>

                {/* Title & Levels */}
                <div className="text-center w-full">
                  <div className="font-black text-[#5D4037] uppercase text-lg leading-tight">
                    {cat.name}
                  </div>
                  <div className="text-xs text-[#8D6E63] font-bold mt-0.5">
                    {completedCount} / {cat.totalLevels} Levels ({cat.hindiName})
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-stone-100 rounded-full h-3 border border-stone-200 overflow-hidden">
                  <div 
                    className={`${barColor} h-full rounded-full transition-all duration-300`} 
                    style={{ width: `${Math.max(8, progressPercent)}%` }}
                  />
                </div>

                {/* Stars Indicator */}
                <div className="flex items-center gap-1.5">
                  <span className={catProgress.starsEarned > 10 ? 'text-yellow-400 text-sm font-bold' : 'text-stone-300 text-sm font-bold'}>★</span>
                  <span className={catProgress.starsEarned > 30 ? 'text-yellow-400 text-sm font-bold' : 'text-stone-300 text-sm font-bold'}>★</span>
                  <span className={catProgress.starsEarned > 70 ? 'text-yellow-400 text-sm font-bold' : 'text-stone-300 text-sm font-bold'}>★</span>
                  <span className="text-[11px] font-bold text-[#5D4037] ml-1">
                    {catProgress.starsEarned || 0} pts
                  </span>
                </div>

                {/* Sample items pill tags */}
                <div className="flex flex-wrap items-center justify-center gap-1 pt-1">
                  {cat.sampleItems.slice(0, 3).map((item, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-[#FDF5E6] border border-[#8D6E63]/30 text-[10px] font-bold text-[#4A3728]"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                {/* Action button */}
                <div className="w-full pt-2 border-t border-stone-200 flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#5D4037]">
                  <span className="text-[#8D6E63] font-bold text-[11px]">Level {catProgress.currentLevel}</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Play Trail</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Cultural Detective Did You Know? Feature Banner in Natural Tones */}
      <div className="bg-white border-b-8 border-r-8 border-[#5D4037] border-t-2 border-l-2 border-[#5D4037] rounded-2xl p-5 sm:p-7 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5 text-[#4A3728]">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#D4AF37] border-2 border-[#5D4037] flex items-center justify-center text-3xl shrink-0 shadow-md">
            📜
          </div>
          <div>
            <span className="px-2.5 py-0.5 rounded bg-[#2E7D32] text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
              Detective Field Notes
            </span>
            <h4 className="font-heading text-lg sm:text-xl text-[#5D4037] font-black mt-1 uppercase tracking-wide">
              Did You Know?
            </h4>
            <p className="text-xs sm:text-sm text-[#4A3728] max-w-2xl leading-relaxed mt-1 font-medium">
              "Kanchipuram silk weavers in Tamil Nadu use a technique where the border and body are woven separately on different shuttles, then joined so firmly that even if the silk tears, the border joint will never separate!"
            </p>
          </div>
        </div>

        <button
          id="discoveries-btn"
          onClick={() => {
            soundEngine.playClick();
            onNavigate('facts');
          }}
          className="whitespace-nowrap px-6 py-3 rounded-xl bg-[#5D4037] hover:bg-[#4A3728] border-2 border-[#D4AF37] text-[#FDF5E6] font-black text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center gap-2 shadow hover:scale-105"
        >
          <BookOpen className="w-4 h-4 text-[#D4AF37]" />
          <span>Read Discoveries</span>
        </button>
      </div>
    </div>
  );
};
