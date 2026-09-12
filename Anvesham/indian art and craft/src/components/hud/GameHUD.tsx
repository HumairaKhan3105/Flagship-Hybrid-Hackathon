import React, { useState } from 'react';
import { PlayerProfile, CraftRegion, GameView } from '../../types';
import { sound } from '../../utils/soundEngine';
import { 
  Volume2, VolumeX, Bell, BellOff, Map, Home, 
  Sparkles, Award, Palette, Settings, CheckCircle2, Circle, ChevronDown, ChevronUp 
} from 'lucide-react';

interface GameHUDProps {
  profile: PlayerProfile;
  activeRegion: CraftRegion;
  currentView: GameView;
  isMusicMuted: boolean;
  isSfxMuted: boolean;
  onToggleMusic: () => void;
  onToggleSfx: () => void;
  onOpenMap: () => void;
  onOpenHome: () => void;
  onOpenGallery: () => void;
  onOpenBadges: () => void;
  onOpenSettings: () => void;
  missionProgress?: {
    talkedToArtisan: boolean;
    artifactsCollected: number;
    totalArtifacts: number;
    paintingCompleted: boolean;
    puzzleSolved: boolean;
    quizCompleted: boolean;
  };
}

export const GameHUD: React.FC<GameHUDProps> = ({
  profile,
  activeRegion,
  currentView,
  isMusicMuted,
  isSfxMuted,
  onToggleMusic,
  onToggleSfx,
  onOpenMap,
  onOpenHome,
  onOpenGallery,
  onOpenBadges,
  onOpenSettings,
  missionProgress = {
    talkedToArtisan: false,
    artifactsCollected: 0,
    totalArtifacts: 5,
    paintingCompleted: false,
    puzzleSolved: false,
    quizCompleted: false,
  },
}) => {
  const [isMissionExpanded, setIsMissionExpanded] = useState<boolean>(false);

  // Calculate Level XP progress (100 XP per level)
  const currentLevelBaseXP = (profile.level - 1) * 100;
  const currentXPInLevel = Math.max(0, profile.xp - currentLevelBaseXP);
  const xpPercent = Math.min(100, Math.round((currentXPInLevel / 100) * 100));

  // Determine Rank Title based on level
  const getRankTitle = (lvl: number) => {
    if (lvl <= 1) return 'Shishya (Apprentice)';
    if (lvl === 2) return 'Chitrakaar (Artisan)';
    if (lvl === 3) return 'Shilpi (Craftsman)';
    if (lvl === 4) return 'Ustad (Master Artist)';
    return 'Kala Ratna (National Treasure)';
  };

  const outfitColor = profile?.customization?.outfitColor || '#d4af37';
  const isFemale = profile?.customization?.gender === 'female';

  // Count completed objectives
  const allCraftsFound = missionProgress.artifactsCollected >= missionProgress.totalArtifacts;
  const completedObjectivesCount = [
    missionProgress.talkedToArtisan,
    allCraftsFound,
    missionProgress.paintingCompleted,
    missionProgress.puzzleSolved,
    missionProgress.quizCompleted,
  ].filter(Boolean).length;

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-3 sm:p-5 select-none font-sans">
      {/* Top Bar */}
      <div className="flex items-start justify-between gap-2 sm:gap-4 w-full">
        {/* Top-Left: Player Profile Badge */}
        <div className="pointer-events-auto flex items-center gap-2.5 sm:gap-3 bg-[#23150d]/90 backdrop-blur-md p-2 sm:p-2.5 rounded-2xl border border-[#d4af37]/40 shadow-2xl glow-heritage">
          <div
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-xl shadow-md border-2 border-[#d4af37]"
            style={{ backgroundColor: outfitColor }}
          >
            {isFemale ? '👧🏽' : '👦🏽'}
          </div>

          <div className="pr-1 sm:pr-2">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs sm:text-sm text-[#fdfbf7] font-heading">
                {profile?.name || 'Aarav'}
              </span>
              <span className="text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded bg-[#d4af37]/20 text-[#d4af37] font-bold border border-[#d4af37]/40">
                Lv.{profile?.level || 1}
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-[#d4af37] font-medium block">
              {getRankTitle(profile?.level || 1)}
            </span>
            <span className="text-[9px] sm:text-[10px] text-[#e6d7be] flex items-center gap-1">
              📍 {activeRegion.craftName} ({activeRegion.state})
            </span>
          </div>
        </div>

        {/* Top-Center: Dynamic Mission Progress HUD */}
        <div className="pointer-events-auto flex flex-col items-center">
          <button
            onClick={() => {
              sound.playClick();
              setIsMissionExpanded(!isMissionExpanded);
            }}
            className="flex items-center gap-2 bg-[#23150d]/90 hover:bg-[#2c1b10] backdrop-blur-md px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-2xl border border-[#d4af37]/50 shadow-2xl transition-all active:scale-95"
          >
            <Sparkles size={13} className="text-[#d4af37] shrink-0" />
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4af37]">
                  MISSION PROGRESS:
                </span>
                <span className="text-[10px] font-bold text-[#fdfbf7]">
                  {completedObjectivesCount}/5 Complete
                </span>
              </div>
              <span className="text-xs font-bold text-[#fdfbf7] block">
                {activeRegion.missionName}
              </span>
            </div>
            {isMissionExpanded ? (
              <ChevronUp size={14} className="text-[#d4af37] ml-1" />
            ) : (
              <ChevronDown size={14} className="text-[#d4af37] ml-1" />
            )}
          </button>

          {/* Collapsible Mission Checklist Dropdown */}
          {isMissionExpanded && (
            <div className="mt-2 w-72 sm:w-80 p-3.5 rounded-2xl bg-[#23150d]/95 backdrop-blur-lg border border-[#d4af37]/60 shadow-2xl text-left space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#d4af37] block pb-1 border-b border-[#d4af37]/20">
                {activeRegion.craftName} Objectives
              </span>

              {/* 1. Talk to Artisan */}
              <div className="flex items-center gap-2 text-xs">
                {missionProgress.talkedToArtisan ? (
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                ) : (
                  <Circle size={15} className="text-[#a3907c] shrink-0" />
                )}
                <span className={missionProgress.talkedToArtisan ? 'text-emerald-300 font-medium' : 'text-[#fdfbf7]'}>
                  Talk to Artisan ({activeRegion.artisan.name})
                </span>
              </div>

              {/* 2. Find Craft Objects */}
              <div className="flex items-center gap-2 text-xs">
                {allCraftsFound ? (
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                ) : (
                  <Circle size={15} className="text-[#a3907c] shrink-0" />
                )}
                <span className={allCraftsFound ? 'text-emerald-300 font-medium' : 'text-[#fdfbf7]'}>
                  Find Hidden Crafts ({missionProgress.artifactsCollected}/{missionProgress.totalArtifacts})
                </span>
              </div>

              {/* 3. Complete Painting */}
              <div className="flex items-center gap-2 text-xs">
                {missionProgress.paintingCompleted ? (
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                ) : (
                  <Circle size={15} className="text-[#a3907c] shrink-0" />
                )}
                <span className={missionProgress.paintingCompleted ? 'text-emerald-300 font-medium' : 'text-[#fdfbf7]'}>
                  Complete Sacred Painting in Studio
                </span>
              </div>

              {/* 4. Solve Pattern Puzzle */}
              <div className="flex items-center gap-2 text-xs">
                {missionProgress.puzzleSolved ? (
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                ) : (
                  <Circle size={15} className="text-[#a3907c] shrink-0" />
                )}
                <span className={missionProgress.puzzleSolved ? 'text-emerald-300 font-medium' : 'text-[#fdfbf7]'}>
                  Solve Heritage Pattern Puzzle
                </span>
              </div>

              {/* 5. Complete Knowledge Quiz */}
              <div className="flex items-center gap-2 text-xs">
                {missionProgress.quizCompleted ? (
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                ) : (
                  <Circle size={15} className="text-[#a3907c] shrink-0" />
                )}
                <span className={missionProgress.quizCompleted ? 'text-emerald-300 font-medium' : 'text-[#fdfbf7]'}>
                  Pass Cultural Knowledge Assessment
                </span>
              </div>

              {completedObjectivesCount === 5 && (
                <div className="pt-2 border-t border-[#d4af37]/30 text-center text-xs font-bold text-amber-300">
                  🎉 Return to Artisan to Claim Master Badge!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Top-Right: XP, Artifacts & Settings */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2.5">
          {/* XP Badge */}
          <div className="bg-[#23150d]/90 backdrop-blur-md px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl border border-[#d4af37]/40 shadow-xl flex flex-col items-end">
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <Award size={13} className="text-[#d4af37]" />
              <span className="text-[#fdfbf7] font-mono">{profile.xp} XP</span>
            </div>
            {/* Progress bar */}
            <div className="w-16 sm:w-20 bg-[#3d2717] h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-gradient-to-r from-[#d4af37] to-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>

          {/* Artifacts Pill */}
          <div className="hidden sm:flex items-center gap-1.5 bg-[#23150d]/90 backdrop-blur-md px-3 py-2 rounded-2xl border border-[#d4af37]/40 shadow-xl text-xs font-bold text-[#fdfbf7]">
            <span>🏺</span>
            <span className="text-[#d4af37] font-mono">
              {missionProgress.artifactsCollected}/{missionProgress.totalArtifacts}
            </span>
            <span className="text-[10px] text-[#e6d7be]">Artifacts</span>
          </div>

          {/* Action Icons Button Group */}
          <div className="flex items-center gap-1 bg-[#23150d]/90 backdrop-blur-md p-1 sm:p-1.5 rounded-2xl border border-[#d4af37]/40 shadow-xl">
            {/* Settings Button (Section 3 & 27) */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenSettings();
              }}
              className="p-1.5 sm:p-2 rounded-xl text-[#d4af37] hover:bg-[#3d2717] transition-all"
              title="Game Settings (Audio & Progress)"
            >
              <Settings size={17} />
            </button>

            {/* World Map Button */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenMap();
              }}
              className="p-1.5 sm:p-2 rounded-xl text-[#d4af37] hover:bg-[#3d2717] transition-all"
              title="Cultural Map of India"
            >
              <Map size={17} />
            </button>

            {/* Gallery Button */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenGallery();
              }}
              className="p-1.5 sm:p-2 rounded-xl text-[#d4af37] hover:bg-[#3d2717] transition-all"
              title="My Saved Artworks"
            >
              <Palette size={17} />
            </button>

            {/* Home / Menu Button */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenHome();
              }}
              className="p-1.5 sm:p-2 rounded-xl text-[#d4af37] hover:bg-[#3d2717] transition-all"
              title="Main Menu"
            >
              <Home size={17} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
