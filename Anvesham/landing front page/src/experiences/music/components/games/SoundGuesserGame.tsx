import React, { useState, useEffect } from 'react';
import { Volume2, Play, Sparkles, Flame, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { soundSynthesizer } from '../../services/soundSynthesizer.ts';
import { GameOverModal } from './GameOverModal.tsx';
import { getFallbackForInstrument } from '../../utils/imageFallback.ts';

interface SoundMysteryRound {
  slug: string;
  name: string;
  hindiName: string;
  acousticClue: string;
  family: string;
  options: { slug: string; name: string }[];
}

const SOUND_ROUNDS: SoundMysteryRound[] = [
  {
    slug: 'sitar',
    name: 'Sitar',
    hindiName: 'सितार',
    acousticClue: 'Listen for the shimmering microtonal glides (meend) across curved brass frets and sympathetic resonance wires.',
    family: 'String',
    options: [
      { slug: 'sitar', name: 'Sitar' },
      { slug: 'sarod', name: 'Sarod' },
      { slug: 'veena', name: 'Saraswati Veena' },
      { slug: 'santoor', name: 'Santoor' },
    ],
  },
  {
    slug: 'bansuri',
    name: 'Bansuri',
    hindiName: 'बांसुरी',
    acousticClue: 'A warm, meditative acoustic tone produced purely by breath flowing over seven natural bamboo finger holes.',
    family: 'Wind',
    options: [
      { slug: 'shehnai', name: 'Shehnai' },
      { slug: 'bansuri', name: 'Bansuri' },
      { slug: 'algoza', name: 'Algoza' },
      { slug: 'nadaswaram', name: 'Nadaswaram' },
    ],
  },
  {
    slug: 'shehnai',
    name: 'Shehnai',
    hindiName: 'शहनाई',
    acousticClue: 'A piercing, sacred double-reed acoustic sound traditionally played at dawn, weddings, and temple sanctums.',
    family: 'Wind',
    options: [
      { slug: 'pepa', name: 'Pepa' },
      { slug: 'bansuri', name: 'Bansuri' },
      { slug: 'shehnai', name: 'Shehnai' },
      { slug: 'algoza', name: 'Algoza' },
    ],
  },
  {
    slug: 'ghatam',
    name: 'Ghatam',
    hindiName: 'घटम',
    acousticClue: 'A resonant, metallic-earth acoustic tone created by slapping the mouth, belly, and rim of a specially baked clay pot.',
    family: 'Percussion',
    options: [
      { slug: 'tabla', name: 'Tabla' },
      { slug: 'ghatam', name: 'Ghatam' },
      { slug: 'kanjira', name: 'Kanjira' },
      { slug: 'mridangam', name: 'Mridangam' },
    ],
  },
  {
    slug: 'tabla',
    name: 'Tabla',
    hindiName: 'तबला',
    acousticClue: 'A resonant dual-pitch stroke combining the open bass of the Bayan with the crisp, ringing bell-like Syahi of the Dayan.',
    family: 'Percussion',
    options: [
      { slug: 'dholak', name: 'Dholak' },
      { slug: 'mridangam', name: 'Mridangam' },
      { slug: 'tabla', name: 'Tabla' },
      { slug: 'pakhawaj', name: 'Pakhawaj' },
    ],
  },
];

export const SoundGuesserGame: React.FC<{ onExit: () => void; onViewLeaderboard: () => void }> = ({
  onExit,
  onViewLeaderboard,
}) => {
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [hasPlayedSound, setHasPlayedSound] = useState(false);
  const [score, setScore] = useState(0);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const round = SOUND_ROUNDS[currentRoundIdx];

  const playTone = () => {
    soundSynthesizer.playInstrumentMysteryTone(round.slug);
    setHasPlayedSound(true);
  };

  // Auto-play tone when a new round starts
  useEffect(() => {
    setSelectedSlug(null);
    setHasPlayedSound(false);
    const t = setTimeout(() => {
      soundSynthesizer.playInstrumentMysteryTone(round.slug);
      setHasPlayedSound(true);
    }, 400);
    return () => clearTimeout(t);
  }, [currentRoundIdx]);

  const handleSelectOption = (slug: string) => {
    if (selectedSlug !== null) return; // already answered
    setSelectedSlug(slug);

    if (slug === round.slug) {
      soundSynthesizer.playSuccessSound();
      setScore((s) => s + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      const earned = 200 + newStreak * 25;
      setPoints((p) => p + earned);
    } else {
      soundSynthesizer.playErrorSound();
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentRoundIdx + 1 < SOUND_ROUNDS.length) {
      setCurrentRoundIdx((r) => r + 1);
    } else {
      setGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentRoundIdx(0);
    setSelectedSlug(null);
    setScore(0);
    setPoints(0);
    setStreak(0);
    setGameOver(false);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 inline-block mb-1">
            Ear Training & Acuity
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-950">
            Blind Sound Mystery (ध्वनि पहचान)
          </h2>
          <p className="text-sm text-stone-600">
            Listen closely to the synthesized tone and identify the traditional instrument!
          </p>
        </div>

        <div className="flex items-center gap-4 bg-amber-50 px-4 py-2.5 rounded-2xl border border-amber-200">
          <div className="text-center">
            <span className="text-[10px] text-stone-500 font-semibold block uppercase">Round</span>
            <span className="text-base font-bold text-stone-800">
              {currentRoundIdx + 1} / {SOUND_ROUNDS.length}
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

      {/* Main Sound Stage */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-md text-center mb-6">
        {/* Speaker Acoustic Visualizer */}
        <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-tr from-amber-600 to-amber-800 text-white flex items-center justify-center shadow-lg shadow-amber-600/20 mb-5 relative group">
          <Volume2 className="w-12 h-12" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-400"></span>
          </span>
        </div>

        <button
          onClick={playTone}
          className="py-3 px-6 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold text-sm transition-colors border border-amber-300 inline-flex items-center gap-2 mb-4"
        >
          <Play className="w-4 h-4 fill-amber-900" />
          Replay Mystery Tone
        </button>

        <p className="text-sm text-stone-600 max-w-lg mx-auto italic bg-stone-50 p-3 rounded-xl border border-stone-200/70 mb-6">
          "{round.acousticClue}"
        </p>

        {/* 4 Instrument Candidate Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-xl mx-auto mb-6">
          {round.options.map((opt) => {
            const isSelected = selectedSlug === opt.slug;
            const isCorrect = opt.slug === round.slug;
            let btnStyle = 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-900';

            if (selectedSlug !== null) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-100 border-emerald-400 text-emerald-950 font-bold ring-2 ring-emerald-400';
              } else if (isSelected) {
                btnStyle = 'bg-rose-100 border-rose-400 text-rose-950 ring-2 ring-rose-400';
              } else {
                btnStyle = 'opacity-40 bg-stone-50 border-stone-200 text-stone-500';
              }
            }

            return (
              <button
                key={opt.slug}
                onClick={() => handleSelectOption(opt.slug)}
                disabled={selectedSlug !== null}
                className={`py-4 px-5 rounded-2xl border-2 text-left font-serif text-lg transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
              >
                <span>{opt.name}</span>
                {selectedSlug !== null && isCorrect && (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                )}
                {selectedSlug !== null && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600" />
                )}
              </button>
            );
          })}
        </div>

        {/* Result & Reveal Card */}
        {selectedSlug !== null && (
          <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-2xl max-w-xl mx-auto flex items-center gap-4 text-left animate-in fade-in">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-900 shrink-0">
              <img
                src={`/images/instruments/${round.slug}.jpg`}
                alt={round.name}
                onError={(e) => {
                  e.currentTarget.src = getFallbackForInstrument(round.slug, round.family);
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider block">
                {selectedSlug === round.slug ? 'Spot On!' : 'Correct Answer:'}
              </span>
              <h4 className="font-serif font-bold text-amber-950 text-base">
                {round.name} ({round.hindiName})
              </h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Belongs to the {round.family} instrument family.
              </p>
            </div>
            <button
              onClick={handleNext}
              className="py-2.5 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0"
            >
              {currentRoundIdx + 1 < SOUND_ROUNDS.length ? 'Next Mystery →' : 'View Results'}
            </button>
          </div>
        )}
      </div>

      {gameOver && (
        <GameOverModal
          gameTitle="Blind Sound Mystery"
          score={score}
          totalQuestions={SOUND_ROUNDS.length}
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
