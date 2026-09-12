import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  BookOpen, 
  Volume2, 
  MapPin, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { GameCategory } from '../types';
import { ALL_LEVELS } from '../data/levels';
import { CATEGORIES } from '../data/categories';
import { soundEngine } from '../utils/audio';

interface FactBookScreenProps {
  onBack: () => void;
}

export const FactBookScreen: React.FC<FactBookScreenProps> = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState<GameCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Collect all level facts into a searchable array
  const allDiscoveries = Object.entries(ALL_LEVELS).flatMap(([catKey, levels]) =>
    levels.map((lvl) => ({
      id: lvl.id,
      category: catKey as GameCategory,
      levelNum: lvl.level,
      title: lvl.title,
      region: lvl.region || 'India',
      fact: lvl.fact || lvl.explanation,
      soundType: lvl.soundType,
    }))
  );

  const filteredDiscoveries = allDiscoveries.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fact.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-8 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            soundEngine.playClick();
            onBack();
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border-2 border-[#5D4037] text-[#5D4037] text-xs sm:text-sm font-black uppercase tracking-wider shadow-sm hover:bg-[#5D4037] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Expedition Hub</span>
        </button>

        <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border-2 border-[#5D4037] text-[#5D4037] text-xs sm:text-sm font-black uppercase shadow-sm">
          <BookOpen className="w-4 h-4 text-[#D4AF37]" />
          <span>{allDiscoveries.length} Discoveries</span>
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white border-b-8 border-r-8 border-[#5D4037] border-t-2 border-l-2 border-[#5D4037] rounded-2xl p-5 sm:p-7 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-[#4A3728]">
        <div>
          <span className="px-2.5 py-0.5 rounded bg-[#2E7D32] text-white text-xs font-black uppercase shadow-sm">
            DETECTIVE ENCYCLOPEDIA
          </span>
          <h1 className="font-heading text-2xl sm:text-4xl font-black uppercase text-[#5D4037] mt-1.5">
            The Great Indian Cultural Compendium
          </h1>
          <p className="text-xs sm:text-sm text-[#8D6E63] font-bold mt-1 max-w-xl">
            Browse through 300+ authentic field discoveries, historical anecdotes, and artistic marvels collected from across 28 States and 8 Union Territories.
          </p>
        </div>

        <div className="w-20 h-20 rounded-2xl bg-[#D4AF37] border-2 border-[#5D4037] flex items-center justify-center text-4xl shadow-md shrink-0">
          📖
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8D6E63] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search any festival, textile, food, instrument, art form, or monument..."
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border-2 border-[#5D4037] text-[#4A3728] placeholder-[#8D6E63] text-xs sm:text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#D4AF37] shadow-sm"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveCategory('all');
            }}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
              activeCategory === 'all'
                ? 'bg-[#D4AF37] text-[#5D4037] font-black border-2 border-[#5D4037] scale-105'
                : 'bg-[#5D4037] text-[#FDF5E6] hover:bg-[#4A3728] border-2 border-[#5D4037]'
            }`}
          >
            All Discoveries ({allDiscoveries.length})
          </button>

          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundEngine.playClick();
                setActiveCategory(cat.id);
              }}
              className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm ${
                activeCategory === cat.id
                  ? 'bg-[#D4AF37] text-[#5D4037] font-black border-2 border-[#5D4037] scale-105'
                  : 'bg-[#5D4037] text-[#FDF5E6] hover:bg-[#4A3728] border-2 border-[#5D4037]'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Discoveries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDiscoveries.slice(0, 50).map((discovery) => {
          const catMeta = CATEGORIES.find((c) => c.id === discovery.category);

          return (
            <div
              key={discovery.id}
              className="bg-white rounded-xl p-5 border-b-6 border-r-6 border-t-2 border-l-2 border-[#5D4037] shadow-sm flex flex-col justify-between hover:border-[#D4AF37] transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{catMeta?.emoji}</span>
                    <h3 className="font-heading text-sm sm:text-base font-black uppercase text-[#5D4037] leading-snug">
                      {discovery.title}
                    </h3>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-[#FDF5E6] border border-[#5D4037] text-[#5D4037] text-[10px] font-black uppercase shrink-0">
                    Level {discovery.levelNum}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-[#8D6E63] font-bold mt-1">
                  <MapPin className="w-3 h-3 text-[#D4AF37]" />
                  <span>{discovery.region}</span>
                </div>

                <p className="text-xs text-[#4A3728] font-medium leading-relaxed mt-2.5">
                  "{discovery.fact}"
                </p>
              </div>

              {discovery.soundType && (
                <div className="mt-3 pt-2 border-t border-stone-200">
                  <button
                    onClick={() => soundEngine.playInstrument(discovery.soundType as any)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FDF5E6] hover:bg-[#D4AF37]/20 text-[#5D4037] text-[11px] font-black uppercase border border-[#5D4037]"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Play Acoustic Tone</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredDiscoveries.length > 50 && (
        <div className="text-center text-xs text-[#8D6E63] font-bold">
          Showing first 50 results. Use the search bar above to narrow down specific regions or artifacts.
        </div>
      )}
    </div>
  );
};
