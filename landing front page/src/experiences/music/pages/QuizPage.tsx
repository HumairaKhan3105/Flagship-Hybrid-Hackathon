import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Trophy,
  Award,
  Music,
  Flame,
  Medal,
  Clock,
  ListOrdered,
} from 'lucide-react';
import { QuizQuestion } from '../types.ts';
import { api } from '../services/api.ts';
import { LoadingSpinner } from '../components/LoadingSpinner.tsx';
import { ErrorMessage } from '../components/ErrorMessage.tsx';
import { CheerfulCelebration } from '../components/CheerfulCelebration.tsx';
import { QuizLeaderboard } from '../components/QuizLeaderboard.tsx';

type QuizTab = 'quiz' | 'leaderboard';

export const QuizPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<QuizTab>('quiz');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lastPointsEarned, setLastPointsEarned] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Question timer for speed bonus
  const questionStartTimeRef = useRef<number>(Date.now());

  const loadQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getQuiz();
      setQuestions(data);
      resetQuiz();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuiz();
  }, []);

  useEffect(() => {
    // Reset timer when advancing to a new question
    questionStartTimeRef.current = Date.now();
  }, [currentIndex]);

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setPoints(0);
    setStreak(0);
    setBestStreak(0);
    setLastPointsEarned(0);
    setShowCelebration(false);
    setQuizFinished(false);
    questionStartTimeRef.current = Date.now();
  };

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;

    const answerTimeSeconds = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000));
    setSelectedOption(option);
    setIsAnswered(true);

    const currentQ = questions[currentIndex];
    const isCorrect = option === currentQ.correctAnswer;

    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);

      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) {
        setBestStreak(newStreak);
      }

      // Points calculation:
      // Base: 100 pts
      // Streak bonus: +20 pts for each streak level above 1 (max +80)
      // Speed bonus: up to +50 pts if answered under 10 seconds
      const basePoints = 100;
      const streakBonus = Math.min(80, Math.max(0, (newStreak - 1) * 20));
      const speedBonus = Math.max(0, Math.min(50, Math.round((12 - answerTimeSeconds) * 5)));
      const earned = basePoints + streakBonus + speedBonus;

      setLastPointsEarned(earned);
      setPoints((prev) => prev + earned);

      // Trigger Cheerful Animation on whole screen!
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
      }, 2300);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowCelebration(false);
    } else {
      setQuizFinished(true);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Gathering traditional music questions..." />;
  }

  if (error || questions.length === 0) {
    return <ErrorMessage message={error || 'No questions found'} onRetry={loadQuiz} />;
  }

  const currentQ = questions[currentIndex];
  const progressPercent = ((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100;

  // Final celebration rating
  const scorePercent = Math.round((score / questions.length) * 100);
  let feedbackTitle = 'Curious Seeker of Sounds';
  let feedbackMsg = 'You are beginning a wonderful journey into India’s vast musical heritage!';

  if (scorePercent === 100) {
    feedbackTitle = 'Mahacharya – Master of Indian Heritage!';
    feedbackMsg = 'Flawless score! Your knowledge of Indian acoustics, gharaanas, and folk traditions is truly extraordinary.';
  } else if (scorePercent >= 75) {
    feedbackTitle = 'Sangeet Vidwan – Heritage Scholar!';
    feedbackMsg = 'Magnificent! You have a deep understanding of instruments across desert, temple, and classical traditions.';
  } else if (scorePercent >= 50) {
    feedbackTitle = 'Rasika – Folk & Rhythm Explorer!';
    feedbackMsg = 'Good effort! You recognized several key musical treasures. Explore a few more stories to master the soundscape.';
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Cheerful Screen-Wide Celebration Overlay on Correct Answer */}
      <CheerfulCelebration
        show={showCelebration}
        pointsEarned={lastPointsEarned}
        streak={streak}
      />

      {/* Quiz Top Title & Navigation Tabs */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
          <span>ItihaasX Cultural Challenge & Leaderboard</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
          Musical Heritage Challenge
        </h1>
        <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto">
          Test your knowledge of Vedic acoustics, folk stories, and sacred crafting traditions. Earn score points, build streaks, and climb the ItihaasX Leaderboard!
        </p>

        {/* Mode Toggle Tabs */}
        <div className="inline-flex p-1 rounded-2xl bg-stone-200/70 border border-stone-300/60 shadow-inner">
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <span>Interactive Quiz</span>
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === 'leaderboard'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Hall of Fame & Leaderboard</span>
          </button>
        </div>
      </div>

      {activeTab === 'leaderboard' ? (
        <QuizLeaderboard
          currentResult={
            quizFinished
              ? {
                  points,
                  score,
                  totalQuestions: questions.length,
                  title: feedbackTitle,
                  streak: bestStreak,
                }
              : null
          }
          onPlayAgain={() => {
            resetQuiz();
            setActiveTab('quiz');
          }}
        />
      ) : !quizFinished ? (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-10 space-y-8">
          {/* Top Score Points & Streak Status Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200/70">
            <div>
              <span className="text-[11px] uppercase font-bold text-stone-500 block">
                Question
              </span>
              <span className="font-serif font-bold text-stone-900 text-base">
                {currentIndex + 1} / {questions.length}
              </span>
            </div>

            <div>
              <span className="text-[11px] uppercase font-bold text-stone-500 block">
                Correct
              </span>
              <span className="font-serif font-bold text-emerald-700 text-base">
                {score} Correct
              </span>
            </div>

            <div>
              <span className="text-[11px] uppercase font-bold text-amber-800 block">
                Score Points
              </span>
              <span className="font-mono font-black text-amber-900 text-lg">
                {points.toLocaleString()} pts
              </span>
            </div>

            <div>
              <span className="text-[11px] uppercase font-bold text-stone-500 block">
                Current Streak
              </span>
              <div className="flex items-center gap-1">
                <Flame
                  className={`w-4 h-4 ${
                    streak > 1 ? 'text-rose-500 fill-rose-500 animate-pulse' : 'text-stone-400'
                  }`}
                />
                <span className="font-bold text-stone-800 text-sm">
                  {streak > 0 ? `${streak} in a row!` : '0'}
                </span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-700 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Question Prompt */}
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
              {currentQ.question}
            </h2>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrect = opt === currentQ.correctAnswer;

              let btnStyle = 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'bg-emerald-50 text-emerald-900 border-emerald-400 font-semibold ring-2 ring-emerald-500/20';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-50 text-rose-900 border-rose-400 font-semibold ring-2 ring-rose-500/20';
                } else {
                  btnStyle = 'bg-stone-50 text-stone-400 border-stone-200 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  disabled={isAnswered}
                  className={`p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {isAnswered && (
                    <span className="shrink-0 ml-2">
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-rose-600" />
                      ) : null}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Answer Feedback & Explanation */}
          {isAnswered && (
            <div
              className={`p-5 rounded-2xl border animate-in fade-in duration-300 ${
                selectedOption === currentQ.correctAnswer
                  ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50/90 border-amber-300 text-amber-950'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {selectedOption === currentQ.correctAnswer
                      ? 'Spot on! Correct Heritage Answer.'
                      : `Correct Answer: ${currentQ.correctAnswer}`}
                  </span>
                </div>
                {selectedOption === currentQ.correctAnswer && (
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    +{lastPointsEarned} pts
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                {currentQ.explanation}
              </p>

              {currentQ.instrumentSlug && (
                <div className="mt-3 pt-2 border-t border-black/10">
                  <Link
                    to={`/instruments/${currentQ.instrumentSlug}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold underline hover:opacity-80"
                  >
                    <span>Read instrument story in the archive</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <div className="pt-2 text-right">
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-amber-800 hover:bg-amber-900 text-white font-medium text-sm transition-colors shadow-sm cursor-pointer"
              >
                <span>
                  {currentIndex + 1 < questions.length ? 'Next Question' : 'View Final Results & Leaderboard'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Final Score Screen */
        <div className="space-y-8">
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-8 sm:p-12 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shadow-inner">
              <Trophy className="w-10 h-10 text-amber-700" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-amber-800 block">
                Quiz Completed
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
                {feedbackTitle}
              </h2>
              <p className="text-stone-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                {feedbackMsg}
              </p>
            </div>

            {/* Score & Points Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-center">
                <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider block">
                  Grand Points
                </span>
                <div className="font-mono text-3xl font-black text-amber-950 mt-1">
                  {points.toLocaleString()}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-center">
                <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider block">
                  Correct
                </span>
                <div className="font-serif text-3xl font-black text-emerald-900 mt-1">
                  {score} / {questions.length}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 text-center">
                <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider block">
                  Best Streak
                </span>
                <div className="font-mono text-3xl font-black text-stone-900 mt-1 flex items-center justify-center gap-1">
                  <Flame className="w-6 h-6 text-rose-500 fill-rose-500" />
                  <span>{bestStreak}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={resetQuiz}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-amber-800 hover:bg-amber-900 text-white text-sm font-medium transition-colors shadow-sm cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>

              <button
                onClick={() => setActiveTab('leaderboard')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 text-sm font-bold transition-colors cursor-pointer"
              >
                <Trophy className="w-4 h-4 text-amber-700" />
                <span>View Full Leaderboard</span>
              </button>

              <Link
                to="/instruments"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 text-sm font-medium transition-colors shadow-xs"
              >
                <Music className="w-4 h-4 text-amber-700" />
                <span>Explore Instruments</span>
              </Link>
            </div>
          </div>

          {/* Submission and Leaderboard Display */}
          <QuizLeaderboard
            currentResult={{
              points,
              score,
              totalQuestions: questions.length,
              title: feedbackTitle,
              streak: bestStreak,
            }}
            onPlayAgain={resetQuiz}
          />
        </div>
      )}
    </div>
  );
};
