import React from 'react';
import { Maximize2, Sparkles, ExternalLink } from 'lucide-react';
import { ScreenId } from '../types';
import { SCREENS_DATA } from '../data/gameData';
import { MainMenuScreen } from './screens/MainMenuScreen';
import { ExplorationScreen } from './screens/ExplorationScreen';
import { DialogueScreen } from './screens/DialogueScreen';
import { NotebookScreen } from './screens/NotebookScreen';
import { MathPuzzleScreen } from './screens/MathPuzzleScreen';
import { AstronomyPuzzleScreen } from './screens/AstronomyPuzzleScreen';
import { KnowledgeWebScreen } from './screens/KnowledgeWebScreen';
import { MapScreen } from './screens/MapScreen';
import { InventoryScreen } from './screens/InventoryScreen';
import { MoralChoiceScreen } from './screens/MoralChoiceScreen';
import { EndingScreen } from './screens/EndingScreen';
import { FooterBanner } from './FooterBanner';
import { sounds } from '../audio';

interface ConceptSheetViewProps {
  onOpenScreenModal: (id: ScreenId) => void;
  onNavigateToSimulator: (id: ScreenId) => void;
}

export const ConceptSheetView: React.FC<ConceptSheetViewProps> = ({
  onOpenScreenModal,
  onNavigateToSimulator,
}) => {
  const renderScreenCard = (
    screenId: ScreenId,
    content: React.ReactNode,
    className = 'col-span-1'
  ) => {
    const meta = SCREENS_DATA.find((s) => s.id === screenId)!;

    return (
      <div
        key={screenId}
        className={`group relative rounded-sm border-2 border-[#d4af37]/60 bg-[#060b18] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all duration-300 hover:border-[#f6d77e] hover:shadow-[0_0_25px_rgba(212,175,55,0.25)] flex flex-col ${className}`}
      >
        {/* Card Header Tag with Screen Number & Title */}
        <div className="bg-gradient-to-r from-[#0a1329] via-[#0f214d] to-[#0a1329] px-3 py-1.5 border-b border-[#d4af37]/40 flex items-center justify-between z-20">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <h3 className="font-cinzel text-xs md:text-sm font-bold text-[#fae596] tracking-wide">
              {meta.title}
            </h3>
          </div>

          <div className="flex items-center space-x-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => {
                sounds.playStoneClick();
                onOpenScreenModal(screenId);
              }}
              className="px-2 py-0.5 rounded bg-[#162954] hover:bg-[#203c7d] text-[10px] font-cinzel text-[#faeccf] border border-[#d4af37]/40 flex items-center space-x-1 transition-colors"
              title="Inspect Screen in Fullscreen"
            >
              <Maximize2 className="w-3 h-3 text-[#fcd34d]" />
              <span className="hidden sm:inline">Inspect</span>
            </button>
            <button
              onClick={() => {
                sounds.playTempleBell(528);
                onNavigateToSimulator(screenId);
              }}
              className="px-2 py-0.5 rounded bg-[#92400e]/70 hover:bg-[#b45309] text-[10px] font-cinzel text-[#fff0bf] border border-[#f59e0b]/50 flex items-center space-x-1 transition-colors"
              title="Launch Live Game Simulator"
            >
              <ExternalLink className="w-3 h-3 text-[#fde047]" />
              <span className="hidden sm:inline">Play</span>
            </button>
          </div>
        </div>

        {/* Screen Viewport (Interactive Preview) */}
        <div className="relative flex-1 min-h-[290px] overflow-hidden">
          {content}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1550px] mx-auto p-3 md:p-6 space-y-6">
      
      {/* Top Heritage Concept Sheet Header */}
      <div className="text-center relative py-6 border-b-2 border-[#d4af37]/40 bg-gradient-to-b from-[#0c1633]/60 via-[#070e24]/40 to-transparent rounded-lg">
        {/* Dharmachakra Symbol & Title */}
        <div className="inline-flex items-center justify-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-full border border-[#d4af37] bg-[#0c1a3e] flex items-center justify-center text-[#f6d77e] shadow-[0_0_15px_rgba(212,175,55,0.4)]">
            <svg viewBox="0 0 100 100" className="w-7 h-7">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
              <circle cx="50" cy="50" r="14" fill="none" stroke="currentColor" strokeWidth="3" />
              <circle cx="50" cy="50" r="5" fill="currentColor" />
              {Array.from({ length: 24 }).map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={50 + 44 * Math.cos((i * 15 * Math.PI) / 180)}
                  y2={50 + 44 * Math.sin((i * 15 * Math.PI) / 180)}
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              ))}
            </svg>
          </div>

          <h1 className="font-cinzel text-2xl md:text-4xl lg:text-5xl font-black tracking-widest text-[#fae596] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
            NALANDA MYSTERY
          </h1>
        </div>

        <p className="font-serif text-sm md:text-lg tracking-[0.3em] text-[#d6c28f] uppercase font-semibold">
          AN INDIAN LEGACY, A GLOBAL STORY
        </p>
        <p className="text-xs text-zinc-400 max-w-2xl mx-auto mt-2 font-sans">
          Cinematic AAA Historical Heritage Game UI Concept Sheet • 11 Interactive Screens with Ancient Indian Architecture, Manuscripts, Monks, Warm Golden Lighting, Parchment Textures, and Dark Navy UI.
        </p>
      </div>

      {/* 11-Screen AAA Master Concept Grid (Matching the Uploaded Design Board) */}

      {/* ROW 1: Screens 1, 2, 3 (Main Menu, Exploration, Dialogue) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {renderScreenCard(
          'main-menu',
          <MainMenuScreen
            onStartGame={() => onNavigateToSimulator('exploration')}
          />
        )}
        {renderScreenCard(
          'exploration',
          <ExplorationScreen
            onInteractNPC={() => onNavigateToSimulator('dialogue')}
            onOpenJournal={() => onNavigateToSimulator('notebook')}
          />
        )}
        {renderScreenCard(
          'dialogue',
          <DialogueScreen
            onContinueQuest={() => onNavigateToSimulator('notebook')}
          />
        )}
      </div>

      {/* ROW 2: Screens 4, 5, 6 (Notebook, Mathematics Puzzle, Astronomy Puzzle) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {renderScreenCard('notebook', <NotebookScreen />)}
        {renderScreenCard('math-puzzle', <MathPuzzleScreen />)}
        {renderScreenCard('astronomy-puzzle', <AstronomyPuzzleScreen />)}
      </div>

      {/* ROW 3: Screens 7, 8, 9, 10 (Knowledge Web, Nalanda Map, Inventory, Final Moral Choice) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {renderScreenCard('knowledge-web', <KnowledgeWebScreen />)}
        {renderScreenCard('map', <MapScreen />)}
        {renderScreenCard('inventory', <InventoryScreen />)}
        {renderScreenCard(
          'moral-choice',
          <MoralChoiceScreen onSelectEnding={() => onNavigateToSimulator('ending')} />
        )}
      </div>

      {/* ROW 4: Screen 11 (Ending) & Grand Title Concept Art Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {renderScreenCard(
          'ending',
          <EndingScreen onReturnToMainMenu={() => onNavigateToSimulator('main-menu')} />
        )}

        {/* Master Branding Banner (matching bottom-right of concept sheet) */}
        <div className="rounded-sm border-2 border-[#d4af37]/60 overflow-hidden flex flex-col justify-center">
          <FooterBanner />
        </div>
      </div>
    </div>
  );
};
