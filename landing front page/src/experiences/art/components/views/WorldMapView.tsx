import React, { useState } from 'react';
import { CraftRegion } from '../../types';
import { CRAFT_REGIONS } from '../../data/craftsData';
import { sound } from '../../utils/soundEngine';
import { ChevronLeft, Lock, Unlock, MapPin, Sparkles, Compass, Play, Info } from 'lucide-react';

interface WorldMapViewProps {
  unlockedRegionIds: string[];
  activeRegionId: string;
  onSelectRegion: (region: CraftRegion) => void;
  onBack: () => void;
}

// Map pin coordinates mapped on India's geographic silhouette (500x580 SVG coordinate space)
const MAP_LOCATIONS: {
  id: string;
  state: string;
  craft: string;
  x: number;
  y: number;
  labelSide: 'left' | 'right' | 'top' | 'bottom';
}[] = [
  { id: 'punjab_phulkari', state: 'Punjab', craft: 'Phulkari', x: 175, y: 135, labelSide: 'left' },
  { id: 'rajasthan_pottery', state: 'Rajasthan', craft: 'Blue Pottery', x: 155, y: 195, labelSide: 'left' },
  { id: 'gujarat_bandhani', state: 'Gujarat', craft: 'Bandhani', x: 105, y: 260, labelSide: 'left' },
  { id: 'bihar_madhubani', state: 'Bihar', craft: 'Madhubani', x: 335, y: 220, labelSide: 'right' },
  { id: 'bengal_kantha', state: 'West Bengal', craft: 'Kantha', x: 370, y: 255, labelSide: 'right' },
  { id: 'odisha_pattachitra', state: 'Odisha', craft: 'Pattachitra', x: 325, y: 310, labelSide: 'right' },
  { id: 'maharashtra_warli', state: 'Maharashtra', craft: 'Warli', x: 170, y: 320, labelSide: 'left' },
  { id: 'karnataka_mysore', state: 'Karnataka', craft: 'Mysore Painting', x: 195, y: 430, labelSide: 'bottom' },
];

