import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles,
  Trophy,
  Flame,
  Clock,
  ArrowRight,
  ArrowLeft,
  Gamepad2,
  Drum,
  Headphones,
  Layers,
  MapPin,
  SpellCheck,
  Hammer,
  Zap,
  Award,
  BookOpen,
} from 'lucide-react';
import { HERITAGE_GAMES } from '../data/gamesData.ts';
import { HeritageGame } from '../types.ts';
import { getPlayerLifetimeStats, getHonorificTitle } from '../services/leaderboardService.ts';

// 10 Game Components
import { TaalaTapGame } from '../components/games/TaalaTapGame.tsx';
import { SoundGuesserGame } from '../components/games/SoundGuesserGame.tsx';
import { GharanaMatchGame } from '../components/games/GharanaMatchGame.tsx';
import { StateDropGame } from '../components/games/StateDropGame.tsx';
import { AcousticSorterGame } from '../components/games/AcousticSorterGame.tsx';
import { WordAnagramGame } from '../components/games/WordAnagramGame.tsx';
import { CraftDetectiveGame } from '../components/games/CraftDetectiveGame.tsx';
import { SpeedReflexGame } from '../components/games/SpeedReflexGame.tsx';
import { MaestroTriviaGame } from '../components/games/MaestroTriviaGame.tsx';
import { MythologyLoreGame } from '../components/games/MythologyLoreGame.tsx';

const CATEGORIES = [
  'All Games',
  'Rhythm & Sound',
  'Memory & Match',
  'Geography & Lore',
  'Speed & Reflex',
] as const;

