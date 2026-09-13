import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Sparkles, Flame, Check, HelpCircle } from 'lucide-react';
import { soundSynthesizer } from '../../services/soundSynthesizer.ts';
import { GameOverModal } from './GameOverModal.tsx';

interface TaalaDefinition {
  name: string;
  hindi: string;
  totalBeats: number;
  tempoBpm: number;
  bols: string[];
  taaliBeats: number[]; // 1-indexed beats where claps happen (Sam is beat 1)
  khaliBeats: number[];
  description: string;
}

const TAALAS: TaalaDefinition[] = [
  {
    name: 'Teentaal',
    hindi: 'तीनताल (१६ मात्रा)',
    totalBeats: 16,
    tempoBpm: 75,
    bols: [
      'Dha', 'Dhin', 'Dhin', 'Dha',
      'Dha', 'Dhin', 'Dhin', 'Dha',
      'Dha', 'Tin', 'Tin', 'Ta',
      'Ta', 'Dhin', 'Dhin', 'Dha'
    ],
    taaliBeats: [1, 5, 13],
    khaliBeats: [9],
    description: 'The monarch of Hindustani rhythm: 16 beats divided into 4 vibhags (4+4+4+4).',
  },
  {
    name: 'Keherwa',
    hindi: 'कहरवा (८ मात्रा)',
    totalBeats: 8,
    tempoBpm: 88,
    bols: ['Dha', 'Ge', 'Na', 'Ti', 'Na', 'Ka', 'Dhi', 'Na'],
    taaliBeats: [1],
    khaliBeats: [5],
    description: 'Energetic 8-beat rhythm popular in folk, ghazal, and thumri compositions.',
  },
  {
    name: 'Dadra',
    hindi: 'दादरा (६ मात्रा)',
    totalBeats: 6,
    tempoBpm: 92,
    bols: ['Dha', 'Dhi', 'Na', 'Dha', 'Tu', 'Na'],
    taaliBeats: [1],
    khaliBeats: [4],
    description: 'Light classical syncopated 6-beat groove with undulating lilt (3+3).',
  },
];

