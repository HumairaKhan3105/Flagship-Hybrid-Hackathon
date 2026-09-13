import React, { useState, useEffect } from 'react';
import { CraftRegion } from '../../types';
import { sound } from '../../utils/soundEngine';
import confetti from 'canvas-confetti';
import { ChevronLeft, HelpCircle, Clock, Award, RotateCcw } from 'lucide-react';

interface PatternPuzzleProps {
  region: CraftRegion;
  onPuzzleComplete: (score: number) => void;
  onBackToWorld: () => void;
}

export const PatternPuzzle: React.FC<PatternPuzzleProps> = ({
  region,
  onPuzzleComplete,
  onBackToWorld,
}) => {
  const puzzle = region.patternPuzzle;
  const [placedSlots, setPlacedSlots] = useState<{ [slotId: string]: string | null }>({});
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [shakeSlotId, setShakeSlotId] = useState<string | null>(null);
  const [score, setScore] = useState<number>(100);

  // Timer
  useEffect(() => {
    if (isCompleted) return;
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isCompleted]);

  // Start puzzle music mode
  useEffect(() => {
    sound.startAmbientMusic('puzzle');
    return () => {
      sound.stopMusic();
    };
  }, []);

  const handleSelectPiece = (pieceId: string) => {
    sound.playClick();
    setSelectedPieceId(pieceId === selectedPieceId ? null : pieceId);
  };

  const handlePlaceInSlot = (slotId: string) => {
    if (!selectedPieceId) return;

    const slot = puzzle.slots.find((s) => s.id === slotId);
    if (!slot) return;

    if (slot.expectedPieceId === selectedPieceId) {
      // Correct placement
      sound.playPuzzleSnap();
      const updatedPlaced = {
        ...placedSlots,
        [slotId]: selectedPieceId,
      };
      setPlacedSlots(updatedPlaced);
      setSelectedPieceId(null);

      // Check if all slots are filled correctly
      const allFilled = puzzle.slots.every((s) => updatedPlaced[s.id] === s.expectedPieceId);

      if (allFilled) {
        setIsCompleted(true);
        sound.playLevelVictory();
        confetti({
          particleCount: 70,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#dc2626', '#10b981'],
        });
        onPuzzleComplete(score);
      }
    } else {
      // Incorrect placement
      sound.playWrong();
      setShakeSlotId(slotId);
      setScore((prev) => Math.max(prev - 10, 40));
      setTimeout(() => setShakeSlotId(null), 500);
    }
  };

  // Drag and drop support
  const handleDragStart = (e: React.DragEvent, pieceId: string) => {
    e.dataTransfer.setData('text/plain', pieceId);
    setSelectedPieceId(pieceId);
  };

  const handleDrop = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    const pieceId = e.dataTransfer.getData('text/plain') || selectedPieceId;
    if (pieceId) {
      const slot = puzzle.slots.find((s) => s.id === slotId);
      if (slot?.expectedPieceId === pieceId) {
        sound.playPuzzleSnap();
        const updatedPlaced = { ...placedSlots, [slotId]: pieceId };
        setPlacedSlots(updatedPlaced);
        setSelectedPieceId(null);

        const allFilled = puzzle.slots.every((s) => updatedPlaced[s.id] === s.expectedPieceId);
        if (allFilled) {
          setIsCompleted(true);
          sound.playLevelVictory();
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#f59e0b', '#dc2626', '#10b981'],
          });
          onPuzzleComplete(score);
        }
      } else {
        sound.playWrong();
        setShakeSlotId(slotId);
        setScore((prev) => Math.max(prev - 10, 40));
        setTimeout(() => setShakeSlotId(null), 500);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleReset = () => {
    setPlacedSlots({});
    setSelectedPieceId(null);
    setIsCompleted(false);
    setScore(100);
    setSecondsElapsed(0);
    sound.playClick();
  };

  const unplacedCount = puzzle.pieces.filter(
    (p) => !Object.values(placedSlots).includes(p.id)
  ).length;

  return (
    <div className="relative w-full h-full flex flex-col bg-[#0d0906] text-amber-50 select-none overflow-y-auto">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#17100a] border-b border-amber-600/30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBackToWorld();
            }}
            className="p-2 rounded-xl bg-[#231810] hover:bg-[#322318] text-amber-300 border border-amber-500/30 transition-all active:scale-95"
            title="Return to 3D Village"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-base sm:text-lg font-bold font-heading text-amber-400">
              Complete the Pattern
            </h2>
            <p className="text-[11px] sm:text-xs text-stone-400">
              {puzzle.title} • {region.craftName}
            </p>
          </div>
        </div>

        {/* Stats & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#231810] border border-amber-500/20 text-xs">
            <Clock size={13} className="text-amber-400" />
            <span className="font-mono text-amber-200">
              {Math.floor(secondsElapsed / 60)}:
              {String(secondsElapsed % 60).padStart(2, '0')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#231810] border border-amber-500/20 text-xs">
            <Award size={13} className="text-yellow-400" />
            <span className="font-bold text-amber-300">{score}%</span>
          </div>

          <button
            onClick={() => {
              setShowHint(!showHint);
              sound.playClick();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-900/40 hover:bg-amber-800/40 text-amber-300 border border-amber-500/40 text-xs font-medium transition-all"
          >
            <HelpCircle size={13} />
            <span className="hidden sm:inline">Hint</span>
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-[#231810] hover:bg-[#322318] text-stone-300 border border-stone-700 transition-all"
            title="Reset Puzzle"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Main Puzzle Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 w-full max-w-lg mx-auto">
        {/* Instruction Paragraph */}
        <div className="text-center mb-6 max-w-sm sm:max-w-md mx-auto px-2">
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Drag and snap the missing geometric and nature tiles to complete the ceremonial wall border.
          </p>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mt-1">
            Drag pieces into the highlighted slots or click to select and place.
          </p>
        </div>

        {/* Puzzle Target Board Container with Double-Border Effect */}
        <div className="relative p-2.5 sm:p-3 rounded-[28px] border border-amber-600/70 bg-[#120d09] w-full max-w-sm sm:max-w-md mx-auto shadow-2xl">
          <div className="rounded-2xl bg-[#18120c] p-3.5 sm:p-4 border border-amber-500/20">
            {/* 2x2 Slots Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
              {puzzle.slots.map((slot, index) => {
                const placedPieceId = placedSlots[slot.id];
                const placedPiece = puzzle.pieces.find((p) => p.id === placedPieceId);
                const isShaking = shakeSlotId === slot.id;

                return (
                  <div
                    key={slot.id}
                    onClick={() => handlePlaceInSlot(slot.id)}
                    onDrop={(e) => handleDrop(e, slot.id)}
                    onDragOver={handleDragOver}
                    className={`relative aspect-[4/3] rounded-xl border border-dashed transition-all flex flex-col items-center justify-center p-3 cursor-pointer overflow-hidden ${
                      placedPiece
                        ? 'bg-amber-950/40 border-emerald-500 shadow-md'
                        : selectedPieceId
                        ? 'bg-amber-500/15 border-amber-400 animate-pulse'
                        : 'bg-[#1c1510] border-stone-600/70 hover:border-amber-500/60'
                    } ${isShaking ? 'animate-bounce border-red-500 bg-red-950/30' : ''}`}
                  >
                    {placedPiece ? (
                      <div className="flex flex-col items-center text-center animate-in zoom-in-75 duration-300">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner mb-1.5 border border-white/20"
                          style={{ backgroundColor: placedPiece.color }}
                        >
                          🎨
                        </div>
                        <span className="font-bold text-amber-200 text-xs line-clamp-1">
                          {placedPiece.label}
                        </span>
                        <span className="text-[10px] text-emerald-400 mt-0.5">
                          ✓ Locked
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center">
                        <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                          SLOT {index + 1}
                        </span>
                        <div className="text-xs font-semibold text-amber-300 leading-tight mt-1">
                          {showHint ? (
                            <span className="text-[10px] text-amber-200 line-clamp-2 px-1">
                              {slot.hint}
                            </span>
                          ) : (
                            <>
                              Tap to<br />place piece
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Available Sacred Pattern Pieces Section */}
        <div className="mt-7 w-full max-w-sm sm:max-w-md mx-auto">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#eab308] font-heading">
              AVAILABLE SACRED PATTERN PIECES ({unplacedCount})
            </h3>
            {selectedPieceId && (
              <span className="text-[11px] text-amber-300 animate-pulse font-medium">
                Tap a slot above
              </span>
            )}
          </div>

          {/* 2x2 Pieces Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
            {puzzle.pieces.map((piece) => {
              const isPlaced = Object.values(placedSlots).includes(piece.id);
              const isSelected = selectedPieceId === piece.id;

              return (
                <div
                  key={piece.id}
                  draggable={!isPlaced}
                  onDragStart={(e) => handleDragStart(e, piece.id)}
                  onClick={() => {
                    if (!isPlaced) handleSelectPiece(piece.id);
                  }}
                  className={`p-4 rounded-2xl border transition-all flex flex-col items-center text-center shadow-lg ${
                    isPlaced
                      ? 'opacity-35 bg-[#140e0a] border-stone-800 cursor-default'
                      : isSelected
                      ? 'bg-[#2a1d13] border-amber-400 shadow-amber-900/30 ring-2 ring-amber-400/50 scale-[1.02] cursor-pointer'
                      : 'bg-[#1b140e] border-stone-700/60 hover:border-amber-500/50 hover:bg-[#231a12] cursor-pointer active:scale-95'
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow mb-2.5 border border-white/10"
                    style={{ backgroundColor: piece.color }}
                  >
                    🎨
                  </div>
                  <span className="font-bold text-xs sm:text-sm text-amber-100">
                    {piece.label}
                  </span>
                  <span className="text-[11px] text-stone-400 mt-1 truncate max-w-full px-1">
                    {piece.shapeDescription}...
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Completion Victory Modal */}
      {isCompleted && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#1c120c] border-2 border-emerald-500/60 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl glow-heritage text-[#fdfbf7]">
            <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              🧩
            </div>
            <h2 className="text-2xl font-bold font-heading text-amber-300">
              Pattern Complete!
            </h2>
            <p className="text-stone-300 text-sm mt-2">
              You harmonized the ancient geometry of {region.craftName}.
            </p>

            <div className="bg-[#2a1b12] border border-emerald-500/30 rounded-2xl p-4 my-6 flex justify-around">
              <div>
                <span className="text-xs text-stone-400 block">XP Earned</span>
                <span className="text-xl font-extrabold text-amber-400">+30 XP</span>
              </div>
              <div className="border-r border-stone-700" />
              <div>
                <span className="text-xs text-stone-400 block">Accuracy</span>
                <span className="text-xl font-extrabold text-emerald-400">{score}%</span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onBackToWorld();
              }}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white rounded-xl font-bold text-sm shadow-lg transition-all"
            >
              Continue Adventure
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
