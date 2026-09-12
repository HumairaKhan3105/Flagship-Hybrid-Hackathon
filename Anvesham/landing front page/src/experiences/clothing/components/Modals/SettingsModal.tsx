import { PlayerProfile } from '../../types';
import { Volume2, VolumeX, RotateCcw, X, ShieldAlert, Award, Sparkles, BookOpen } from 'lucide-react';
import { soundManager } from '../../utils/audio';

interface SettingsModalProps {
  player: PlayerProfile;
  onClose: () => void;
  onToggleSound: () => void;
  onResetGame: () => void;
}

export default function SettingsModal({
  player,
  onClose,
  onToggleSound,
  onResetGame,
}: SettingsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
      <div className="relative w-full max-w-xl royal-glass-card rounded-2xl border-2 border-amber-400 p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-amber-500/30 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-cinzel font-bold text-amber-200">
              GAME SETTINGS & HERITAGE RULES
            </h3>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-stone-900 border border-amber-500/40 text-stone-300 hover:text-amber-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Controls */}
        <div className="p-4 rounded-xl bg-black/40 border border-amber-500/30 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {player.soundEnabled ? (
              <Volume2 className="w-6 h-6 text-amber-400" />
            ) : (
              <VolumeX className="w-6 h-6 text-stone-500" />
            )}
            <div>
              <p className="text-sm font-cinzel font-bold text-stone-200">Audio & Soundscape</p>
              <p className="text-xs font-marcellus text-stone-400">Synthesized Indian Sitar, Tanpura & Loom sounds</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onToggleSound();
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-cinzel font-bold tracking-wider ${
              player.soundEnabled
                ? 'bg-amber-400 text-stone-950 shadow-[0_0_10px_#f5c042]'
                : 'bg-stone-800 text-stone-400'
            }`}
          >
            {player.soundEnabled ? 'ENABLED' : 'MUTED'}
          </button>
        </div>

        {/* Game Rules & How to Play */}
        <div className="parchment-bg rounded-xl p-4 border border-amber-700/40 text-stone-900 mb-4 text-xs sm:text-sm font-marcellus space-y-2">
          <h4 className="font-cinzel font-bold text-amber-950 text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-800" />
            HOW TO PLAY VASTRA YATRA
          </h4>
          <ul className="list-disc list-inside space-y-1 text-stone-800">
            <li><strong>3D India Map:</strong> Tap glowing regional pins to discover sacred textile hubs from Varanasi to Kanchipuram.</li>
            <li><strong>Weaver's Challenge:</strong> Match genuine regional weave patterns (A, B, C, D) before time runs out.</li>
            <li><strong>Culture Quizzes:</strong> Answer 4-option cultural trivia to unlock legendary garments.</li>
            <li><strong>3D Unlocks:</strong> Earn +100 Heritage Points and dramatic 3D garment unlocks with Sahana's cultural commentary.</li>
            <li><strong>Sanctum Challenge:</strong> Pass the 3 Master trials to win the Imperial Historian title.</li>
          </ul>
        </div>

        {/* Reset Progress */}
        <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-800/40 flex items-center justify-between">
          <div>
            <span className="text-xs font-cinzel font-bold text-rose-300 block">Reset Explorer Data</span>
            <span className="text-[11px] font-marcellus text-stone-400">Clear unlocked garments and restore starting lives</span>
          </div>
          <button
            onClick={() => {
              if (confirm('Are you sure you wish to restart your heritage journey?')) {
                soundManager.playClick();
                onResetGame();
                onClose();
              }
            }}
            className="px-3 py-1.5 rounded-lg bg-rose-900/70 hover:bg-rose-800 text-rose-200 text-xs font-cinzel font-semibold flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
