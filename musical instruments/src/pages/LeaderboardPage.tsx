import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Gamepad2, Sparkles, ArrowLeft } from 'lucide-react';
import { QuizLeaderboard } from '../components/QuizLeaderboard.tsx';
import { getPlayerLifetimeStats, getHonorificTitle } from '../services/leaderboardService.ts';

export const LeaderboardPage: React.FC = () => {
  const stats = getPlayerLifetimeStats();
  const currentTitle = getHonorificTitle(stats.totalPoints, 85);

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              to="/games"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-950 mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Games Arcade
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                Global Hall of Scholars
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-amber-950 mt-1">
              ItihaasX Global Leaderboard
            </h1>
            <p className="text-stone-600 text-sm mt-0.5">
              Top scores across rhythm cycles, blind sound mysteries, and heritage lore quizzes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/games"
              className="py-2.5 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs sm:text-sm transition-colors shadow-sm inline-flex items-center gap-1.5"
            >
              <Gamepad2 className="w-4 h-4 text-amber-300" />
              Play Games
            </Link>
          </div>
        </div>

        {/* Embedded Leaderboard Component */}
        <QuizLeaderboard />
      </div>
    </div>
  );
};
