import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { MONUMENTS } from '../../data/monuments';
import { LocationId } from '../../types';
import { X, Lock, CheckCircle2, Compass, MapPin, ArrowRight } from 'lucide-react';

interface HampiMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HampiMapModal: React.FC<HampiMapModalProps> = ({ isOpen, onClose }) => {
  const {
    currentLocation,
    unlockedLocations,
    moveToLocation,
    clues,
    solvedPuzzles
  } = useGameStore();

  const [selectedLocationId, setSelectedLocationId] = useState<LocationId>(currentLocation);

  if (!isOpen) return null;

  const selectedMonument = MONUMENTS[selectedLocationId] || MONUMENTS.bazaar;
  const isUnlocked = unlockedLocations.includes(selectedLocationId);

  // Count clues for this monument
  const monumentClues = clues.filter(c => c.locationId === selectedLocationId);
  const discoveredClues = monumentClues.filter(c => c.status === 'discovered');

  // Check if puzzle is solved
  const isPuzzleSolved = selectedMonument.puzzleId ? solvedPuzzles.includes(selectedMonument.puzzleId) : true;

  const handleTravel = () => {
    if (isUnlocked) {
      moveToLocation(selectedLocationId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-stone-950 border border-amber-600/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] box-gold-glow animate-in fade-in zoom-in-95">
        {/* Map Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-950/80 border-b border-amber-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-300">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-amber-100 tracking-wider">
                CHRONICLE CARTOGRAPHY OF VIJAYANAGARA
              </h3>
              <p className="text-xs text-amber-400/80 font-serif">
                Sacred axis along the holy Tungabhadra River Valley
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-amber-400 hover:text-amber-200 hover:bg-stone-800/70 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Content (2-Column: Parchment Map on Left, Monument Details on Right) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* LEFT: Weathered Parchment Map Canvas */}
          <div className="relative flex-1 bg-[#1a140e] overflow-hidden min-h-[340px] sm:min-h-[420px] p-6 border-b lg:border-b-0 lg:border-r border-amber-900/40 flex items-center justify-center">
            {/* Parchment background styling with river lines */}
            <div
              className="absolute inset-0 opacity-40 mix-blend-overlay"
              style={{
                backgroundImage: `radial-gradient(ellipse at 40% 50%, #442a12 0%, #160e06 85%)`
              }}
            />

            {/* Stylized River Tungabhadra curving across map */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M -50 80 Q 200 40 400 120 T 900 100"
                fill="none"
                stroke="#457b9d"
                strokeWidth="24"
                strokeLinecap="round"
                className="opacity-70"
              />
              <path
                d="M -50 80 Q 200 40 400 120 T 900 100"
                fill="none"
                stroke="#64b5f6"
                strokeWidth="4"
                strokeDasharray="10 10"
              />
              <text x="35%" y="65" fill="#64b5f6" fontSize="11" fontFamily="Cinzel" letterSpacing="4" opacity="0.6">
                ~ TUNGABHADRA RIVER ~
              </text>
            </svg>

            {/* Sacred Hills contour labels */}
            <div className="absolute top-8 left-12 text-[10px] font-serif text-amber-600/50 tracking-widest uppercase">
              ▲ Hemakuta Hill
            </div>
            <div className="absolute top-12 right-24 text-[10px] font-serif text-amber-600/50 tracking-widest uppercase">
              ▲ Matanga Hill
            </div>

            {/* Monument Map Markers */}
            <div className="relative w-full max-w-lg aspect-[4/3]">
              {Object.values(MONUMENTS).map(mon => {
                const unlocked = unlockedLocations.includes(mon.id);
                const isSelected = selectedLocationId === mon.id;
                const isCurrent = currentLocation === mon.id;

                return (
                  <button
                    key={mon.id}
                    onClick={() => setSelectedLocationId(mon.id)}
                    style={{
                      left: `${mon.coordinates[0]}%`,
                      top: `${mon.coordinates[1]}%`
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-transform duration-200 cursor-pointer ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-20'
                    }`}
                  >
                    {/* Pulsing ring if selected or current */}
                    {(isSelected || isCurrent) && (
                      <span className="absolute -inset-2 rounded-full border-2 border-amber-400 animate-ping opacity-60 pointer-events-none" />
                    )}

                    {/* Marker Icon Pin */}
                    <div
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shadow-2xl border transition-all ${
                        unlocked
                          ? isSelected
                            ? 'bg-gradient-to-br from-amber-400 to-yellow-600 text-stone-950 border-amber-200 box-gold-glow'
                            : 'bg-stone-900/90 text-amber-300 border-amber-500/70'
                          : 'bg-stone-900/80 text-stone-500 border-stone-700'
                      }`}
                    >
                      {unlocked ? (
                        mon.id === 'stone_chariot' ? (
                          <span className="text-lg">☸️</span>
                        ) : mon.id === 'virupaksha' ? (
                          <span className="text-lg">⛩️</span>
                        ) : mon.id === 'vitthala' ? (
                          <span className="text-lg">🏛️</span>
                        ) : (
                          <MapPin className="w-5 h-5" />
                        )
                      ) : (
                        <Lock className="w-4 h-4 text-stone-500" />
                      )}
                    </div>

                    {/* Marker Label */}
                    <span
                      className={`mt-1.5 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-serif font-bold whitespace-nowrap shadow-md transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-stone-950'
                          : unlocked
                          ? 'bg-stone-900/90 text-amber-200 border border-amber-900/40'
                          : 'bg-stone-900/60 text-stone-500'
                      }`}
                    >
                      {mon.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* RIGHT: Monument Details & Travel Panel */}
          <div className="w-full lg:w-96 bg-stone-900/90 p-6 flex flex-col justify-between overflow-y-auto parchment-scroll">
            <div>
              {/* Header Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-serif text-amber-400 tracking-wider">
                  {selectedMonument.kannadaName}
                </span>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                    isUnlocked
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-rose-950 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {isUnlocked ? 'Unlocked Area' : 'Locked Territory'}
                </span>
              </div>

              <h3 className="font-serif font-bold text-xl text-amber-100 gold-glow mb-1">
                {selectedMonument.name}
              </h3>
              <p className="text-xs text-amber-300/80 font-serif italic mb-4">
                "{selectedMonument.tagline}"
              </p>

              {/* Status Counters Grid */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-stone-950/70 border border-amber-900/40 rounded-xl p-2.5">
                  <span className="text-[10px] text-stone-400 font-serif block">CLUES FOUND</span>
                  <span className="font-mono text-sm font-bold text-amber-300">
                    {discoveredClues.length} / {monumentClues.length}
                  </span>
                </div>
                <div className="bg-stone-950/70 border border-amber-900/40 rounded-xl p-2.5">
                  <span className="text-[10px] text-stone-400 font-serif block">PUZZLE STATUS</span>
                  <span className="font-mono text-sm font-bold text-amber-300 flex items-center gap-1">
                    {isPuzzleSolved ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 inline" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-amber-500 inline" />
                    )}
                    {isPuzzleSolved ? 'SOLVED' : 'ACTIVE'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-3 text-xs text-stone-300 font-sans leading-relaxed mb-4">
                <p>{selectedMonument.description}</p>
                <div className="bg-amber-950/40 border border-amber-800/30 rounded-xl p-3">
                  <span className="text-amber-400 font-serif font-bold block mb-1">
                    Historical Dynasty:
                  </span>
                  <p className="text-stone-400 text-[11px]">
                    {selectedMonument.historicalPeriod} • {selectedMonument.rulerAssociation}
                  </p>
                </div>
              </div>

              {/* Key Features */}
              <div className="mb-4">
                <span className="text-[11px] font-serif font-bold text-amber-300 uppercase block mb-1.5">
                  Key Architectural Features:
                </span>
                <ul className="space-y-1">
                  {selectedMonument.keyFeatures.map((f, i) => (
                    <li key={i} className="text-[11px] text-stone-400 flex items-start gap-1.5">
                      <span className="text-amber-500">✦</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Unlock Requirement Notice if locked */}
              {!isUnlocked && (
                <div className="bg-rose-950/40 border border-rose-800/40 rounded-xl p-3 text-xs text-rose-200 flex items-start gap-2 mb-4">
                  <Lock className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-serif font-bold block text-rose-300">Unlock Requirement:</span>
                    <p className="text-[11px] text-rose-200/90">{selectedMonument.unlockRequirementText}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Travel Action Button */}
            <div className="pt-4 border-t border-amber-900/40">
              <button
                onClick={handleTravel}
                disabled={!isUnlocked || currentLocation === selectedLocationId}
                className={`w-full py-3 rounded-xl font-serif font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                  currentLocation === selectedLocationId
                    ? 'bg-stone-800 text-stone-500 cursor-default'
                    : isUnlocked
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 box-gold-glow'
                    : 'bg-stone-800/60 text-stone-600 cursor-not-allowed'
                }`}
              >
                {currentLocation === selectedLocationId ? (
                  <span>CURRENTLY HERE</span>
                ) : isUnlocked ? (
                  <>
                    <span>TRAVEL TO {selectedMonument.name.toUpperCase()}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <span>LOCATION LOCKED</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
