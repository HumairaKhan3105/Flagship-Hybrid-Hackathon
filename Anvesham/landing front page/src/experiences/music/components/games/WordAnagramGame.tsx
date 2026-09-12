import React, { useState, useEffect } from 'react';
import { Sparkles, Delete, RotateCcw, Lightbulb, CheckCircle2 } from 'lucide-react';
import { soundSynthesizer } from '../../services/soundSynthesizer.ts';
import { GameOverModal } from './GameOverModal.tsx';

interface AnagramItem {
  word: string;
  displayWord: string;
  hint: string;
  family: string;
}

const ANAGRAM_LIST: AnagramItem[] = [
  { word: 'SHEHNAI', displayWord: 'SHEHNAI', hint: 'Double-reed sacred wind instrument played at dawn and celebrations', family: 'Wind' },
  { word: 'MRIDANGAM', displayWord: 'MRIDANGAM', hint: 'The premier rhythmic barrel drum of Carnatic classical concerts', family: 'Percussion' },
  { word: 'SANTOOR', displayWord: 'SANTOOR', hint: '100-string hammered dulcimer from the valleys of Kashmir', family: 'Classical' },
  { word: 'BANSURI', displayWord: 'BANSURI', hint: 'Seven-hole bamboo flute associated with Lord Krishna', family: 'Wind' },
  { word: 'EKTARA', displayWord: 'EKTARA', hint: 'Single-string drone instrument of mystic wandering Baul minstrels', family: 'Folk' },
];

export const WordAnagramGame: React.FC<{ onExit: () => void; onViewLeaderboard: () => void }> = ({
  onExit,
  onViewLeaderboard,
}) => {
  const [roundIdx, setRoundIdx] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const current = ANAGRAM_LIST[roundIdx];

  // Scramble letters
  useEffect(() => {
    const letters = current.word.split('').sort(() => Math.random() - 0.5);
    setScrambledLetters(letters);
    setSelectedIndices([]);
    setShowHint(false);
    setIsSuccess(false);
  }, [roundIdx]);

  const assembledWord = selectedIndices.map((idx) => scrambledLetters[idx]).join('');

  const handlePickLetter = (idx: number) => {
    if (selectedIndices.includes(idx)) return;
    soundSynthesizer.playPercussionBeat('ta');
    const nextIndices = [...selectedIndices, idx];
    setSelectedIndices(nextIndices);

    const newWord = nextIndices.map((i) => scrambledLetters[i]).join('');
    if (newWord.length === current.word.length) {
      if (newWord === current.word) {
        // SOLVED!
        soundSynthesizer.playSuccessSound();
        setIsSuccess(true);
        setScore((s) => s + 1);
        const newStreak = streak + 1;
        setStreak(newStreak);
        const pts = 200 - (showHint ? 50 : 0) + newStreak * 20;
        setPoints((p) => p + pts);

        setTimeout(() => {
          if (roundIdx + 1 < ANAGRAM_LIST.length) {
            setRoundIdx((r) => r + 1);
          } else {
            setGameOver(true);
          }
        }, 1200);
      } else {
        soundSynthesizer.playErrorSound();
        setStreak(0);
      }
    }
  };

  const handleBackspace = () => {
    if (selectedIndices.length === 0) return;
    setSelectedIndices((prev) => prev.slice(0, prev.length - 1));
  };

  const handleClear = () => {
    setSelectedIndices([]);
  };

  const handleRestart = () => {
    setRoundIdx(0);
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
            Lexicon & Anagrams
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-amber-950">
            Swara Word Anagram (संगीत शब्द पहेली)
          </h2>
          <p className="text-sm text-stone-600">
            Tap the scrambled letters to spell the sacred instrument's name!
          </p>
        </div>

        <div className="flex items-center gap-4 bg-amber-50 px-4 py-2.5 rounded-2xl border border-amber-200">
          <div className="text-center">
            <span className="text-[10px] text-stone-500 font-semibold block uppercase">Word</span>
            <span className="text-base font-bold text-stone-800">
              {roundIdx + 1} / {ANAGRAM_LIST.length}
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

      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-md text-center mb-6">
        {/* Assembled Word Slot */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap min-h-[64px]">
          {Array.from({ length: current.word.length }).map((_, i) => {
            const letter = assembledWord[i];
            return (
              <div
                key={i}
                className={`w-12 h-14 rounded-2xl border-2 font-mono font-bold text-2xl flex items-center justify-center transition-all ${
                  letter
                    ? isSuccess
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-950 scale-105'
                      : 'bg-amber-100 border-amber-400 text-amber-950 shadow-sm'
                    : 'bg-stone-50 border-dashed border-stone-300 text-transparent'
                }`}
              >
                {letter || '_'}
              </div>
            );
          })}
        </div>

        {/* Scrambled Letter Tiles */}
        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          {scrambledLetters.map((char, idx) => {
            const isUsed = selectedIndices.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => handlePickLetter(idx)}
                disabled={isUsed || isSuccess}
                className={`w-12 h-14 rounded-2xl font-bold font-serif text-xl transition-all flex items-center justify-center cursor-pointer shadow-xs ${
                  isUsed
                    ? 'bg-stone-100 border border-stone-200 text-stone-300 scale-95'
                    : 'bg-amber-800 hover:bg-amber-900 border border-amber-700 text-amber-100 active:scale-95 shadow-md'
                }`}
              >
                {char}
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={handleBackspace}
            disabled={selectedIndices.length === 0}
            className="py-2.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <Delete className="w-4 h-4" /> Backspace
          </button>
          <button
            onClick={handleClear}
            disabled={selectedIndices.length === 0}
            className="py-2.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" /> Clear
          </button>
          <button
            onClick={() => setShowHint(true)}
            className="py-2.5 px-4 rounded-xl bg-amber-50 border border-amber-300 hover:bg-amber-100 text-amber-900 font-semibold text-xs transition-colors flex items-center gap-1.5"
          >
            <Lightbulb className="w-4 h-4 text-amber-600" /> Need a Clue?
          </button>
        </div>

        {/* Hint Box */}
        {showHint && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl max-w-md mx-auto text-xs text-amber-950 text-left animate-in fade-in">
            <strong className="font-semibold block text-amber-900 mb-0.5">Heritage Clue:</strong>
            {current.hint} ({current.family} family)
          </div>
        )}
      </div>

      {gameOver && (
        <GameOverModal
          gameTitle="Swara Word Anagram"
          score={score}
          totalQuestions={ANAGRAM_LIST.length}
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
