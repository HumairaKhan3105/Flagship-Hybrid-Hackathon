/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  GameView, PlayerProfile, CraftRegion, CulturalArtifact, 
  SavedArtwork, CharacterCustomization 
} from './types';
import { CRAFT_REGIONS, ALL_BADGES } from './data/craftsData';
import { sound } from './utils/soundEngine';

// Components
import { GameHUD } from './components/hud/GameHUD';
import { HomeScreen } from './components/views/HomeScreen';
import { GameWorld3D } from './components/3d/GameWorld3D';
import { PaintingStudio } from './components/minigames/PaintingStudio';
import { PatternPuzzle } from './components/minigames/PatternPuzzle';
import { ArtToStateMatch } from './components/minigames/ArtToStateMatch';
import { QuizModule } from './components/minigames/QuizModule';
import { WorldMapView } from './components/views/WorldMapView';
import { ArtworksGalleryView } from './components/views/ArtworksGalleryView';
import { CulturalMuseumView } from './components/views/CulturalMuseumView';
import { BadgesView } from './components/views/BadgesView';
import { CharacterCustomizerView } from './components/views/CharacterCustomizerView';

// Modals
import { ArtisanDialogueModal } from './components/modals/ArtisanDialogueModal';
import { ArtifactDiscoveryModal } from './components/modals/ArtifactDiscoveryModal';
import { LevelCompleteModal } from './components/modals/LevelCompleteModal';
import { SettingsModal } from './components/modals/SettingsModal';

