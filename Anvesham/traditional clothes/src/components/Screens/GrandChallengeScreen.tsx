import { useState } from 'react';
import { PlayerProfile } from '../../types';
import { GAME_ASSETS } from '../../data/gameData';
import { Crown, Sparkles, Trophy, Heart, Flame, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface GrandChallengeScreenProps {
  player: PlayerProfile;
  onCompleteGrandChallenge: () => void;
  onFailLife: () => void;
}

export default function GrandChallengeScreen({
  player,
  onCompleteGrandChallenge,
  onFailLife,
}: GrandChallengeScreenProps) {
  const [step, setStep] = useState<number>(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const grandQuestions = [
    {
      id: 1,
      prompt: 'Trial 1 of 3: Name the ancient double-ikat silk weave where both warp and weft are tie-dyed before weaving, creating identical patterns on both sides.',
      options: ['Patan Patola (Gujarat)', 'Chanderi (Madhya Pradesh)', 'Mysore Silk (Karnataka)', 'Kota Doria (Rajasthan)'],
      correctIdx: 0,
      lore: 'Patan Patola requires up to 6 months of master mathematical calculations per saree.'
    },
    {
      id: 2,
      prompt: 'Trial 2 of 3: Which golden zari motif symbolizes immortality, prosperity, and the eternal tree of life on royal Banarasi and Paithani sarees?',
      options: ['Kalka / Paisley (Ambi)', 'Trishul', 'Chakram', 'Shankha'],
      correctIdx: 0,
      lore: 'The Kalka / Paisley motif originated from the unripe mango and cypress tree representing eternal fertility.'
    },
    {
      id: 3,
      prompt: 'Final Trial: Which imperial natural silk from Assam is naturally golden and becomes more lustrous with every wash?',
      options: ['Muga Golden Silk', 'Tussar Wild Silk', 'Eri Ahimsa Silk', 'Mulberry Cultivated Silk'],
      correctIdx: 0,
      lore: 'Muga silk was exclusively reserved for Ahom royalty for over 600 years.'
    },
  ];

  const currentQ = grandQuestions[step - 1];

  const handleNextTrial = () => {
    if (selectedAnswer === null) return;

    if (selectedAnswer === currentQ.correctIdx) {
      soundManager.playCorrectFanfare();
      if (step < grandQuestions.length) {
        setStep(step + 1);
        setSelectedAnswer(null);
      } else {
        soundManager.playUnlockCelebration();
        setIsCompleted(true);
        onCompleteGrandChallenge();
      }
    } else {
      soundManager.playWrong();
      onFailLife();
    }
  };

  return (
    <div className="relative w-full flex-1 flex flex-col items-center justify-between p-4 sm:p-8 overflow-y-auto select-none">
      {/* Background: Ancient Heritage Temple Sanctum */}
      <div className="absolute inset-0 z-0">
        <img
          src={GAME_ASSETS.heritageSanctum}
          alt="Ancient Heritage Temple Sanctum"
          className="w-full h-full object-cover filter brightness-40"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060911] via-[#091122]/70 to-[#070d18]/90" />
      </div>

      {/* Top Header */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-between border-b border-amber-500/30 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-950 border-2 border-amber-400 flex items-center justify-center text-amber-200 shadow-[0_0_20px_rgba(245,192,66,0.5)]">
            <Crown className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-cinzel font-black text-amber-200 uppercase tracking-wider">
                GRAND MASTER CHALLENGE
              </h2>
              <span className="px-2 py-0.5 rounded bg-rose-950/80 border border-rose-500/40 text-[10px] font-cinzel font-bold text-rose-300 flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-400" />
                Trial of Sovereignty
              </span>
            </div>
            <p className="text-xs font-marcellus text-stone-300">
              Pass the 3 Sacred Trials of Bharat's Royal Looms
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-cinzel font-bold text-amber-400 block">
            Reward: +500 Pts
          </span>
          <span className="text-[10px] font-marcellus text-stone-400">
            Grandmaster Title
          </span>
        </div>
      </div>

      {/* Center Stage: Sanctum Challenge Card */}
      <div className="relative z-10 w-full max-w-3xl my-6">
        {isCompleted ? (
          /* Victory Sanctum Screen */
          <div className="royal-glass-card rounded-2xl p-8 border-2 border-amber-400 text-center shadow-[0_0_50px_rgba(245,192,66,0.5)]">
            <div className="w-20 h-20 mx-auto rounded-full bg-amber-400 text-stone-950 flex items-center justify-center mb-4 shadow-[0_0_30px_#f5c042]">
              <Trophy className="w-10 h-10" />
            </div>
            <h3 className="text-3xl font-cinzel font-black text-amber-200 uppercase tracking-wider">
              TRIAL CONQUERED!
            </h3>
            <p className="text-base font-marcellus text-stone-200 max-w-md mx-auto my-3">
              You have mastered the sacred looms of Bharat. You are officially crowned as an <strong className="text-amber-300">Imperial Textile Historian</strong>.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-950/80 border border-amber-400 text-amber-300 font-cinzel font-bold text-sm shadow">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>+500 Heritage Points & Sovereign Master Crown</span>
            </div>
          </div>
        ) : (
          /* Active Question Card */
          <div className="parchment-bg rounded-2xl p-6 sm:p-8 border-2 border-amber-600/50 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-amber-900/20 pb-2 mb-4">
              <span className="text-xs font-cinzel font-bold text-amber-950 uppercase tracking-widest">
                Trial {step} of 3
              </span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className={`w-3 h-3 rounded-full border ${
                      i < step
                        ? 'bg-emerald-600 border-emerald-700'
                        : i === step
                        ? 'bg-amber-600 border-amber-700 animate-pulse'
                        : 'bg-stone-300 border-stone-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            <h3 className="text-lg sm:text-xl font-cinzel font-bold text-stone-950 leading-relaxed my-3">
              {currentQ.prompt}
            </h3>

            {/* Options */}
            <div className="space-y-3 my-5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedAnswer(idx);
                    }}
                    className={`w-full p-4 rounded-xl border-2 font-cinzel font-semibold text-sm sm:text-base text-left transition-all flex items-center justify-between shadow ${
                      isSelected
                        ? 'bg-amber-800 text-amber-100 border-amber-400 shadow-[0_0_15px_rgba(245,192,66,0.5)] scale-[1.01]'
                        : 'bg-white/80 text-stone-900 border-amber-900/30 hover:bg-white hover:border-amber-700'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center text-xs">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Action Button */}
            <div className="flex justify-end mt-4">
              <button
                disabled={selectedAnswer === null}
                onClick={handleNextTrial}
                className={`py-3 px-8 rounded-xl font-cinzel font-bold text-sm tracking-widest uppercase shadow-xl transition-all flex items-center gap-2 ${
                  selectedAnswer !== null
                    ? 'text-stone-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 border border-amber-200 active:scale-95 cursor-pointer shadow-[0_0_20px_rgba(245,192,66,0.6)]'
                    : 'bg-stone-400/40 text-stone-600 border border-stone-400/30 cursor-not-allowed'
                }`}
              >
                <span>{step === 3 ? 'FINISH SACRED TRIAL' : 'ADVANCE TO NEXT TRIAL'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 text-xs font-marcellus text-stone-400">
        Lives remaining: <span className="text-rose-400 font-bold">{player.lives}/5</span> • Choose carefully in the sanctum
      </div>
    </div>
  );
}
