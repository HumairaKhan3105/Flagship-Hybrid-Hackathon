import React, { useState } from 'react';
import { Compass, MapPin, Building, BookOpen, Users, ShoppingBag, Home, Info } from 'lucide-react';
import { NALANDA_LOCATIONS } from '../../data/gameData';
import { LandmarkLocation } from '../../types';
import { sounds } from '../../audio';

export const MapScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Map' | 'Objectives' | 'Legend'>('Map');
  const [selectedLocation, setSelectedLocation] = useState<LandmarkLocation | null>(NALANDA_LOCATIONS[0]);

  const getLocationIcon = (type: LandmarkLocation['type']) => {
    switch (type) {
      case 'Library':
        return BookOpen;
      case 'Monastery':
        return Building;
      case 'Classroom':
        return Users;
      case 'Market':
        return ShoppingBag;
      case 'Residential':
        return Home;
      case 'Courtyard':
      default:
        return MapPin;
    }
  };

  return (
    <div id="screen-map" className="relative w-full h-full min-h-[360px] flex flex-col justify-between overflow-hidden bg-[#24170d] text-[#faeccf] select-none p-3 md:p-5">
      {/* Ancient Hand-Painted Parchment Map Canvas */}
      <div className="absolute inset-0 bg-[#e8dbbe] bg-[radial-gradient(#c7b08b_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      {/* Screen Header Bar */}
      <div className="relative z-10 flex items-center justify-between pb-2.5 border-b border-[#a8824f]">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-full border border-[#8b5a2b] bg-[#3d2011] flex items-center justify-center text-[#fcd34d]">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-cinzel text-base md:text-lg font-bold text-[#451e08] tracking-wide">
              Nalanda Map
            </h3>
            <p className="text-[11px] text-[#78461c] font-serif">
              नालन्दा महाविहार मानचित्त्रम् • 7th Century CE
            </p>
          </div>
        </div>

        {/* Ornate Compass Rose on Map */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full border border-[#8b5a2b] flex items-center justify-center bg-[#f5ecd8] shadow">
            <Compass className="w-5 h-5 text-[#8b5a2b] animate-[spin_50s_linear_infinite]" />
          </div>
        </div>
      </div>

      {/* Main Map Body: Left Menu Tabs & Interactive Isometric Map */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row gap-4 my-2">
        
        {/* Left Sidebar Tabs: Map, Objectives, Legend */}
        <div className="w-full md:w-36 bg-[#3a2012] border border-[#6f3d1b] rounded-md p-2 flex md:flex-col gap-1.5 justify-start shadow-md text-xs">
          {[
            { id: 'Map', label: 'Map' },
            { id: 'Objectives', label: 'Objectives' },
            { id: 'Legend', label: 'Legend' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                sounds.playStoneClick();
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`flex-1 md:flex-none py-1.5 px-2.5 rounded font-cinzel text-left transition-all ${
                activeTab === tab.id
                  ? 'bg-[#d4af37] text-[#291206] font-bold shadow'
                  : 'text-[#d6c29e] hover:bg-[#522e19]'
              }`}
            >
              {tab.label}
            </button>
          ))}

          {/* Mini active quest teaser */}
          <div className="hidden md:block mt-auto p-2 bg-[#261309] rounded border border-[#5c3316] text-[10px] text-[#cca96e]">
            <span className="font-bold text-[#fcd34d]">Active Target:</span>
            <div className="truncate">Ratnasagara Tower</div>
          </div>
        </div>

        {/* Central Isometric Nalanda Campus Graphic with Clickable Landmarks */}
        <div className="flex-1 relative rounded-md border-2 border-[#a67c48] overflow-hidden bg-[#ecdcb8] shadow-inner min-h-[220px]">
          {/* Isometric Campus Campus Illustration Lines */}
          <svg className="absolute inset-0 w-full h-full text-[#9c7849]/35 pointer-events-none" viewBox="0 0 500 300">
            {/* Grid of quadrangles / viharas */}
            <polygon points="50,150 250,50 450,150 250,250" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <polygon points="120,150 250,85 380,150 250,215" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            {/* Canals and sacred lotus pond */}
            <ellipse cx="250" cy="150" rx="35" ry="18" fill="#93c5fd" opacity="0.3" stroke="#3b82f6" strokeWidth="1" />
            {/* Peripheral wall */}
            <rect x="20" y="20" width="460" height="260" rx="4" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" />
          </svg>

          {/* Interactive Landmark Pins */}
          {NALANDA_LOCATIONS.map(loc => {
            const Icon = getLocationIcon(loc.type);
            const isSelected = selectedLocation?.id === loc.id;
            return (
              <div
                key={loc.id}
                style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <button
                  onClick={() => {
                    sounds.playStoneClick();
                    setSelectedLocation(loc);
                  }}
                  className={`group flex items-center space-x-1 px-2 py-1 rounded shadow-md border transition-all ${
                    isSelected
                      ? 'bg-[#3d1e0f] text-[#fae596] border-[#fcd34d] scale-110 shadow-lg'
                      : 'bg-[#f5ebd6] text-[#451e08] border-[#8c5d2e] hover:bg-[#fff9ed]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${loc.hasActiveQuest ? 'text-amber-600 animate-pulse' : ''}`} />
                  <span className="font-cinzel text-[10px] md:text-xs font-bold whitespace-nowrap">
                    {loc.name.split(' ')[0]}
                  </span>
                  {loc.hasActiveQuest && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                  )}
                </button>
              </div>
            );
          })}

          {/* Location Details Overlay */}
          {selectedLocation && (
            <div className="absolute bottom-2 left-2 right-2 bg-[#2d180d]/95 border border-[#c59b27] rounded p-2.5 shadow-2xl text-[#faeccf] z-20 animate-fadeIn">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-cinzel text-xs md:text-sm font-bold text-[#fae596]">
                    {selectedLocation.name}
                  </h4>
                  <div className="text-[10px] text-[#fcd34d] font-serif">
                    {selectedLocation.ancientName}
                  </div>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#4a2713] text-[#fae596] border border-[#d4af37]/40">
                  {selectedLocation.type}
                </span>
              </div>
              <p className="text-[11px] text-[#e0d0b6] mt-1 leading-snug">
                {selectedLocation.description}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Screen Label Badge */}
      <div className="relative z-10 px-2 pt-2 flex items-center justify-between text-[11px] text-[#8b5a2b] font-mono">
        <span className="bg-[#ecdcb8] px-2 py-0.5 border border-[#8b5a2b]/40 rounded text-[#3d1e0f] font-bold">
          8. Map / Locations
        </span>
        <span className="text-[10px] tracking-wider text-[#78461c]">
          HARSHA-ERA MAHAVIHARA CARTOGRAPHY
        </span>
      </div>
    </div>
  );
};
