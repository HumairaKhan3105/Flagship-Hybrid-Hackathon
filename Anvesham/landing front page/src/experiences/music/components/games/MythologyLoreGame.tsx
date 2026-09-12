import React, { useState } from 'react';
import { Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { soundSynthesizer } from '../../services/soundSynthesizer.ts';
import { GameOverModal } from './GameOverModal.tsx';

interface LoreQuestion {
  title: string;
  deityLore: string;
  correctInstrument: string;
  options: string[];
  mythicFact: string;
}

const LORE_QUESTIONS: LoreQuestion[] = [
  {
    title: 'The Cosmic Rhythm of Creation',
    deityLore: 'When Lord Shiva performed the cosmic Tandava dance of creation and dissolution, fourteen sacred sound formulas (Maheshwara Sutras) resonated from which hourglass drum?',
    correctInstrument: 'Damru',
    options: ['Damru', 'Chenda', 'Tabla', 'Mridangam'],
    mythicFact: 'Panini, the ancient Sanskrit grammarian, based the entire phonetic grammar of Sanskrit on the 14 strikes of Shiva’s Damru.',
  },
  {
    title: 'The Supreme Embodiment of Nada Brahma',
    deityLore: 'Which sacred stringed instrument is seated upon the lap of Goddess Saraswati, representing speech (Vak), intellect, and the cosmic harmony of the universe?',
    correctInstrument: 'Veena',
    options: ['Veena', 'Sitar', 'Sarod', 'Santoor'],
    mythicFact: 'In Vedic scripture, the human spinal column with its 24 vertebrae is revered as the divine "Shariri Veena" (the body veena).',
  },
  {
    title: 'The Divine Melody of Vrindavan',
    deityLore: 'Which simple hollow reed instrument held by Lord Krishna is said to have enchanted all cows, rivers, gopis, and celestial beings in the groves of Vrindavan?',
    correctInstrument: 'Bansuri (Venu)',
    options: ['Bansuri (Venu)', 'Shehnai', 'Algoza', 'Pepa'],
    mythicFact: 'In Bhakti poetry, the flute symbolizes complete surrender (sunyata)—being completely empty inside so divine breath can flow through.',
  },
  {
    title: 'The Devotion of the Demon King',
    deityLore: 'According to legend, King Ravana cut off one of his ten heads and pulled out a tendon from his own arm to string which ancient bowed instrument to sing the Shiva Tandava Stotram?',
    correctInstrument: 'Ravanahatha',
    options: ['Ravanahatha', 'Sarangi', 'Ektara', 'Kamaicha'],
    mythicFact: 'Ravana was an extraordinary scholar of music; pleased by his devotion, Shiva granted him the divine Chandrahas sword.',
  },
  {
    title: 'The Celestial Bard of the Devas',
    deityLore: 'Which divine sage travels through the three worlds chanting "Narayana Narayana" while strumming his heavenly Tambura/Mahati Veena?',
    correctInstrument: 'Sage Narada',
    options: ['Sage Narada', 'Tansen', 'Bharata Muni', 'Sage Valmiki'],
    mythicFact: 'Narada is considered the celestial teacher of music, author of the historic Sangeeta Makaranda musical treatise.',
  },
];

export const MythologyLoreGame: React.FC<{ onExit: () => void; onViewLeaderboard: () => void }> = ({
  onExit,
  onViewLeaderboard,
}) => {
  const [qIdx, setQIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const q = LORE_QUESTIONS[qIdx];

  const handleSelect = (opt: string) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(opt);

    if (opt === q.correctInstrument) {
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
    if (qIdx + 1 < LORE_QUESTIONS.length) {
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
            Divine Origins & Scripture
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-950">
            Mythology & Sacred Lore
          </h2>
          <p className="text-sm text-stone-600">
            Discover the spiritual roots connecting the cosmos, deities, and sacred sounds.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-amber-50 px-4 py-2.5 rounded-2xl border border-amber-200">
          <div className="text-center">
            <span className="text-[10px] text-stone-500 font-semibold block uppercase">Chapter</span>
            <span className="text-base font-bold text-stone-800">
              {qIdx + 1} / {LORE_QUESTIONS.length}
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
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-amber-950 mb-3">{q.title}</h3>
        <p className="text-stone-700 text-base leading-relaxed mb-6 bg-amber-50/50 p-4 rounded-2xl border border-amber-200">
          {q.deityLore}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {q.options.map((opt) => {
            const isSelected = selectedOpt === opt;
            const isCorrect = opt === q.correctInstrument;
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
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 mb-4 animate-in fade-in">
            <span className="text-xs uppercase font-bold text-amber-800 block mb-1">
              Spiritual Lore Essence:
            </span>
            <p className="text-xs text-stone-700 leading-relaxed mb-3">{q.mythicFact}</p>
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="py-2.5 px-5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                {qIdx + 1 < LORE_QUESTIONS.length ? 'Next Sacred Chapter →' : 'View Final Honor'}
              </button>
            </div>
          </div>
        )}
      </div>

      {gameOver && (
        <GameOverModal
          gameTitle="Mythology & Sacred Lore"
          score={score}
          totalQuestions={LORE_QUESTIONS.length}
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
