import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Flame, Sparkles, CheckCircle2, RotateCcw, ArrowRight, Award } from 'lucide-react';
import { saveLeaderboardEntry, getHonorificTitle } from '../../services/leaderboardService.ts';

interface GameOverModalProps {
  gameTitle: string;
  score: number;
  totalQuestions: number;
  points: number;
  streak: number;
  onRestart: () => void;
  onExit: () => void;
  onViewLeaderboard: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  gameTitle,
  score,
  totalQuestions,
  points,
  streak,
  onRestart,
  onExit,
  onViewLeaderboard,
}) => {
  const [playerName, setPlayerName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 100;
  const honorific = getHonorificTitle(points, accuracy);

  // Trigger celebration confetti on mount
  React.useEffect(() => {
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#D97706', '#B45309', '#F59E0B', '#10B981'],
    });
  }, []);

  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = playerName.trim() || 'Heritage Seeker';
    saveLeaderboardEntry({
      name: finalName,
      points,
      score,
      totalQuestions,
      accuracy,
      title: honorific,
      streak,
      gameName: gameTitle,
    });
    setSubmitted(true);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.4 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#FDFBF7] border border-amber-200/90 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-center relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-orange-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Trophy icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shadow-md mb-4">
          <Trophy className="w-9 h-9" />
        </div>

        <span className="text-xs uppercase tracking-widest font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 inline-block mb-2">
          {gameTitle} Complete!
        </span>

        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-amber-950 mb-1">
          {honorific}
        </h3>
        <p className="text-stone-600 text-sm mb-6">
          Magnificent demonstration of Indian musical heritage!
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-xs">
            <span className="text-[11px] text-stone-500 font-medium block">Points</span>
            <span className="text-xl font-bold text-amber-600 flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {points}
            </span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-xs">
            <span className="text-[11px] text-stone-500 font-medium block">Score</span>
            <span className="text-xl font-bold text-stone-800">
              {score}/{totalQuestions}
            </span>
          </div>

          <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-xs">
            <span className="text-[11px] text-stone-500 font-medium block">Streak</span>
            <span className="text-xl font-bold text-orange-600 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              {streak}x
            </span>
          </div>
        </div>

        {/* Leaderboard Submission Form */}
        {!submitted ? (
          <form onSubmit={handleSubmitScore} className="mb-6 space-y-3">
            <label className="block text-xs font-semibold text-amber-900 text-left">
              Submit your name to the ItihaasX Global Leaderboard:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Enter your name or handle..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={30}
                required
                className="flex-1 px-4 py-2.5 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-stone-900 text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-colors shadow-sm flex items-center gap-1.5 shrink-0"
              >
                <Award className="w-4 h-4" />
                Submit
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center gap-2 text-emerald-800 text-sm font-semibold animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Ranked & Added to the Global Leaderboard!
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onRestart}
            className="flex-1 py-2.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-medium text-sm transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>
          <button
            onClick={onViewLeaderboard}
            className="flex-1 py-2.5 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-amber-100 font-medium text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            Leaderboard
          </button>
          <button
            onClick={onExit}
            className="py-2.5 px-4 rounded-xl text-stone-500 hover:text-stone-800 font-medium text-sm transition-colors"
          >
            Arcade Hub
          </button>
        </div>
      </div>
    </div>
  );
};
