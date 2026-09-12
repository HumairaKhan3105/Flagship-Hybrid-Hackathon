import React, { useState } from 'react';
import { Hammer, Sparkles, CheckCircle, XCircle, ShieldAlert } from 'lucide-react';
import { soundSynthesizer } from '../../services/soundSynthesizer.ts';
import { GameOverModal } from './GameOverModal.tsx';

interface CraftQuestion {
  title: string;
  materialClue: string;
  correctAnswer: string;
  options: string[];
  culturalFact: string;
}

const CRAFT_QUESTIONS: CraftQuestion[] = [
  {
    title: 'The Tumba (Acoustic Dried Gourd)',
    materialClue: 'Carefully sun-dried, hollowed bitter bottle gourd (Lagenaria siceraria) used as a lower and upper spherical sound resonator.',
    correctAnswer: 'Sitar & Rudra Veena',
    options: ['Sitar & Rudra Veena', 'Bansuri & Shehnai', 'Tabla & Dholak', 'Kartal & Morchang'],
    culturalFact: 'Artisans from Bengal and Miraj select mature gourds grown on special riverbanks to ensure maximum microtonal resonance.',
  },
  {
    title: 'The Mystic Syahi (Black Tuning Spot)',
    materialClue: 'A circular compound of iron filings, soot, boiled rice paste, and tamarind water layered painstakingly to create crisp harmonics.',
    correctAnswer: 'Tabla & Mridangam',
    options: ['Tabla & Mridangam', 'Sarangi & Ektara', 'Santoor & Sarod', 'Ghatam & Chenda'],
    culturalFact: 'The Syahi loads the skin membrane, converting harmonic overtones into pure bell-like pitched musical notes.',
  },
  {
    title: 'Buffalo Horn & Reed Craft',
    materialClue: 'A natural curved horn sourced from deceased wild Asiatic water buffalo, fitted onto a bamboo pipe with a tiny reed.',
    correctAnswer: 'Pepa',
    options: ['Pepa', 'Ravanahatha', 'Algoza', 'Sarangi'],
    culturalFact: 'The Pepa was historically sounded by tribal warriors and cattle herders before becoming the soul of Rongali Bihu.',
  },
  {
    title: 'Baked Clay with Copper Filings',
    materialClue: 'Dense earthenware pot fired in special wood kilns with brass and copper filings hammered into the clay walls for metallic ring.',
    correctAnswer: 'Manamadurai Ghatam',
    options: ['Manamadurai Ghatam', 'Dafli', 'Khol', 'Pakhawaj'],
    culturalFact: 'Potters in Manamadurai, Tamil Nadu, bake each Ghatam for weeks; only 1 in 10 pots meets the concert pitch standards of masters.',
  },
  {
    title: 'Monolithic Aged Jackfruit Wood',
    materialClue: 'Carved out of a single whole trunk of aged jackfruit wood (Pala Maram), renowned for its warm acoustic resistance to humidity.',
    correctAnswer: 'Saraswati Veena',
    options: ['Saraswati Veena', 'Bansuri', 'Algoza', 'Morchang'],
    culturalFact: 'Known as an Ekanda Veena, this instrument has zero joints between the neck, body, and bowl, giving unbroken sustain.',
  },
];

export const CraftDetectiveGame: React.FC<{ onExit: () => void; onViewLeaderboard: () => void }> = ({
  onExit,
  onViewLeaderboard,
}) => {
  const [qIdx, setQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const q = CRAFT_QUESTIONS[qIdx];

  const handleSelect = (opt: string) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(opt);

    if (opt === q.correctAnswer) {
      soundSynthesizer.playSuccessSound();
      setScore((s) => s + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setPoints((p) => p + 180 + newStreak * 25);
    } else {
      soundSynthesizer.playErrorSound();
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (qIdx + 1 < CRAFT_QUESTIONS.length) {
      setQIdx((i) => i + 1);
      setSelectedOpt(null);
    } else {
      setGameOver(true);
    }
  };

  const handleRestart = () => {
    setQIdx(0);
    setSelectedOpt(null);
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
            Artisanal Metallurgy & Botany
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-950">
            Craft & Anatomy Detective
          </h2>
          <p className="text-sm text-stone-600">
            Deduce which sacred instruments rely on these rare organic crafting secrets!
          </p>
        </div>

        <div className="flex items-center gap-4 bg-amber-50 px-4 py-2.5 rounded-2xl border border-amber-200">
          <div className="text-center">
            <span className="text-[10px] text-stone-500 font-semibold block uppercase">Evidence</span>
            <span className="text-base font-bold text-stone-800">
              {qIdx + 1} / {CRAFT_QUESTIONS.length}
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
        <div className="mb-6">
          <div className="flex items-center gap-2 text-amber-800 mb-2">
            <Hammer className="w-5 h-5 text-amber-600" />
            <span className="text-xs uppercase tracking-wider font-bold">Artisan Material Dossier</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-amber-950 mb-3">{q.title}</h3>
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-stone-700 text-sm leading-relaxed italic">
            "{q.materialClue}"
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {q.options.map((opt) => {
            const isSelected = selectedOpt === opt;
            const isCorrect = opt === q.correctAnswer;
            let style = 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-900';

            if (selectedOpt !== null) {
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
                key={opt}
                onClick={() => handleSelect(opt)}
                disabled={selectedOpt !== null}
                className={`py-4 px-5 rounded-2xl border-2 text-left font-semibold text-base transition-all flex items-center justify-between cursor-pointer ${style}`}
              >
                <span>{opt}</span>
                {selectedOpt !== null && isCorrect && (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                )}
                {selectedOpt !== null && isSelected && !isCorrect && (
                  <XCircle className="w-5 h-5 text-rose-600" />
                )}
              </button>
            );
          })}
        </div>

        {selectedOpt !== null && (
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 mb-4 animate-in fade-in">
            <span className="text-xs uppercase font-bold text-amber-800 block mb-1">
              Historical Craft Fact:
            </span>
            <p className="text-xs text-stone-700 leading-relaxed mb-3">{q.culturalFact}</p>
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="py-2.5 px-5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                {qIdx + 1 < CRAFT_QUESTIONS.length ? 'Next Mystery →' : 'Complete Detective Case'}
              </button>
            </div>
          </div>
        )}
      </div>

      {gameOver && (
        <GameOverModal
          gameTitle="Craft & Anatomy Detective"
          score={score}
          totalQuestions={CRAFT_QUESTIONS.length}
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
