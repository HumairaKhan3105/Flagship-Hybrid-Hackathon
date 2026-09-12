import React from 'react';
import { MapPin, Music } from 'lucide-react';

interface IndiaMapProps {
  selectedState: string;
  onSelectState: (state: string) => void;
  stateCounts: Record<string, number>;
}

// Major musical regions and representative states with geographical coordinates on 600x650 viewport
interface StateNode {
  name: string;
  code: string;
  x: number;
  y: number;
  region: string;
  d?: string;
}

const STATES_DATA: StateNode[] = [
  { name: 'Jammu & Kashmir', code: 'JK', x: 195, y: 85, region: 'North' },
  { name: 'Himachal Pradesh', code: 'HP', x: 230, y: 135, region: 'North' },
  { name: 'Punjab', code: 'PB', x: 190, y: 165, region: 'North' },
  { name: 'Uttarakhand', code: 'UK', x: 265, y: 170, region: 'North' },
  { name: 'Rajasthan', code: 'RJ', x: 155, y: 245, region: 'West' },
  { name: 'Uttar Pradesh', code: 'UP', x: 280, y: 235, region: 'North' },
  { name: 'Bihar', code: 'BR', x: 380, y: 255, region: 'East' },
  { name: 'Gujarat', code: 'GJ', x: 110, y: 320, region: 'West' },
  { name: 'Madhya Pradesh', code: 'MP', x: 255, y: 315, region: 'Central' },
  { name: 'West Bengal', code: 'WB', x: 420, y: 310, region: 'East' },
  { name: 'Assam', code: 'AS', x: 495, y: 240, region: 'Northeast' },
  { name: 'Manipur', code: 'MN', x: 535, y: 280, region: 'Northeast' },
  { name: 'Maharashtra', code: 'MH', x: 200, y: 405, region: 'West' },
  { name: 'Odisha', code: 'OD', x: 365, y: 375, region: 'East' },
  { name: 'Telangana', code: 'TS', x: 260, y: 430, region: 'South' },
  { name: 'Andhra Pradesh', code: 'AP', x: 265, y: 485, region: 'South' },
  { name: 'Karnataka', code: 'KA', x: 195, y: 495, region: 'South' },
  { name: 'Kerala', code: 'KL', x: 200, y: 575, region: 'South' },
  { name: 'Tamil Nadu', code: 'TN', x: 245, y: 570, region: 'South' },
];

export const IndiaMap: React.FC<IndiaMapProps> = ({
  selectedState,
  onSelectState,
  stateCounts,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Interactive SVG Diagrammatic Map */}
        <div className="relative w-full max-w-[460px] aspect-[460/520] mx-auto bg-gradient-to-b from-amber-50/40 via-stone-50/20 to-amber-50/40 rounded-2xl p-4 border border-amber-100 flex items-center justify-center">
          {/* Decorative Compass & Motif */}
          <div className="absolute top-3 right-4 text-xs font-serif font-bold text-amber-900/60 uppercase tracking-widest flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-700"></span>
            <span>Bharat Sangeet Map</span>
          </div>

          <svg
            viewBox="50 40 520 580"
            className="w-full h-full drop-shadow-sm select-none"
            aria-label="Interactive Map of India Musical Traditions"
          >
            {/* Outline Silhouette of India */}
            <path
              d="M 180 50 L 220 50 L 250 80 L 230 110 L 260 140 L 300 160 L 370 210 L 440 210 L 490 200 L 530 230 L 550 280 L 510 320 L 450 320 L 430 350 L 380 400 L 320 460 L 280 540 L 240 610 L 220 610 L 190 560 L 180 480 L 140 400 L 90 350 L 90 290 L 140 260 L 130 190 L 180 130 Z"
              fill="#FEF3C7"
              stroke="#D97706"
              strokeWidth="2"
              strokeDasharray="4 2"
              className="opacity-40"
            />

            {/* Regional Connecting Web Lines */}
            <g stroke="#FDE68A" strokeWidth="1.5" strokeOpacity="0.6">
              <line x1="190" y1="165" x2="280" y2="235" />
              <line x1="155" y1="245" x2="280" y2="235" />
              <line x1="280" y1="235" x2="420" y2="310" />
              <line x1="420" y1="310" x2="495" y2="240" />
              <line x1="255" y1="315" x2="200" y2="405" />
              <line x1="200" y1="405" x2="195" y2="495" />
              <line x1="195" y1="495" x2="245" y2="570" />
              <line x1="245" y1="570" x2="200" y2="575" />
            </g>

            {/* Interactive Nodes for Each State */}
            {STATES_DATA.map((st) => {
              const isSelected = selectedState.toLowerCase() === st.name.toLowerCase();
              const count = stateCounts[st.name] || 0;

              return (
                <g
                  key={st.name}
                  onClick={() => onSelectState(st.name)}
                  className="cursor-pointer group"
                >
                  {/* Outer Pulsing Ring if Selected */}
                  {isSelected && (
                    <circle
                      cx={st.x}
                      cy={st.y}
                      r="20"
                      className="fill-amber-400/30 stroke-amber-600 animate-ping"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    cx={st.x}
                    cy={st.y}
                    r={isSelected ? 16 : count > 0 ? 13 : 9}
                    className={`transition-all duration-200 ${
                      isSelected
                        ? 'fill-amber-900 stroke-white stroke-2'
                        : count > 0
                        ? 'fill-amber-600 hover:fill-amber-800 stroke-white stroke-1.5'
                        : 'fill-stone-300 hover:fill-stone-400 stroke-white'
                    }`}
                  />

                  {/* Instrument Count Inside Node */}
                  {count > 0 && (
                    <text
                      x={st.x}
                      y={st.y + 4}
                      textAnchor="middle"
                      className="text-[10px] font-bold fill-white pointer-events-none font-sans"
                    >
                      {count}
                    </text>
                  )}

                  {/* State Name Label */}
                  <text
                    x={st.x}
                    y={st.y + (isSelected ? 26 : 22)}
                    textAnchor="middle"
                    className={`text-[11px] font-medium transition-colors pointer-events-none drop-shadow-xs ${
                      isSelected
                        ? 'fill-amber-950 font-bold font-serif'
                        : 'fill-stone-700 group-hover:fill-amber-900'
                    }`}
                  >
                    {st.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* State Quick-Selector Grid */}
        <div className="w-full lg:w-1/2 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-800" />
              <span>Select a State or Union Territory</span>
            </h4>
            <span className="text-xs text-stone-500">
              Click map node or pill below
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[340px] overflow-y-auto pr-1">
            {STATES_DATA.map((st) => {
              const isSelected = selectedState.toLowerCase() === st.name.toLowerCase();
              const count = stateCounts[st.name] || 0;

              return (
                <button
                  key={st.name}
                  onClick={() => onSelectState(st.name)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-800 text-white border-amber-900 shadow-xs'
                      : count > 0
                      ? 'bg-amber-50/60 hover:bg-amber-100/80 text-stone-800 border-amber-200/80'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
                  }`}
                >
                  <span className="truncate pr-1">{st.name}</span>
                  {count > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-amber-200/80 text-amber-900'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs text-amber-950 flex items-center gap-2">
            <Music className="w-4 h-4 text-amber-800 shrink-0" />
            <span>
              Each state harbors unique acoustics, crafting materials, and rituals handed down across centuries.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
