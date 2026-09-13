import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameCategory, UserProgress } from './types';
import { StorageService } from './utils/storage';
import { soundEngine } from './utils/audio';
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { LevelMapScreen } from './components/LevelMapScreen';
import { GameplayEngine } from './components/GameplayEngine';
import { ProfileScreen } from './components/ProfileScreen';
import { BadgesScreen } from './components/BadgesScreen';
import { FactBookScreen } from './components/FactBookScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { DailyChallengeModal } from './components/DailyChallengeModal';
import { SettingsModal } from './components/SettingsModal';
import { getLevel } from './data/levels';

type AppScreen = 'home' | 'map' | 'game' | 'profile' | 'badges' | 'facts' | 'leaderboard';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => StorageService.loadProgress());
  const [activeScreen, setActiveScreen] = useState<AppScreen>('home');
  const [activeCategory, setActiveCategory] = useState<GameCategory>('festivals');
  const [activeLevelNum, setActiveLevelNum] = useState<number>(1);
  const [isDailyOpen, setIsDailyOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync state on load
  useEffect(() => {
    const loaded = StorageService.loadProgress();
    setProgress(loaded);
  }, []);

  // Category selection handler
  const handleSelectCategory = (cat: GameCategory) => {
    setActiveCategory(cat);
    setActiveScreen('map');
  };

  // Launch direct level
  const handleSelectLevel = (cat: GameCategory, levelNum: number) => {
    setActiveCategory(cat);
    setActiveLevelNum(levelNum);
    setActiveScreen('game');
  };

  // Start adventure (resumes next unplayed level in active category or launches level 1)
  const handleStartAdventure = () => {
    const catProgress = progress.categoryProgress[activeCategory];
    const nextLvl = catProgress?.currentLevel || 1;
    setActiveLevelNum(nextLvl);
    setActiveScreen('game');
  };

  // When a level is completed in the gameplay engine
  const handleCompleteLevel = (stars: number, xpGained: number, coinsGained: number) => {
    const prevRank = progress.rankTitle;
    const updated = StorageService.completeLevel(
      activeCategory,
      activeLevelNum,
      stars,
      xpGained,
      coinsGained
    );
    setProgress(updated);

    if (updated.rankTitle !== prevRank) {
      soundEngine.playLevelUp();
    }
  };

  // Move to next level in trail
  const handleNextLevel = () => {
    if (activeLevelNum < 50) {
      setActiveLevelNum((prev) => prev + 1);
    } else {
      // Completed all 50 levels of category!
      setActiveScreen('map');
    }
  };

  // Daily Challenge claim handler
  const handleClaimDaily = (xp: number, coins: number) => {
    const updated = StorageService.addRewards(xp, coins);
    // Extend streak
    updated.streak += 1;
    StorageService.saveProgress(updated);
    setProgress({ ...updated });
  };

  // Claim Badge Reward handler
  const handleClaimBadge = (badgeId: string, xp: number, coins: number) => {
    const updated = StorageService.unlockBadge(badgeId);
    const withRewards = StorageService.addRewards(xp, coins);
    setProgress(withRewards);
  };

  // Reset Progress
  const handleResetProgress = () => {
    const reset = StorageService.resetProgress();
    setProgress(reset);
    setActiveScreen('home');
  };

  // Current level data for gameplay
  const currentLevelData = getLevel(activeCategory, activeLevelNum);

  return (
    <div className="min-h-screen bg-[#FDF5E6] text-[#4A3728] flex flex-col font-sans selection:bg-[#D4AF37] selection:text-[#5D4037] relative">
      {/* Subtle Natural Tones Radial Texture */}
      <div 
        className="fixed inset-0 opacity-5 pointer-events-none z-0" 
        style={{ backgroundImage: 'radial-gradient(#5D4037 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
      />

      {/* Top Universal App Header */}
      <Header
        progress={progress}
        activeScreen={activeScreen}
        onNavigate={(screen) => setActiveScreen(screen)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDaily={() => setIsDailyOpen(true)}
      />

      {/* Main Screen Container with Page Transition */}
      <main className="flex-1 w-full pb-10 z-10 relative">
        <AnimatePresence mode="wait">
          {activeScreen === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <HomeScreen
                progress={progress}
                onSelectCategory={handleSelectCategory}
                onStartAdventure={handleStartAdventure}
                onOpenDaily={() => setIsDailyOpen(true)}
                onNavigate={(screen) => setActiveScreen(screen)}
              />
            </motion.div>
          )}

          {activeScreen === 'map' && (
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <LevelMapScreen
                progress={progress}
                activeCategory={activeCategory}
                onSelectCategory={(cat) => setActiveCategory(cat)}
                onSelectLevel={handleSelectLevel}
                onBack={() => setActiveScreen('home')}
              />
            </motion.div>
          )}

          {activeScreen === 'game' && currentLevelData && (
            <motion.div
              key={`game-${activeCategory}-${activeLevelNum}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <GameplayEngine
                level={currentLevelData}
                progress={progress}
                onCompleteLevel={handleCompleteLevel}
                onNextLevel={handleNextLevel}
                onExit={() => setActiveScreen('map')}
              />
            </motion.div>
          )}

          {activeScreen === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <ProfileScreen
                progress={progress}
                onBack={() => setActiveScreen('home')}
              />
            </motion.div>
          )}

          {activeScreen === 'badges' && (
            <motion.div
              key="badges"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <BadgesScreen
                progress={progress}
                onClaimBadge={handleClaimBadge}
                onBack={() => setActiveScreen('home')}
              />
            </motion.div>
          )}

          {activeScreen === 'facts' && (
            <motion.div
              key="facts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <FactBookScreen onBack={() => setActiveScreen('home')} />
            </motion.div>
          )}

          {activeScreen === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <LeaderboardScreen
                progress={progress}
                onBack={() => setActiveScreen('home')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Daily Challenge Modal */}
      <DailyChallengeModal
        progress={progress}
        isOpen={isDailyOpen}
        onClose={() => setIsDailyOpen(false)}
        onClaimDaily={handleClaimDaily}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onResetProgress={handleResetProgress}
      />

      {/* Footer copyright */}
      <footer className="w-full py-4 bg-[#FDF5E6] border-t-4 border-[#5D4037] text-center text-xs text-[#8D6E63] font-bold z-20">
        <p>Culture Detective — Discover India Through Games • 300+ Cultural Challenges Across 28 States</p>
      </footer>
    </div>
  );
}
