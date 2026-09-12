import React, { useState, useEffect } from 'react';
import { useGameStore } from './store/gameStore';
import { GameCanvas } from './components/World/GameCanvas';
import { GameHUD } from './components/HUD/GameHUD';
import { MainMenu } from './components/Menu/MainMenu';
import { IntroPrologue } from './components/Intro/IntroPrologue';
import { VictoryScreen } from './components/Ending/VictoryScreen';
import { HampiMapModal } from './components/Map/HampiMapModal';
import { JournalModal } from './components/Journal/JournalModal';
import { PuzzleModal } from './components/Puzzle/PuzzleModal';
import { CinematicModal } from './components/Cinematic/CinematicModal';
import { AIGuideWidget } from './components/AIGuide/AIGuideWidget';
import { gameApi } from './services/gameApi';

export default function App() {
  const {
    screen,
    activeModal,
    activePuzzleId,
    setActiveModal,
    setActivePuzzle
  } = useGameStore();

  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Restore saved progress from local/server storage on mount
  useEffect(() => {
    gameApi.getPlayerProgress().then(saved => {
      if (saved && saved.unlockedLocations && saved.score) {
        useGameStore.setState({
          unlockedLocations: saved.unlockedLocations,
          clues: saved.clues || useGameStore.getState().clues,
          artifacts: saved.artifacts || useGameStore.getState().artifacts,
          quests: saved.quests || useGameStore.getState().quests,
          currentQuestIndex: saved.currentQuestIndex ?? 0,
          solvedPuzzles: saved.solvedPuzzles || [],
          score: saved.score ?? 0,
          xp: saved.xp ?? 0,
          level: saved.level ?? 1
        });
      }
    });
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-stone-950 font-sans text-stone-100 select-none">
      {/* 1. MAIN MENU SCREEN */}
      {screen === 'menu' && <MainMenu />}

      {/* 2. CINEMATIC INTRO PROLOGUE SCREEN */}
      {screen === 'intro' && <IntroPrologue />}

      {/* 3. VICTORY / ENDING SCREEN */}
      {screen === 'ending' && <VictoryScreen />}

      {/* 4. ACTIVE 3D GAME WORLD SCREEN */}
      {screen === 'playing' && (
        <>
          {/* Real 3D Three.js Heritage World */}
          <GameCanvas />

          {/* Heads-Up Display */}
          <GameHUD onOpenGuide={() => setIsGuideOpen(true)} />

          {/* Map Modal */}
          {activeModal === 'map' && (
            <HampiMapModal
              isOpen={true}
              onClose={() => setActiveModal(null)}
            />
          )}

          {/* Historical Journal & Relics Modal */}
          {activeModal === 'journal' && (
            <JournalModal
              isOpen={true}
              onClose={() => setActiveModal(null)}
            />
          )}

          {/* Interactive Historical Puzzle Modal */}
          {activeModal === 'puzzle' && (
            <PuzzleModal
              puzzleId={activePuzzleId}
              onClose={() => {
                setActiveModal(null);
                setActivePuzzle(null);
              }}
            />
          )}

          {/* Clue Discovery Cinematic Modal */}
          {activeModal === 'cinematic' && <CinematicModal />}

          {/* AI Historical Guide Widget */}
          <AIGuideWidget
            isOpen={isGuideOpen}
            onClose={() => setIsGuideOpen(false)}
          />
        </>
      )}
    </div>
  );
}
