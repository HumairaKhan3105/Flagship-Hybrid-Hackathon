import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { PUZZLES } from '../../data/puzzles';
import { X, CheckCircle2, RotateCcw, Lightbulb, Sparkles, Award } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface PuzzleModalProps {
  puzzleId: string | null;
  onClose: () => void;
}

export const PuzzleModal: React.FC<PuzzleModalProps> = ({ puzzleId, onClose }) => {
  const { solvePuzzle, useHint, hintsRemaining } = useGameStore();

  const puzzle = puzzleId ? PUZZLES[puzzleId] : null;

  // Local interactive states for each puzzle type
  // 1. Architecture Puzzle: Ordering of 4 elements
  const [archOrder, setArchOrder] = useState<string[]>([
    'arch_gopuram',
    'arch_stupi',
    'arch_upapitha',
    'arch_tala'
  ]);

  // 2. Inscription Puzzle: Selected match for each glyph
  const [glyphMatches, setGlyphMatches] = useState<{ [glyphId: string]: string }>({});

  // 3. Timeline Puzzle: Selected order of events
  const [timelineOrder, setTimelineOrder] = useState<string[]>([
    'time_coronation',
    'time_foundation',
    'time_chariot',
    'time_devaraya'
  ]);

  // 4. Stone Chariot Puzzle: Rotations of the 4 directional dials
  const [chariotDials, setChariotDials] = useState<{ [ringId: string]: number }>({
    ring_north: 90,
    ring_east: 180,
    ring_south: 270,
    ring_west: 0
  });

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [hintActive, setHintActive] = useState(false);

  if (!puzzle) return null;

  // --- SOLVER VALIDATIONS ---

  // 1. Architecture Check: Upapitha -> Tala -> Gopuram -> Stupi
  const checkArchitecturePuzzle = () => {
    const correctOrder = ['arch_upapitha', 'arch_tala', 'arch_gopuram', 'arch_stupi'];
    const isCorrect = JSON.stringify(archOrder) === JSON.stringify(correctOrder);

    if (isCorrect) {
      setFeedback({
        type: 'success',
        message: 'Magnificent! The cosmic Dravidian proportions resonate. The inverted shadow chamber unlocks!'
      });
      setTimeout(() => {
        solvePuzzle(puzzle.id);
      }, 1400);
    } else {
      soundService.playPuzzleFail();
      setFeedback({
        type: 'error',
        message: 'The structural balance is misaligned. Remember: Foundation at base, Sanctuary in middle, Stepped Tower rising up, Golden Finial crowning the summit.'
      });
    }
  };

  // Move element up/down in Architecture ordering
  const moveArchItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= archOrder.length) return;
    const next = [...archOrder];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    setArchOrder(next);
    soundService.playStoneInteract();
  };

  // 2. Inscription Check
  const checkInscriptionPuzzle = () => {
    const correct = {
      glyph_shri: 'Divine Invocation & Auspicious Grace',
      glyph_varaha: 'Imperial Boar Emblem of Empire',
      glyph_vijaya: 'Eternal Victory of Vijayanagara',
      glyph_surya: 'Radiant Solar Lineage'
    };

    const isMatch = Object.entries(correct).every(
      ([k, v]) => glyphMatches[k] === v
    );

    if (isMatch) {
      setFeedback({
        type: 'success',
        message: 'The stone reveals its secrets! Emperor Krishnadevaraya’s royal charter of 1516 CE is translated.'
      });
      setTimeout(() => {
        solvePuzzle(puzzle.id);
      }, 1400);
    } else {
      soundService.playPuzzleFail();
      setFeedback({
        type: 'error',
        message: 'Some epigraphic translations are incorrect. Review the Kannada characters and royal crest iconography.'
      });
    }
  };

  // 3. Timeline Check: 1336 -> 1424 -> 1509 -> 1516
  const checkTimelinePuzzle = () => {
    const correctOrder = ['time_foundation', 'time_devaraya', 'time_coronation', 'time_chariot'];
    const isCorrect = JSON.stringify(timelineOrder) === JSON.stringify(correctOrder);

    if (isCorrect) {
      setFeedback({
        type: 'success',
        message: 'The chronological flow of history is restored! The Royal Archives reveal the royal treasury decree.'
      });
      setTimeout(() => {
        solvePuzzle(puzzle.id);
      }, 1400);
    } else {
      soundService.playPuzzleFail();
      setFeedback({
        type: 'error',
        message: 'The chronology is disordered. Begin with the 1336 CE founding and end with the 1516 CE Stone Chariot.'
      });
    }
  };

  const moveTimelineItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= timelineOrder.length) return;
    const next = [...timelineOrder];
    const temp = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = temp;
    setTimelineOrder(next);
    soundService.playStoneInteract();
  };

  // 4. Stone Chariot Radial Astronomy Check: All dials at 0 degrees
  const rotateDial = (ringId: string) => {
    soundService.playStoneInteract();
    setChariotDials(prev => ({
      ...prev,
      [ringId]: (prev[ringId] + 90) % 360
    }));
  };

  const checkChariotPuzzle = () => {
    const isAligned = Object.values(chariotDials).every(deg => deg === 0);

    if (isAligned) {
      setFeedback({
        type: 'success',
        message: '✦ SACRED MECHANISM ENGAGED! ✦ The granite wheel unlocks the hidden chamber of Emperor Krishnadevaraya!'
      });
      setTimeout(() => {
        solvePuzzle(puzzle.id);
      }, 1500);
    } else {
      soundService.playPuzzleFail();
      setFeedback({
        type: 'error',
        message: 'The chariot dials do not align. All four cardinal symbols (Garuda, Surya, Varaha, Kamala) must lock into the Zenith marker (0°).'
      });
    }
  };

  const handleRequestHint = () => {
    if (useHint()) {
      setHintActive(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-stone-950 border border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] box-gold-glow animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border-b border-amber-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/30 border border-amber-400/50 flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-amber-100 tracking-wider">
                  {puzzle.title}
                </h3>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  {puzzle.difficulty.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-amber-400/80 font-serif">
                {puzzle.locationName}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRequestHint}
              disabled={hintActive || hintsRemaining <= 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 hover:bg-amber-900 border border-amber-700/50 text-amber-300 text-xs font-serif font-semibold disabled:opacity-40 cursor-pointer"
            >
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <span>HINT ({hintsRemaining})</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-amber-400 hover:text-amber-200 hover:bg-stone-800/70 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Puzzle Body Content */}
        <div className="flex-1 overflow-y-auto p-6 parchment-scroll bg-[#15110d] space-y-5">
          {/* Instructions */}
          <div className="bg-stone-900/80 border border-amber-900/40 rounded-2xl p-4">
            <p className="text-xs sm:text-sm text-stone-200 font-sans leading-relaxed">
              {puzzle.instructions}
            </p>
            {hintActive && (
              <div className="mt-3 p-3 bg-amber-950/60 border border-amber-500/40 rounded-xl text-xs text-amber-200 font-serif italic">
                💡 <strong>Historical Hint:</strong> {puzzle.hint}
              </div>
            )}
          </div>

          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`p-3.5 rounded-2xl text-xs sm:text-sm font-serif font-medium border flex items-center gap-2.5 animate-in fade-in ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200'
                  : 'bg-rose-950/80 border-rose-500/60 text-rose-200'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <span className="text-lg">⚠️</span>
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* PUZZLE 1: ARCHITECTURAL ALIGNMENT */}
          {/* ------------------------------------------------------------- */}
          {puzzle.type === 'architecture_cipher' && (
            <div className="space-y-3">
              <span className="text-xs font-serif font-bold text-amber-300 block">
                Arrange the Dravidian Architectural tiers from Base (Bottom) to Summit (Top):
              </span>
              <div className="space-y-2">
                {archOrder.map((id, index) => {
                  const names: { [k: string]: { name: string; desc: string; icon: string } } = {
                    arch_upapitha: { name: '1. Upapitha (Moulded Granite Plinth)', desc: 'Ground foundation & sacred plinth', icon: '🪨' },
                    arch_tala: { name: '2. Tala (Pillared Hypostyle Hall)', desc: 'Carved mandapa pillars with lion yalis', icon: '🏛️' },
                    arch_gopuram: { name: '3. Gopuram (Stepped Pyramidal Gateway)', desc: 'Nine-tiered terracotta & granite tower', icon: '⛩️' },
                    arch_stupi: { name: '4. Stupi (Golden Zenith Kalasha)', desc: 'Sacred crowning copper-gold finial', icon: '✨' }
                  };
                  const item = names[id];

                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between p-3.5 bg-stone-900 border border-amber-900/50 rounded-2xl hover:border-amber-500/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <h5 className="font-serif font-bold text-amber-100 text-sm">
                            {item.name}
                          </h5>
                          <p className="text-[11px] text-stone-400 font-sans">
                            {item.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveArchItem(index, 'up')}
                          disabled={index === 0}
                          className="px-2.5 py-1 bg-stone-800 hover:bg-amber-800 disabled:opacity-30 rounded-lg text-amber-200 text-xs cursor-pointer"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveArchItem(index, 'down')}
                          disabled={index === archOrder.length - 1}
                          className="px-2.5 py-1 bg-stone-800 hover:bg-amber-800 disabled:opacity-30 rounded-lg text-amber-200 text-xs cursor-pointer"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* PUZZLE 2: KANNADA INSCRIPTION DECODER */}
          {/* ------------------------------------------------------------- */}
          {puzzle.type === 'inscription_decoder' && (
            <div className="space-y-4">
              <span className="text-xs font-serif font-bold text-amber-300 block">
                Match each ancient Kannada epigraphic glyph to its royal meaning:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'glyph_shri', glyph: 'ಶ್ರೀ', name: 'Shri (Divine Grace)' },
                  { id: 'glyph_varaha', glyph: 'ವರಾಹ', name: 'Varaha (Royal Boar)' },
                  { id: 'glyph_vijaya', glyph: 'ವಿಜಯ', name: 'Vijaya (Eternal Victory)' },
                  { id: 'glyph_surya', glyph: 'ಸೂರ್ಯ', name: 'Surya (Solar Dynasty)' }
                ].map(item => (
                  <div key={item.id} className="p-3.5 bg-stone-900 border border-amber-900/50 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-serif text-amber-400 font-bold bg-stone-950 px-2.5 py-1 rounded-xl border border-amber-900">
                        {item.glyph}
                      </span>
                      <span className="font-serif font-bold text-sm text-amber-100">
                        {item.name}
                      </span>
                    </div>

                    <select
                      value={glyphMatches[item.id] || ''}
                      onChange={e => setGlyphMatches({ ...glyphMatches, [item.id]: e.target.value })}
                      className="w-full bg-stone-950 border border-amber-900/70 rounded-xl px-3 py-2 text-xs text-amber-200 focus:border-amber-500 focus:outline-none"
                    >
                      <option value="">-- Select Meaning --</option>
                      <option value="Divine Invocation & Auspicious Grace">Divine Invocation & Auspicious Grace</option>
                      <option value="Imperial Boar Emblem of Empire">Imperial Boar Emblem of Empire</option>
                      <option value="Eternal Victory of Vijayanagara">Eternal Victory of Vijayanagara</option>
                      <option value="Radiant Solar Lineage">Radiant Solar Lineage</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* PUZZLE 3: CHRONOLOGICAL DYNASTIC TIMELINE */}
          {/* ------------------------------------------------------------- */}
          {puzzle.type === 'timeline_ordering' && (
            <div className="space-y-3">
              <span className="text-xs font-serif font-bold text-amber-300 block">
                Arrange historical milestones chronologically (Earliest at top to Latest at bottom):
              </span>
              <div className="space-y-2">
                {timelineOrder.map((id, index) => {
                  const events: { [k: string]: { year: string; title: string; desc: string } } = {
                    time_foundation: { year: '1336 CE', title: 'Foundation of Vijayanagara', desc: 'Hakka & Bukka consecrate the capital on the banks of Tungabhadra' },
                    time_devaraya: { year: '1424 CE', title: 'Maritime Trading Zenith', desc: 'Devaraya II expands trade in Arabian horses and Gulf pearls' },
                    time_coronation: { year: '1509 CE', title: 'Coronation of Krishnadevaraya', desc: 'Golden age begins with massive patronage of arts and temples' },
                    time_chariot: { year: '1516 CE', title: 'Stone Chariot Consecration', desc: 'Garuda shrine chariot erected in Vitthala temple courtyard' }
                  };
                  const ev = events[id];

                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between p-3.5 bg-stone-900 border border-amber-900/50 rounded-2xl hover:border-amber-500/50 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono font-bold text-xs bg-amber-950 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-800">
                          {ev.year}
                        </span>
                        <div>
                          <h5 className="font-serif font-bold text-amber-100 text-sm">
                            {ev.title}
                          </h5>
                          <p className="text-[11px] text-stone-400 font-sans">
                            {ev.desc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveTimelineItem(index, 'up')}
                          disabled={index === 0}
                          className="px-2.5 py-1 bg-stone-800 hover:bg-amber-800 disabled:opacity-30 rounded-lg text-amber-200 text-xs cursor-pointer"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => moveTimelineItem(index, 'down')}
                          disabled={index === timelineOrder.length - 1}
                          className="px-2.5 py-1 bg-stone-800 hover:bg-amber-800 disabled:opacity-30 rounded-lg text-amber-200 text-xs cursor-pointer"
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ------------------------------------------------------------- */}
          {/* PUZZLE 4: STONE CHARIOT RADIAL ASTRONOMY LOCK */}
          {/* ------------------------------------------------------------- */}
          {puzzle.type === 'stone_chariot_rotator' && (
            <div className="space-y-4 text-center">
              <span className="text-xs font-serif font-bold text-amber-300 block">
                Click each astronomical dial to rotate 90°. Align all cardinal dials with the Zenith marker (0°):
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
                {[
                  { id: 'ring_north', name: 'NORTH: Garuda', symbol: '🦅', target: '0°' },
                  { id: 'ring_east', name: 'EAST: Surya', symbol: '☀️', target: '0°' },
                  { id: 'ring_south', name: 'SOUTH: Varaha', symbol: '🐗', target: '0°' },
                  { id: 'ring_west', name: 'WEST: Lotus', symbol: '🪷', target: '0°' }
                ].map(dial => {
                  const deg = chariotDials[dial.id];
                  const isAligned = deg === 0;

                  return (
                    <div
                      key={dial.id}
                      onClick={() => rotateDial(dial.id)}
                      className={`p-4 rounded-2xl border flex flex-col items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${
                        isAligned
                          ? 'bg-amber-950/60 border-amber-400 box-gold-glow'
                          : 'bg-stone-900 border-amber-900/60'
                      }`}
                    >
                      <div
                        className="w-16 h-16 rounded-full border-2 border-amber-500/60 flex items-center justify-center text-3xl shadow-lg transition-transform duration-300 bg-stone-950"
                        style={{ transform: `rotate(${deg}deg)` }}
                      >
                        {dial.symbol}
                      </div>

                      <span className="font-serif font-bold text-xs text-amber-200 mt-2">
                        {dial.name}
                      </span>
                      <span className="font-mono text-[10px] text-amber-400/80">
                        {deg}° {isAligned ? '✦ LOCKED' : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="p-4 bg-stone-950 border-t border-amber-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Award className="w-4 h-4 text-yellow-400" />
            <span>Reward: +{puzzle.rewardXP} XP</span>
          </div>

          <button
            onClick={() => {
              if (puzzle.type === 'architecture_cipher') checkArchitecturePuzzle();
              else if (puzzle.type === 'inscription_decoder') checkInscriptionPuzzle();
              else if (puzzle.type === 'timeline_ordering') checkTimelinePuzzle();
              else if (puzzle.type === 'stone_chariot_rotator') checkChariotPuzzle();
            }}
            className="px-6 py-2.5 rounded-xl font-serif font-bold text-sm bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 box-gold-glow transition-all shadow-lg cursor-pointer"
          >
            VERIFY ALIGNMENT
          </button>
        </div>
      </div>
    </div>
  );
};
