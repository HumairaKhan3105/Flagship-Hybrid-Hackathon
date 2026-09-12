import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Flame, 
  Coins, 
  Check, 
  X, 
  Clock, 
  Trophy, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { UserProgress } from '../types';
import { soundEngine } from '../utils/audio';

interface DailyChallengeModalProps {
  progress: UserProgress;
  isOpen: boolean;
  onClose: () => void;
  onClaimDaily: (xp: number, coins: number) => void;
}

const DAILY_QUESTIONS = [
  {
    step: 1,
    region: 'Assam',
    title: 'The Golden Cocoon Mystery',
    q: 'Which shimmering golden-yellow wild silk is found exclusively in the Brahmaputra valley of Assam and naturally shines brighter with every wash?',
    options: ['Muga Silk', 'Tussar Silk', 'Mulberry Silk', 'Eri Silk'],
    correct: 'Muga Silk',
    fact: 'Muga silk caterpillars feed only on Som and Sualu leaves in Assam, protected by a prestigious Geographical Indication (GI) tag.',
  },
  {
    step: 2,
    region: 'Punjab',
    title: 'The Golden Temple Kitchen Secret',
    q: 'What is the massive community kitchen at Sri Harmandir Sahib in Amritsar called that serves over 100,000 free hot vegetarian meals daily to all visitors?',
    options: ['Langar', 'Panghat', 'Bhandara', 'Prasadam'],
    correct: 'Langar',
    fact: 'Instituted by Guru Nanak, Langar upholds the principle of Seva (selfless service) and radical human equality.',
  },
  {
    step: 3,
    region: 'Karnataka',
    title: 'The Singing Pillars of the Empire',
    q: 'In the stone-carved ruins of Hampi, which famous temple features 56 musical granite pillars that emit distinct acoustic notes (Sa-Re-Ga-Ma) when tapped?',
    options: ['Vittala Temple', 'Virupaksha Temple', 'Hazara Rama Temple', 'Achyutaraya Temple'],
    correct: 'Vittala Temple',
    fact: 'British engineers once cut two pillars open to inspect if there were hidden musical bells inside, but found only solid monolithic granite.',
  },
];

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  progress,
  isOpen,
  onClose,
  onClaimDaily,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [allDone, setAllDone] = useState(false);

  if (!isOpen) return null;

  const currentQ = DAILY_QUESTIONS[currentStep];

  const handleSelectOption = (opt: string) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);

    const correct = opt === currentQ.correct;
    setIsCorrect(correct);

    if (correct) {
      soundEngine.playCorrect();
      setCompletedSteps([...completedSteps, currentStep]);
    } else {
      soundEngine.playWrong();
    }
  };

  const handleNextStep = () => {
    soundEngine.playClick();
    if (currentStep < DAILY_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(null);
    } else {
      // Completed all 3!
      soundEngine.playLevelComplete();
      setAllDone(true);
      try {
        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
      } catch (e) {}
    }
  };

  const handleClaimAndClose = () => {
    soundEngine.playLevelUp();
    onClaimDaily(250, 100);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        className="bg-[#FDF5E6] w-full max-w-lg rounded-3xl p-5 sm:p-7 border-4 border-[#5D4037] shadow-2xl space-y-5 relative text-[#4A3728]"
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-[#D4AF37] border-2 border-[#5D4037] text-white flex items-center justify-center text-xl shadow-md">
              <Sparkles className="w-6 h-6 text-[#5D4037]" />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#8D6E63]">
                DAILY DETECTIVE CASE
              </span>
              <h2 className="font-heading text-lg sm:text-xl font-black uppercase text-[#5D4037]">
                The Heritage Triad
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white border-2 border-[#5D4037] hover:bg-[#5D4037] hover:text-white text-[#5D4037] font-black flex items-center justify-center text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center justify-center gap-2">
          {DAILY_QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? 'w-8 bg-[#D4AF37] border border-[#5D4037]'
                  : completedSteps.includes(i)
                  ? 'w-4 bg-[#2E7D32]'
                  : 'w-4 bg-stone-300'
              }`}
            />
          ))}
        </div>

        {!allDone ? (
          /* Question Content */
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border-2 border-[#5D4037]/20 space-y-2 shadow-sm">
              <div className="flex items-center justify-between text-xs font-black uppercase text-[#8D6E63]">
                <span>Clue {currentStep + 1} of 3</span>
                <span>Region: {currentQ.region}</span>
              </div>
              <h3 className="font-heading text-sm sm:text-base font-black uppercase text-[#5D4037]">
                {currentQ.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#4A3728] leading-relaxed font-medium">
                {currentQ.q}
              </p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQ.options.map((opt, i) => {
                const isSelected = selectedOption === opt;
                const isTheCorrect = opt === currentQ.correct;

                let btnStyles = 'bg-white hover:bg-[#FDF5E6] text-[#4A3728] border-b-4 border-r-4 border-[#5D4037] border-t-2 border-l-2 border-[#5D4037] shadow-sm';
                if (isAnswered) {
                  if (isTheCorrect) {
                    btnStyles = 'bg-[#2E7D32] text-white border-b-4 border-r-4 border-[#1B5E20] border-t-2 border-l-2 border-[#1B5E20] font-black';
                  } else if (isSelected && !isCorrect) {
                    btnStyles = 'bg-[#8B0000] text-white border-b-4 border-r-4 border-[#450000] border-t-2 border-l-2 border-[#450000]';
                  } else {
                    btnStyles = 'opacity-50 bg-stone-100 text-stone-400 border-2 border-stone-200';
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelectOption(opt)}
                    disabled={isAnswered}
                    className={`p-3.5 rounded-xl text-xs sm:text-sm font-bold text-left transition-all flex items-center justify-between ${btnStyles}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isTheCorrect && <Check className="w-4 h-4 text-white stroke-[3]" />}
                    {isAnswered && isSelected && !isCorrect && <X className="w-4 h-4 text-white stroke-[3]" />}
                  </button>
                );
              })}
            </div>

            {/* Answer Feedback */}
            {isAnswered && (
              <div
                className={`p-3.5 rounded-xl text-xs border-b-4 border-r-4 border-t-2 border-l-2 shadow-sm ${
                  isCorrect
                    ? 'bg-[#E8F5E9] border-[#2E7D32] text-[#1B5E20]'
                    : 'bg-[#FFEBEE] border-[#8B0000] text-[#8B0000]'
                }`}
              >
                <p className="font-black uppercase mb-0.5">
                  {isCorrect ? '✓ Correct Deduction!' : '✗ Not Quite! The correct answer is ' + currentQ.correct}
                </p>
                <p className="leading-snug text-xs font-medium">{currentQ.fact}</p>
                <div className="mt-2.5 flex justify-end">
                  <button
                    onClick={handleNextStep}
                    className="px-4 py-1.5 rounded-lg bg-[#2E7D32] hover:bg-[#388E3C] text-white font-black uppercase text-xs flex items-center gap-1 shadow"
                  >
                    <span>{currentStep < 2 ? 'Next Clue' : 'Complete Case'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* All 3 Steps Solved Celebration */
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 rounded-full bg-white border-2 border-[#5D4037] text-3xl flex items-center justify-center mx-auto shadow-sm">
              🏆
            </div>

            <h3 className="font-heading text-2xl font-black uppercase text-[#5D4037]">
              Daily Case Solved!
            </h3>
            <p className="text-xs sm:text-sm text-[#4A3728] font-bold max-w-sm mx-auto">
              You uncovered all 3 clues across India today! Your cultural detective streak is safe.
            </p>

            {/* Rewards */}
            <div className="flex items-center justify-center gap-3">
              <div className="bg-white px-4 py-2 rounded-xl border-2 border-[#5D4037]/20 font-black text-[#5D4037] text-sm shadow-sm">
                +250 XP
              </div>
              <div className="bg-white px-4 py-2 rounded-xl border-2 border-[#5D4037]/20 font-black text-[#D4AF37] text-sm flex items-center gap-1 shadow-sm">
                <Coins className="w-4 h-4 fill-yellow-400" />
                <span>+100 Coins</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-xl border-2 border-[#5D4037]/20 font-black text-[#FF9933] text-sm flex items-center gap-1 shadow-sm">
                <Flame className="w-4 h-4 fill-[#FF9933]" />
                <span>Streak Extended!</span>
              </div>
            </div>

            <button
              id="claim-daily-btn"
              onClick={handleClaimAndClose}
              className="w-full py-3 rounded-xl bg-[#2E7D32] hover:bg-[#388E3C] border-2 border-[#8BC34A] text-white font-black uppercase text-base shadow-xl hover:scale-102 transition-transform"
            >
              Claim Rewards & Keep Exploring
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
