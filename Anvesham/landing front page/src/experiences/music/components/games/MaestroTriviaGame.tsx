import React, { useState } from 'react';
import { Award, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { soundSynthesizer } from '../../services/soundSynthesizer.ts';
import { GameOverModal } from './GameOverModal.tsx';

interface MaestroQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

const TRIVIA_QUESTIONS: MaestroQuestion[] = [
  {
    question: 'Which legendary Shehnai maestro was awarded the Bharat Ratna in 2001 and played from the ramparts of the Red Fort on India’s Independence Day?',
    options: ['Ustad Bismillah Khan', 'Pt. Hariprasad Chaurasia', 'Ustad Ali Akbar Khan', 'Pt. Ram Narayan'],
    answer: 'Ustad Bismillah Khan',
    explanation: 'Ustad Bismillah Khan elevated the Shehnai from a folk ceremonial wedding pipe to international concert auditoriums.',
  },
  {
    question: 'Which legendary Sitar maestro performed at the 1969 Woodstock Festival and collaborated extensively with George Harrison and Yehudi Menuhin?',
    options: ['Pandit Ravi Shankar', 'Ustad Vilayat Khan', 'Pt. Nikhil Banerjee', 'Ustad Shahid Parvez'],
    answer: 'Pandit Ravi Shankar',
    explanation: 'Pandit Ravi Shankar became a global cultural ambassador, introducing Indian ragas to Western symphony halls and counter-culture festivals.',
  },
  {
    question: 'Which legendary percussionist formed the historic cross-cultural fusion ensembles "Shakti" and "Planet Drum"?',
    options: ['Ustad Zakir Hussain', 'Pt. Anindo Chatterjee', 'Pt. Kishan Maharaj', 'Ustad Alla Rakha'],
    answer: 'Ustad Zakir Hussain',
    explanation: 'Ustad Zakir Hussain, son of Ustad Alla Rakha, won multiple Grammy Awards and redefined classical rhythm on global stages.',
  },
  {
    question: 'Pandit Shivkumar Sharma single-handedly transformed which folk instrument from Kashmiri Sufiana music into a premier Hindustani classical solo instrument?',
    options: ['Santoor', 'Sarangi', 'Rudra Veena', 'Ghatam'],
    answer: 'Santoor',
    explanation: 'He modified the 100-string dulcimer by developing a special sliding mallet technique to produce the vocal "meend" essential to ragas.',
  },
  {
    question: 'Who is revered as the undisputed "Emperor of Sarod" from the Maihar Gharana who founded the Ali Akbar College of Music in California?',
    options: ['Ustad Ali Akbar Khan', 'Ustad Amjad Ali Khan', 'Pt. Radhika Mohan Maitra', 'Pt. Buddhadev Das Gupta'],
    answer: 'Ustad Ali Akbar Khan',
    explanation: 'Revered as a "National Living Treasure" by the Government of India, his father was the legendary Guru Baba Allauddin Khan.',
  },
];

export const MaestroTriviaGame: React.FC<{ onExit: () => void; onViewLeaderboard: () => void }> = ({
  onExit,
  onViewLeaderboard,
}) => {
  const [index, setIndex] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const q = TRIVIA_QUESTIONS[index];

  const handleSelect = (opt: string) => {
    if (selectedOpt !== null) return;
    setSelectedOpt(opt);

    if (opt === q.answer) {
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
    if (index + 1 < TRIVIA_QUESTIONS.length) {
      setIndex((i) => i + 1);
      setSelectedOpt(null);
    } else {
      setGameOver(true);
    }
  };

  const handleRestart = () => {
    setIndex(0);
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
            Gharana & Cultural Lore
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-950">
            Legendary Maestro Trivia
          </h2>
          <p className="text-sm text-stone-600">
            Test your knowledge on India's greatest musical luminaries and their legacies.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-amber-50 px-4 py-2.5 rounded-2xl border border-amber-200">
          <div className="text-center">
            <span className="text-[10px] text-stone-500 font-semibold block uppercase">Question</span>
            <span className="text-base font-bold text-stone-800">
              {index + 1} / {TRIVIA_QUESTIONS.length}
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
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 mb-6 leading-snug">
          {q.question}
        </h3>

        <div className="space-y-3 mb-6">
          {q.options.map((opt) => {
            const isSelected = selectedOpt === opt;
            const isCorrect = opt === q.answer;
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
                className={`w-full py-4 px-5 rounded-2xl border-2 text-left font-semibold text-base transition-all flex items-center justify-between cursor-pointer ${style}`}
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
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 mb-4 animate-in fade-in">
            <span className="text-xs uppercase font-bold text-amber-800 block mb-1">
              Historical Context:
            </span>
            <p className="text-xs text-stone-700 leading-relaxed mb-3">{q.explanation}</p>
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="py-2.5 px-5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                {index + 1 < TRIVIA_QUESTIONS.length ? 'Next Question →' : 'View Final Score'}
              </button>
            </div>
          </div>
        )}
      </div>

      {gameOver && (
        <GameOverModal
          gameTitle="Legendary Maestro Trivia"
          score={score}
          totalQuestions={TRIVIA_QUESTIONS.length}
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
