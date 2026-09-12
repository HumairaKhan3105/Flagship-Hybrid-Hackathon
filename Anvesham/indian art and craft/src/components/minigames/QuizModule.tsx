import React, { useState } from 'react';
import { CraftRegion } from '../../types';
import { sound } from '../../utils/soundEngine';
import confetti from 'canvas-confetti';
import { ChevronLeft, CheckCircle2, XCircle, Award, HelpCircle, ArrowRight } from 'lucide-react';

interface QuizModuleProps {
  region: CraftRegion;
  onQuizComplete: (score: number, total: number) => void;
  onBackToWorld: () => void;
}

export const QuizModule: React.FC<QuizModuleProps> = ({
  region,
  onQuizComplete,
  onBackToWorld,
}) => {
  const questions = region.quiz;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setShowExplanation(true);

    if (idx === currentQ.correctIndex) {
      sound.playCorrect();
      setCorrectCount((prev) => prev + 1);
    } else {
      sound.playWrong();
    }
  };

  const handleNext = () => {
    sound.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setIsFinished(true);
      sound.playLevelVictory();
      if (correctCount >= 4) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#dc2626', '#10b981'],
        });
      }
      onQuizComplete(correctCount, questions.length);
    }
  };

  const handleRetryQuestion = () => {
    sound.playClick();
    setSelectedOption(null);
    setShowExplanation(false);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-stone-950 text-amber-50 select-none overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-stone-900 border-b border-amber-500/30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBackToWorld();
            }}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-500/20 transition-all active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-lg font-bold font-heading text-amber-400">
              {region.craftName} Knowledge Quiz
            </h2>
            <p className="text-xs text-stone-400">
              Curriculum Heritage Master Assessment • Class 8–12
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800 border border-amber-500/20 text-xs">
          <Award size={14} className="text-amber-400" />
          <span className="font-bold text-amber-300">
            Question {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-2xl mx-auto w-full">
        {/* Progress Bar */}
        <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden mb-6">
          <div
            className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="w-full bg-gradient-to-b from-stone-900 to-stone-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-2">
            Heritage Inquiry #{currentIndex + 1}
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-amber-100 mb-6 leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let optionStyle = 'bg-stone-800/80 border-stone-700 hover:border-amber-500/60 text-stone-200';
              if (selectedOption !== null) {
                if (isCorrect) {
                  optionStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-100 shadow-md';
                } else if (isSelected) {
                  optionStyle = 'bg-red-950/60 border-red-500 text-red-100 animate-shake';
                } else {
                  optionStyle = 'bg-stone-900/50 border-stone-800 text-stone-500 opacity-60';
                }
              }

              return (
                <button
                  key={option}
                  disabled={selectedOption !== null}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-left font-medium text-sm sm:text-base ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-stone-700/60 flex items-center justify-center font-bold text-xs">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {selectedOption !== null && (
                    <span>
                      {isCorrect && <CheckCircle2 size={20} className="text-emerald-400" />}
                      {isSelected && !isCorrect && <XCircle size={20} className="text-red-400" />}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Educational Explanation Box */}
          {showExplanation && (
            <div className="mt-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-xs sm:text-sm text-amber-200 leading-relaxed animate-in fade-in duration-300">
              <div className="font-bold flex items-center gap-1 text-amber-400 mb-1">
                <HelpCircle size={14} />
                <span>Historical Fact</span>
              </div>
              <p>{currentQ.explanation}</p>
            </div>
          )}

          {/* Continue / Retry bar */}
          {selectedOption !== null && (
            <div className="mt-6 flex items-center justify-end gap-3">
              {selectedOption !== currentQ.correctIndex && (
                <button
                  onClick={handleRetryQuestion}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 text-xs font-semibold border border-stone-700 transition-all"
                >
                  Try Again
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 text-white text-sm font-bold shadow-lg transition-all active:scale-95"
              >
                <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'View Results'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Final Results Modal */}
      {isFinished && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-amber-500/60 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl glow-heritage">
            <div className="w-16 h-16 bg-amber-500/20 border-2 border-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              📜
            </div>
            <h2 className="text-2xl font-bold font-heading text-amber-300">
              Quiz Completed!
            </h2>
            <p className="text-stone-300 text-sm mt-2">
              Mastery assessment for {region.craftName}
            </p>

            <div className="bg-stone-800/80 border border-amber-500/30 rounded-2xl p-4 my-6 flex justify-around">
              <div>
                <span className="text-xs text-stone-400 block">Final Score</span>
                <span className="text-2xl font-extrabold text-amber-400">
                  {correctCount} / {questions.length}
                </span>
              </div>
              <div className="border-r border-stone-700" />
              <div>
                <span className="text-xs text-stone-400 block">XP Reward</span>
                <span className="text-2xl font-extrabold text-emerald-400">
                  +{correctCount * 10} XP
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onBackToWorld();
              }}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 text-white rounded-xl font-bold text-sm shadow-lg transition-all"
            >
              Continue Adventure
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