export const TaalaTapGame: React.FC<{ onExit: () => void; onViewLeaderboard: () => void }> = ({
  onExit,
  onViewLeaderboard,
}) => {
  const [taalaIndex, setTaalaIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(1);
  const [score, setScore] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; color: string } | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const activeTaala = TAALAS[taalaIndex];
  const beatIntervalMs = (60 / activeTaala.tempoBpm) * 1000;
  const lastBeatTimeRef = useRef<number>(0);
  const hasTappedCurrentBeatRef = useRef<boolean>(false);

  // Play beats loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentBeat((prev) => {
        const next = prev >= activeTaala.totalBeats ? 1 : prev + 1;
        lastBeatTimeRef.current = Date.now();
        hasTappedCurrentBeatRef.current = false;

        // Audio synthesis for the beat
        if (next === 1) {
          soundSynthesizer.playPercussionBeat('dha');
        } else if (activeTaala.taaliBeats.includes(next)) {
          soundSynthesizer.playPercussionBeat('clap');
        } else if (activeTaala.khaliBeats.includes(next)) {
          soundSynthesizer.playPercussionBeat('ting');
        } else {
          soundSynthesizer.playPercussionBeat('dhin');
        }

        return next;
      });
    }, beatIntervalMs);

    return () => clearInterval(interval);
  }, [isPlaying, activeTaala, beatIntervalMs]);

  // Check if player tapped Sam or Taali
  const handleTap = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      return;
    }

    const now = Date.now();
    const elapsedSinceBeat = now - lastBeatTimeRef.current;
    const isTargetBeat = activeTaala.taaliBeats.includes(currentBeat);

    setTotalAttempts((prev) => prev + 1);

    if (isTargetBeat && elapsedSinceBeat <= 320) {
      // Perfect tap
      const isSam = currentBeat === 1;
      const ptsEarned = isSam ? 150 : 100;
      soundSynthesizer.playSuccessSound();
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
      setPoints((p) => p + ptsEarned + streak * 10);
      setFeedback({
        text: isSam ? 'WAH! PERFECT SAM (ता 1)! +150' : 'GREAT CLAP! +100',
        color: 'text-emerald-600',
      });
    } else {
      soundSynthesizer.playErrorSound();
      setStreak(0);
      setFeedback({
        text: isTargetBeat ? 'A BIT LATE! Keep the laya steady!' : 'Missed Taali! Tap on highlighted beats',
        color: 'text-rose-500',
      });
    }

    setTimeout(() => setFeedback(null), 1200);

    // End after enough attempts
    if (totalAttempts >= 12) {
      setIsPlaying(false);
      setGameOver(true);
    }
  };

  const handleNextTaala = () => {
    setTaalaIndex((prev) => (prev + 1) % TAALAS.length);
    setCurrentBeat(1);
    setIsPlaying(false);
  };

  const handleRestart = () => {
    setScore(0);
    setTotalAttempts(0);
    setPoints(0);
    setStreak(0);
    setCurrentBeat(1);
    setGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      {/* Game Header */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              Rhythm & Laya
            </span>
            <span className="text-xs text-stone-500 font-medium">16-Beat & 8-Beat Cycles</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-950 mt-1">
            Taala Rhythm Tap (ताल और लय)
          </h2>
          <p className="text-sm text-stone-600 mt-0.5">
            Listen to the acoustic tabla cycle and tap on the <strong className="text-amber-800">Sam (Beat 1)</strong> and clapped beats!
          </p>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 bg-amber-50/80 px-4 py-2.5 rounded-2xl border border-amber-200">
          <div className="text-center">
            <span className="text-[10px] uppercase font-semibold text-stone-500 block">Points</span>
            <span className="text-lg font-bold text-amber-700 flex items-center justify-center gap-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              {points}
            </span>
          </div>
          <div className="w-px h-8 bg-amber-200" />
          <div className="text-center">
            <span className="text-[10px] uppercase font-semibold text-stone-500 block">Streak</span>
            <span className="text-lg font-bold text-orange-600 flex items-center justify-center gap-0.5">
              <Flame className="w-3.5 h-3.5 fill-orange-500" />
              {streak}x
            </span>
          </div>
        </div>
      </div>

      {/* Main Rhythm Stage */}
      <div className="bg-gradient-to-b from-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-900/30 mb-6 text-center relative overflow-hidden">
        {/* Taala Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-left">
            <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider block">
              Active Taala
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
              {activeTaala.name}{' '}
              <span className="text-sm text-amber-300 font-sans font-normal">({activeTaala.hindi})</span>
            </h3>
          </div>
          <button
            onClick={handleNextTaala}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-200 transition-colors border border-white/10"
          >
            Switch Cycle →
          </button>
        </div>

        {/* Circular / Grid Beat Indicators */}
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 max-w-2xl mx-auto mb-8">
          {Array.from({ length: activeTaala.totalBeats }, (_, i) => i + 1).map((beat) => {
            const isActive = currentBeat === beat && isPlaying;
            const isSam = beat === 1;
            const isTaali = activeTaala.taaliBeats.includes(beat);
            const isKhali = activeTaala.khaliBeats.includes(beat);
            const bol = activeTaala.bols[beat - 1] || 'Ta';

            return (
              <div
                key={beat}
                className={`p-3 rounded-2xl border transition-all duration-150 flex flex-col items-center justify-center ${
                  isActive
                    ? isSam
                      ? 'bg-amber-400 text-stone-950 border-amber-300 scale-110 shadow-lg shadow-amber-400/50 ring-4 ring-amber-300/40'
                      : 'bg-amber-500/80 text-white border-amber-300 scale-105 shadow-md ring-2 ring-amber-400/30'
                    : isSam
                    ? 'bg-amber-950/70 border-amber-500/60 text-amber-300'
                    : isKhali
                    ? 'bg-stone-800/60 border-stone-700/60 text-stone-400'
                    : 'bg-stone-900/60 border-stone-800 text-stone-300'
                }`}
              >
                <span className="text-[10px] font-semibold opacity-70">
                  {isSam ? 'SAM (X)' : isKhali ? '0' : beat}
                </span>
                <span className="text-sm font-bold font-serif my-0.5">{bol}</span>
                <span className="text-[9px] uppercase tracking-wider font-semibold opacity-80">
                  {isSam ? '★ 1st' : isTaali ? 'Clap' : isKhali ? 'Wave' : ''}
                </span>
              </div>
            );
          })}
        </div>

        {/* Feedback Display */}
        <div className="h-8 flex items-center justify-center mb-6">
          {feedback ? (
            <span className={`text-base sm:text-lg font-bold ${feedback.color} animate-bounce`}>
              {feedback.text}
            </span>
          ) : (
            <span className="text-xs text-stone-400">
              {isPlaying
                ? 'Keep your ears tuned! Tap precisely when the Sam (Beat 1) strikes!'
                : 'Click "Start Laya" to begin the acoustic percussion tempo.'}
            </span>
          )}
        </div>

        {/* Massive Interactive Tap Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleTap}
            className="w-full sm:w-64 py-5 px-8 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-stone-950 font-black text-xl tracking-wide shadow-xl shadow-amber-600/30 active:scale-95 transition-all transform border-2 border-amber-300 flex items-center justify-center gap-3 cursor-pointer"
          >
            <Sparkles className="w-6 h-6 text-stone-950" />
            {isPlaying ? 'TAP ON SAM!' : 'START LAYA & TAP'}
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors border border-white/15 flex items-center gap-2"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause Loop' : 'Play Rhythm'}
          </button>
        </div>
      </div>

      {/* Cultural Explainer Card */}
      <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 sm:p-5 text-amber-950 text-xs sm:text-sm flex items-start gap-3">
        <HelpCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold block text-amber-900 mb-1">
            Understanding Indian Taala & Sam:
          </strong>
          In Indian classical music, <strong>Sam (सम)</strong> is the very first beat of a rhythmic
          cycle—the point of highest gravitational pull where melody and rhythm unite with a resonant
          clap. <strong>Khali (खाली)</strong> represents the silent wave of the hand, maintaining balance
          before resolving back to Sam!
        </div>
      </div>

      {/* Game Over Modal */}
      {gameOver && (
        <GameOverModal
          gameTitle="Taala Rhythm Tap"
          score={score}
          totalQuestions={12}
          points={points}
          streak={streak}
          onRestart={handleRestart}
          onExit={onExit}
          onViewLeaderboard={onViewLeaderboard}
        />
      )}
    </div>
  );
};
