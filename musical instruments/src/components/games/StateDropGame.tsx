import React, { useState } from 'react';
import { MapPin, Sparkles, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { soundSynthesizer } from '../../services/soundSynthesizer.ts';
import { GameOverModal } from './GameOverModal.tsx';
import { getFallbackForInstrument } from '../../utils/imageFallback.ts';

interface StateQuestion {
  instrumentSlug: string;
  name: string;
  family: string;
  lore: string;
  correctState: string;
  options: string[];
}

const STATE_QUESTIONS: StateQuestion[] = [
  {
    instrumentSlug: 'ravanahatha',
    name: 'Ravanahatha',
    family: 'Folk',
    lore: 'Played by nomadic Bhopa bard-priests across the Thar desert while narrating the Pabuji folk epic.',
    correctState: 'Rajasthan',
    options: ['Rajasthan', 'Gujarat', 'Punjab', 'Madhya Pradesh'],
  },
  {
    instrumentSlug: 'pepa',
    name: 'Pepa',
    family: 'Wind',
    lore: 'Carved from buffalo horn and bamboo, played during the vibrant Bihu harvest spring festivals.',
    correctState: 'Assam',
    options: ['Assam', 'Manipur', 'Meghalaya', 'Nagaland'],
  },
  {
    instrumentSlug: 'chenda',
    name: 'Chenda',
    family: 'Percussion',
    lore: 'Thundering cylindrical wooden drum central to Kathakali dance and temple Pooram processions.',
    correctState: 'Kerala',
    options: ['Kerala', 'Tamil Nadu', 'Karnataka', 'Andhra Pradesh'],
  },
  {
    instrumentSlug: 'ektara',
    name: 'Ektara',
    family: 'Folk',
    lore: 'Single-string drone instrument strummed by wandering mystic Baul minstrels seeking inner divinity.',
    correctState: 'West Bengal',
    options: ['West Bengal', 'Bihar', 'Odisha', 'Jharkhand'],
  },
  {
    instrumentSlug: 'algoza',
    name: 'Algoza',
    family: 'Wind',
    lore: 'Double bamboo flute played with continuous circular breathing by desert shepherds and pastoralists.',
    correctState: 'Punjab',
    options: ['Punjab', 'Uttar Pradesh', 'Himachal Pradesh', 'Haryana'],
  },
  {
    instrumentSlug: 'santoor',
    name: 'Santoor',
    family: 'Classical',
    lore: '100-string walnut dulcimer originating from Himalayan valleys as part of Sufiana Kalam recitals.',
    correctState: 'Jammu & Kashmir',
    options: ['Jammu & Kashmir', 'Uttarakhand', 'Himachal Pradesh', 'Punjab'],
  },
];

export const StateDropGame: React.FC<{ onExit: () => void; onViewLeaderboard: () => void }> = ({
  onExit,
  onViewLeaderboard,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const q = STATE_QUESTIONS[currentIdx];

  const handleSelect = (state: string) => {
    if (selectedState !== null) return;
    setSelectedState(state);

    if (state === q.correctState) {
      soundSynthesizer.playSuccessSound();
      setScore((s) => s + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setPoints((p) => p + 160 + newStreak * 20);
    } else {
      soundSynthesizer.playErrorSound();
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < STATE_QUESTIONS.length) {
      setCurrentIdx((i) => i + 1);
      setSelectedState(null);
    } else {
      setGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedState(null);
    setScore(0);
    setPoints(0);
    setStreak(0);
    setGameOver(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 inline-block mb-1">
            Geography & Folk Roots
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-950">
            State Heritage Drop (राग और राज्य)
          </h2>
          <p className="text-sm text-stone-600">
            Which Indian state gave birth to this traditional instrument?
          </p>
        </div>

        <div className="flex items-center gap-4 bg-amber-50 px-4 py-2.5 rounded-2xl border border-amber-200">
          <div className="text-center">
            <span className="text-[10px] text-stone-500 font-semibold block uppercase">Question</span>
            <span className="text-base font-bold text-stone-800">
              {currentIdx + 1} / {STATE_QUESTIONS.length}
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

      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-md mb-6">
        <div className="flex flex-col md:flex-row gap-6 items-center mb-6">
          <div className="w-full md:w-56 aspect-4/3 rounded-2xl overflow-hidden bg-stone-900 shadow-md shrink-0">
            <img
              src={`/images/instruments/${q.instrumentSlug}.jpg`}
              alt={q.name}
              onError={(e) => {
                e.currentTarget.src = getFallbackForInstrument(q.instrumentSlug, q.family);
              }}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 text-center md:text-left">
            <span className="text-xs uppercase tracking-wider font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 inline-block mb-2">
              {q.family} Tradition
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">
              {q.name}
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed">{q.lore}</p>
          </div>
        </div>

        {/* State Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {q.options.map((st) => {
            const isSelected = selectedState === st;
            const isCorrect = st === q.correctState;
            let style = 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-900';

            if (selectedState !== null) {
              if (isCorrect) {
                style = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold ring-2 ring-emerald-300';
              } else if (isSelected) {
                style = 'bg-rose-100 border-rose-400 text-rose-950 ring-2 ring-rose-300';
              } else {
                style = 'opacity-40 bg-stone-50 border-stone-200 text-stone-400';
              }
            }

            return (
              <button
                key={st}
                onClick={() => handleSelect(st)}
                disabled={selectedState !== null}
                className={`py-4 px-5 rounded-2xl border-2 text-left font-semibold text-base transition-all flex items-center justify-between cursor-pointer ${style}`}
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  {st}
                </span>
                {selectedState !== null && isCorrect && (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                )}
                {selectedState !== null && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600" />
                )}
              </button>
            );
          })}
        </div>

        {selectedState !== null && (
          <div className="flex justify-end animate-in fade-in">
            <button
              onClick={handleNext}
              className="py-3 px-6 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-sm transition-colors flex items-center gap-2 shadow-sm"
            >
              {currentIdx + 1 < STATE_QUESTIONS.length ? 'Next Instrument →' : 'View Score Summary'}
            </button>
          </div>
        )}
      </div>

      {gameOver && (
        <GameOverModal
          gameTitle="State Heritage Drop"
          score={score}
          totalQuestions={STATE_QUESTIONS.length}
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
