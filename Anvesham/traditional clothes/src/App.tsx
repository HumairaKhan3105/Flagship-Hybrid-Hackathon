import { useState, useEffect } from 'react';
import { GameScreen, PlayerProfile, Region, Garment } from './types';
import { 
  INITIAL_REGIONS, 
  INITIAL_GARMENTS, 
  WEAVER_LEVELS, 
  QUIZ_QUESTIONS 
} from './data/gameData';
import { soundManager } from './utils/audio';

// HUD & Navigation
import GameHUD from './components/HUD/GameHUD';
import BottomNav from './components/HUD/BottomNav';

// Screens
import WelcomeScreen from './components/Screens/WelcomeScreen';
import IndiaMap3D from './components/ThreeCanvas/IndiaMap3D';
import StoryScreen from './components/Screens/StoryScreen';
import WeaversChallengeScreen from './components/Screens/WeaversChallengeScreen';
import QuizScreen from './components/Screens/QuizScreen';
import WardrobeScreen from './components/Screens/WardrobeScreen';
import TimelineScreen from './components/Screens/TimelineScreen';
import GrandChallengeScreen from './components/Screens/GrandChallengeScreen';

// 3D Canvas & Modals
import UnlockAnimation3D from './components/ThreeCanvas/UnlockAnimation3D';
import SahanaGuideModal from './components/Modals/SahanaGuideModal';
import SettingsModal from './components/Modals/SettingsModal';

