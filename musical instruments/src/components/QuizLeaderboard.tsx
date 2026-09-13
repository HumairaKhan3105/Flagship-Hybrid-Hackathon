import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, Sparkles, User, Calendar, RotateCcw, PlusCircle, Check, Filter } from 'lucide-react';
import { LeaderboardEntry } from '../types.ts';
import { getLeaderboardEntries, saveLeaderboardEntry } from '../services/leaderboardService.ts';

const GAME_FILTER_OPTIONS = [
  'All Games',
  'Culture Quiz',
  'Taala Rhythm Tap',
  'Blind Sound Mystery',
  'Gharana & Maestro Flip',
  'State Heritage Drop',
  'Natya Shastra Sorter',
  'Swara Word Anagram',
  'Craft & Anatomy Detective',
  'Folk vs Classical Blitz',
  'Legendary Maestro Trivia',
  'Mythology & Sacred Lore',
];

interface QuizLeaderboardProps {
  currentResult?: {
    points: number;
    score: number;
    totalQuestions: number;
    title: string;
    streak: number;
    gameName?: string;
  } | null;
  onPlayAgain?: () => void;
}

export const QuizLeaderboard: React.FC<QuizLeaderboardProps> = ({
  currentResult,
  onPlayAgain,
}) => {
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>('All Games');
  const [entries, setEntries] = useState<LeaderboardEntry[]>(() =>
    getLeaderboardEntries()
  );

  const [playerName, setPlayerName] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Refresh entries when filter changes
  useEffect(() => {
    setEntries(getLeaderboardEntries(selectedGameFilter === 'All Games' ? undefined : selectedGameFilter));
  }, [selectedGameFilter]);

  const handleSubmitScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentResult || !playerName.trim() || hasSubmitted) return;

    saveLeaderboardEntry({
      name: playerName.trim(),
      points: currentResult.points,
      score: currentResult.score,
      totalQuestions: currentResult.totalQuestions,
      accuracy: Math.round((currentResult.score / currentResult.totalQuestions) * 100),
      title: currentResult.title,
      streak: currentResult.streak,
      gameName: currentResult.gameName || 'Culture Quiz',
    });

    setEntries(getLeaderboardEntries(selectedGameFilter === 'All Games' ? undefined : selectedGameFilter));
    setHasSubmitted(true);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset leaderboard to default scholarly champions?')) {
      localStorage.removeItem('itihaasx_quiz_leaderboard');
      setEntries(getLeaderboardEntries());
      setHasSubmitted(false);
    }
  };

  const top3 = entries.slice(0, 3);
  const remaining = entries.slice(3);

  return (
    <div id="quiz-leaderboard-section" className="space-y-8 animate-in fade-in duration-300">
      {/* Submit Current Score Card if available and not yet submitted */}
      {currentResult && !hasSubmitted && (
        <div className="bg-gradient-to-br from-amber-800 via-amber-900 to-stone-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg border-2 border-amber-400/40 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Claim Your Heritage Rank
              </span>
              <h3 className="font-serif text-2xl font-bold text-amber-100 mt-1">
                You earned {currentResult.points} Points!
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 mt-0.5">
                Score: {currentResult.score}/{currentResult.totalQuestions} • Best Streak: {currentResult.streak} • Title: {currentResult.title}
              </p>
            </div>
            <div className="bg-amber-700/50 px-4 py-2 rounded-2xl border border-amber-400/30 text-center">
              <span className="text-xs text-amber-200 block font-medium">Earned Points</span>
              <span className="font-mono text-2xl font-black text-amber-300">{currentResult.points}</span>
            </div>
          </div>

          <form onSubmit={handleSubmitScore} className="flex flex-col sm:flex-row gap-3 pt-2">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name or scholar handle..."
              maxLength={24}
              required
              className="flex-1 px-4 py-3 rounded-xl bg-black/40 border border-amber-400/30 text-white placeholder-stone-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-sm transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <Trophy className="w-4 h-4" />
              <span>Submit to Leaderboard</span>
            </button>
          </form>
        </div>
      )}

      {hasSubmitted && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-2xl flex items-center gap-3">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="text-sm font-semibold">
            🎉 Your score was recorded! Check out your ranking on the ItihaasX Leaderboard below.
          </span>
        </div>
      )}

      {/* Top 3 Podium Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-600" />
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Top Sound Scholars Podium
            </h3>
          </div>
          <button
            onClick={handleResetDefaults}
            className="text-xs text-stone-400 hover:text-stone-600 flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 2nd Place */}
          {top3[1] && (
            <div className="order-2 md:order-1 bg-stone-50 border border-stone-200/90 rounded-2xl p-5 flex flex-col items-center text-center relative shadow-xs">
              <div className="w-10 h-10 rounded-full bg-stone-200 text-stone-700 flex items-center justify-center font-bold text-sm mb-3 shadow-inner">
                🥈 2nd
              </div>
              <h4 className="font-serif font-bold text-stone-900 text-base line-clamp-1">
                {top3[1].name}
              </h4>
              <span className="text-xs text-stone-500 line-clamp-1 mb-2">
                {top3[1].title}
              </span>
              <div className="mt-auto pt-3 border-t border-stone-200/80 w-full flex justify-around text-xs">
                <div>
                  <span className="text-stone-400 block">Points</span>
                  <span className="font-mono font-bold text-stone-800 text-sm">{top3[1].points}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Score</span>
                  <span className="font-medium text-stone-700">{top3[1].score}/{top3[1].totalQuestions}</span>
                </div>
              </div>
            </div>
          )}

          {/* 1st Place Champion */}
          {top3[0] && (
            <div className="order-1 md:order-2 bg-gradient-to-b from-amber-50 to-white border-2 border-amber-400/80 rounded-2xl p-6 flex flex-col items-center text-center relative shadow-md transform md:-translate-y-2">
              <div className="absolute -top-3 bg-amber-500 text-amber-950 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                <Crown className="w-3 h-3" /> Champion
              </div>
              <div className="w-14 h-14 rounded-full bg-amber-200 text-amber-900 flex items-center justify-center font-black text-xl mb-3 shadow-inner mt-1">
                🥇 1st
              </div>
              <h4 className="font-serif font-black text-stone-900 text-lg line-clamp-1">
                {top3[0].name}
              </h4>
              <span className="text-xs font-semibold text-amber-800 line-clamp-1 mb-2">
                {top3[0].title}
              </span>
              <div className="mt-auto pt-3 border-t border-amber-200 w-full flex justify-around text-xs">
                <div>
                  <span className="text-stone-400 block">Grand Points</span>
                  <span className="font-mono font-black text-amber-900 text-base">{top3[0].points}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Accuracy</span>
                  <span className="font-bold text-emerald-700">{top3[0].accuracy}%</span>
                </div>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {top3[2] && (
            <div className="order-3 bg-stone-50 border border-stone-200/90 rounded-2xl p-5 flex flex-col items-center text-center relative shadow-xs">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm mb-3 shadow-inner">
                🥉 3rd
              </div>
              <h4 className="font-serif font-bold text-stone-900 text-base line-clamp-1">
                {top3[2].name}
              </h4>
              <span className="text-xs text-stone-500 line-clamp-1 mb-2">
                {top3[2].title}
              </span>
              <div className="mt-auto pt-3 border-t border-stone-200/80 w-full flex justify-around text-xs">
                <div>
                  <span className="text-stone-400 block">Points</span>
                  <span className="font-mono font-bold text-stone-800 text-sm">{top3[2].points}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Score</span>
                  <span className="font-medium text-stone-700">{top3[2].score}/{top3[2].totalQuestions}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-serif font-bold text-stone-900 text-base">
              All Musical Scholars Rankings ({entries.length})
            </h4>
            <span className="text-xs text-stone-500">Sorted by Points Earned Across Games & Quizzes</span>
          </div>

          {/* Game Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <select
              value={selectedGameFilter}
              onChange={(e) => setSelectedGameFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs font-semibold bg-stone-50 text-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              {GAME_FILTER_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-500 text-xs uppercase tracking-wider font-semibold border-b border-stone-200/80">
              <tr>
                <th className="px-5 py-3">Rank</th>
                <th className="px-5 py-3">Scholar Name</th>
                <th className="px-5 py-3">Game / Challenge</th>
                <th className="px-5 py-3">Points</th>
                <th className="px-5 py-3">Accuracy</th>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {entries.map((item, index) => {
                const isChampion = index === 0;
                const isTop3 = index < 3;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-amber-50/40 transition-colors ${
                      item.name === playerName ? 'bg-amber-100/40 font-semibold' : ''
                    }`}
                  >
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                          index === 0
                            ? 'bg-amber-400 text-amber-950'
                            : index === 1
                            ? 'bg-stone-300 text-stone-800'
                            : index === 2
                            ? 'bg-amber-200 text-amber-900'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        #{index + 1}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-stone-900 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span>{item.name}</span>
                        {item.name === playerName && (
                          <span className="text-[10px] bg-amber-700 text-white px-1.5 py-0.5 rounded-sm">
                            YOU
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200">
                        {item.gameName || 'Culture Quiz'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap font-mono font-bold text-amber-900">
                      {item.points.toLocaleString()} pts
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-stone-600">
                      {item.score}/{item.totalQuestions} ({item.accuracy}%)
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-xs text-stone-600">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-stone-100 text-stone-800 font-medium">
                        {item.title.split('–')[0].trim()}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 whitespace-nowrap text-right text-xs text-stone-400">
                      {item.date}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {onPlayAgain && (
        <div className="text-center pt-2">
          <button
            onClick={onPlayAgain}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-amber-800 hover:bg-amber-900 text-white font-medium text-sm transition-colors shadow-sm cursor-pointer"
          >
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>Take the Quiz to Beat the High Score</span>
          </button>
        </div>
      )}
    </div>
  );
};
