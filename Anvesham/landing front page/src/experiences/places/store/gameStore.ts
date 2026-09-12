import { create } from 'zustand';
import { LocationId, ActiveModal, InteractiveWorldObject, Clue, Artifact, Quest } from '../types';
import { MONUMENTS } from '../data/monuments';
import { INITIAL_CLUES, INITIAL_ARTIFACTS, QUESTS } from '../data/quests';
import { soundService } from '../services/soundService';
import { gameApi } from '../services/gameApi';

export interface CinematicData {
  title: string;
  subtitle: string;
  narration: string;
  historicalEra: string;
  clueId?: string;
  onComplete?: () => void;
}

interface GameState {
  // Game Screen Flow
  screen: 'menu' | 'intro' | 'playing' | 'ending';
  activeModal: ActiveModal;
  activePuzzleId: string | null;
  cinematicData: CinematicData | null;

  // Exploration & World
  currentLocation: LocationId;
  unlockedLocations: LocationId[];
  nearbyInteractiveObject: InteractiveWorldObject | null;
  playerPosition: [number, number, number];

  // Progression & Lore
  quests: Quest[];
  currentQuestIndex: number;
  clues: Clue[];
  artifacts: Artifact[];
  solvedPuzzles: string[];

  // Stats
  health: number;
  maxHealth: number;
  xp: number;
  level: number;
  score: number;
  hintsRemaining: number;

  // Audio & Settings
  isMuted: boolean;
  graphicsQuality: 'high' | 'medium' | 'low';

  // Actions
  startAdventure: () => void;
  skipIntro: () => void;
  returnToMenu: () => void;
  moveToLocation: (locationId: LocationId) => void;
  unlockLocation: (locationId: LocationId) => void;
  setNearbyInteractiveObject: (obj: InteractiveWorldObject | null) => void;
  setPlayerPosition: (pos: [number, number, number]) => void;

  interactWithCurrentObject: () => void;
  discoverClue: (clueId: string) => void;
  collectArtifact: (artifactId: string) => void;
  completeQuest: (questId: string) => void;
  advanceQuestStep: (questId: string, stepId: string) => void;
  solvePuzzle: (puzzleId: string) => void;
  addXP: (amount: number) => void;
  useHint: () => boolean;

  setActiveModal: (modal: ActiveModal) => void;
  setActivePuzzle: (puzzleId: string | null) => void;
  triggerCinematic: (data: CinematicData) => void;
  closeCinematic: () => void;
  toggleMute: () => void;
  resetProgress: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  screen: 'menu',
  activeModal: null,
  activePuzzleId: null,
  cinematicData: null,

  currentLocation: 'bazaar',
  unlockedLocations: ['bazaar'],
  nearbyInteractiveObject: null,
  playerPosition: [0, 0, 0],

  quests: QUESTS,
  currentQuestIndex: 0,
  clues: INITIAL_CLUES,
  artifacts: INITIAL_ARTIFACTS,
  solvedPuzzles: [],

  health: 100,
  maxHealth: 100,
  xp: 0,
  level: 1,
  score: 0,
  hintsRemaining: 5,

  isMuted: false,
  graphicsQuality: 'high',

  startAdventure: () => {
    soundService.startAmbient();
    set({ screen: 'intro', activeModal: null });
  },

  skipIntro: () => {
    set({ screen: 'playing', activeModal: null });
  },

  returnToMenu: () => {
    set({ screen: 'menu', activeModal: null });
  },

  moveToLocation: (locationId: LocationId) => {
    const monument = MONUMENTS[locationId];
    if (!monument) return;

    soundService.playStoneInteract();
    set({
      currentLocation: locationId,
      playerPosition: [...monument.worldPosition] as [number, number, number],
      activeModal: null
    });
  },

  unlockLocation: (locationId: LocationId) => {
    const { unlockedLocations } = get();
    if (!unlockedLocations.includes(locationId)) {
      set({ unlockedLocations: [...unlockedLocations, locationId] });
      soundService.playDiscovery();
    }
  },

  setNearbyInteractiveObject: (obj) => {
    set({ nearbyInteractiveObject: obj });
  },

  setPlayerPosition: (pos) => {
    set({ playerPosition: pos });
  },

  interactWithCurrentObject: () => {
    const { nearbyInteractiveObject, quests, currentQuestIndex } = get();
    if (!nearbyInteractiveObject) return;

    soundService.playStoneInteract();

    // Trigger associated clue or puzzle
    if (nearbyInteractiveObject.associatedPuzzleId) {
      set({ activePuzzleId: nearbyInteractiveObject.associatedPuzzleId, activeModal: 'puzzle' });
      return;
    }

    if (nearbyInteractiveObject.associatedClueId) {
      get().discoverClue(nearbyInteractiveObject.associatedClueId);
    }

    // Advance quest step if linked
    const currentQuest = quests[currentQuestIndex];
    if (currentQuest) {
      const stepToComplete = currentQuest.steps.find(
        s => s.interactionTargetId === nearbyInteractiveObject.id && !s.isCompleted
      );
      if (stepToComplete) {
        get().advanceQuestStep(currentQuest.id, stepToComplete.id);
      }
    }
  },

