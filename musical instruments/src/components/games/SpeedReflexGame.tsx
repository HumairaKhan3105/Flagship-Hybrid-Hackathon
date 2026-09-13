import React, { useState, useEffect } from 'react';
import { Zap, Timer, Flame, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { soundSynthesizer } from '../../services/soundSynthesizer.ts';
import { GameOverModal } from './GameOverModal.tsx';

interface ReflexItem {
  name: string;
  hindi: string;
  tradition: 'Folk' | 'Classical';
}

const ITEMS_POOL: ReflexItem[] = [
  { name: 'Sitar', hindi: 'सितार', tradition: 'Classical' },
  { name: 'Ravanahatha', hindi: 'रावणहत्था', tradition: 'Folk' },
  { name: 'Mridangam', hindi: 'मृदंगम', tradition: 'Classical' },
  { name: 'Pepa', hindi: 'पेपा', tradition: 'Folk' },
  { name: 'Sarod', hindi: 'सरोद', tradition: 'Classical' },
  { name: 'Ektara', hindi: 'एकतारा', tradition: 'Folk' },
  { name: 'Saraswati Veena', hindi: 'सरस्वती वीणा', tradition: 'Classical' },
  { name: 'Algoza', hindi: 'अलगोजा', tradition: 'Folk' },
  { name: 'Chenda', hindi: 'चेण्डा', tradition: 'Folk' },
  { name: 'Santoor', hindi: 'संतूर', tradition: 'Classical' },
  { name: 'Kamaicha', hindi: 'कमायचा', tradition: 'Folk' },
  { name: 'Surbahar', hindi: 'सुरबहार', tradition: 'Classical' },
  { name: 'Dotara', hindi: 'दोतारा', tradition: 'Folk' },
  { name: 'Rudra Veena', hindi: 'रुद्र वीणा', tradition: 'Classical' },
  { name: 'Kartal', hindi: 'करताल', tradition: 'Folk' },
  { name: 'Shehnai', hindi: 'शहनाई', tradition: 'Classical' },
];

export const SpeedReflexGame: React.FC<{ onExit: () => void; onViewLeaderboard: () => void }> = ({
  onExit,
  onViewLeaderboard,
}) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentItemIdx, setCurrentItemIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<'hit' | 'miss' | null>(null);
  const [gameOver, setGameOver] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) {
      if (isPlaying && timeLeft <= 0) {
        setIsPlaying(false);
        setGameOver(true);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, timeLeft]);

  const currentItem = ITEMS_POOL[currentItemIdx % ITEMS_POOL.length];

  const handleClassify = (tradition: 'Folk' | 'Classical') => {
    if (!isPlaying) {
      setIsPlaying(true);
    }

    setTotalAttempts((prev) => prev + 1);

    if (tradition === currentItem.tradition) {
      soundSynthesizer.playPercussionBeat('ting');
      setScore((s) => s + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setPoints((p) => p + 100 + newStreak * 20);
      setFeedback('hit');
    } else {
      soundSynthesizer.playErrorSound();
      setStreak(0);
      setFeedback('miss');
    }

    setCurrentItemIdx((prev) => prev + 1);
    setTimeout(() => setFeedback(null), 300);
  };

  const handleStart = () => {
    setTimeLeft(30);
    setScore(0);
    setTotalAttempts(0);
    setPoints(0);
    setStreak(0);
    setCurrentItemIdx(0);
    setIsPlaying(true);
    setGameOver(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 text-center">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-sm mb-6 flex items-center justify-between">
        <div className="text-left">
          <span className="text-xs uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 inline-block mb-1">
            Rapid Reflex Blitz
          </span>
          <h2 className="font-serif text-2xl font-bold text-amber-950">Folk vs Classical Blitz</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-50 px-3.5 py-2 rounded-2xl border border-amber-200">
            <Timer className={`w-4 h-4 ${timeLeft <= 5 ? 'text-rose-600 animate-spin' : 'text-amber-700'}`} />
            <span className={`text-lg font-bold font-mono ${timeLeft <= 5 ? 'text-rose-600' : 'text-stone-800'}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-orange-50 px-3.5 py-2 rounded-2xl border border-orange-200">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="text-lg font-bold text-orange-700">{streak}x</span>
          </div>
        </div>
      </div>

      {/* Main Flash Stage */}
      <div className="bg-gradient-to-b from-stone-900 to-amber-950 text-white rounded-3xl p-8 shadow-xl border border-amber-900/40 mb-6 relative overflow-hidden">
        <div className="text-xs uppercase tracking-widest text-amber-300 font-semibold mb-2">
          Sort Fast: Is This Instrument Folk or Classical?
        </div>

        <div className="py-8">
          <h3 className="font-serif text-4xl sm:text-5xl font-black text-white tracking-wide mb-1">
            {currentItem.name}
          </h3>
          <span className="text-lg font-sans text-amber-200/80">({currentItem.hindi})</span>
        </div>

        {/* Rapid Choice Buttons */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <button
            onClick={() => handleClassify('Folk')}
            className="py-5 px-6 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-lg transition-transform active:scale-95 shadow-lg border-2 border-amber-400 cursor-pointer"
          >
            🪕 FOLK / TRIBAL
          </button>
          <button
            onClick={() => handleClassify('Classical')}
            className="py-5 px-6 rounded-2xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-lg transition-transform active:scale-95 shadow-lg border-2 border-amber-500/50 cursor-pointer"
          >
            🏛️ CLASSICAL
          </button>
        </div>

        {/* Live Score Counter */}
        <div className="mt-6 flex items-center justify-center gap-6 text-sm text-stone-300">
          <span>
            Score: <strong className="text-white">{score}</strong> / {totalAttempts}
          </span>
          <span>
            Points: <strong className="text-amber-400 font-mono">{points}</strong>
          </span>
        </div>
      </div>

      {!isPlaying && !gameOver && (
        <button
          onClick={handleStart}
          className="py-4 px-8 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-lg shadow-md inline-flex items-center gap-2"
        >
          <Zap className="w-5 h-5" /> Start 30s Speed Run
        </button>
      )}

      {gameOver && (
        <GameOverModal
          gameTitle="Folk vs Classical Blitz"
          score={score}
          totalQuestions={totalAttempts || 10}
          points={points}
          streak={streak}
          onRestart={handleStart}
          onExit={onExit}
          onViewLeaderboard={onViewLeaderboard}
        />
      )}
    </div>
  );
};