const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Aarav',
  level: 1,
  xp: 0,
  completedCrafts: [],
  unlockedRegions: ['bihar_madhubani'],
  unlockedRegionIds: ['bihar_madhubani'],
  badges: [],
  unlockedBadgeIds: [],
  discoveredArtifactIds: [],
  collectedArtifactIds: [],
  savedArtworks: [],
  stats: {
    paintingsCreated: 0,
    puzzlesSolved: 0,
    quizzesCompleted: 0,
    artifactsFound: 0,
  },
  customization: {
    gender: 'male',
    skinTone: '#f59e0b',
    hairStyle: 'classic_crop',
    hairColor: '#18181b',
    outfit: 'kurta_stole',
    outfitColor: '#d97706',
    accessory: 'rudraksha',
    name: 'Aarav',
  },
};

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<GameView>('home');
  const [activeRegionId, setActiveRegionId] = useState<string>('bihar_madhubani');

  // Audio State
  const [isMusicMuted, setIsMusicMuted] = useState<boolean>(false);
  const [isSfxMuted, setIsSfxMuted] = useState<boolean>(false);

  // Modals & Active Overlays
  const [showArtisanDialogue, setShowArtisanDialogue] = useState<boolean>(false);
  const [discoveredArtifact, setDiscoveredArtifact] = useState<CulturalArtifact | null>(null);
  const [showLevelComplete, setShowLevelComplete] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [artworkToEdit, setArtworkToEdit] = useState<SavedArtwork | null>(null);

  // Mission Objective Tracking per Region
  const [missionProgress, setMissionProgress] = useState<{
    talkedToArtisan: boolean;
    paintingCompleted: boolean;
    puzzleSolved: boolean;
    quizCompleted: boolean;
  }>({
    talkedToArtisan: false,
    paintingCompleted: false,
    puzzleSolved: false,
    quizCompleted: false,
  });

  // Player Profile with LocalStorage
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    try {
      const cached = localStorage.getItem('kalayatra_player_profile');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === 'object') {
          return {
            ...DEFAULT_PROFILE,
            ...parsed,
            stats: {
              ...DEFAULT_PROFILE.stats,
              ...(parsed.stats || {}),
            },
            customization: {
              ...DEFAULT_PROFILE.customization,
              ...(parsed.customization || {}),
            },
            unlockedRegionIds:
              Array.isArray(parsed.unlockedRegionIds) && parsed.unlockedRegionIds.length > 0
                ? parsed.unlockedRegionIds
                : DEFAULT_PROFILE.unlockedRegionIds,
            unlockedBadgeIds: Array.isArray(parsed.unlockedBadgeIds)
              ? parsed.unlockedBadgeIds
              : DEFAULT_PROFILE.unlockedBadgeIds,
            collectedArtifactIds: Array.isArray(parsed.collectedArtifactIds)
              ? parsed.collectedArtifactIds
              : DEFAULT_PROFILE.collectedArtifactIds,
            savedArtworks: Array.isArray(parsed.savedArtworks)
              ? parsed.savedArtworks
              : DEFAULT_PROFILE.savedArtworks,
          };
        }
      }
    } catch (e) {
      console.error('Error loading cached profile', e);
    }
    return DEFAULT_PROFILE;
  });

  // Active Craft Region object
  const activeRegion = CRAFT_REGIONS.find((r) => r.id === activeRegionId) || CRAFT_REGIONS[0];

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('kalayatra_player_profile', JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  }, [profile]);

  // Audio State management
  const handleToggleMusic = () => {
    const muted = sound.toggleMusic();
    setIsMusicMuted(muted);
  };

  const handleToggleSfx = () => {
    const muted = sound.toggleSfx();
    setIsSfxMuted(muted);
  };

  // Badge Check Engine
  const checkAndAwardBadges = (updatedProfile: PlayerProfile) => {
    const newBadgeIds = [...updatedProfile.unlockedBadgeIds];

    // Check Young Artist: 1 painting saved
    if (updatedProfile.savedArtworks.length >= 1 && !newBadgeIds.includes('young_artist')) {
      newBadgeIds.push('young_artist');
      sound.playBadgeUnlocked();
    }

    // Check Heritage Explorer: 5 artifacts collected
    if (updatedProfile.collectedArtifactIds.length >= 5 && !newBadgeIds.includes('heritage_explorer')) {
      newBadgeIds.push('heritage_explorer');
      sound.playBadgeUnlocked();
    }

    // Check Puzzle Master: >= 2 regions unlocked or high xp
    if (updatedProfile.unlockedRegionIds.length >= 2 && !newBadgeIds.includes('puzzle_master')) {
      newBadgeIds.push('puzzle_master');
      sound.playBadgeUnlocked();
    }

    // Check Craft Collector: >= 3 regions
    if (updatedProfile.unlockedRegionIds.length >= 3 && !newBadgeIds.includes('craft_collector')) {
      newBadgeIds.push('craft_collector');
      sound.playBadgeUnlocked();
    }

    // Check Culture Keeper: >= 4 regions
    if (updatedProfile.unlockedRegionIds.length >= 4 && !newBadgeIds.includes('culture_keeper')) {
      newBadgeIds.push('culture_keeper');
      sound.playBadgeUnlocked();
    }

    return newBadgeIds;
  };

  // Level Up Calculator
  const calculateLevel = (xp: number) => {
    return Math.max(1, Math.floor(xp / 100) + 1);
  };

  // Add XP Helper
  const addXP = (amount: number) => {
    sound.playRewardXp();
    setProfile((prev) => {
      const newXp = prev.xp + amount;
      const newLevel = calculateLevel(newXp);
      const updated: PlayerProfile = {
        ...prev,
        xp: newXp,
        level: newLevel,
      };
      updated.unlockedBadgeIds = checkAndAwardBadges(updated);
      return updated;
    });
  };

  // Handle Artifact Discovery in 3D world
  const handleArtifactFound = (artifact: CulturalArtifact) => {
    setProfile((prev) => {
      if (prev.collectedArtifactIds.includes(artifact.id)) {
        return prev;
      }
      const updatedIds = [...prev.collectedArtifactIds, artifact.id];
      const newXp = prev.xp + 10;
      const updated: PlayerProfile = {
        ...prev,
        collectedArtifactIds: updatedIds,
        xp: newXp,
        level: calculateLevel(newXp),
      };
      updated.unlockedBadgeIds = checkAndAwardBadges(updated);
      return updated;
    });
    setDiscoveredArtifact(artifact);
  };

  // Handle Artisan Interaction in 3D world
  const handleMeetArtisan = () => {
    sound.playDialogueOpen();
    setMissionProgress((prev) => ({ ...prev, talkedToArtisan: true }));

    // Check if player has already completed painting, puzzle, and quiz
    const activeArtifactsCount = profile.collectedArtifactIds.filter((id) =>
      activeRegion.artifacts.some((a) => a.id === id)
    ).length;

    if (
      missionProgress.paintingCompleted &&
      missionProgress.puzzleSolved &&
      missionProgress.quizCompleted &&
      activeArtifactsCount >= activeRegion.artifacts.length
    ) {
      // Completed all regional objectives! Victory!
      handleCompleteLevel();
    } else {
      setShowArtisanDialogue(true);
    }
  };

  // Handle Saving Artwork from Studio
  const handleSaveArtwork = (artworkDataUrl: string, title: string) => {
    const newArtwork: SavedArtwork = {
      id: artworkToEdit ? artworkToEdit.id : `art_${Date.now()}`,
      region: activeRegion.state,
      craftName: activeRegion.craftName,
      title: title || `${activeRegion.craftName} Masterpiece`,
      createdAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      dataUrl: artworkDataUrl,
      score: 100,
    };

    setProfile((prev) => {
      const existingIdx = prev.savedArtworks.findIndex((a) => a.id === newArtwork.id);
      let updatedArtworks: SavedArtwork[];
      if (existingIdx >= 0) {
        updatedArtworks = [...prev.savedArtworks];
        updatedArtworks[existingIdx] = newArtwork;
      } else {
        updatedArtworks = [newArtwork, ...prev.savedArtworks];
      }

      const newXp = prev.xp + 50;
      const updated: PlayerProfile = {
        ...prev,
        savedArtworks: updatedArtworks,
        xp: newXp,
        level: calculateLevel(newXp),
      };
      updated.unlockedBadgeIds = checkAndAwardBadges(updated);
      return updated;
    });

    setMissionProgress((prev) => ({ ...prev, paintingCompleted: true }));
    setArtworkToEdit(null);
    setCurrentView('3d_world');
  };

  // Handle Pattern Puzzle Complete
  const handlePuzzleComplete = (score: number) => {
    addXP(30);
    setMissionProgress((prev) => ({ ...prev, puzzleSolved: true }));
  };

  // Handle Quiz Complete
  const handleQuizComplete = (score: number, total: number) => {
    addXP(score * 10);
    setMissionProgress((prev) => ({ ...prev, quizCompleted: true }));
    // Prompt to complete level if all requirements are done
    setTimeout(() => {
      handleCompleteLevel();
    }, 1200);
  };

  // Handle Level Completion and Unlock Next Region
  const handleCompleteLevel = () => {
    const currentIndex = CRAFT_REGIONS.findIndex((r) => r.id === activeRegionId);
    let nextRegionId: string | null = null;
    if (currentIndex < CRAFT_REGIONS.length - 1) {
      nextRegionId = CRAFT_REGIONS[currentIndex + 1].id;
    }

    setProfile((prev) => {
      const unlocked = [...prev.unlockedRegionIds];
      if (nextRegionId && !unlocked.includes(nextRegionId)) {
        unlocked.push(nextRegionId);
      }
      const newXp = prev.xp + 100;
      const updated: PlayerProfile = {
        ...prev,
        unlockedRegionIds: unlocked,
        xp: newXp,
        level: calculateLevel(newXp),
      };
      updated.unlockedBadgeIds = checkAndAwardBadges(updated);
      return updated;
    });

    setShowLevelComplete(true);
  };

  // Next Region Name helper for LevelCompleteModal
  const currentIndex = CRAFT_REGIONS.findIndex((r) => r.id === activeRegionId);
  const nextRegion = currentIndex < CRAFT_REGIONS.length - 1 ? CRAFT_REGIONS[currentIndex + 1] : null;

  // Handle Continue Journey from modal
  const handleContinueJourney = () => {
    setShowLevelComplete(false);
    if (nextRegion) {
      setActiveRegionId(nextRegion.id);
      setMissionProgress({
        talkedToArtisan: false,
        paintingCompleted: false,
        puzzleSolved: false,
        quizCompleted: false,
      });
      setCurrentView('3d_world');
    } else {
      setCurrentView('world_map');
    }
  };

  // Reset Progress Handler
  const handleResetProgress = () => {
    try {
      localStorage.removeItem('kalayatra_player_profile');
    } catch (e) {
      console.error(e);
    }
    setProfile(DEFAULT_PROFILE);
    setActiveRegionId('bihar_madhubani');
    setMissionProgress({
      talkedToArtisan: false,
      paintingCompleted: false,
      puzzleSolved: false,
      quizCompleted: false,
    });
    setShowSettingsModal(false);
    setCurrentView('home');
    sound.playClick();
  };

  // Edit artwork from gallery
  const handleEditArtworkFromGallery = (artwork: SavedArtwork) => {
    const reg = CRAFT_REGIONS.find((r) => r.craftName === artwork.craftName);
    if (reg) setActiveRegionId(reg.id);
    setArtworkToEdit(artwork);
    setCurrentView('painting_studio');
  };

  // Delete artwork from gallery
  const handleDeleteArtworkFromGallery = (id: string) => {
    setProfile((prev) => ({
      ...prev,
      savedArtworks: prev.savedArtworks.filter((a) => a.id !== id),
    }));
  };

  // Calculate active artifacts found in active region
  const activeRegionArtifactsCount = profile.collectedArtifactIds.filter((id) =>
    activeRegion.artifacts.some((a) => a.id === id)
  ).length;

  return (
    <div className="relative w-screen h-screen bg-[#1c120c] text-[#fdfbf7] overflow-hidden font-sans">
      {/* 1. HOME SCREEN */}
      {currentView === 'home' && (
        <HomeScreen
          profile={profile}
          activeRegion={activeRegion}
          onNavigate={(view) => setCurrentView(view)}
          isMusicMuted={isMusicMuted}
          isSfxMuted={isSfxMuted}
          onToggleMusic={handleToggleMusic}
          onToggleSfx={handleToggleSfx}
          onOpenSettings={() => setShowSettingsModal(true)}
        />
      )}

      {/* 2. 3D EXPLORATION WORLD */}
      {currentView === '3d_world' && (
        <div className="relative w-full h-full">
          <GameWorld3D
            region={activeRegion}
            profile={profile}
            characterCustomization={profile.customization}
            onMeetArtisan={handleMeetArtisan}
            onEnterPaintingStudio={() => setCurrentView('painting_studio')}
            onEnterPatternPuzzle={() => setCurrentView('pattern_puzzle')}
            onEnterQuiz={() => setCurrentView('quiz')}
            onDiscoverArtifact={handleArtifactFound}
          />

          {/* Persistent Game HUD */}
          <GameHUD
            profile={profile}
            activeRegion={activeRegion}
            currentView={currentView}
            isMusicMuted={isMusicMuted}
            isSfxMuted={isSfxMuted}
            onToggleMusic={handleToggleMusic}
            onToggleSfx={handleToggleSfx}
            onOpenMap={() => setCurrentView('world_map')}
            onOpenHome={() => setCurrentView('home')}
            onOpenGallery={() => setCurrentView('artworks_gallery')}
            onOpenBadges={() => setCurrentView('badges')}
            onOpenSettings={() => setShowSettingsModal(true)}
            missionProgress={{
              talkedToArtisan: missionProgress.talkedToArtisan,
              artifactsCollected: activeRegionArtifactsCount,
              totalArtifacts: activeRegion.artifacts.length,
              paintingCompleted: missionProgress.paintingCompleted,
              puzzleSolved: missionProgress.puzzleSolved,
              quizCompleted: missionProgress.quizCompleted,
            }}
          />
        </div>
      )}

      {/* 3. PAINTING STUDIO */}
      {currentView === 'painting_studio' && (
        <PaintingStudio
          region={activeRegion}
          initialImage={artworkToEdit?.dataUrl}
          onSaveArtwork={handleSaveArtwork}
          onBackToWorld={() => {
            setArtworkToEdit(null);
            setCurrentView('3d_world');
          }}
        />
      )}

      {/* 4. PATTERN PUZZLE MINI-GAME */}
      {currentView === 'pattern_puzzle' && (
        <PatternPuzzle
          region={activeRegion}
          onPuzzleComplete={handlePuzzleComplete}
          onBackToWorld={() => setCurrentView('3d_world')}
        />
      )}

      {/* 5. MATCH ART TO STATE MINI-GAME */}
      {currentView === 'match_art_game' && (
        <ArtToStateMatch
          onComplete={(xp) => addXP(xp)}
          onBackToWorld={() => setCurrentView('home')}
        />
      )}

      {/* 6. KNOWLEDGE QUIZ */}
      {currentView === 'quiz' && (
        <QuizModule
          region={activeRegion}
          onQuizComplete={handleQuizComplete}
          onBackToWorld={() => setCurrentView('3d_world')}
        />
      )}

      {/* 7. WORLD MAP (CULTURAL MAP OF INDIA) */}
      {currentView === 'world_map' && (
        <WorldMapView
          unlockedRegionIds={profile.unlockedRegionIds}
          activeRegionId={activeRegionId}
          onSelectRegion={(reg) => {
            setActiveRegionId(reg.id);
            setCurrentView('3d_world');
          }}
          onBack={() => setCurrentView('home')}
        />
      )}

      {/* 8. ARTWORKS GALLERY */}
      {currentView === 'artworks_gallery' && (
        <ArtworksGalleryView
          artworks={profile.savedArtworks}
          onEditArtwork={handleEditArtworkFromGallery}
          onDeleteArtwork={handleDeleteArtworkFromGallery}
          onNewPainting={() => {
            setArtworkToEdit(null);
            setCurrentView('painting_studio');
          }}
          onBack={() => setCurrentView('home')}
        />
      )}

      {/* 9. NATIONAL CULTURAL MUSEUM */}
      {currentView === 'museum' && (
        <CulturalMuseumView
          unlockedRegionIds={profile.unlockedRegionIds}
          onBack={() => setCurrentView('home')}
        />
      )}

      {/* 10. BADGES TROPHY HALL */}
      {currentView === 'badges' && (
        <BadgesView
          unlockedBadgeIds={profile.unlockedBadgeIds}
          onBack={() => setCurrentView('home')}
        />
      )}

      {/* 11. CHARACTER CUSTOMIZER */}
      {currentView === 'character_customizer' && (
        <CharacterCustomizerView
          customization={profile.customization}
          onSaveCustomization={(updated) => {
            setProfile((prev) => ({
              ...prev,
              name: updated.name || prev.name,
              customization: updated,
            }));
          }}
          onBack={() => setCurrentView('home')}
        />
      )}

      {/* MODAL: SETTINGS (Audio Sliders & Reset Progress) */}
      {showSettingsModal && (
        <SettingsModal
          isMusicMuted={isMusicMuted}
          isSfxMuted={isSfxMuted}
          onToggleMusic={handleToggleMusic}
          onToggleSfx={handleToggleSfx}
          onResetProgress={handleResetProgress}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {/* MODAL: ARTISAN DIALOGUE */}
      {showArtisanDialogue && (
        <ArtisanDialogueModal
          region={activeRegion}
          onClose={() => setShowArtisanDialogue(false)}
          onStartPainting={() => {
            setShowArtisanDialogue(false);
            setCurrentView('painting_studio');
          }}
          onStartPuzzle={() => {
            setShowArtisanDialogue(false);
            setCurrentView('pattern_puzzle');
          }}
        />
      )}

      {/* MODAL: ARTIFACT DISCOVERY */}
      {discoveredArtifact && (
        <ArtifactDiscoveryModal
          artifact={discoveredArtifact}
          onClose={() => setDiscoveredArtifact(null)}
        />
      )}

      {/* MODAL: LEVEL COMPLETION */}
      {showLevelComplete && (
        <LevelCompleteModal
          region={activeRegion}
          profile={profile}
          nextRegionName={nextRegion ? `${nextRegion.craftName} (${nextRegion.state})` : undefined}
          onContinueJourney={handleContinueJourney}
        />
      )}
    </div>
  );
}
