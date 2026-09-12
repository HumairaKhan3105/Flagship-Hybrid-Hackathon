import { useState } from 'react';
import { Garment, PlayerProfile } from '../../types';
import ClothViewer3D from '../ThreeCanvas/ClothViewer3D';
import { Sparkles, Lock, Eye, Check, Filter, X } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface WardrobeScreenProps {
  garments: Garment[];
  player: PlayerProfile;
  onInspectGarment?: (garment: Garment) => void;
}

export default function WardrobeScreen({
  garments,
  player,
}: WardrobeScreenProps) {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [inspectingGarment, setInspectingGarment] = useState<Garment | null>(null);

  const filterTabs = ['All', 'North', 'South', 'West', 'East', 'Central'];

  const filteredGarments = garments.filter(g => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'North') return ['Varanasi, Uttar Pradesh', 'Kashmir', 'Punjab'].includes(g.regionName);
    if (activeFilter === 'South') return ['Kanchipuram, Tamil Nadu', 'Kerala'].includes(g.regionName);
    if (activeFilter === 'West') return ['Maharashtra', 'Gujarat', 'Rajasthan'].includes(g.regionName);
    if (activeFilter === 'East') return ['West Bengal', 'Assam', 'Odisha'].includes(g.regionName);
    if (activeFilter === 'Central') return ['Madhya Pradesh'].includes(g.regionName);
    return true;
  });

  return (
    <div className="relative w-full flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto select-none">
      {/* Top Banner: Heritage Wardrobe Title & Stats */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-amber-500/30 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-amber-200 uppercase tracking-wider">
              HERITAGE WARDROBE
            </h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-400 text-amber-300 font-cinzel font-semibold text-xs">
              3D Collection
            </span>
          </div>
          <p className="text-xs sm:text-sm font-marcellus text-stone-300 mt-0.5">
            Collect authentic regional garments from master looms across India
          </p>
        </div>

        {/* Collection Progress */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl royal-glass-card border border-amber-500/40 text-center">
            <span className="text-[10px] font-cinzel text-stone-400 tracking-wider uppercase block">
              Unlocked
            </span>
            <span className="text-lg font-cinzel font-bold text-amber-300">
              {player.unlockedGarments.length} / {garments.length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar pb-3 mb-4">
        {filterTabs.map(tab => (
          <button
            key={tab}
            onClick={() => {
              soundManager.playClick();
              setActiveFilter(tab);
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-cinzel font-semibold tracking-wider transition-all whitespace-nowrap ${
              activeFilter === tab
                ? 'bg-amber-400 text-stone-950 shadow-[0_0_12px_#f5c042]'
                : 'bg-stone-900/80 text-stone-300 border border-amber-500/20 hover:border-amber-500/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid of Garment Artifacts (Matching Reference Bottom-Left Screen) */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredGarments.map((garment) => {
          const isUnlocked = player.unlockedGarments.includes(garment.id) || garment.unlocked;

          return (
            <div
              key={garment.id}
              className={`royal-glass-card rounded-2xl p-4 border transition-all duration-300 relative flex flex-col justify-between group ${
                isUnlocked
                  ? 'border-amber-500/40 hover:border-amber-300 shadow-lg hover:shadow-[0_0_20px_rgba(245,192,66,0.3)]'
                  : 'border-stone-800 opacity-65 bg-stone-950/60'
              }`}
            >
              {/* Garment Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-cinzel font-bold tracking-wider uppercase bg-amber-950/90 text-amber-300 border border-amber-500/40">
                    {garment.rarity}
                  </span>
                  <span className="text-[11px] font-marcellus text-stone-400">
                    {garment.regionName}
                  </span>
                </div>

                {/* 3D Model / Visual Canvas Box */}
                <div 
                  className="w-full h-44 rounded-xl overflow-hidden relative border border-amber-500/30 flex items-center justify-center shadow-inner my-2"
                  style={{ backgroundColor: `${garment.colorHex}22` }}
                >
                  {isUnlocked ? (
                    <>
                      {/* Stylized Miniature Cloth Preview */}
                      <ClothViewer3D
                        colorHex={garment.colorHex}
                        accentGold={garment.accentGold}
                        garmentName={garment.name}
                        rarity={garment.rarity}
                        isInteractive={false}
                      />
                      <button
                        onClick={() => {
                          soundManager.playChime();
                          setInspectingGarment(garment);
                        }}
                        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-xs font-cinzel font-bold text-amber-200"
                      >
                        <Eye className="w-4 h-4 text-amber-400" />
                        <span>Inspect 3D Weave</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-4">
                      <div className="w-10 h-10 rounded-full bg-stone-900 border border-stone-700 flex items-center justify-center text-stone-500 mb-2">
                        <Lock className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-cinzel font-bold text-stone-400">
                        LOCKED
                      </span>
                      <span className="text-[10px] font-marcellus text-stone-500 mt-1">
                        Explore {garment.regionName} to unlock
                      </span>
                    </div>
                  )}
                </div>

                <h3 className="text-base font-cinzel font-bold text-amber-200 mt-2">
                  {garment.name}
                </h3>
                <p className="text-xs font-marcellus text-stone-300 line-clamp-2 mt-1">
                  {garment.description}
                </p>
              </div>

              {/* Footer info */}
              <div className="mt-3 pt-3 border-t border-amber-500/20 flex items-center justify-between text-[11px] font-marcellus">
                <span className="text-stone-400">Weave:</span>
                <span className="text-amber-300 font-semibold">{garment.fabricDetails.weaveTechnique}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Full 3D Interactive Garment Inspector */}
      {inspectingGarment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl royal-glass-card rounded-2xl border-2 border-amber-400 p-6 shadow-2xl flex flex-col">
            <button
              onClick={() => setInspectingGarment(null)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-stone-900 border border-amber-500/40 text-stone-300 hover:text-amber-300"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-left mb-2">
              <span className="text-xs font-cinzel text-amber-400 uppercase tracking-widest">
                {inspectingGarment.regionName} • {inspectingGarment.era}
              </span>
              <h3 className="text-2xl font-cinzel font-bold text-amber-200 uppercase">
                {inspectingGarment.name}
              </h3>
            </div>

            <div className="w-full h-72 rounded-xl bg-black/60 border border-amber-500/40 relative overflow-hidden my-3">
              <ClothViewer3D
                colorHex={inspectingGarment.colorHex}
                accentGold={inspectingGarment.accentGold}
                garmentName={inspectingGarment.name}
                rarity={inspectingGarment.rarity}
                isInteractive={true}
              />
            </div>

            <div className="parchment-bg p-4 rounded-xl text-stone-900 border border-amber-700/40 text-left text-xs sm:text-sm font-marcellus">
              <p className="font-semibold text-amber-950 mb-1">Cultural Significance:</p>
              <p className="leading-relaxed">{inspectingGarment.culturalSignificance}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
