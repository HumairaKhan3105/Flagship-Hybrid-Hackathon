import React, { useState } from 'react';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  HelpCircle, 
  BookOpen, 
  ShieldAlert,
  Check
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetProgress,
}) => {
  const [muted, setMuted] = useState(soundEngine.isMutedState());
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleToggleMute = () => {
    const isNowMuted = soundEngine.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) soundEngine.playClick();
  };

  const handleConfirmReset = () => {
    onResetProgress();
    setConfirmReset(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FDF5E6] w-full max-w-md rounded-3xl p-6 border-4 border-[#5D4037] shadow-2xl space-y-5 text-[#4A3728]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="font-heading text-lg font-black uppercase text-[#5D4037] flex items-center gap-2">
            <span>Detective Headquarters</span>
          </h2>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white border-2 border-[#5D4037] text-[#5D4037] hover:bg-[#5D4037] hover:text-white font-black flex items-center justify-center text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Audio Setting */}
        <div className="bg-white p-3.5 rounded-2xl border-2 border-[#5D4037]/20 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            {muted ? <VolumeX className="w-5 h-5 text-[#8B0000]" /> : <Volume2 className="w-5 h-5 text-[#2E7D32]" />}
            <div>
              <h4 className="font-black uppercase text-xs sm:text-sm text-[#5D4037]">Sound & Instruments</h4>
              <p className="text-[10px] sm:text-xs text-[#8D6E63] font-bold">Acoustic tones & haptic sounds</p>
            </div>
          </div>

          <button
            onClick={handleToggleMute}
            className={`px-3 py-1.5 rounded-xl font-black uppercase text-xs transition-colors shadow-sm ${
              muted ? 'bg-stone-200 text-stone-600 border border-stone-300' : 'bg-[#2E7D32] text-white'
            }`}
          >
            {muted ? 'Muted' : 'Enabled'}
          </button>
        </div>

        {/* How to Play Rules */}
        <div className="bg-white p-3.5 rounded-2xl border-2 border-[#5D4037]/20 space-y-1.5 text-xs text-[#4A3728] shadow-sm">
          <div className="flex items-center gap-1.5 font-black uppercase text-[#5D4037]">
            <HelpCircle className="w-4 h-4 text-[#D4AF37]" />
            <span>How to Play:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-[#8D6E63] font-medium leading-relaxed pl-1">
            <li>Choose from 6 Cultural Trails (Festivals, Clothes, Food, Music, Art, Places).</li>
            <li>Solve 50 progressive clues per trail to unlock the secrets of Indian heritage.</li>
            <li>Speed & accuracy yield up to 3 stars, rich XP, and cultural coins.</li>
            <li>Use Detective Toolkit lifelines (50:50, Hint Clue, +15s Time) whenever stuck.</li>
            <li>Maintain your daily streak with the Daily Mystery Triad case!</li>
          </ul>
        </div>

        {/* Reset Progress Section */}
        <div className="pt-2 border-t border-[#5D4037]/20">
          {!confirmReset ? (
            <button
              onClick={() => setConfirmReset(true)}
              className="w-full py-2.5 rounded-xl border-2 border-[#8B0000] text-[#8B0000] hover:bg-red-50 font-black uppercase text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Game Data & Start Fresh</span>
            </button>
          ) : (
            <div className="bg-red-50 p-3 rounded-2xl border-2 border-[#8B0000] space-y-2 text-center">
              <p className="text-xs text-[#8B0000] font-black uppercase">
                Are you sure? This will reset all stars, coins, and levels unlocked.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConfirmReset(false)}
                  className="flex-1 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-800 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReset}
                  className="flex-1 py-1.5 rounded-xl bg-[#8B0000] text-white font-black uppercase text-xs shadow"
                >
                  Yes, Reset All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
