import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Star, 
  Coins, 
  Flame, 
  Award, 
  Compass, 
  CheckCircle2, 
  Sparkles,
  Users
} from 'lucide-react';
import { UserProgress } from '../types';
import { CHARACTERS } from '../data/characters';
import { DETECTIVE_RANKS } from '../utils/storage';
import { CATEGORIES } from '../data/categories';
import { soundEngine } from '../utils/audio';

interface ProfileScreenProps {
  progress: UserProgress;
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ progress, onBack }) => {
  const [selectedChar, setSelectedChar] = useState(CHARACTERS[0]);
  const [filterRegion, setFilterRegion] = useState<string>('all');

  const totalStars = Object.values(progress.categoryProgress || {}).reduce(
    (acc: number, cat: any) => acc + (cat?.starsEarned || 0),
    0
  );

  const totalSolved = Object.values(progress.categoryProgress || {}).reduce(
    (acc: number, cat: any) => acc + (cat?.completedLevels?.length || 0),
    0
  );

  const currentRankIndex = DETECTIVE_RANKS.findIndex((r) => r.title === progress.rankTitle);
  const nextRank = DETECTIVE_RANKS[currentRankIndex + 1] || null;

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Back button */}
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

      {/* Detective ID Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border-b-8 border-r-8 border-[#5D4037] border-t-2 border-l-2 border-[#5D4037] shadow-sm relative overflow-hidden text-[#4A3728]">
        <div className="absolute top-3 right-4 px-3 py-1 rounded-full bg-[#FDF5E6] border border-[#5D4037] text-[#5D4037] text-[10px] sm:text-xs font-black uppercase tracking-wider">
          Cultural Dossier #IND-2026
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pt-2">
          {/* Avatar Photo Frame */}
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-[#FDF5E6] border-4 border-[#5D4037] flex items-center justify-center text-6xl shadow-md">
              🕵️
            </div>
            <span className="mt-2 px-3 py-1 rounded-full bg-[#2E7D32] text-white text-xs font-black uppercase shadow-sm">
              Active Sleuth
            </span>
          </div>

          {/* Dossier Information */}
          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h1 className="font-heading text-2xl sm:text-3xl font-black uppercase text-[#5D4037]">
                Detective of Bharat
              </h1>
              <span className="px-2.5 py-0.5 rounded-lg bg-[#D4AF37] text-[#5D4037] text-xs font-black uppercase border border-[#5D4037] inline-block w-fit mx-auto md:mx-0">
                Rank Level {progress.level}
              </span>
            </div>

            <p className="font-subheading text-base sm:text-lg font-bold text-[#8D6E63]">
              {progress.rankTitle}
            </p>

            {/* Quick Metrics */}
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-center">
              <div className="bg-[#FDF5E6] p-2.5 rounded-xl border border-[#5D4037]/20 shadow-sm">
                <span className="text-[10px] text-[#8D6E63] font-bold uppercase block">Total XP</span>
                <span className="font-black text-base text-[#5D4037]">{progress.xp}</span>
              </div>
              <div className="bg-[#FDF5E6] p-2.5 rounded-xl border border-[#5D4037]/20 shadow-sm">
                <span className="text-[10px] text-[#8D6E63] font-bold uppercase block">Cultural Coins</span>
                <span className="font-black text-base text-[#D4AF37]">{progress.coins}</span>
              </div>
              <div className="bg-[#FDF5E6] p-2.5 rounded-xl border border-[#5D4037]/20 shadow-sm">
                <span className="text-[10px] text-[#8D6E63] font-bold uppercase block">Stars Collected</span>
                <span className="font-black text-base text-[#D4AF37]">{totalStars}</span>
              </div>
              <div className="bg-[#FDF5E6] p-2.5 rounded-xl border border-[#5D4037]/20 shadow-sm">
                <span className="text-[10px] text-[#8D6E63] font-bold uppercase block">Cases Solved</span>
                <span className="font-black text-base text-[#2E7D32]">{totalSolved}/300</span>
              </div>
            </div>

            {/* Rank Progression */}
            {nextRank && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs text-[#5D4037] font-black uppercase mb-1">
                  <span>Next Rank: {nextRank.title}</span>
                  <span>{progress.xp} / {nextRank.minXp} XP</span>
                </div>
                <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden border border-stone-300">
                  <div
                    className="h-full bg-[#D4AF37] rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round((progress.xp / nextRank.minXp) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Mastery Breakdown */}
      <div className="space-y-3">
        <h2 className="font-heading text-xl sm:text-2xl font-black uppercase text-[#5D4037]">
          Field Operations Across 6 Cultural Trails
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {CATEGORIES.map((c) => {
            const cat = progress.categoryProgress[c.id] || {
              currentLevel: 1,
              completedLevels: [],
              starsEarned: 0,
            };
            const solved = cat.completedLevels?.length || 0;
            const pct = Math.round((solved / c.totalLevels) * 100);

            return (
              <div
                key={c.id}
                className="bg-white rounded-xl p-4 border-b-6 border-r-6 border-t-2 border-l-2 border-[#5D4037] shadow-sm space-y-2 text-[#4A3728]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{c.emoji}</span>
                    <span className="font-black uppercase text-[#5D4037] text-sm">{c.name}</span>
                  </div>
                  <span className="text-xs font-black text-[#8D6E63]">{solved}/50</span>
                </div>

                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2E7D32] rounded-full"
                    style={{ width: `${Math.max(4, pct)}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#8D6E63] font-bold pt-1">
                  <span>{pct}% Complete</span>
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-500" />
                    <span>{cat.starsEarned || 0} Stars</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 50 Companion Characters from Indian States */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-heading text-xl sm:text-2xl font-black uppercase text-[#5D4037] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#D4AF37]" />
              <span>50 Regional Cultural Guides & Companions</span>
            </h2>
            <p className="text-xs text-[#8D6E63] font-bold">
              Each character represents the heritage, traditional dress, and spirit of an Indian region.
            </p>
          </div>
        </div>

        {/* Selected Guide Details Showcase */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border-b-6 border-r-6 border-t-2 border-l-2 border-[#5D4037] shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4 text-[#4A3728]">
          <div className="w-20 h-20 rounded-2xl bg-[#FDF5E6] border-2 border-[#5D4037] flex items-center justify-center text-5xl shadow shrink-0">
            {selectedChar.avatar}
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="font-heading text-lg font-black uppercase text-[#5D4037]">
                {selectedChar.name}
              </h3>
              <span className="px-2 py-0.5 rounded bg-[#D4AF37] text-[#5D4037] text-xs font-black uppercase">
                {selectedChar.role}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#FDF5E6] border border-[#5D4037] text-[#5D4037] text-xs font-bold">
                {selectedChar.state}
              </span>
            </div>
            <p className="text-xs text-[#8D6E63] italic font-medium">"{selectedChar.greeting}"</p>
            <p className="text-xs text-[#4A3728] leading-relaxed pt-1 font-medium">
              <strong className="text-[#5D4037]">Specialty:</strong> {selectedChar.specialty}
            </p>
          </div>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {CHARACTERS.map((char) => {
            const isSelected = selectedChar.id === char.id;
            return (
              <button
                key={char.id}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedChar(char);
                }}
                className={`p-2 rounded-xl flex flex-col items-center text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#D4AF37] border-2 border-[#5D4037] shadow-md scale-105'
                    : 'bg-white hover:bg-[#FDF5E6] border border-[#5D4037]/40'
                }`}
                title={`${char.name} (${char.state})`}
              >
                <span className="text-2xl mb-1">{char.avatar}</span>
                <span className="text-[10px] font-black uppercase text-[#5D4037] truncate w-full">
                  {char.name}
                </span>
                <span className="text-[8px] text-[#8D6E63] font-bold truncate w-full">
                  {char.state}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
