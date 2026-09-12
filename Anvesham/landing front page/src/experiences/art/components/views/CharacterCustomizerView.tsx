import React, { useState } from 'react';
import { CharacterCustomization } from '../../types';
import { sound } from '../../utils/soundEngine';
import { ChevronLeft, User, Sparkles, Check, Palette } from 'lucide-react';

interface CharacterCustomizerViewProps {
  customization: CharacterCustomization;
  onSaveCustomization: (updated: CharacterCustomization) => void;
  onBack: () => void;
}

const SKIN_TONES = [
  { label: 'Fair Ivory', hex: '#fed7aa' },
  { label: 'Warm Wheatish', hex: '#f59e0b' },
  { label: 'Earthy Dusky', hex: '#d97706' },
  { label: 'Deep Bronze', hex: '#92400e' },
  { label: 'Rich Terracotta', hex: '#78350f' },
];

const OUTFIT_COLORS = [
  { label: 'Kesari Saffron', hex: '#d97706' },
  { label: 'Sindoor Crimson', hex: '#dc2626' },
  { label: 'Royal Neel Indigo', hex: '#1d4ed8' },
  { label: 'Vana Forest Green', hex: '#15803d' },
  { label: 'Pari Lotus Pink', hex: '#db2777' },
  { label: 'Kashi Ivory White', hex: '#fdfbf7' },
];

const HAIR_COLORS = [
  { label: 'Jet Black', hex: '#18181b' },
  { label: 'Dark Henna Brown', hex: '#451a03' },
  { label: 'Chestnut', hex: '#78350f' },
];

// Character Archetypes as explicitly requested: Character A & Character B
const PRESET_CHARACTERS: {
  id: 'character_a' | 'character_b';
  name: string;
  role: string;
  preset: CharacterCustomization;
}[] = [
  {
    id: 'character_a',
    name: 'Kavya',
    role: 'Mithila Heritage Scholar',
    preset: {
      gender: 'female',
      skinTone: '#fed7aa',
      hairStyle: 'braid',
      hairColor: '#18181b',
      outfit: 'saree_dupatta',
      outfitColor: '#dc2626',
      accessory: 'angavastram',
      name: 'Kavya',
    },
  },
  {
    id: 'character_b',
    name: 'Aarav',
    role: 'Traditional Craft Explorer',
    preset: {
      gender: 'male',
      skinTone: '#f59e0b',
      hairStyle: 'classic_crop',
      hairColor: '#18181b',
      outfit: 'kurta_stole',
      outfitColor: '#d97706',
      accessory: 'rudraksha',
      name: 'Aarav',
    },
  },
];

const DEFAULT_CUST: CharacterCustomization = {
  gender: 'male',
  skinTone: '#f59e0b',
  hairStyle: 'classic_crop',
  hairColor: '#18181b',
  outfit: 'kurta_stole',
  outfitColor: '#d97706',
  accessory: 'rudraksha',
  name: 'Aarav',
};

