import React, { useState } from 'react';
import { Package, X, Key, Scroll, Sparkles, Footprints, Shield, Eye, Flame } from 'lucide-react';
import { INVENTORY_ITEMS } from '../../data/gameData';
import { InventoryItem } from '../../types';
import { sounds } from '../../audio';

export const InventoryScreen: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<InventoryItem>(INVENTORY_ITEMS[0]);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const getItemIcon = (iconType: InventoryItem['iconType']) => {
    switch (iconType) {
      case 'coin':
        return Sparkles;
      case 'scroll':
        return Scroll;
      case 'symbol':
        return Shield;
      case 'key':
        return Key;
      case 'herb':
        return Footprints;
      default:
        return Package;
    }
  };

  const handleAction = (action: string) => {
    sounds.playTempleBell(580);
    setActionFeedback(`Action performed: ${action} on ${selectedItem.name}`);
    setTimeout(() => setActionFeedback(null), 2500);
  };

  return (
    <div id="screen-inventory" className="relative w-full h-full min-h-[360px] flex flex-col justify-between overflow-hidden bg-[#060c1c] text-[#faeccf] select-none p-4 md:p-6">
      {/* Dark Navy Blueprint Texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a1532] via-[#060e22] to-[#040814] pointer-events-none" />

      {/* Screen Header */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-[#d4af37]/40">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-full border border-[#d4af37] bg-[#0f214d] flex items-center justify-center text-[#fcd34d]">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-cinzel text-base md:text-lg font-bold text-[#fae596] tracking-wide">
              Inventory
            </h3>
            <p className="text-xs text-[#93c5fd] font-sans">
              Sacred relics, parchment rubbings, and investigative tools.
            </p>
          </div>
        </div>

        {/* Close [X] Icon */}
        <button
          onClick={() => {
            sounds.playStoneClick();
            setActionFeedback('Closed inventory panel');
          }}
          className="w-7 h-7 rounded border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] hover:bg-[#142a5c] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Inventory: 5-Item Grid and Item Inspection Panel */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row gap-5 my-3">
        
        {/* Left: 5 Items Grid (matching screenshot) */}
        <div className="w-full md:w-3/5 flex flex-col justify-between">
          <div className="grid grid-cols-5 gap-2.5">
            {INVENTORY_ITEMS.map((item) => {
              const Icon = getItemIcon(item.iconType);
              const isSelected = selectedItem.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sounds.playStoneClick();
                    setSelectedItem(item);
                  }}
                  className={`aspect-square rounded-sm border p-2 flex flex-col items-center justify-center text-center transition-all group relative ${
                    isSelected
                      ? 'border-[#fcd34d] bg-[#1a346e] text-[#fff1be] shadow-[0_0_15px_rgba(252,211,77,0.3)]'
                      : 'border-[#d4af37]/30 bg-[#091533] text-[#c59b27] hover:border-[#fcd34d]/60 hover:bg-[#11244f]'
                  }`}
                >
                  <Icon className="w-6 h-6 mb-1.5 transition-transform group-hover:scale-110" />
                  <span className="font-cinzel text-[10px] md:text-xs font-semibold leading-tight line-clamp-1">
                    {item.name}
                  </span>

                  {/* Rarity pip */}
                  <span className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${
                    item.rarity === 'Sacred' ? 'bg-amber-400 animate-pulse' : 'bg-blue-400'
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Action Feedback Banner */}
          {actionFeedback && (
            <div className="mt-3 p-2 bg-[#0d2250] border border-cyan-400 rounded text-xs text-cyan-200 text-center animate-fadeIn">
              {actionFeedback}
            </div>
          )}

          {/* Capacity and Quick Lore */}
          <div className="mt-auto pt-3 border-t border-[#d4af37]/20 flex justify-between items-center text-[11px] font-mono text-[#93c5fd]">
            <span>Slots Used: 5 / 16</span>
            <span className="text-[#fcd34d]">Cloth Satchel • Magadha Scribe</span>
          </div>
        </div>

        {/* Right: Selected Item Inspection Viewport */}
        <div className="w-full md:w-2/5 bg-[#081432]/95 border-2 border-[#d4af37]/60 rounded-md p-4 shadow-xl flex flex-col justify-between">
          <div>
            {/* Sanskrit Name & Category */}
            <div className="flex justify-between items-start pb-2 border-b border-[#d4af37]/30 mb-2.5">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase">
                  {selectedItem.category} • {selectedItem.rarity}
                </span>
                <h4 className="font-cinzel text-sm md:text-base font-bold text-[#fae596]">
                  {selectedItem.name}
                </h4>
              </div>
              <span className="text-xl">{selectedItem.imageFallback}</span>
            </div>

            <p className="text-[11px] font-serif text-[#fcd34d] italic mb-2">
              {selectedItem.sanskritName}
            </p>

            <p className="text-xs text-[#e2d5b6] leading-relaxed mb-3">
              {selectedItem.description}
            </p>

            {/* Historical context callout */}
            <div className="p-2.5 bg-[#050b1a] border border-[#d4af37]/25 rounded text-[11px] text-[#cbd5e1] leading-snug">
              <strong className="text-[#fcd34d] block font-mono text-[10px] uppercase mb-1">
                Investigation Note:
              </strong>
              {selectedItem.historicalContext}
            </div>
          </div>

          {/* Action Buttons: Inspect, Read, Use */}
          <div className="grid grid-cols-3 gap-2 mt-4 pt-2 border-t border-[#d4af37]/20">
            <button
              onClick={() => handleAction('Inspecting')}
              className="py-1.5 px-2 rounded-sm bg-[#12285a] hover:bg-[#1e3c85] border border-[#d4af37]/40 text-xs text-[#fae596] font-cinzel font-medium transition-all"
            >
              Inspect
            </button>
            <button
              onClick={() => handleAction('Examining Inscription')}
              className="py-1.5 px-2 rounded-sm bg-[#12285a] hover:bg-[#1e3c85] border border-[#d4af37]/40 text-xs text-[#fae596] font-cinzel font-medium transition-all"
            >
              Read
            </button>
            <button
              onClick={() => handleAction('Using in Environment')}
              className="py-1.5 px-2 rounded-sm bg-gradient-to-r from-[#b45309] to-[#d97706] hover:from-[#d97706] hover:to-[#f59e0b] text-[#fff6db] font-cinzel font-bold text-xs shadow transition-all"
            >
              Use
            </button>
          </div>
        </div>
      </div>

      {/* Screen Label Badge */}
      <div className="relative z-10 px-2 pt-2 flex items-center justify-between text-[11px] text-[#c59b27]/80 font-mono">
        <span className="bg-[#050b18]/80 px-2 py-0.5 border border-[#d4af37]/20 rounded">
          9. Inventory
        </span>
        <span className="text-[10px] tracking-wider text-amber-200/50">
          DARK NAVY UI & GOLD FILIGREE FRAMES
        </span>
      </div>
    </div>
  );
};
