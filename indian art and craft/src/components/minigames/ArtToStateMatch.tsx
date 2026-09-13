import React, { useState } from 'react';
import { ART_TO_STATE_PAIRS } from '../../data/craftsData';
import { sound } from '../../utils/soundEngine';
import confetti from 'canvas-confetti';
import { ChevronLeft, Check, Sparkles, MapPin, Award } from 'lucide-react';

interface ArtToStateMatchProps {
  onComplete: (xp: number) => void;
  onBackToWorld: () => void;
}

export const ArtToStateMatch: React.FC<ArtToStateMatchProps> = ({
  onComplete,
  onBackToWorld,
}) => {
  const [selectedArtId, setSelectedArtId] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [currentFact, setCurrentFact] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Shuffled state list
  const [states] = useState(() =>
    [...ART_TO_STATE_PAIRS].sort(() => Math.random() - 0.5)
  );

  const handleSelectArt = (id: string) => {
    if (matchedPairs.includes(id)) return;
    sound.playClick();
    setSelectedArtId(id === selectedArtId ? null : id);
  };

  const handleSelectState = (stateName: string) => {
    if (!selectedArtId) return;

    const targetPair = ART_TO_STATE_PAIRS.find((p) => p.id === selectedArtId);
    if (targetPair?.state === stateName) {
      // Correct match!
      sound.playCorrect();
      const updated = [...matchedPairs, selectedArtId];
      setMatchedPairs(updated);
      setSelectedArtId(null);
      setCurrentFact(`${targetPair.art} is traditionally associated with ${targetPair.state}. ${targetPair.fact}`);

      if (updated.length === ART_TO_STATE_PAIRS.length) {
        setIsFinished(true);
        sound.playLevelVictory();
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#dc2626', '#10b981'],
        });
        onComplete(50);
      }
    } else {
      // Wrong match
      sound.playWrong();
      setSelectedArtId(null);
    }
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
              Match the Art to the State
            </h2>
            <p className="text-xs text-stone-400">
              Discover India's vibrant regional heritage traditions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800 border border-amber-500/20 text-xs">
          <Award size={14} className="text-amber-400" />
          <span className="font-bold text-amber-300">
            {matchedPairs.length} / {ART_TO_STATE_PAIRS.length} Matched
          </span>
        </div>
      </div>

      {/* Main Matching Stage */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
        {/* Educational Info Card */}
        {currentFact && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 max-w-xl text-center animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles size={14} />
              <span>Cultural Insight</span>
            </div>
            <p className="text-amber-100 text-xs sm:text-sm leading-relaxed">
              {currentFact}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Traditional Artworks Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
              <span>🎨 Traditional Indian Crafts</span>
            </h3>
            <div className="space-y-3">
              {ART_TO_STATE_PAIRS.map((pair) => {
                const isMatched = matchedPairs.includes(pair.id);
                const isSelected = selectedArtId === pair.id;

                return (
                  <button
                    key={pair.id}
                    disabled={isMatched}
                    onClick={() => handleSelectArt(pair.id)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-left ${
                      isMatched
                        ? 'bg-emerald-950/30 border-emerald-500/60 opacity-80 cursor-default'
                        : isSelected
                        ? 'bg-amber-600/30 border-amber-400 shadow-lg scale-102'
                        : 'bg-stone-900 border-amber-500/20 hover:border-amber-400 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{pair.icon}</span>
                      <div>
                        <span className="font-bold text-sm text-amber-100 block">
                          {pair.art}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {isMatched ? `✓ Paired with ${pair.state}` : 'Select to pair'}
                        </span>
                      </div>
                    </div>
                    {isMatched && <Check size={18} className="text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Indian States Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400 mb-3 flex items-center gap-2">
              <MapPin size={14} />
              <span>Origin State</span>
            </h3>
            <div className="space-y-3">
              {states.map((s) => {
                const matchedPair = ART_TO_STATE_PAIRS.find(
                  (p) => p.state === s.state && matchedPairs.includes(p.id)
                );

                return (
                  <button
                    key={s.state}
                    disabled={!!matchedPair || !selectedArtId}
                    onClick={() => handleSelectState(s.state)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-left ${
                      matchedPair
                        ? 'bg-emerald-950/30 border-emerald-500/60 opacity-80 cursor-default'
                        : selectedArtId
                        ? 'bg-stone-900 border-orange-500/40 hover:border-orange-400 hover:bg-orange-950/20 cursor-pointer animate-pulse'
                        : 'bg-stone-900 border-stone-800 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center font-bold text-xs text-orange-400 border border-stone-700">
                        {s.state[0]}
                      </div>
                      <div>
                        <span className="font-bold text-sm text-stone-200 block">
                          {s.state}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {matchedPair ? `✓ ${matchedPair.art}` : 'Tap after choosing craft'}
                        </span>
                      </div>
                    </div>
                    {matchedPair && <Check size={18} className="text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {isFinished && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-b from-stone-900 to-stone-950 border-2 border-amber-500/60 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl glow-heritage">
            <div className="w-16 h-16 bg-amber-500/20 border-2 border-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              🗺️
            </div>
            <h2 className="text-2xl font-bold font-heading text-amber-300">
              State Match Master!
            </h2>
            <p className="text-stone-300 text-sm mt-2">
              You successfully mapped traditional crafts across India's diverse geography.
            </p>

            <div className="bg-stone-800/80 border border-amber-500/30 rounded-2xl p-4 my-6 flex justify-around">
              <div>
                <span className="text-xs text-stone-400 block">Reward</span>
                <span className="text-xl font-extrabold text-amber-400">+50 XP</span>
              </div>
              <div className="border-r border-stone-700" />
              <div>
                <span className="text-xs text-stone-400 block">Completed</span>
                <span className="text-xl font-extrabold text-emerald-400">6 / 6</span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onBackToWorld();
              }}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 text-white rounded-xl font-bold text-sm shadow-lg transition-all"
            >
              Return to Journey
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
