import React from 'react';
import { PlayerProfile, CraftRegion, GameView } from '../../types';
import { sound } from '../../utils/soundEngine';
import { 
  Play, Compass, Palette, Trophy, BookOpen, Settings, 
  Sparkles, Award, MapPin, Gamepad2, User, Volume2, VolumeX, Bell, BellOff 
} from 'lucide-react';

interface HomeScreenProps {
  profile: PlayerProfile;
  activeRegion: CraftRegion;
  onNavigate: (view: GameView) => void;
  isMusicMuted: boolean;
  isSfxMuted: boolean;
  onToggleMusic: () => void;
  onToggleSfx: () => void;
  onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  profile,
  activeRegion,
  onNavigate,
  isMusicMuted,
  isSfxMuted,
  onToggleMusic,
  onToggleSfx,
  onOpenSettings,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between bg-[#1c120c] text-[#fdfbf7] select-none overflow-y-auto p-5 sm:p-8 font-sans">
      {/* Background Indian Traditional Texture Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#3d2717]/60 via-[#1c120c] to-[#140c08] pointer-events-none" />
      
      {/* Top Header Toolbar */}
      <div className="relative z-10 w-full max-w-5xl flex items-center justify-between">
        {/* Heritage Initiative Pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2c1b10] border border-[#d4af37]/40 text-xs font-bold text-[#d4af37] shadow-md">
          <Sparkles size={14} className="text-[#d4af37]" />
          <span>Smart Indian Art Heritage • Class 8–12</span>
        </div>

        {/* Audio Quick Toggles & Settings */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onToggleSfx();
            }}
            className={`p-2 rounded-xl border transition-all ${
              isSfxMuted ? 'text-stone-500 bg-[#23150d] border-[#3d2717]' : 'text-[#d4af37] bg-[#2c1b10] border-[#d4af37]/40'
            }`}
            title="Toggle Sound Effects"
          >
            {isSfxMuted ? <BellOff size={18} /> : <Bell size={18} />}
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onToggleMusic();
            }}
            className={`p-2 rounded-xl border transition-all ${
              isMusicMuted ? 'text-stone-500 bg-[#23150d] border-[#3d2717]' : 'text-[#d4af37] bg-[#2c1b10] border-[#d4af37]/40'
            }`}
            title="Toggle Ambient Sitar Music"
          >
            {isMusicMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="p-2 rounded-xl bg-[#2c1b10] border border-[#d4af37]/40 text-[#d4af37] hover:bg-[#3d2717] transition-all"
            title="Game Settings"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>

      {/* Main Hero Branding */}
      <div className="relative z-10 my-auto text-center max-w-3xl flex flex-col items-center py-6">
        {/* Sacred Traditional Mandala / Sun Emblem */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-[#2c1b10] border-2 border-[#d4af37] flex items-center justify-center text-4xl sm:text-5xl shadow-2xl glow-heritage mb-5">
          🎨
        </div>

        {/* Main Title: KALAYATRA */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-heading tracking-wider text-[#d4af37] drop-shadow-md">
          KALAYATRA
        </h1>

        {/* Tagline: Create • Explore • Preserve */}
        <p className="text-sm sm:text-lg font-bold tracking-widest text-[#fdfbf7] mt-2 font-heading uppercase">
          Create • Explore • Preserve
        </p>

        <p className="text-xs sm:text-sm text-[#e6d7be] max-w-xl mt-3 leading-relaxed">
          Journey Through Indian Art & Craft. Control your 3D explorer, learn traditional techniques directly from master artisans, complete missions, and preserve centuries of living heritage.
        </p>

        {/* Quick Player Stat Bar */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#2c1b10] border border-[#d4af37]/30">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37]" />
            <span className="text-[#a3907c]">Explorer:</span>
            <span className="font-bold text-[#fdfbf7] font-heading">
              {profile?.name || 'Aarav'} (Lv.{profile?.level || 1})
            </span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#2c1b10] border border-[#d4af37]/30">
            <Award size={14} className="text-[#d4af37]" />
            <span className="text-[#a3907c]">Total XP:</span>
            <span className="font-bold text-[#d4af37] font-mono">{profile?.xp || 0} XP</span>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#2c1b10] border border-[#d4af37]/30">
            <MapPin size={14} className="text-[#d4af37]" />
            <span className="text-[#a3907c]">Active Region:</span>
            <span className="font-bold text-[#fdfbf7]">{activeRegion.craftName}</span>
          </div>
        </div>

        {/* 1. PLAY JOURNEY (Primary Big Action) */}
        <div className="mt-8 w-full max-w-md">
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('3d_world');
            }}
            className="w-full py-4 px-8 rounded-2xl bg-[#d4af37] hover:bg-[#c59b27] text-[#1c120c] font-black text-lg sm:text-xl uppercase tracking-wider shadow-2xl flex items-center justify-center gap-3 transition-all hover:scale-103 active:scale-98 border-2 border-yellow-200 glow-heritage"
          >
            <Play size={24} className="fill-[#1c120c]" />
            <span>PLAY JOURNEY</span>
          </button>
        </div>

        {/* 6 Requested Hub Buttons:
            1. PLAY JOURNEY (Above)
            2. EXPLORE INDIA
            3. MY ARTWORKS
            4. MY COLLECTION
            5. BADGES
            6. SETTINGS
            + CHARACTER CUSTOMIZER & STATE MATCH MINI-GAME */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 w-full max-w-4xl">
          {/* 2. EXPLORE INDIA */}
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('world_map');
            }}
            className="p-3.5 rounded-2xl bg-[#2c1b10] border border-[#d4af37]/30 hover:border-[#d4af37] hover:bg-[#3d2717] transition-all flex flex-col items-center text-center group"
          >
            <Compass size={22} className="text-[#d4af37] mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs text-[#fdfbf7]">EXPLORE INDIA</span>
            <span className="text-[10px] text-[#a3907c] mt-0.5">8 Craft States</span>
          </button>

          {/* 3. MY ARTWORKS */}
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('artworks_gallery');
            }}
            className="p-3.5 rounded-2xl bg-[#2c1b10] border border-[#d4af37]/30 hover:border-[#d4af37] hover:bg-[#3d2717] transition-all flex flex-col items-center text-center group"
          >
            <Palette size={22} className="text-[#d4af37] mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs text-[#fdfbf7]">MY ARTWORKS</span>
            <span className="text-[10px] text-[#a3907c] mt-0.5">{profile?.savedArtworks?.length || 0} Paintings</span>
          </button>

          {/* 4. MY COLLECTION (National Cultural Museum) */}
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('museum');
            }}
            className="p-3.5 rounded-2xl bg-[#2c1b10] border border-[#d4af37]/30 hover:border-[#d4af37] hover:bg-[#3d2717] transition-all flex flex-col items-center text-center group"
          >
            <BookOpen size={22} className="text-[#d4af37] mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs text-[#fdfbf7]">MY COLLECTION</span>
            <span className="text-[10px] text-[#a3907c] mt-0.5">Artifacts & Lore</span>
          </button>

          {/* 5. BADGES */}
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('badges');
            }}
            className="p-3.5 rounded-2xl bg-[#2c1b10] border border-[#d4af37]/30 hover:border-[#d4af37] hover:bg-[#3d2717] transition-all flex flex-col items-center text-center group"
          >
            <Trophy size={22} className="text-[#d4af37] mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs text-[#fdfbf7]">BADGES</span>
            <span className="text-[10px] text-[#a3907c] mt-0.5">{profile?.unlockedBadgeIds?.length || 0} Unlocked</span>
          </button>

          {/* 6. SETTINGS */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="p-3.5 rounded-2xl bg-[#2c1b10] border border-[#d4af37]/30 hover:border-[#d4af37] hover:bg-[#3d2717] transition-all flex flex-col items-center text-center group"
          >
            <Settings size={22} className="text-[#d4af37] mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs text-[#fdfbf7]">SETTINGS</span>
            <span className="text-[10px] text-[#a3907c] mt-0.5">Audio & Reset</span>
          </button>

          {/* BONUS: CHARACTER CUSTOMIZER */}
          <button
            onClick={() => {
              sound.playClick();
              onNavigate('character_customizer');
            }}
            className="p-3.5 rounded-2xl bg-[#2c1b10] border border-[#d4af37]/30 hover:border-[#d4af37] hover:bg-[#3d2717] transition-all flex flex-col items-center text-center group"
          >
            <User size={22} className="text-[#d4af37] mb-1.5 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs text-[#fdfbf7]">CHARACTER</span>
            <span className="text-[10px] text-[#a3907c] mt-0.5">Avatar Style</span>
          </button>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="relative z-10 text-center text-[#a3907c] text-[11px] pt-4">
        KalaYatra: National Heritage & Art Education Platform • Inspired by Traditional Indian Masters
      </div>
    </div>
  );
};
