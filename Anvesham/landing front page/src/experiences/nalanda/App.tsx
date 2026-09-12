import React, { useState } from 'react';
import { ScreenId } from './types';
import { SCREENS_DATA } from './data/gameData';
import { HeaderBanner } from './components/HeaderBanner';
import { ConceptSheetView } from './components/ConceptSheetView';
import { ScreenModal } from './components/ScreenModal';
import { InfoModal } from './components/InfoModal';
import { MainMenuScreen } from './components/screens/MainMenuScreen';
import { ExplorationScreen } from './components/screens/ExplorationScreen';
import { DialogueScreen } from './components/screens/DialogueScreen';
import { NotebookScreen } from './components/screens/NotebookScreen';
import { MathPuzzleScreen } from './components/screens/MathPuzzleScreen';
import { AstronomyPuzzleScreen } from './components/screens/AstronomyPuzzleScreen';
import { KnowledgeWebScreen } from './components/screens/KnowledgeWebScreen';
import { MapScreen } from './components/screens/MapScreen';
import { InventoryScreen } from './components/screens/InventoryScreen';
import { MoralChoiceScreen } from './components/screens/MoralChoiceScreen';
import { EndingScreen } from './components/screens/EndingScreen';
import { sounds } from './audio';
import './index.css';

export default function App() {
  const [viewMode, setViewMode] = useState<'concept-sheet' | 'simulator'>('concept-sheet');
  const [activeScreenId, setActiveScreenId] = useState<ScreenId>('main-menu');
  const [modalScreenId, setModalScreenId] = useState<ScreenId | null>(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(false);

  // Helper to render the screen component dynamically
  const renderScreen = (id: ScreenId) => {
    switch (id) {
      case 'main-menu':
        return (
          <MainMenuScreen
            onStartGame={() => {
              setActiveScreenId('exploration');
              if (viewMode === 'concept-sheet') {
                setModalScreenId('exploration');
              }
            }}
          />
        );
      case 'exploration':
        return (
          <ExplorationScreen
            onInteractNPC={() => {
              setActiveScreenId('dialogue');
              if (modalScreenId) setModalScreenId('dialogue');
            }}
            onOpenJournal={() => {
              setActiveScreenId('notebook');
              if (modalScreenId) setModalScreenId('notebook');
            }}
          />
        );
      case 'dialogue':
        return (
          <DialogueScreen
            onContinueQuest={() => {
              setActiveScreenId('notebook');
              if (modalScreenId) setModalScreenId('notebook');
            }}
          />
        );
      case 'notebook':
        return <NotebookScreen />;
      case 'math-puzzle':
        return <MathPuzzleScreen />;
      case 'astronomy-puzzle':
        return <AstronomyPuzzleScreen />;
      case 'knowledge-web':
        return <KnowledgeWebScreen />;
      case 'map':
        return <MapScreen />;
      case 'inventory':
        return <InventoryScreen />;
      case 'moral-choice':
        return (
          <MoralChoiceScreen
            onSelectEnding={() => {
              setActiveScreenId('ending');
              if (modalScreenId) setModalScreenId('ending');
            }}
          />
        );
      case 'ending':
        return (
          <EndingScreen
            onReturnToMainMenu={() => {
              setActiveScreenId('main-menu');
              if (modalScreenId) setModalScreenId('main-menu');
            }}
          />
        );
      default:
        return <MainMenuScreen />;
    }
  };

  const currentMeta = SCREENS_DATA.find((s) => s.id === activeScreenId)!;

  return (
    <div className="nalanda-experience min-h-screen bg-[#050811] text-[#f7eed9] flex flex-col selection:bg-[#c59b27]/30 selection:text-[#fcedb3]">
      
      {/* Top Header & Navigation Bar */}
      <HeaderBanner
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeScreenId={activeScreenId}
        setActiveScreenId={setActiveScreenId}
        isAudioOn={isAudioOn}
        setIsAudioOn={setIsAudioOn}
        onOpenInfoModal={() => setIsInfoModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-x-hidden">
        {viewMode === 'concept-sheet' ? (
          /* View 1: Complete 11-Screen Master Concept Sheet (Matching Uploaded Image) */
          <ConceptSheetView
            onOpenScreenModal={(id) => setModalScreenId(id)}
            onNavigateToSimulator={(id) => {
              setActiveScreenId(id);
              setViewMode('simulator');
            }}
          />
        ) : (
          /* View 2: Full-Scale Interactive Game Simulator */
          <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-4 animate-fadeIn">
            {/* Active Screen Info Header */}
            <div className="bg-[#08122a] border border-[#d4af37]/40 rounded-sm p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#f59e0b] uppercase">
                  SIMULATOR MODE • SCREEN {currentMeta.number} OF 11
                </span>
                <h2 className="font-cinzel text-xl md:text-2xl font-bold text-[#fae596]">
                  {currentMeta.title}
                </h2>
                <p className="text-xs text-[#cbd5e1] font-sans mt-0.5">
                  {currentMeta.description}
                </p>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    sounds.playStoneClick();
                    const prevIdx = (SCREENS_DATA.findIndex(s => s.id === activeScreenId) - 1 + SCREENS_DATA.length) % SCREENS_DATA.length;
                    setActiveScreenId(SCREENS_DATA[prevIdx].id);
                  }}
                  className="px-3 py-1.5 rounded-sm bg-[#12244d] hover:bg-[#1a346e] border border-[#d4af37]/30 text-xs text-[#fae596] font-cinzel transition-all"
                >
                  ← Prev
                </button>
                <button
                  onClick={() => {
                    sounds.playStoneClick();
                    const nextIdx = (SCREENS_DATA.findIndex(s => s.id === activeScreenId) + 1) % SCREENS_DATA.length;
                    setActiveScreenId(SCREENS_DATA[nextIdx].id);
                  }}
                  className="px-3 py-1.5 rounded-sm bg-[#d4af37] hover:bg-[#f6d77e] text-[#1c0d05] text-xs font-cinzel font-bold transition-all"
                >
                  Next →
                </button>
              </div>
            </div>

            {/* Active Screen Simulator Viewport */}
            <div className="w-full h-[620px] rounded-sm border-2 border-[#d4af37] overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.8)] bg-[#050a16]">
              {renderScreen(activeScreenId)}
            </div>
          </div>
        )}
      </main>

      {/* Screen Focus & Zoom Modal */}
      <ScreenModal
        screenId={modalScreenId}
        onClose={() => setModalScreenId(null)}
        onSelectScreen={(id) => setModalScreenId(id)}
        renderScreenContent={(id) => renderScreen(id)}
      />

      {/* Design Document / Historical Info Modal */}
      <InfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
}
