import React, { useState } from 'react';
import { sound } from '../../utils/soundEngine';
import { Volume2, VolumeX, Music, RotateCcw, X, ShieldAlert, Check } from 'lucide-react';

interface SettingsModalProps {
  isMusicMuted: boolean;
  isSfxMuted: boolean;
  onToggleMusic: () => void;
  onToggleSfx: () => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isMusicMuted,
  isSfxMuted,
  onToggleMusic,
  onToggleSfx,
  onResetProgress,
  onClose,
}) => {
  const [musicVol, setMusicVol] = useState<number>(Math.round(sound.getMusicVolume() * 100));
  const [sfxVol, setSfxVol] = useState<number>(Math.round(sound.getSfxVolume() * 100));
  const [showConfirmReset, setShowConfirmReset] = useState<boolean>(false);

  const handleMusicVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setMusicVol(val);
    sound.setMusicVolume(val / 100);
    if (val > 0 && isMusicMuted) {
      onToggleMusic();
    }
  };

  const handleSfxVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setSfxVol(val);
    sound.setSfxVolume(val / 100);
    if (val > 0 && isSfxMuted) {
      onToggleSfx();
    }
    sound.playClick();
  };

  const handleConfirmReset = () => {
    sound.playClick();
    onResetProgress();
    setShowConfirmReset(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1c120c]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#2c1b10] border-2 border-[#d4af37]/70 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative glow-heritage text-[#fdfbf7] animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#d4af37]/70 hover:text-[#fdfbf7] hover:bg-[#3d2717] transition-all"
          aria-label="Close Settings"
        >
          <X size={20} />
        </button>

        {/* Title Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#d4af37]/30">
          <div className="w-12 h-12 rounded-2xl bg-[#3d2717] border border-[#d4af37]/50 flex items-center justify-center text-2xl shadow-inner">
            ⚙️
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-[#fdfbf7]">
              Game Settings
            </h2>
            <p className="text-xs text-[#d4af37]">
              Audio preferences & explorer progress
            </p>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="space-y-5 mb-8">
          {/* Background Music Toggle & Slider */}
          <div className="p-4 rounded-2xl bg-[#23150d] border border-[#d4af37]/20">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#fdfbf7]">
                <Music size={17} className="text-[#d4af37]" />
                <span>Indian Ambient Music</span>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  onToggleMusic();
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                  !isMusicMuted
                    ? 'bg-[#d4af37] text-[#1c120c] border-[#d4af37]'
                    : 'bg-[#3d2717] text-[#a3907c] border-[#4a321f]'
                }`}
              >
                {!isMusicMuted ? 'ON' : 'MUTED'}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={isMusicMuted ? 0 : musicVol}
                onChange={handleMusicVolumeChange}
                className="w-full accent-[#d4af37] cursor-pointer"
              />
              <span className="text-xs font-mono text-[#d4af37] w-8 text-right">
                {isMusicMuted ? '0%' : `${musicVol}%`}
              </span>
            </div>
          </div>

          {/* Sound Effects Toggle & Slider */}
          <div className="p-4 rounded-2xl bg-[#23150d] border border-[#d4af37]/20">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#fdfbf7]">
                {isSfxMuted ? (
                  <VolumeX size={17} className="text-stone-400" />
                ) : (
                  <Volume2 size={17} className="text-[#d4af37]" />
                )}
                <span>Sound Effects (SFX)</span>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  onToggleSfx();
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
                  !isSfxMuted
                    ? 'bg-[#d4af37] text-[#1c120c] border-[#d4af37]'
                    : 'bg-[#3d2717] text-[#a3907c] border-[#4a321f]'
                }`}
              >
                {!isSfxMuted ? 'ON' : 'MUTED'}
              </button>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="100"
                value={isSfxMuted ? 0 : sfxVol}
                onChange={handleSfxVolumeChange}
                className="w-full accent-[#d4af37] cursor-pointer"
              />
              <span className="text-xs font-mono text-[#d4af37] w-8 text-right">
                {isSfxMuted ? '0%' : `${sfxVol}%`}
              </span>
            </div>
          </div>
        </div>

        {/* Progress & Reset Section */}
        <div className="pt-2 border-t border-[#d4af37]/20 space-y-3">
          {!showConfirmReset ? (
            <button
              onClick={() => {
                sound.playClick();
                setShowConfirmReset(true);
              }}
              className="w-full py-3 px-4 rounded-2xl bg-[#3d2717] hover:bg-rose-950/60 border border-rose-500/30 text-rose-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <RotateCcw size={15} />
              <span>Reset Game Progress</span>
            </button>
          ) : (
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-start gap-2.5 text-xs text-rose-200">
                <ShieldAlert size={18} className="text-rose-400 shrink-0 mt-0.5" />
                <span>
                  Are you sure you want to reset? This will clear all XP, unlocked regions, artifacts, and saved artworks.
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleConfirmReset}
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  Yes, Reset All
                </button>
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowConfirmReset(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-[#2c1b10] hover:bg-[#3d2717] text-[#fdfbf7] font-semibold text-xs border border-[#d4af37]/30 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Back to Game button */}
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-[#d4af37] hover:bg-[#c59b27] text-[#1c120c] font-bold text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Check size={16} />
            <span>Back to Game</span>
          </button>
        </div>
      </div>
    </div>
  );
};