  discoverClue: (clueId: string) => {
    const { clues, quests, currentQuestIndex } = get();
    const clueIndex = clues.findIndex(c => c.id === clueId);
    if (clueIndex === -1) return;

    if (clues[clueIndex].status === 'discovered') return; // already found

    const updatedClues = [...clues];
    updatedClues[clueIndex] = {
      ...updatedClues[clueIndex],
      status: 'discovered',
      discoveryDate: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    soundService.playDiscovery();

    // Trigger cinematic flashback
    const clue = updatedClues[clueIndex];
    set({
      clues: updatedClues,
      score: get().score + 200
    });
    get().addXP(100);

    get().triggerCinematic({
      title: `ECHO OF VIJAYANAGARA`,
      subtitle: clue.title,
      narration: clue.secretRevelation,
      historicalEra: '16th Century Golden Age',
      clueId: clue.id
    });

    // Check current quest completion requirement
    const currentQuest = quests[currentQuestIndex];
    if (currentQuest && currentQuest.unlockedClueId === clueId) {
      get().completeQuest(currentQuest.id);
    }

    gameApi.savePlayerProgress(get());
  },

  collectArtifact: (artifactId: string) => {
    const { artifacts } = get();
    const updated = artifacts.map(a => a.id === artifactId ? { ...a, unlocked: true } : a);
    soundService.playDiscovery();
    set({ artifacts: updated, score: get().score + 150 });
    get().addXP(75);
    gameApi.savePlayerProgress(get());
  },

  advanceQuestStep: (questId: string, stepId: string) => {
    const { quests } = get();
    const questIndex = quests.findIndex(q => q.id === questId);
    if (questIndex === -1) return;

    const quest = quests[questIndex];
    const updatedSteps = quest.steps.map(s => s.id === stepId ? { ...s, isCompleted: true } : s);
    const allCompleted = updatedSteps.every(s => s.isCompleted);

    const updatedQuests = [...quests];
    updatedQuests[questIndex] = {
      ...quest,
      steps: updatedSteps,
      completed: allCompleted
    };

    set({ quests: updatedQuests });

    if (allCompleted) {
      get().completeQuest(questId);
    }
  },

  completeQuest: (questId: string) => {
    const { quests, currentQuestIndex, unlockedLocations } = get();
    const questIndex = quests.findIndex(q => q.id === questId);
    if (questIndex === -1) return;

    const quest = quests[questIndex];
    if (quest.completed && currentQuestIndex > questIndex) return; // already processed

    const updatedQuests = [...quests];
    updatedQuests[questIndex] = {
      ...quest,
      completed: true,
      steps: quest.steps.map(s => ({ ...s, isCompleted: true }))
    };

    get().addXP(quest.rewardXP);
    soundService.playPuzzleSuccess();

    // Unlock location if provided
    let newUnlockedLocations = [...unlockedLocations];
    if (quest.unlockedLocationId && !newUnlockedLocations.includes(quest.unlockedLocationId)) {
      newUnlockedLocations.push(quest.unlockedLocationId);
    }

    const nextQuestIndex = Math.min(currentQuestIndex + 1, quests.length - 1);

    // If final quest completed -> victory screen!
    if (quest.id === 'quest_06') {
      set({
        quests: updatedQuests,
        unlockedLocations: newUnlockedLocations,
        screen: 'ending'
      });
      return;
    }

    set({
      quests: updatedQuests,
      currentQuestIndex: nextQuestIndex,
      unlockedLocations: newUnlockedLocations
    });

    gameApi.savePlayerProgress(get());
  },

  solvePuzzle: (puzzleId: string) => {
    const { solvedPuzzles, quests, currentQuestIndex } = get();
    if (solvedPuzzles.includes(puzzleId)) return;

    soundService.playPuzzleSuccess();
    const newSolved = [...solvedPuzzles, puzzleId];
    set({
      solvedPuzzles: newSolved,
      activePuzzleId: null,
      activeModal: null,
      score: get().score + 350
    });
    get().addXP(200);

    // Advance quests waiting for this puzzle
    const currentQuest = quests[currentQuestIndex];
    if (currentQuest) {
      if (currentQuest.unlocksPuzzleId === puzzleId || puzzleId.includes(currentQuest.locationId)) {
        if (currentQuest.unlockedClueId) {
          get().discoverClue(currentQuest.unlockedClueId);
        }
        get().completeQuest(currentQuest.id);
      }
    }

    gameApi.savePlayerProgress(get());
  },

  addXP: (amount: number) => {
    const { xp, level } = get();
    const newXP = xp + amount;
    const newLevel = Math.floor(newXP / 300) + 1;
    if (newLevel > level) {
      soundService.playDiscovery();
    }
    set({ xp: newXP, level: newLevel });
  },

  useHint: () => {
    const { hintsRemaining } = get();
    if (hintsRemaining <= 0) return false;
    set({ hintsRemaining: hintsRemaining - 1 });
    return true;
  },

  setActiveModal: (modal) => {
    if (modal) soundService.playStoneInteract();
    set({ activeModal: modal });
  },

  setActivePuzzle: (puzzleId) => {
    set({ activePuzzleId: puzzleId, activeModal: puzzleId ? 'puzzle' : null });
  },

  triggerCinematic: (data) => {
    set({ cinematicData: data, activeModal: 'cinematic' });
  },

  closeCinematic: () => {
    const cb = get().cinematicData?.onComplete;
    set({ cinematicData: null, activeModal: null });
    if (cb) cb();
  },

  toggleMute: () => {
    const nextMuted = !get().isMuted;
    soundService.setMuted(nextMuted);
    set({ isMuted: nextMuted });
  },

  resetProgress: () => {
    localStorage.removeItem('hampi_echoes_save');
    set({
      screen: 'menu',
      activeModal: null,
      activePuzzleId: null,
      cinematicData: null,
      currentLocation: 'bazaar',
      unlockedLocations: ['bazaar'],
      quests: QUESTS,
      currentQuestIndex: 0,
      clues: INITIAL_CLUES,
      artifacts: INITIAL_ARTIFACTS,
      solvedPuzzles: [],
      xp: 0,
      level: 1,
      score: 0,
      hintsRemaining: 5
    });
  }
}));