export const CharacterCustomizerView: React.FC<CharacterCustomizerViewProps> = ({
  customization,
  onSaveCustomization,
  onBack,
}) => {
  const [cust, setCust] = useState<CharacterCustomization>(() => ({
    ...DEFAULT_CUST,
    ...(customization || {}),
  }));

  const handleApplyPreset = (preset: CharacterCustomization) => {
    sound.playClick();
    setCust({ ...preset });
  };

  const handleUpdate = <K extends keyof CharacterCustomization>(
    field: K,
    val: CharacterCustomization[K]
  ) => {
    sound.playClick();
    setCust((prev) => ({ ...prev, [field]: val }));
  };

  const handleSave = () => {
    sound.playCorrect();
    onSaveCustomization(cust);
    onBack();
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#1c120c] text-[#fdfbf7] select-none overflow-y-auto font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-[#23150d] border-b-2 border-[#d4af37]/40 sticky top-0 z-20 shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="p-2 rounded-xl bg-[#3d2717] hover:bg-[#4a321f] text-[#d4af37] border border-[#d4af37]/30 transition-all active:scale-95"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-lg sm:text-xl font-bold font-heading text-[#d4af37] flex items-center gap-2">
              <User size={20} />
              <span>Character Customization</span>
            </h2>
            <p className="text-xs text-[#e6d7be]">
              Choose Character A or B, customize attire and accessories
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#c59b27] text-[#1c120c] font-black text-xs uppercase tracking-wider shadow-lg transition-all active:scale-95 glow-heritage"
        >
          Save & Journey
        </button>
      </div>

      {/* Main Studio */}
      <div className="p-6 max-w-5xl mx-auto w-full flex-1 flex flex-col md:flex-row gap-8 items-center md:items-start justify-center">
        {/* Left: Stylized Indian Explorer Visual Avatar Card */}
        <div className="w-full md:w-80 flex flex-col items-center">
          <div className="w-full aspect-[3/4] rounded-3xl bg-[#2c1b10] border-2 border-[#d4af37]/60 p-6 flex flex-col items-center justify-center relative shadow-2xl overflow-hidden glow-heritage">
            {/* Background traditional motif ring */}
            <div className="absolute w-56 h-56 rounded-full border border-dashed border-[#d4af37]/30 pointer-events-none" />

            {/* Stylized Avatar Figure */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Head & Hair */}
              <div className="relative">
                <div
                  className="w-24 h-24 rounded-full absolute -top-2 -left-2 z-0"
                  style={{ backgroundColor: cust.hairColor }}
                />
                <div
                  className="w-20 h-20 rounded-full relative z-10 border-2 border-[#d4af37]/40 flex items-center justify-center text-4xl shadow-inner"
                  style={{ backgroundColor: cust.skinTone }}
                >
                  {cust.gender === 'female' ? '👩🏽' : '👦🏽'}
                </div>

                {/* Head Accessory (Pagdi / Turban) */}
                {cust.accessory === 'pagdi' && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 px-3 py-1 bg-amber-600 text-[10px] font-bold text-white rounded-full shadow-md border border-amber-300">
                    👑 Pagdi
                  </div>
                )}
              </div>

              {/* Body / Attire */}
              <div
                className="w-32 h-36 rounded-t-3xl mt-2 border-2 border-[#d4af37]/40 flex flex-col items-center justify-center p-3 relative shadow-lg"
                style={{ backgroundColor: cust.outfitColor }}
              >
                {/* Accessory Overlay */}
                {cust.accessory === 'rudraksha' && (
                  <span className="text-xs bg-black/40 px-2 py-0.5 rounded-full text-amber-200 border border-amber-400/40 mb-1">
                    📿 Rudraksha
                  </span>
                )}
                {cust.accessory === 'angavastram' && (
                  <span className="text-xs bg-black/40 px-2 py-0.5 rounded-full text-amber-200 border border-amber-400/40 mb-1">
                    🧣 Angavastram
                  </span>
                )}
                {cust.accessory === 'satchel' && (
                  <span className="text-xs bg-black/40 px-2 py-0.5 rounded-full text-amber-200 border border-amber-400/40 mb-1">
                    🎒 Heritage Satchel
                  </span>
                )}

                <span className="text-xs font-bold text-white uppercase tracking-wider drop-shadow-md text-center">
                  {cust.outfit.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Explorer Tag */}
            <div className="mt-4 text-center">
              <h3 className="text-base font-bold font-heading text-[#d4af37]">
                {cust.name}
              </h3>
              <p className="text-[11px] text-[#e6d7be]">
                {cust.gender === 'female' ? 'Female Explorer' : 'Male Explorer'} • {cust.outfit}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Customization Controls Panel */}
        <div className="flex-1 w-full space-y-6">
          {/* SECTION 6: CHOOSE CHARACTER A OR CHARACTER B */}
          <div className="bg-[#2c1b10] border border-[#d4af37]/40 rounded-2xl p-5 shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37] block mb-3">
              1. Choose Character (Archetype)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRESET_CHARACTERS.map((char) => {
                const isSelected = cust.gender === char.preset.gender;
                return (
                  <button
                    key={char.id}
                    onClick={() => handleApplyPreset(char.preset)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${
                      isSelected
                        ? 'bg-[#3d2717] border-[#d4af37] shadow-lg scale-102'
                        : 'bg-[#23150d] border-[#4a321f] hover:border-[#d4af37]/50 text-[#e6d7be]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-[#d4af37] uppercase">
                        {char.id === 'character_a' ? 'Character A' : 'Character B'}
                      </span>
                      <span className="text-xl">
                        {char.preset.gender === 'female' ? '👧🏽' : '👦🏽'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#fdfbf7]">{char.name}</h4>
                    <p className="text-[11px] text-[#a3907c] mt-0.5">{char.role}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Explorer Name Input */}
          <div className="bg-[#2c1b10] border border-[#d4af37]/30 rounded-2xl p-5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#d4af37] block mb-2">
              Explorer Name
            </label>
            <input
              type="text"
              value={cust.name}
              onChange={(e) => handleUpdate('name', e.target.value)}
              maxLength={24}
              className="w-full bg-[#1c120c] border border-[#d4af37]/40 text-[#fdfbf7] text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-[#d4af37] font-semibold"
              placeholder="Enter your explorer name..."
            />
          </div>

          {/* Hairstyle Selection */}
          <div className="bg-[#2c1b10] border border-[#d4af37]/30 rounded-2xl p-5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#d4af37] block mb-2.5">
              Hairstyle
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'classic_crop', label: 'Classic Crop' },
                { id: 'curly', label: 'Curly Waves' },
                { id: 'braid', label: 'Traditional Braid' },
                { id: 'short', label: 'Neat Short' },
              ].map((h) => (
                <button
                  key={h.id}
                  onClick={() => handleUpdate('hairStyle', h.id as any)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                    cust.hairStyle === h.id
                      ? 'bg-[#d4af37] text-[#1c120c] border-[#d4af37]'
                      : 'bg-[#23150d] text-[#e6d7be] border-[#4a321f] hover:border-[#d4af37]/40'
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          {/* Outfit Attire Selection */}
          <div className="bg-[#2c1b10] border border-[#d4af37]/30 rounded-2xl p-5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#d4af37] block mb-2.5">
              Traditional Indian Attire
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'kurta_stole', label: 'Kurta & Stole', desc: 'Cotton kurta with draped stole' },
                { id: 'dhoti_vest', label: 'Dhoti & Nehru Vest', desc: 'Khadi vest with pleated dhoti' },
                { id: 'saree_dupatta', label: 'Saree & Dupatta', desc: 'Regional handloom pleats' },
                { id: 'heritage_jacket', label: 'Heritage Bandhgala', desc: 'Embroidered formal jacket' },
              ].map((outfit) => (
                <button
                  key={outfit.id}
                  onClick={() => handleUpdate('outfit', outfit.id as any)}
                  className={`p-3 rounded-xl border transition-all text-left ${
                    cust.outfit === outfit.id
                      ? 'bg-[#3d2717] border-[#d4af37] text-[#fdfbf7]'
                      : 'bg-[#23150d] border-[#4a321f] text-[#e6d7be] hover:border-[#d4af37]/40'
                  }`}
                >
                  <span className="font-bold text-xs text-[#d4af37] block">{outfit.label}</span>
                  <span className="text-[10px] text-[#a3907c] mt-0.5 block">{outfit.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Outfit Color Palette */}
          <div className="bg-[#2c1b10] border border-[#d4af37]/30 rounded-2xl p-5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#d4af37] block mb-2.5">
              Attire Natural Dye Shade
            </label>
            <div className="flex flex-wrap gap-3">
              {OUTFIT_COLORS.map((col) => (
                <button
                  key={col.label}
                  onClick={() => handleUpdate('outfitColor', col.hex)}
                  className={`w-10 h-10 rounded-2xl border-2 transition-all relative flex items-center justify-center shadow-md ${
                    cust.outfitColor === col.hex
                      ? 'border-[#d4af37] scale-110'
                      : 'border-[#4a321f] hover:scale-105'
                  }`}
                  style={{ backgroundColor: col.hex }}
                  title={col.label}
                >
                  {cust.outfitColor === col.hex && (
                    <Check size={16} className="text-[#1c120c] font-bold" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Accessories */}
          <div className="bg-[#2c1b10] border border-[#d4af37]/30 rounded-2xl p-5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#d4af37] block mb-2.5">
              Cultural Heritage Accessory
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'none', label: 'None', icon: '—' },
                { id: 'pagdi', label: 'Pagdi (Turban)', icon: '👑' },
                { id: 'angavastram', label: 'Angavastram Stole', icon: '🧣' },
                { id: 'satchel', label: 'Artisan Satchel', icon: '🎒' },
                { id: 'rudraksha', label: 'Rudraksha Mala', icon: '📿' },
              ].map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => handleUpdate('accessory', acc.id as any)}
                  className={`p-2.5 rounded-xl border transition-all text-xs font-semibold flex items-center gap-2 ${
                    cust.accessory === acc.id
                      ? 'bg-[#d4af37] text-[#1c120c] border-[#d4af37]'
                      : 'bg-[#23150d] text-[#e6d7be] border-[#4a321f] hover:border-[#d4af37]/40'
                  }`}
                >
                  <span>{acc.icon}</span>
                  <span className="truncate">{acc.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
