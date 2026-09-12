import { useState, useEffect } from 'react';
import { QuizQuestion, PlayerProfile } from '../../types';
import { GAME_ASSETS } from '../../data/gameData';
import { Sparkles, HelpCircle, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface QuizScreenProps {
  question: QuizQuestion;
  player: PlayerProfile;
  onAnswerCorrect: () => void;
  onAnswerWrong: () => void;
}

export default function QuizScreen({
  question,
  player,
  onAnswerCorrect,
  onAnswerWrong,
}: QuizScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isWrongAnswer, setIsWrongAnswer] = useState<boolean>(false);

  const handleSubmit = () => {
    if (selectedIndex === null) return;
    setIsSubmitted(true);

    if (selectedIndex === question.correctAnswerIndex) {
      soundManager.playCorrectFanfare();
      setTimeout(() => {
        onAnswerCorrect();
      }, 700);
    } else {
      soundManager.playWrong();
      setIsWrongAnswer(true);
      onAnswerWrong();
      setTimeout(() => {
        setIsSubmitted(false);
        setIsWrongAnswer(false);
      }, 1500);
    }
  };

  return (
    <div className="relative w-full flex-1 flex flex-col items-center justify-between p-4 sm:p-6 overflow-y-auto select-none">
      {/* Cinematic Backdrop */}
      <div className="absolute inset-0 z-0">
        <img
          src={GAME_ASSETS.varanasiGhats}
          alt="Varanasi Ghats Quiz Scene"
          className="w-full h-full object-cover filter brightness-45"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060911] via-[#091122]/75 to-[#070d18]/90" />
      </div>

      {/* Top Banner: CULTURE QUIZ - Question 3/5 */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-between border-b border-amber-500/30 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950/90 border border-amber-400 flex items-center justify-center text-amber-300 shadow">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-amber-200 uppercase tracking-wider">
              CULTURE QUIZ
            </h2>
            <p className="text-xs font-marcellus text-stone-300">
              Question {question.questionNumber} / {question.totalQuestions} • Heritage Points: {player.points}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-400/50 text-amber-300 font-cinzel font-semibold text-xs">
            Reward: +{question.pointsReward} Pts
          </span>
        </div>
      </div>

      {/* Center Question Parchment Board & 4 Golden Option Buttons (Matching Middle-Center Screen) */}
      <div className="relative z-10 w-full max-w-3xl my-4">
        <div className="parchment-bg rounded-2xl p-6 sm:p-8 border-2 border-amber-600/50 shadow-2xl relative">
          <div className="text-center mb-6">
            <span className="text-xs font-cinzel font-bold tracking-widest text-amber-900 uppercase">
              Cultural Geography & Heritage
            </span>
            <h3 className="text-lg sm:text-2xl font-cinzel font-bold text-stone-950 leading-snug mt-2">
              {question.question}
            </h3>
          </div>

          {/* 4 Golden Interactive Options */}
          <div className="space-y-3 max-w-xl mx-auto">
            {question.options.map((option, idx) => {
              const isSelected = selectedIndex === idx;
              let btnStyle = 'bg-stone-900/90 text-stone-200 border-amber-500/40 hover:border-amber-400 hover:bg-stone-800/90';

              if (isSelected) {
                if (isSubmitted && isWrongAnswer) {
                  btnStyle = 'bg-rose-950 border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.4)]';
                } else if (isSubmitted && !isWrongAnswer) {
                  btnStyle = 'bg-emerald-950 border-emerald-400 text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.5)]';
                } else {
                  // Golden glow selected state matching reference photo
                  btnStyle = 'bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 border-amber-300 text-amber-100 shadow-[0_0_20px_rgba(245,192,66,0.6)] scale-[1.02] ring-2 ring-amber-400';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (isSubmitted) return;
                    soundManager.playClick();
                    setSelectedIndex(idx);
                  }}
                  className={`w-full py-3.5 px-6 rounded-xl border-2 font-cinzel font-bold text-sm sm:text-base tracking-wide text-left transition-all duration-200 flex items-center justify-between shadow-lg ${btnStyle}`}
                >
                  <span>{option}</span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center text-xs">
                      ✓
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sahana Companion Hint Speech Bubble */}
          <div className="mt-6 p-3 sm:p-4 rounded-xl bg-amber-900/10 border border-amber-800/30 flex items-center gap-3.5 max-w-xl mx-auto">
            <img
              src={GAME_ASSETS.sahanaAvatar}
              alt="Sahana AI Culture Guide"
              className="w-11 h-11 rounded-full object-cover border border-amber-700 flex-shrink-0 shadow"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 text-left text-xs sm:text-sm font-marcellus text-stone-800 italic">
              {showHint ? (
                <span className="font-semibold text-amber-950">{question.companionHint}</span>
              ) : (
                <span>"Think about the textile's name. Can you trace its origin?" — Sahana</span>
              )}
            </div>
            {!showHint && (
              <button
                onClick={() => {
                  soundManager.playChime();
                  setShowHint(true);
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-amber-100 font-cinzel font-bold text-xs uppercase tracking-wider flex items-center gap-1 flex-shrink-0 shadow"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>HINT</span>
              </button>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex flex-col items-center justify-center gap-2">
            {isWrongAnswer && (
              <span className="text-xs font-cinzel font-bold text-rose-700 flex items-center gap-1 animate-bounce">
                <AlertCircle className="w-4 h-4" />
                Incorrect city! Lost 1 life. Try again!
              </span>
            )}
            <button
              disabled={selectedIndex === null || isSubmitted}
              onClick={handleSubmit}
              className={`py-3 px-10 rounded-xl font-cinzel font-bold text-sm tracking-widest uppercase shadow-xl transition-all flex items-center justify-center gap-2 ${
                selectedIndex !== null && !isSubmitted
                  ? 'text-stone-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 border border-amber-200 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(245,192,66,0.6)]'
                  : 'bg-stone-400/40 text-stone-600 border border-stone-400/30 cursor-not-allowed'
              }`}
            >
              <span>SUBMIT</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
