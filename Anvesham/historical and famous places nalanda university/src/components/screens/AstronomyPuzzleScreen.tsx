import React, { useState } from 'react';
import { Compass, Moon, Sparkles, Award, RotateCw } from 'lucide-react';
import { sounds } from '../../audio';

export const AstronomyPuzzleScreen: React.FC = () => {
  const [selectedDirection, setSelectedDirection] = useState<'North' | 'East' | 'South' | 'West' | null>(null);
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const rotateArmillary = () => {
    sounds.playStoneClick();
    setRotationAngle((prev) => (prev + 45) % 360);
  };

  const handleSubmit = () => {
    if (selectedDirection === 'North') {
      sounds.playSolveSuccess();
      setIsSolved(true);
      setErrorMessage(null);
    } else {
      sounds.playStoneClick();
      setErrorMessage('The alignment with Dhruva Tara (Polaris) does not match.');
      setTimeout(() => setErrorMessage(null), 2500);
    }
  };

  return (
    <div id="screen-astronomy-puzzle" className="relative w-full h-full min-h-[360px] flex flex-col justify-between overflow-hidden bg-[#050a17] text-[#f7eed9] select-none p-4 md:p-6">
      {/* Night Sky with Constellations and Starfield */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f214d] via-[#08122a] to-[#03060f] pointer-events-none" />

      {/* Screen Header */}
      <div className="relative z-10 flex items-center justify-between pb-3 border-b border-[#d4af37]/30">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-full border border-[#d4af37] bg-[#0c1630] flex items-center justify-center text-[#fcd34d]">
            <Moon className="w-4 h-4 text-cyan-300 animate-pulse" />
          </div>
          <div>
            <h3 className="font-cinzel text-base md:text-lg font-bold text-[#fae596] tracking-wide">
              Astronomy Puzzle
            </h3>
            <p className="text-xs text-[#93c5fd] font-sans">
              Use the position of stars and shadow to find the correct direction.
            </p>
          </div>
        </div>

        {/* Rotate Yantra button */}
        <button
          onClick={rotateArmillary}
          className="px-2.5 py-1 rounded bg-[#0b1736] border border-[#d4af37]/40 hover:border-[#fcd34d] text-xs text-[#fae596] flex items-center space-x-1 transition-all"
        >
          <RotateCw className="w-3 h-3" />
          <span>Rotate Yantra ({rotationAngle}°)</span>
        </button>
      </div>

      {/* Main Celestial Puzzle Interactive Area */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center gap-6 py-4">
        
        {/* Armillary Sphere & Constellation Projection Chamber */}
        <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-full border-2 border-[#d4af37]/70 bg-[#071129]/80 shadow-[0_0_35px_rgba(56,189,248,0.15)] flex items-center justify-center overflow-hidden">
          
          {/* Background Starry Sky Map (Saptarishi / Ursa Major pointing to Dhruva Tara) */}
          <svg className="absolute inset-0 w-full h-full text-cyan-200 pointer-events-none" viewBox="0 0 200 200">
            {/* Background stars */}
            {Array.from({ length: 30 }).map((_, idx) => (
              <circle
                key={idx}
                cx={(idx * 43) % 190 + 5}
                cy={(idx * 57) % 190 + 5}
                r={idx % 4 === 0 ? 1.5 : 0.8}
                fill="#ffffff"
                opacity={0.4 + (idx % 3) * 0.25}
              />
            ))}

            {/* Saptarishi Constellation (Ursa Major / Great Bear) */}
            <g transform={`rotate(${rotationAngle} 100 100)`} className="transition-transform duration-500">
              {/* Stars of the Big Dipper */}
              <circle cx="50" cy="80" r="2.5" fill="#fcd34d" />
              <circle cx="65" cy="70" r="2.5" fill="#fcd34d" />
              <circle cx="85" cy="75" r="2.5" fill="#fcd34d" />
              <circle cx="100" cy="90" r="2.5" fill="#fcd34d" />
              <circle cx="120" cy="88" r="2.5" fill="#fcd34d" />
              <circle cx="130" cy="110" r="2.5" fill="#fcd34d" />
              <circle cx="110" cy="112" r="2.5" fill="#fcd34d" />

              {/* Connecting constellation lines */}
              <path d="M50,80 L65,70 L85,75 L100,90 L120,88 L130,110 L110,112 L100,90" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" fill="none" opacity="0.7" />

              {/* Pointer line from Meru & Pulaha to Dhruva Tara (North Star) */}
              <line x1="120" y1="88" x2="130" y2="110" stroke="#fbbf24" strokeWidth="1.5" />
              <line x1="130" y1="110" x2="148" y2="155" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 2" />
            </g>

            {/* Dhruva Tara (Polaris - The Fixed North Star) */}
            <g transform="translate(100, 32)">
              <circle cx="0" cy="0" r="4" fill="#ffffff" />
              <circle cx="0" cy="0" r="8" fill="#38bdf8" opacity="0.3" className="animate-ping" />
              <line x1="-8" y1="0" x2="8" y2="0" stroke="#fef08a" strokeWidth="1" />
              <line x1="0" y1="-8" x2="0" y2="8" stroke="#fef08a" strokeWidth="1" />
              <text x="7" y="-5" fill="#fde047" fontSize="8" fontFamily="serif" fontWeight="bold">Dhruva (North)</text>
            </g>

            {/* Armillary Rings (Golayantra) */}
            <circle cx="100" cy="100" r="86" fill="none" stroke="#d4af37" strokeWidth="1.5" opacity="0.6" />
            <ellipse cx="100" cy="100" rx="86" ry="34" fill="none" stroke="#d4af37" strokeWidth="1.2" opacity="0.5" transform="rotate(30 100 100)" />
            <ellipse cx="100" cy="100" rx="86" ry="34" fill="none" stroke="#d4af37" strokeWidth="1.2" opacity="0.5" transform="rotate(-30 100 100)" />

            {/* Center Gnomon Shadow Needle */}
            <line x1="100" y1="100" x2="100" y2="40" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            <circle cx="100" cy="100" r="5" fill="#d4af37" />
          </svg>

          {/* Solved Overlay */}
          {isSolved && (
            <div className="absolute inset-0 z-20 bg-[#051a24]/95 flex flex-col items-center justify-center p-4 animate-fadeIn border border-cyan-400">
              <Award className="w-10 h-10 text-cyan-300 mb-2 animate-bounce" />
              <div className="font-cinzel text-base font-bold text-cyan-100">
                ASTRONOMICAL LOCK OPEN!
              </div>
              <p className="text-xs text-cyan-200 text-center mt-1">
                Aligned with Dhruva Tara (True North). The celestial azimuth reveals the scholar’s escape coordinates!
              </p>
            </div>
          )}
        </div>

        {/* Right Side: Directional Radio Selector & Submit */}
        <div className="w-full md:w-64 bg-[#091530]/90 border border-[#d4af37]/50 rounded-md p-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="font-cinzel text-xs font-bold text-[#f7e09e] uppercase tracking-wider mb-2 text-center">
              Select the correct direction
            </div>
            <p className="text-[11px] text-[#93c5fd] text-center mb-3">
              Where does the Saptarishi pointer lead?
            </p>

            {/* Radio options: North, East, South, West */}
            <div className="space-y-2 mb-4">
              {(['North', 'East', 'South', 'West'] as const).map(dir => (
                <label
                  key={dir}
                  onClick={() => {
                    sounds.playStoneClick();
                    setSelectedDirection(dir);
                  }}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-sm border cursor-pointer transition-all ${
                    selectedDirection === dir
                      ? 'bg-[#18366e] border-[#f6d77e] text-[#fff1be]'
                      : 'bg-[#0b1b3e] border-[#d4af37]/30 text-[#cbd5e1] hover:bg-[#132a5e]'
                  }`}
                >
                  <input
                    type="radio"
                    name="direction"
                    checked={selectedDirection === dir}
                    onChange={() => setSelectedDirection(dir)}
                    className="accent-[#f59e0b]"
                  />
                  <span className="font-cinzel text-sm font-semibold tracking-wide">
                    {dir}
                  </span>
                  {dir === 'North' && (
                    <span className="ml-auto text-[10px] font-mono text-cyan-300">
                      [Dhruva]
                    </span>
                  )}
                </label>
              ))}
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-300 text-center font-medium animate-shake mb-2">
                {errorMessage}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            className="w-full py-2.5 rounded-sm bg-gradient-to-r from-[#0284c7] to-[#0369a1] hover:from-[#0369a1] hover:to-[#075985] text-[#f0f9ff] font-cinzel font-bold text-sm tracking-wider shadow-lg border border-cyan-400 transition-all hover:scale-[1.02]"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Screen Label Badge */}
      <div className="relative z-10 px-2 pt-2 flex items-center justify-between text-[11px] text-[#c59b27]/80 font-mono">
        <span className="bg-[#050b18]/80 px-2 py-0.5 border border-[#d4af37]/20 rounded">
          6. Puzzle - Astronomy
        </span>
        <span className="text-[10px] tracking-wider text-cyan-200/60">
          GOLAYANTRA CELESTIAL ROTATION
        </span>
      </div>
    </div>
  );
};