const INITIAL_PLAYER_PROFILE: PlayerProfile = {
  name: 'Explorer Aryavart',
  rankTitle: 'Imperial Textile Seeker',
  level: 1,
  points: 1250,
  lives: 5,
  maxLives: 5,
  unlockedGarments: ['banarasi_saree', 'kanchipuram'],
  discoveredRegions: ['uttar_pradesh', 'rajasthan', 'tamil_nadu'],
  completedQuizzes: [],
  completedWeaverLevels: [],
  grandChallengeUnlocked: false,
  grandChallengeMastered: false,
  soundEnabled: true,
  musicEnabled: true,
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('welcome');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('uttar_pradesh');
  const [selectedGarmentId, setSelectedGarmentId] = useState<string>('banarasi_saree');
  
  // Game progression indices
  const [weaverLevelIndex, setWeaverLevelIndex] = useState<number>(0);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState<number>(0);

  // Modals & Unlock States
  const [unlockedCelebrationGarment, setUnlockedCelebrationGarment] = useState<Garment | null>(null);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Player state with localStorage initialization
  const [player, setPlayer] = useState<PlayerProfile>(() => {
    const saved = localStorage.getItem('vastra_yatra_player');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PLAYER_PROFILE;
      }
    }
    return INITIAL_PLAYER_PROFILE;
  });

  // Sync player profile to localStorage
  useEffect(() => {
    localStorage.setItem('vastra_yatra_player', JSON.stringify(player));
  }, [player]);

  const selectedRegion = INITIAL_REGIONS.find(r => r.id === selectedRegionId) || INITIAL_REGIONS[0];
  const selectedGarment = INITIAL_GARMENTS.find(g => g.id === selectedGarmentId) || INITIAL_GARMENTS[0];
  const currentWeaverLevel = WEAVER_LEVELS[weaverLevelIndex] || WEAVER_LEVELS[0];
  const currentQuizQuestion = QUIZ_QUESTIONS[quizQuestionIndex] || QUIZ_QUESTIONS[0];

  // Sound toggle handler
  const handleToggleSound = () => {
    const newState = !player.soundEnabled;
    soundManager.setEnabled(newState);
    setPlayer(prev => ({ ...prev, soundEnabled: newState }));
  };

  // Reset Game handler
  const handleResetGame = () => {
    localStorage.removeItem('vastra_yatra_player');
    setPlayer(INITIAL_PLAYER_PROFILE);
    setWeaverLevelIndex(0);
    setQuizQuestionIndex(0);
    setCurrentScreen('welcome');
  };

  // Lose life handler
  const handleFailLife = () => {
    setPlayer(prev => {
      const newLives = Math.max(0, prev.lives - 1);
      return {
        ...prev,
        lives: newLives === 0 ? prev.maxLives : newLives, // restore if depleted
      };
    });
  };

  // Challenge Success -> Trigger 3D Unlock
  const handleChallengeSuccess = (rewardPoints: number = 100) => {
    // Pick the garment to unlock
    const garmentToUnlock = selectedGarment;

    setPlayer(prev => ({
      ...prev,
      points: prev.points + rewardPoints,
      unlockedGarments: prev.unlockedGarments.includes(garmentToUnlock.id)
        ? prev.unlockedGarments
        : [...prev.unlockedGarments, garmentToUnlock.id],
      discoveredRegions: prev.discoveredRegions.includes(selectedRegion.id)
        ? prev.discoveredRegions
        : [...prev.discoveredRegions, selectedRegion.id],
    }));

    setUnlockedCelebrationGarment(garmentToUnlock);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#060a12] text-stone-100 flex flex-col font-sans">
      {/* Top Royal Game HUD */}
      <GameHUD
        player={player}
        currentScreen={currentScreen}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onToggleSound={handleToggleSound}
      />

      {/* Screen Router Viewport */}
      <main className="relative flex-1 flex flex-col w-full h-full overflow-hidden">
        {currentScreen === 'welcome' && (
          <WelcomeScreen
            player={player}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        )}

        {currentScreen === 'map' && (
          <IndiaMap3D
            regions={INITIAL_REGIONS}
            selectedRegionId={selectedRegionId}
            onSelectRegion={(region) => setSelectedRegionId(region.id)}
            onEnterStory={(region) => {
              setSelectedRegionId(region.id);
              // Find matching garment
              const matchingGarment = INITIAL_GARMENTS.find(g => g.regionId === region.id) || INITIAL_GARMENTS[0];
              setSelectedGarmentId(matchingGarment.id);
              setCurrentScreen('story');
            }}
          />
        )}

        {currentScreen === 'story' && (
          <StoryScreen
            region={selectedRegion}
            garment={selectedGarment}
            onEnterChallenge={() => setCurrentScreen('weaver')}
            onOpenTimeline={() => setCurrentScreen('timeline')}
            onOpenGuide={() => setIsGuideModalOpen(true)}
          />
        )}

        {currentScreen === 'weaver' && (
          <WeaversChallengeScreen
            level={currentWeaverLevel}
            player={player}
            onSuccess={() => {
              handleChallengeSuccess(currentWeaverLevel.pointsReward);
              setWeaverLevelIndex((prev) => (prev + 1) % WEAVER_LEVELS.length);
            }}
            onFailLife={handleFailLife}
          />
        )}

        {currentScreen === 'quiz' && (
          <QuizScreen
            question={currentQuizQuestion}
            player={player}
            onAnswerCorrect={() => {
              handleChallengeSuccess(currentQuizQuestion.pointsReward);
              setQuizQuestionIndex((prev) => (prev + 1) % QUIZ_QUESTIONS.length);
            }}
            onAnswerWrong={handleFailLife}
          />
        )}

        {currentScreen === 'collection' && (
          <WardrobeScreen
            garments={INITIAL_GARMENTS}
            player={player}
          />
        )}

        {currentScreen === 'timeline' && (
          <TimelineScreen />
        )}

        {currentScreen === 'grand-challenge' && (
          <GrandChallengeScreen
            player={player}
            onCompleteGrandChallenge={() => {
              setPlayer(prev => ({
                ...prev,
                points: prev.points + 500,
                rankTitle: 'Imperial Textile Historian',
                level: prev.level + 1,
              }));
            }}
            onFailLife={handleFailLife}
          />
        )}
      </main>

      {/* Persistent Bottom Royal Navigation */}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={(screen) => setCurrentScreen(screen)}
      />

      {/* Dramatic 3D Unlock Modal */}
      {unlockedCelebrationGarment && (
        <UnlockAnimation3D
          garment={unlockedCelebrationGarment}
          onContinue={() => {
            setUnlockedCelebrationGarment(null);
            setCurrentScreen('collection');
          }}
          onAddToCollection={() => {
            setUnlockedCelebrationGarment(null);
            setCurrentScreen('collection');
          }}
        />
      )}

      {/* Sahana AI Culture Guide Modal */}
      {isGuideModalOpen && (
        <SahanaGuideModal
          garment={selectedGarment}
          region={selectedRegion}
          onClose={() => setIsGuideModalOpen(false)}
        />
      )}

      {/* Game Settings & Rules Modal */}
      {isSettingsModalOpen && (
        <SettingsModal
          player={player}
          onClose={() => setIsSettingsModalOpen(false)}
          onToggleSound={handleToggleSound}
          onResetGame={handleResetGame}
        />
      )}
    </div>
  );
}
