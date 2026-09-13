import React, { useState } from 'react';
import { Check, RotateCcw, Sparkles, Flame, Award } from 'lucide-react';
import { sounds } from '../../audio';

export const MathPuzzleScreen: React.FC = () => {
  // Equations:
  // Eq 1: ? + 8 = 15 => Answer is 7
  // Eq 2: 6 + ? = 14 => Answer is 8
  // Eq 3: ? + 7 = 12 => Answer is 5

  const [slot1, setSlot1] = useState<number | null>(null);
  const [slot2, setSlot2] = useState<number | null>(null);
  const [slot3, setSlot3] = useState<number | null>(null);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [activeSlotFocus, setActiveSlotFocus] = useState<number>(1);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  const availableNumbers = [5, 6, 7, 8];

  const handlePickNumber = (num: number) => {
    sounds.playStoneClick();
    setSelectedNumber(num);
    // Auto-fill active focused slot
    if (activeSlotFocus === 1) {
      setSlot1(num);
      setActiveSlotFocus(2);
    } else if (activeSlotFocus === 2) {
      setSlot2(num);
      setActiveSlotFocus(3);
    } else if (activeSlotFocus === 3) {
      setSlot3(num);
    }
  };

  const handleReset = () => {
    sounds.playStoneClick();
    setSlot1(null);
    setSlot2(null);
    setSlot3(null);
    setSelectedNumber(null);
    setActiveSlotFocus(1);
    setIsSolved(false);
    setHasError(false);
  };

  const handleSubmit = () => {
    if (slot1 === 7 && slot2 === 8 && slot3 === 5) {
      sounds.playSolveSuccess();
      setIsSolved(true);
      setHasError(false);
    } else {
      sounds.playStoneClick();
      setHasError(true);
      setTimeout(() => setHasError(false), 2000);
    }
  };

  return (
    <div id="screen-math-puzzle" className="relative w-full h-full min-h-[360px] flex flex-col justify-between overflow-hidden bg-[#0c0806] text-[#faeccf] select-none p-4 md:p-6">
      {/* Ancient Dark Stone Chamber Backdrop with Diya Lamp Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1c0f0a] via-[#120805] to-[#080403] pointer-events-none" />
      
      {/* Warm Diya Lamp Glow and Flame Ambience */}
      <div className="absolute top-8 left-10 w-24 h-24 bg-amber-600/20 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-10 right-16 w-32 h-32 bg-orange-600/20 rounded-full blur-3xl animate-pulse" />

      {/* Screen Header */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-[#d4af37]/30">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-full border border-[#d4af37] bg-[#1a0f08] flex items-center justify-center text-[#fcd34d]">
            <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
          </div>
          <div>
            <h3 className="font-cinzel text-base md:text-lg font-bold text-[#fae596] tracking-wide">
              Mathematics Puzzle
            </h3>
            <p className="text-xs text-[#c59b27] font-serif">
              Reconstruct the damaged calculation.
            </p>
          </div>
        </div>

        {/* Reset button */}
        <button
          onClick={handleReset}
          className="px-2.5 py-1 rounded bg-[#1f1008] border border-[#d4af37]/40 hover:border-[#fcd34d] text-xs text-[#d8be8a] flex items-center space-x-1 transition-all"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Central Interactive Puzzle Area: Tablet on Left, Numbers on Right */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center gap-6 py-4">
        
        {/* Ancient Terracotta Carved Calculation Tablet */}
        <div className="relative w-full max-w-sm bg-[#5c2a12] border-4 border-[#3f190a] rounded-lg p-5 shadow-[0_15px_35px_rgba(0,0,0,0.9)] text-center overflow-hidden">
          {/* Terracotta Texture and Carved Cracks */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#833816] via-[#652a0e] to-[#3a1606] opacity-95" />
          <div className="absolute top-0 inset-x-0 h-1 bg-[#fcd34d]/20" />
          
          {/* Sanskrit Header Inscription on Stone */}
          <div className="relative z-10 text-[10px] font-mono tracking-widest text-[#fbd38d]/60 mb-3 border-b border-[#8c431b] pb-1">
            गणित सूत्र • BAKHSHALI FRAGMENT • EQ-03
          </div>

          {/* 3 Equations */}
          <div className="relative z-10 space-y-3 font-cinzel text-xl md:text-2xl font-bold tracking-wider text-[#faeccf]">
            
            {/* Equation 1: ? + 8 = 15 */}
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => {
                  sounds.playStoneClick();
                  setActiveSlotFocus(1);
                }}
                className={`w-11 h-11 rounded-sm flex items-center justify-center text-xl font-bold transition-all ${
                  slot1 !== null
                    ? 'bg-[#fcd34d] text-[#3e1b07] shadow-inner'
                    : activeSlotFocus === 1
                    ? 'border-2 border-[#fcd34d] bg-[#3a1708] text-[#fcd34d] animate-pulse'
                    : 'border border-[#d4af37]/50 bg-[#281005] text-[#d4af37]'
                }`}
              >
                {slot1 !== null ? slot1 : '?'}
              </button>
              <span className="text-[#f6d77e]">+</span>
              <span className="w-10 h-10 flex items-center justify-center text-stone-200">8</span>
              <span className="text-[#f6d77e]">=</span>
              <span className="w-10 h-10 flex items-center justify-center text-[#fae596]">15</span>
            </div>

            {/* Equation 2: 6 + ? = 14 */}
            <div className="flex items-center justify-center space-x-2">
              <span className="w-10 h-10 flex items-center justify-center text-stone-200">6</span>
              <span className="text-[#f6d77e]">+</span>
              <button
                onClick={() => {
                  sounds.playStoneClick();
                  setActiveSlotFocus(2);
                }}
                className={`w-11 h-11 rounded-sm flex items-center justify-center text-xl font-bold transition-all ${
                  slot2 !== null
                    ? 'bg-[#fcd34d] text-[#3e1b07] shadow-inner'
                    : activeSlotFocus === 2
                    ? 'border-2 border-[#fcd34d] bg-[#3a1708] text-[#fcd34d] animate-pulse'
                    : 'border border-[#d4af37]/50 bg-[#281005] text-[#d4af37]'
                }`}
              >
                {slot2 !== null ? slot2 : '?'}
              </button>
              <span className="text-[#f6d77e]">=</span>
              <span className="w-10 h-10 flex items-center justify-center text-[#fae596]">14</span>
            </div>

            {/* Equation 3: ? + 7 = 12 */}
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => {
                  sounds.playStoneClick();
                  setActiveSlotFocus(3);
                }}
                className={`w-11 h-11 rounded-sm flex items-center justify-center text-xl font-bold transition-all ${
                  slot3 !== null
                    ? 'bg-[#fcd34d] text-[#3e1b07] shadow-inner'
                    : activeSlotFocus === 3
                    ? 'border-2 border-[#fcd34d] bg-[#3a1708] text-[#fcd34d] animate-pulse'
                    : 'border border-[#d4af37]/50 bg-[#281005] text-[#d4af37]'
                }`}
              >
                {slot3 !== null ? slot3 : '?'}
              </button>
              <span className="text-[#f6d77e]">+</span>
              <span className="w-10 h-10 flex items-center justify-center text-stone-200">7</span>
              <span className="text-[#f6d77e]">=</span>
              <span className="w-10 h-10 flex items-center justify-center text-[#fae596]">12</span>
            </div>
          </div>

          {/* Solved Overlay Notification */}
          {isSolved && (
            <div className="absolute inset-0 z-20 bg-[#0f2413]/95 flex flex-col items-center justify-center p-4 animate-fadeIn border-2 border-emerald-500">
              <Award className="w-10 h-10 text-emerald-400 mb-2 animate-bounce" />
              <div className="font-cinzel text-base font-bold text-emerald-200">
                VEDIC CIPHER DECODED!
              </div>
              <p className="text-xs text-emerald-300 mt-1 max-w-xs">
                The stone chamber slides open, revealing the subterranean passage to the observatory.
              </p>
            </div>
          )}
        </div>

        {/* Right Side Control: Choose missing numbers & Submit */}
        <div className="w-full md:w-56 bg-[#160d09]/90 border border-[#d4af37]/50 rounded-md p-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="font-cinzel text-xs font-bold text-[#f7e09e] uppercase tracking-wider mb-2 text-center">
              Choose the missing numbers
            </div>
            <p className="text-[11px] text-[#c59b27] text-center mb-3">
              Click a number to insert into slot {activeSlotFocus}
            </p>

            {/* Number Tiles: [5], [6], [7], [8] */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {availableNumbers.map(num => (
                <button
                  key={num}
                  onClick={() => handlePickNumber(num)}
                  className={`h-11 rounded-sm border font-cinzel text-lg font-bold flex items-center justify-center transition-all ${
                    selectedNumber === num
                      ? 'bg-[#fcd34d] text-[#3e1b07] border-[#fff]'
                      : 'bg-[#2b140b] text-[#faeccf] border-[#8b5a2b] hover:bg-[#4a2211] hover:border-[#fcd34d]'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            {hasError && (
              <p className="text-xs text-rose-400 text-center font-medium animate-shake mb-2">
                Calculation mismatch. Try again!
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-2.5 rounded-sm bg-gradient-to-r from-[#b45309] to-[#d97706] hover:from-[#d97706] hover:to-[#f59e0b] text-[#fff6db] font-cinzel font-bold text-sm tracking-wider shadow-lg border border-[#fcd34d] transition-all hover:scale-[1.02]"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Screen Label Badge */}
      <div className="relative z-10 px-2 pt-2 flex items-center justify-between text-[11px] text-[#c59b27]/80 font-mono">
        <span className="bg-[#050b18]/80 px-2 py-0.5 border border-[#d4af37]/20 rounded">
          5. Puzzle - Mathematics
        </span>
        <span className="text-[10px] tracking-wider text-amber-200/50">
          ARYABHATA NUMERICAL RECONSTRUCTION
        </span>
      </div>
    </div>
  );
};
