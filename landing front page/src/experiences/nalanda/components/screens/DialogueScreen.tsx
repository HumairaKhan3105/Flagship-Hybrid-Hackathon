import React, { useState } from 'react';
import { MessageSquare, HelpCircle, CheckCircle, ArrowRight, X, AlertCircle } from 'lucide-react';
import { sounds } from '../../audio';

interface DialogueScreenProps {
  onContinueQuest?: () => void;
}

export const DialogueScreen: React.FC<DialogueScreenProps> = ({ onContinueQuest }) => {
  const [activeDialogueIndex, setActiveDialogueIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState<boolean>(true);

  const dialogTree = [
    {
      speaker: 'Librarian (Acharya Shilabhadra)',
      text: 'The manuscript was last seen in the library. But someone entered after the evening bell...',
      options: [
        {
          id: 'opt1',
          icon: '?',
          text: 'What did the intruder look like?',
          reply: 'He wore travel-stained monk robes from the western Silk Road, but moved with the haste of a royal envoy rather than a contemplative scholar.',
        },
        {
          id: 'opt2',
          icon: '?',
          text: 'Any clues left behind?',
          reply: 'He dropped a pure gold coin near the ninth-story window and left brick-dust footprints. Only someone with an imperial copper key could enter.',
        },
        {
          id: 'opt3',
          icon: '!',
          text: "I'll check the library.",
          reply: 'Be watchful, young pandita. The stone plinth near the astronomy rotunda was shifted. Its mathematics lock has been altered!',
        },
        {
          id: 'opt4',
          icon: '✕',
          text: 'Goodbye.',
          reply: 'May Saraswati illuminate your discernment. The legacy of Aryabhata rests upon your shoulders.',
        },
      ],
    },
  ];

  const currentDialogue = dialogTree[activeDialogueIndex];

  const handleSelectOption = (opt: { id: string; text: string; reply: string }) => {
    sounds.playTempleBell(520);
    setSelectedOption(opt.reply);
  };

  return (
    <div id="screen-dialogue" className="relative w-full h-full min-h-[360px] flex flex-col justify-between overflow-hidden bg-[#070b16] text-[#f7eed9] select-none">
      {/* Background Library Interior Scene */}
      <div className="absolute inset-0 z-0">
        {/* Warm Terracotta and Mahogany Library Atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#170c08] via-[#33180e] to-[#0d162d]" />

        {/* Pigeonhole manuscript shelves background */}
        <div className="absolute inset-0 opacity-25">
          <div className="w-full h-full grid grid-cols-12 grid-rows-6 gap-1 p-4">
            {Array.from({ length: 72 }).map((_, i) => (
              <div key={i} className="border border-[#d4af37]/30 bg-[#24130a]/50 rounded-sm flex items-center justify-center p-1">
                <div className="w-full h-1 bg-[#d4af37]/40 rounded-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Monk Portrait Character View (Left-Center) */}
        <div className="absolute bottom-0 left-6 md:left-14 z-10 w-48 md:w-64 h-80">
          <svg viewBox="0 0 200 280" className="w-full h-full filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]">
            {/* Soft divine halo/aura */}
            <circle cx="100" cy="80" r="60" fill="#f59e0b" opacity="0.15" />
            
            {/* Venerable Buddhist Monk with shaved head and serene meditative gaze */}
            <circle cx="100" cy="80" r="32" fill="#c99767" />
            
            {/* Facial details (silver beard, wise brow, closed serenity) */}
            <path d="M85,96 Q100,125 115,96" stroke="#f4f4f5" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M88,72 Q95,70 102,72" stroke="#78350f" strokeWidth="1.5" fill="none" />
            <path d="M98,72 Q105,70 112,72" stroke="#78350f" strokeWidth="1.5" fill="none" />
            {/* Ushnisha / cranial bump of wisdom */}
            <circle cx="100" cy="48" r="8" fill="#c99767" />

            {/* Saffron and Ochre Kasaya Robe draped gracefully over one shoulder */}
            <path d="M60,110 C45,150 40,200 36,280 L164,280 C160,200 155,150 140,110 Z" fill="#b45309" />
            <path d="M62,112 Q100,165 140,112 L150,150 Q100,210 50,150 Z" fill="#d97706" />
            <path d="M50,140 Q100,230 150,280" stroke="#fcd34d" strokeWidth="2" fill="none" opacity="0.6" />

            {/* Prayer beads (Japamala) draped across robe */}
            {Array.from({ length: 9 }).map((_, idx) => (
              <circle key={idx} cx={75 + idx * 6} cy={165 + Math.sin(idx * 0.5) * 15} r="3.5" fill="#78350f" stroke="#f59e0b" strokeWidth="0.8" />
            ))}

            {/* Holding palm-leaf manuscript bundle with sacred red cord */}
            <rect x="75" y="210" width="85" height="14" rx="2" transform="rotate(-10 75 210)" fill="#e5c158" stroke="#78350f" strokeWidth="1.5" />
            <rect x="110" y="202" width="4" height="28" fill="#ef4444" />
          </svg>
        </div>

        {/* Warm Flickering Oil Diya Lamps Glow */}
        <div className="absolute bottom-12 left-64 w-12 h-12 bg-amber-500/25 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/4 right-1/3 w-16 h-16 bg-yellow-600/15 rounded-full blur-2xl" />
      </div>

      {/* Top Quest Notification Banner (matching reference image top-right) */}
      <div className="relative z-20 p-4 flex justify-between items-start">
        <div className="hidden sm:block text-xs font-mono text-[#c59b27] tracking-wider uppercase">
          Ratnasagara Library • Lower Nave
        </div>

        {showNotification && (
          <div className="bg-[#0b1735]/95 border border-[#f59e0b] px-3.5 py-1.5 rounded-sm shadow-xl flex items-center space-x-2 text-xs text-[#fae596] animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">Quest Updated:</span>
            <span className="text-[#fde047]">Talk to the Librarian</span>
            <button
              onClick={() => setShowNotification(false)}
              className="text-zinc-400 hover:text-white ml-2 text-xs"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Main Dialogue UI Area (Bottom Subtitle Box & Right Choices) */}
      <div className="relative z-20 px-4 md:px-6 pb-6 pt-12 flex flex-col md:flex-row gap-4 items-end">
        {/* Subtitle Dialogue Box (Left/Center) */}
        <div className="w-full md:w-3/5 bg-[#070f24]/90 backdrop-blur-md border border-[#d4af37]/60 rounded-sm p-4 shadow-[0_8px_30px_rgba(0,0,0,0.8)] relative">
          {/* Subtle gold corner accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#f6d77e]" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#f6d77e]" />

          {/* Speaker Badge */}
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-[#d4af37]/20 border border-[#d4af37]/40 rounded-xs mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-cinzel text-xs font-bold text-[#fae596] tracking-wide">
              {currentDialogue.speaker}
            </span>
          </div>

          {/* Spoken Text */}
          <p className="font-sans text-sm md:text-base leading-relaxed text-[#f7eed9] italic min-h-[50px]">
            “{selectedOption || currentDialogue.text}”
          </p>

          {/* Dialogue continuation prompt */}
          <div className="mt-3 pt-2 border-t border-[#d4af37]/20 flex justify-between items-center text-[10px] text-[#c59b27]/80 font-mono">
            <span>[SPACE] Continue conversation</span>
            <span>Recorded in Journal</span>
          </div>
        </div>

        {/* Dialogue Interaction Choices on Right (matching screenshot style) */}
        <div className="w-full md:w-2/5 space-y-2">
          {currentDialogue.options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleSelectOption(opt)}
              className="w-full text-left p-2.5 rounded-sm bg-[#081329]/85 hover:bg-[#12234c] border border-[#d4af37]/40 hover:border-[#f6d77e] transition-all flex items-center space-x-3 group shadow-md"
            >
              <span className="w-5 h-5 rounded-full border border-[#d4af37]/60 bg-[#142347] flex items-center justify-center text-xs font-bold text-[#f6d77e] group-hover:scale-110 transition-transform">
                {opt.icon}
              </span>
              <span className="font-cinzel text-xs md:text-sm text-[#e2d5b6] group-hover:text-[#fff0bf] transition-colors">
                {opt.text}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-[#d4af37]/40 group-hover:text-[#f6d77e] ml-auto group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </div>

      {/* Screen Label Badge */}
      <div className="relative z-10 px-5 pb-2.5 flex items-center justify-between text-[11px] text-[#c59b27]/70 font-mono">
        <span className="bg-[#050b18]/80 px-2 py-0.5 border border-[#d4af37]/20 rounded">
          3. NPC Interaction / Dialogue
        </span>
        <span className="text-[10px] tracking-wider text-amber-200/50">
          ACHARYA SHILABHADRA • DHARMAGANJA
        </span>
      </div>
    </div>
  );
};