export const GamesPage: React.FC = () => {
  const { gameId } = useParams<{ gameId?: string }>();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All Games');

  const stats = getPlayerLifetimeStats();
  const currentTitle = getHonorificTitle(stats.totalPoints, 85);

  const activeGame = HERITAGE_GAMES.find((g) => g.id === gameId);

  const filteredGames = HERITAGE_GAMES.filter((game) => {
    if (selectedCategory === 'All Games') return true;
    return game.category === selectedCategory;
  });

  const getGameIcon = (iconName: string) => {
    switch (iconName) {
      case 'Drum':
        return <Drum className="w-6 h-6 text-amber-600" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6 text-amber-600" />;
      case 'Layers':
        return <Layers className="w-6 h-6 text-amber-600" />;
      case 'MapPin':
        return <MapPin className="w-6 h-6 text-amber-600" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-amber-600" />;
      case 'SpellCheck':
        return <SpellCheck className="w-6 h-6 text-amber-600" />;
      case 'Hammer':
        return <Hammer className="w-6 h-6 text-amber-600" />;
      case 'Zap':
        return <Zap className="w-6 h-6 text-amber-600" />;
      case 'Award':
        return <Award className="w-6 h-6 text-amber-600" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-6 h-6 text-amber-600" />;
    }
  };

  const renderActiveGame = () => {
    const handleExit = () => navigate('/games');
    const handleViewLeaderboard = () => navigate('/leaderboard');

    switch (gameId) {
      case 'taala-tap':
        return <TaalaTapGame onExit={handleExit} onViewLeaderboard={handleViewLeaderboard} />;
      case 'sound-guesser':
        return <SoundGuesserGame onExit={handleExit} onViewLeaderboard={handleViewLeaderboard} />;
      case 'gharana-match':
        return <GharanaMatchGame onExit={handleExit} onViewLeaderboard={handleViewLeaderboard} />;
      case 'state-drop':
        return <StateDropGame onExit={handleExit} onViewLeaderboard={handleViewLeaderboard} />;
      case 'acoustic-sorter':
        return <AcousticSorterGame onExit={handleExit} onViewLeaderboard={handleViewLeaderboard} />;
      case 'word-anagram':
        return <WordAnagramGame onExit={handleExit} onViewLeaderboard={handleViewLeaderboard} />;
      case 'craft-detective':
        return <CraftDetectiveGame onExit={handleExit} onViewLeaderboard={handleViewLeaderboard} />;
      case 'speed-reflex':
        return <SpeedReflexGame onExit={handleExit} onViewLeaderboard={handleViewLeaderboard} />;
      case 'maestro-trivia':
        return <MaestroTriviaGame onExit={handleExit} onViewLeaderboard={handleViewLeaderboard} />;
      case 'mythology-lore':
        return <MythologyLoreGame onExit={handleExit} onViewLeaderboard={handleViewLeaderboard} />;
      default:
        return null;
    }
  };

  // If a specific game is active, render that game runner view
  if (activeGame) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] py-8">
        <div className="max-w-4xl mx-auto px-4 mb-4">
          <button
            onClick={() => navigate('/games')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to ItihaasX Games Arcade
          </button>
        </div>
        {renderActiveGame()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Arcade Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-semibold mb-3">
            <Gamepad2 className="w-4 h-4 text-amber-700" />
            ItihaasX Gamified Heritage Arcade
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-amber-950 tracking-tight mb-3">
            Games
          </h1>
          <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto">
            Test rhythm in Teentaal, listen to blind acoustic mystery tones, unscramble ancient swaras,
            and conquer the global ItihaasX leaderboards!
          </p>
        </div>

        {/* Player Stats & Honorific Banner */}
        <div className="bg-white border border-amber-200/90 rounded-3xl p-6 shadow-sm mb-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 shrink-0 shadow-xs">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-700">
                Current Player Rank
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-amber-950">
                {currentTitle}
              </h2>
              <p className="text-xs text-stone-500">
                {stats.gamesPlayed > 0
                  ? `${stats.gamesPlayed} games played across the subcontinent`
                  : 'Play any game below to start gaining leaderboard score!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-5 sm:gap-8">
            <div className="text-center">
              <span className="text-[11px] font-semibold text-stone-500 uppercase block">
                Total Score
              </span>
              <span className="text-2xl font-bold text-amber-700 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-amber-500" />
                {stats.totalPoints}
              </span>
            </div>

            <div className="w-px h-10 bg-stone-200" />

            <div className="text-center">
              <span className="text-[11px] font-semibold text-stone-500 uppercase block">
                Best Streak
              </span>
              <span className="text-2xl font-bold text-orange-600 flex items-center gap-1">
                <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                {stats.bestStreak}x
              </span>
            </div>

            <div className="w-px h-10 bg-stone-200" />

            <Link
              to="/leaderboard"
              className="py-2.5 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-amber-100 font-semibold text-xs sm:text-sm transition-colors shadow-sm inline-flex items-center gap-1.5 shrink-0"
            >
              <Trophy className="w-4 h-4 text-amber-300" />
              Leaderboard
            </Link>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-800 text-white shadow-sm'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-amber-50 hover:border-amber-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
          {filteredGames.map((game, idx) => (
            <div
              key={game.id}
              className="bg-white rounded-3xl border border-stone-200/90 hover:border-amber-400 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header with Icon and Difficulty */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getGameIcon(game.icon)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        game.difficulty === 'Easy'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : game.difficulty === 'Medium'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {game.difficulty}
                    </span>
                    <span className="text-[10px] font-semibold text-stone-400 px-1">
                      #{idx + 1}
                    </span>
                  </div>
                </div>

                <div className="mb-2">
                  <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">
                    {game.category}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-amber-950 group-hover:text-amber-800 transition-colors">
                    {game.title}
                  </h3>
                  <span className="text-xs text-stone-500 font-medium block">
                    {game.hindiTitle}
                  </span>
                </div>

                <p className="text-stone-600 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                  {game.description}
                </p>
              </div>

              <div>
                {/* Metadata details */}
                <div className="flex items-center justify-between py-2 border-t border-stone-100 text-xs text-stone-500 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    {game.duration}
                  </span>
                  <span className="font-semibold text-amber-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    {game.pointsReward}
                  </span>
                </div>

                <Link
                  to={`/games/${game.id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-50 hover:bg-amber-600 text-amber-900 hover:text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 border border-amber-200 hover:border-amber-600 shadow-xs cursor-pointer"
                >
                  Play Game
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
