import React, { useState } from 'react';
import { Flame, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { soundSynthesizer } from '../../services/soundSynthesizer.ts';
import { GameOverModal } from './GameOverModal.tsx';
import { getFallbackForInstrument } from '../../utils/imageFallback.ts';

interface ShastraInstrument {
  name: string;
  slug: string;
  sanskritCategory: 'Tata' | 'Sushira' | 'Avanaddha' | 'Ghana';
  categoryLabel: string;
  hint: string;
}

const SHASTRA_ITEMS: ShastraInstrument[] = [
  { name: 'Sitar', slug: 'sitar', sanskritCategory: 'Tata', categoryLabel: 'Tata Vadya (String)', hint: 'Plucked chordophone with sympathetic resonance' },
  { name: 'Bansuri', slug: 'bansuri', sanskritCategory: 'Sushira', categoryLabel: 'Sushira Vadya (Wind)', hint: 'Acoustic tubular aerophone played via breath' },
  { name: 'Mridangam', slug: 'mridangam', sanskritCategory: 'Avanaddha', categoryLabel: 'Avanaddha Vadya (Drum)', hint: 'Double-headed barrel membranophone' },
  { name: 'Ghatam', slug: 'ghatam', sanskritCategory: 'Ghana', categoryLabel: 'Ghana Vadya (Solid)', hint: 'Non-membrane solid earthenware resonant idiophone' },
  { name: 'Sarangi', slug: 'sarangi', sanskritCategory: 'Tata', categoryLabel: 'Tata Vadya (String)', hint: 'Bowed wooden chordophone with gut strings' },
  { name: 'Shehnai', slug: 'shehnai', sanskritCategory: 'Sushira', categoryLabel: 'Sushira Vadya (Wind)', hint: 'Double-reed flared wind aerophone' },
  { name: 'Tabla', slug: 'tabla', sanskritCategory: 'Avanaddha', categoryLabel: 'Avanaddha Vadya (Drum)', hint: 'Twin leather-headed percussion pair' },
  { name: 'Morchang', slug: 'morchang', sanskritCategory: 'Ghana', categoryLabel: 'Ghana Vadya (Solid)', hint: 'Plucked solid brass lamellophone / idiophone' },
];

const CATEGORIES = [
  { key: 'Tata', name: 'Tata Vadya', english: 'String / Chordophone', icon: '🪕' },
  { key: 'Sushira', name: 'Sushira Vadya', english: 'Wind / Aerophone', icon: '🪈' },
  { key: 'Avanaddha', name: 'Avanaddha Vadya', english: 'Drum / Membranophone', icon: '🪘' },
  { key: 'Ghana', name: 'Ghana Vadya', english: 'Solid / Idiophone', icon: '🔔' },
];

export const AcousticSorterGame: React.FC<{ onExit: () => void; onViewLeaderboard: () => void }> = ({
  onExit,
  onViewLeaderboard,
}) => {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [gameOver, setGameOver] = useState(false);

  const current = SHASTRA_ITEMS[index];

  const handleClassify = (catKey: string) => {
    if (feedback !== null) return;

    if (catKey === current.sanskritCategory) {
      soundSynthesizer.playSuccessSound();
      setScore((s) => s + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setPoints((p) => p + 180 + newStreak * 25);
      setFeedback({
        correct: true,
        message: `Correct! ${current.name} is a ${current.categoryLabel}!`,
      });
    } else {
      soundSynthesizer.playErrorSound();
      setStreak(0);
      setFeedback({
        correct: false,
        message: `Incorrect. ${current.name} is classified as ${current.categoryLabel}!`,
      });
    }

    setTimeout(() => {
      setFeedback(null);
      if (index + 1 < SHASTRA_ITEMS.length) {
        setIndex((i) => i + 1);
      } else {
        setGameOver(true);
      }
    }, 1300);
  };

  const handleRestart = () => {
    setIndex(0);
    setScore(0);
    setPoints(0);
    setStreak(0);
    setFeedback(null);
    setGameOver(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 inline-block mb-1">
            Natya Shastra 4-Fold System
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-950">
            Natya Shastra Acoustic Sorter
          </h2>
          <p className="text-sm text-stone-600">
            Classify the instrument into Bharata Muni's 2,000-year-old classification!
          </p>
        </div>

        <div className="flex items-center gap-4 bg-amber-50 px-4 py-2.5 rounded-2xl border border-amber-200">
          <div className="text-center">
            <span className="text-[10px] text-stone-500 font-semibold block uppercase">Item</span>
            <span className="text-base font-bold text-stone-800">
              {index + 1} / {SHASTRA_ITEMS.length}
            </span>
          </div>
          <div className="w-px h-8 bg-amber-200" />
          <div className="text-center">
            <span className="text-[10px] text-stone-500 font-semibold block uppercase">Points</span>
            <span className="text-lg font-bold text-amber-700 flex items-center gap-0.5">
              <Sparkles className="w-3.5 h-3.5" />
              {points}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-md mb-6 text-center">
        <div className="max-w-xs mx-auto aspect-4/3 rounded-2xl overflow-hidden bg-stone-900 mb-4 shadow-md">
          <img
            src={`/images/instruments/${current.slug}.jpg`}
            alt={current.name}
            onError={(e) => {
              e.currentTarget.src = getFallbackForInstrument(current.slug);
            }}
            className="w-full h-full object-cover"
          />
        </div>

        <h3 className="font-serif text-3xl font-bold text-stone-900 mb-1">{current.name}</h3>
        <p className="text-xs text-stone-500 mb-6 italic">{current.hint}</p>

        {/* 4 Classification Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl mx-auto mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => handleClassify(cat.key)}
              disabled={feedback !== null}
              className="p-4 rounded-2xl border-2 border-amber-200 bg-amber-50/50 hover:bg-amber-100 hover:border-amber-400 text-amber-950 font-semibold text-left transition-all active:scale-95 cursor-pointer shadow-xs"
            >
              <span className="text-2xl mr-2">{cat.icon}</span>
              <span className="font-serif font-bold text-base block">{cat.name}</span>
              <span className="text-xs text-stone-600 font-normal">{cat.english}</span>
            </button>
          ))}
        </div>

        {/* Feedback alert */}
        <div className="h-10 flex items-center justify-center">
          {feedback && (
            <div
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold animate-in fade-in ${
                feedback.correct
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}
            >
              {feedback.correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              {feedback.message}
            </div>
          )}
        </div>
      </div>

      {gameOver && (
        <GameOverModal
          gameTitle="Natya Shastra Sorter"
          score={score}
          totalQuestions={SHASTRA_ITEMS.length}
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