export const WorldMapView: React.FC<WorldMapViewProps> = ({
  unlockedRegionIds,
  activeRegionId,
  onSelectRegion,
  onBack,
}) => {
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

  const handleLocationClick = (regId: string) => {
    const region = CRAFT_REGIONS.find((r) => r.id === regId);
    if (!region) return;

    if (unlockedRegionIds.includes(regId)) {
      sound.playClick();
      onSelectRegion(region);
    } else {
      sound.playWrong();
    }
  };

  const selectedRegion = CRAFT_REGIONS.find(
    (r) => r.id === (hoveredRegionId || activeRegionId)
  ) || CRAFT_REGIONS[0];

  return (
    <div className="relative w-full h-full flex flex-col bg-[#fdfbf7] text-[#1c120c] select-none overflow-y-auto font-sans">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#23150d] text-[#fdfbf7] border-b-2 border-[#d4af37]/40 sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="p-2 rounded-xl bg-[#3d2717] hover:bg-[#4a321f] text-[#d4af37] border border-[#d4af37]/30 transition-all active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-[#d4af37] flex items-center gap-2">
              <Compass size={20} />
              <span>Cultural Map of India</span>
            </h2>
            <p className="text-xs text-[#e6d7be]">
              Select an unlocked region to begin your artisan adventure
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#3d2717] border border-[#d4af37]/40 text-xs font-bold text-[#d4af37]">
          <Sparkles size={14} />
          <span>
            {unlockedRegionIds.length} / {CRAFT_REGIONS.length} Traditions Unlocked
          </span>
        </div>
      </div>

      {/* Main Map Container: Cream Background + Dark Brown Map + Antique Gold Markers */}
      <div className="p-4 sm:p-8 max-w-6xl mx-auto w-full flex-1 flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center">
        {/* Left: Interactive Map of India Canvas */}
        <div className="w-full max-w-md lg:max-w-lg bg-[#f7f2e7] p-5 sm:p-7 rounded-3xl border-2 border-[#d4af37]/40 shadow-xl relative flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#8c6d37]">
              Interactive Heritage Map
            </span>
            <span className="text-[10px] text-[#7a6857] flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#d4af37] inline-block" /> Gold = Unlocked
            </span>
          </div>

          {/* SVG Map of India */}
          <div className="relative w-full aspect-[500/580] flex items-center justify-center">
            <svg
              viewBox="0 0 500 580"
              className="w-full h-full drop-shadow-md"
              style={{ filter: 'drop-shadow(0 6px 12px rgba(44, 27, 16, 0.15))' }}
            >
              {/* Stylized Geographic Contours of India in Dark Brown */}
              <path
                d="M 190,45 
                   C 210,40 230,55 240,75 
                   C 255,90 280,105 310,120 
                   C 330,130 350,140 370,165 
                   C 390,185 410,195 435,210 
                   C 455,225 460,245 440,260 
                   C 420,270 395,260 380,275 
                   C 365,290 350,310 355,340 
                   C 350,370 320,400 290,440 
                   C 265,475 235,520 215,550 
                   C 200,530 180,480 170,440 
                   C 160,400 145,360 140,320 
                   C 130,290 100,285 70,275 
                   C 60,250 85,230 110,215 
                   C 125,200 135,175 140,150 
                   C 145,120 165,80 185,50 Z"
                fill="#2c1b10"
                stroke="#d4af37"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />

              {/* Decorative Regional Province Dividers */}
              <path
                d="M 155,195 Q 230,210 335,220"
                fill="none"
                stroke="#4a321f"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <path
                d="M 170,320 Q 245,310 325,310"
                fill="none"
                stroke="#4a321f"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <path
                d="M 140,240 Q 200,250 250,260"
                fill="none"
                stroke="#4a321f"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Location Pins with Antique Gold & Glow */}
              {MAP_LOCATIONS.map((loc) => {
                const isUnlocked = unlockedRegionIds.includes(loc.id);
                const isActive = activeRegionId === loc.id;
                const isHovered = hoveredRegionId === loc.id;

                return (
                  <g
                    key={loc.id}
                    className="cursor-pointer transition-transform duration-200"
                    onMouseEnter={() => setHoveredRegionId(loc.id)}
                    onMouseLeave={() => setHoveredRegionId(null)}
                    onClick={() => handleLocationClick(loc.id)}
                  >
                    {/* Unlocked Gold Glow Ring */}
                    {isUnlocked && (
                      <circle
                        cx={loc.x}
                        cy={loc.y}
                        r="14"
                        fill="#d4af37"
                        opacity="0.25"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer Pin Body */}
                    <circle
                      cx={loc.x}
                      cy={loc.y}
                      r={isActive ? 11 : 9}
                      fill={isUnlocked ? '#d4af37' : '#4a321f'}
                      stroke={isUnlocked ? '#fdfbf7' : '#23150d'}
                      strokeWidth="2"
                    />

                    {/* Center Dot or Lock Symbol */}
                    {isUnlocked ? (
                      <circle
                        cx={loc.x}
                        cy={loc.y}
                        r="3.5"
                        fill="#1c120c"
                      />
                    ) : (
                      <circle
                        cx={loc.x}
                        cy={loc.y}
                        r="3.5"
                        fill="#8c6d37"
                      />
                    )}

                    {/* Location Badge Card */}
                    <foreignObject
                      x={loc.labelSide === 'left' ? loc.x - 105 : loc.x + 12}
                      y={loc.y - 14}
                      width="100"
                      height="36"
                    >
                      <div
                        className={`px-2 py-0.5 rounded-lg text-[9px] font-bold truncate transition-all ${
                          isUnlocked
                            ? isActive || isHovered
                              ? 'bg-[#d4af37] text-[#1c120c] shadow-md scale-105'
                              : 'bg-[#23150d] text-[#d4af37] border border-[#d4af37]/40'
                            : 'bg-[#23150d]/80 text-[#8c6d37] border border-[#4a321f]'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {!isUnlocked && <span className="text-[8px]">🔒</span>}
                          <span className="truncate">{loc.craft}</span>
                        </div>
                        <div className="text-[7.5px] opacity-75 truncate">{loc.state}</div>
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
            </svg>
          </div>

          <p className="text-[11px] text-[#7a6857] text-center mt-3">
            Click any unlocked golden pin to explore that traditional craft village.
          </p>
        </div>

        {/* Right: Selected Region Preview & Travel Deck */}
        <div className="w-full lg:w-96 flex flex-col gap-4">
          <div className="p-6 rounded-3xl bg-[#23150d] text-[#fdfbf7] border-2 border-[#d4af37]/60 shadow-2xl relative glow-heritage">
            <div className="flex items-center justify-between mb-3 pb-3 border-b border-[#d4af37]/30">
              <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
                <MapPin size={14} />
                {selectedRegion.state} • {selectedRegion.region}
              </span>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                  unlockedRegionIds.includes(selectedRegion.id)
                    ? 'bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/50'
                    : 'bg-[#3d2717] text-[#a3907c]'
                }`}
              >
                {unlockedRegionIds.includes(selectedRegion.id) ? (
                  <>
                    <Unlock size={10} /> Unlocked
                  </>
                ) : (
                  <>
                    <Lock size={10} /> Locked
                  </>
                )}
              </span>
            </div>

            <h3 className="text-2xl font-extrabold font-heading text-[#d4af37] mb-1">
              {selectedRegion.craftName}
            </h3>
            <p className="text-xs text-[#e6d7be] mb-4 italic">
              "{selectedRegion.tagline}"
            </p>

            <p className="text-xs text-[#fdfbf7] leading-relaxed mb-5">
              {selectedRegion.description}
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2.5 text-xs bg-[#1c120c] p-3.5 rounded-2xl border border-[#d4af37]/20 mb-5">
              <div>
                <span className="text-[#a3907c] text-[10px] block">Master Artisan</span>
                <span className="font-bold text-[#fdfbf7] truncate block">
                  {selectedRegion.artisan.name}
                </span>
              </div>
              <div>
                <span className="text-[#a3907c] text-[10px] block">Level Reward</span>
                <span className="font-bold text-[#d4af37]">+{selectedRegion.xpReward} XP</span>
              </div>
              <div>
                <span className="text-[#a3907c] text-[10px] block">Difficulty</span>
                <span className="font-bold text-[#e6d7be]">{selectedRegion.difficulty}</span>
              </div>
              <div>
                <span className="text-[#a3907c] text-[10px] block">Sacred Relics</span>
                <span className="font-bold text-[#fdfbf7]">{selectedRegion.artifacts.length} Artifacts</span>
              </div>
            </div>

            {/* Travel / Action Button */}
            {unlockedRegionIds.includes(selectedRegion.id) ? (
              <button
                onClick={() => {
                  sound.playClick();
                  onSelectRegion(selectedRegion);
                }}
                className="w-full py-3.5 rounded-2xl bg-[#d4af37] hover:bg-[#c59b27] text-[#1c120c] font-black text-sm uppercase tracking-wider shadow-xl transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-2 glow-heritage"
              >
                <Play size={16} className="fill-[#1c120c]" />
                <span>Travel to {selectedRegion.craftName}</span>
              </button>
            ) : (
              <div className="w-full py-3.5 rounded-2xl bg-[#3d2717] text-[#a3907c] font-bold text-xs text-center border border-[#4a321f] flex items-center justify-center gap-2 cursor-not-allowed">
                <Lock size={14} />
                <span>Complete Madhubani to Unlock</span>
              </div>
            )}
          </div>

          {/* Quick List of All 8 Traditions */}
          <div className="bg-[#f7f2e7] p-4 rounded-3xl border border-[#d4af37]/30">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8c6d37] block mb-2.5">
              All 8 Heritage Craft Odysseys
            </span>
            <div className="space-y-1.5">
              {CRAFT_REGIONS.map((r, i) => {
                const unlocked = unlockedRegionIds.includes(r.id);
                return (
                  <button
                    key={r.id}
                    onClick={() => handleLocationClick(r.id)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all ${
                      selectedRegion.id === r.id
                        ? 'bg-[#23150d] text-[#d4af37] shadow-md'
                        : unlocked
                        ? 'bg-[#fdfbf7] text-[#2c1b10] hover:bg-[#eee6d8]'
                        : 'bg-[#eee6d8]/60 text-[#a3907c] opacity-60'
                    }`}
                  >
                    <span>
                      {i + 1}. {r.state} — {r.craftName}
                    </span>
                    <span>{unlocked ? '🔓' : '🔒'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
