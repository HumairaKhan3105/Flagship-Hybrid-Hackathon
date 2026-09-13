import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Trophy, 
  Medal, 
  Flame, 
  Star, 
  ShieldCheck,
  Award
} from 'lucide-react';
import { UserProgress } from '../types';
import { soundEngine } from '../utils/audio';

interface LeaderboardScreenProps {
  progress: UserProgress;
  onBack: () => void;
}

interface SleuthEntry {
  rank: number;
  name: string;
  avatar: string;
  city: string;
  state: string;
  rankTitle: string;
  xp: number;
  stars: number;
  streak: number;
  isPlayer?: boolean;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ progress, onBack }) => {
  const [tab, setTab] = useState<'weekly' | 'alltime'>('alltime');

  const totalStars: number = Object.values(progress.categoryProgress || {}).reduce<number>(
    (acc, cat: any) => acc + (cat?.starsEarned || 0),
    0
  );

  // Fictional top sleuths
  const baseSleuths: SleuthEntry[] = [
    {
      rank: 1,
      name: 'Aditi Rao',
      avatar: '👩‍🌾',
      city: 'Pune',
      state: 'Maharashtra',
      rankTitle: 'Grand Cultural Detective',
      xp: 14850,
      stars: 840,
      streak: 42,
    },
    {
      rank: 2,
      name: 'Karthik Sundaram',
      avatar: '👨‍🎨',
      city: 'Thanjavur',
      state: 'Tamil Nadu',
      rankTitle: 'Grand Cultural Detective',
      xp: 13200,
      stars: 790,
      streak: 35,
    },
    {
      rank: 3,
      name: 'Meherangiz Cama',
      avatar: '🕵️‍♀️',
      city: 'Ahmedabad',
      state: 'Gujarat',
      rankTitle: 'Chief Heritage Sleuth',
      xp: 11950,
      stars: 710,
      streak: 28,
    },
    {
      rank: 4,
      name: 'Tsering Dorje',
      avatar: '👨‍🦱',
      city: 'Leh',
      state: 'Ladakh',
      rankTitle: 'Chief Heritage Sleuth',
      xp: 10400,
      stars: 640,
      streak: 21,
    },
    {
      rank: 5,
      name: 'Gurpreet Singh',
      avatar: '👳',
      city: 'Amritsar',
      state: 'Punjab',
      rankTitle: 'Senior Field Scholar',
      xp: 9200,
      stars: 580,
      streak: 19,
    },
    {
      rank: 6,
      name: 'Debjani Mukherjee',
      avatar: '👩‍🏫',
      city: 'Kolkata',
      state: 'West Bengal',
      rankTitle: 'Senior Field Scholar',
      xp: 8100,
      stars: 510,
      streak: 16,
    },
    {
      rank: 7,
      name: 'Pema Lhamo',
      avatar: '👩‍🎨',
      city: 'Gangtok',
      state: 'Sikkim',
      rankTitle: 'Cultural Detective',
      xp: 7300,
      stars: 460,
      streak: 14,
    },
    {
      rank: 8,
      name: 'Farhan Beg',
      avatar: '👨‍💻',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      rankTitle: 'Cultural Detective',
      xp: 6400,
      stars: 410,
      streak: 12,
    },
  ];

  // Insert player according to XP
  const playerEntry: SleuthEntry = {
    rank: 9,
    name: 'You (Detective of Bharat)',
    avatar: '🕵️',
    city: 'New Delhi',
    state: 'National',
    rankTitle: progress.rankTitle,
    xp: progress.xp,
    stars: totalStars,
    streak: progress.streak,
    isPlayer: true,
  };

  const allEntries = [...baseSleuths, playerEntry].sort((a, b) => b.xp - a.xp).map((entry, idx) => ({
    ...entry,
    rank: idx + 1,
  }));

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6">
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

        <div className="flex items-center gap-1 bg-white p-1 rounded-full border-2 border-[#5D4037] text-xs font-black shadow-sm">
          <button
            onClick={() => {
              soundEngine.playClick();
              setTab('alltime');
            }}
            className={`px-3.5 py-1 rounded-full transition-all uppercase ${
              tab === 'alltime' ? 'bg-[#D4AF37] text-[#5D4037] font-black' : 'text-[#8D6E63] hover:text-[#5D4037]'
            }`}
          >
            All-Time
          </button>
          <button
            onClick={() => {
              soundEngine.playClick();
              setTab('weekly');
            }}
            className={`px-3.5 py-1 rounded-full transition-all uppercase ${
              tab === 'weekly' ? 'bg-[#D4AF37] text-[#5D4037] font-black' : 'text-[#8D6E63] hover:text-[#5D4037]'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white border-b-8 border-r-8 border-[#5D4037] border-t-2 border-l-2 border-[#5D4037] rounded-2xl p-5 sm:p-7 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-[#4A3728]">
        <div>
          <span className="px-2.5 py-0.5 rounded bg-[#2E7D32] text-white text-xs font-black uppercase shadow-sm">
            NATIONAL REGISTER OF INVESTIGATORS
          </span>
          <h1 className="font-heading text-2xl sm:text-4xl font-black uppercase text-[#5D4037] mt-1.5">
            Hall of Cultural Fame
          </h1>
          <p className="text-xs sm:text-sm text-[#8D6E63] font-bold mt-1 max-w-xl">
            Compete with cultural enthusiasts across India. Earn XP and solve cases to climb the national ranks!
          </p>
        </div>

        <div className="w-20 h-20 rounded-2xl bg-[#D4AF37] border-2 border-[#5D4037] flex items-center justify-center text-4xl shadow-md shrink-0">
          🏛️
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-3xl p-3 sm:p-6 border-b-8 border-r-8 border-[#5D4037] border-t-2 border-l-2 border-[#5D4037] shadow-sm space-y-3">
        <div className="grid grid-cols-12 text-xs font-black text-[#8D6E63] uppercase tracking-wider px-3 py-2 border-b-2 border-stone-200">
          <span className="col-span-1 text-center">Rank</span>
          <span className="col-span-6 sm:col-span-5">Detective</span>
          <span className="col-span-2 text-center">Stars</span>
          <span className="col-span-3 sm:col-span-4 text-right">Total XP</span>
        </div>

        <div className="space-y-2">
          {allEntries.map((entry) => {
            const medalColors =
              entry.rank === 1
                ? 'bg-[#FFD700] text-[#5D4037] border-2 border-[#5D4037]'
                : entry.rank === 2
                ? 'bg-stone-200 text-[#5D4037] border-2 border-[#5D4037]'
                : entry.rank === 3
                ? 'bg-[#D4AF37] text-white border-2 border-[#5D4037]'
                : 'bg-stone-100 text-[#5D4037] border border-stone-300';

            return (
              <div
                key={entry.rank + entry.name}
                className={`grid grid-cols-12 items-center p-3 sm:p-4 rounded-xl border-2 transition-all ${
                  entry.isPlayer
                    ? 'bg-[#FDF5E6] border-[#D4AF37] shadow-sm font-bold ring-2 ring-[#D4AF37]'
                    : 'bg-white border-stone-200 hover:border-[#5D4037]'
                }`}
              >
                {/* Rank */}
                <div className="col-span-1 flex justify-center">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shadow-sm ${medalColors}`}
                  >
                    {entry.rank}
                  </span>
                </div>

                {/* Detective Info */}
                <div className="col-span-6 sm:col-span-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FDF5E6] border-2 border-[#5D4037] flex items-center justify-center text-xl shrink-0 shadow-sm">
                    {entry.avatar}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-black uppercase text-[#5D4037] truncate">
                        {entry.name}
                      </span>
                      {entry.isPlayer && (
                        <span className="px-1.5 py-0.2 rounded bg-[#2E7D32] text-white text-[9px] font-black uppercase">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#8D6E63] font-bold block truncate">
                      {entry.city}, {entry.state} • {entry.rankTitle}
                    </span>
                  </div>
                </div>

                {/* Stars */}
                <div className="col-span-2 flex items-center justify-center gap-1 text-xs font-black text-[#5D4037]">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-500" />
                  <span>{entry.stars}</span>
                </div>

                {/* XP */}
                <div className="col-span-3 sm:col-span-4 text-right">
                  <span className="font-black text-xs sm:text-sm text-[#5D4037]">
                    {entry.xp.toLocaleString()} XP
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
