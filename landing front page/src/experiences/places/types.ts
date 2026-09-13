export type LocationId = 
  | 'bazaar'
  | 'virupaksha'
  | 'vitthala'
  | 'stone_chariot'
  | 'lotus_mahal'
  | 'royal_enclosure';

export interface MonumentInfo {
  id: LocationId;
  name: string;
  kannadaName: string;
  tagline: string;
  description: string;
  detailedHistory: string;
  historicalPeriod: string;
  rulerAssociation: string;
  architecturalStyle: string;
  coordinates: [number, number]; // x, y on ancient parchment map (0-100 scale)
  worldPosition: [number, number, number]; // 3D world coordinates [x, y, z]
  unlockRequirementText: string;
  unlockedByDefault: boolean;
  clueIds: string[];
  puzzleId?: string;
  keyFeatures: string[];
}

export interface Clue {
  id: string;
  title: string;
  locationId: LocationId;
  locationName: string;
  status: 'locked' | 'discovered';
  icon: string;
  category: 'inscription' | 'architecture' | 'royal_seal' | 'map' | 'artifact';
  shortDescription: string;
  historicalContext: string;
  secretRevelation: string;
  discoveryDate?: string;
}

export interface Artifact {
  id: string;
  name: string;
  period: string;
  material: string;
  rarity: 'Common' | 'Rare' | 'Royal' | 'Sacred';
  description: string;
  historicalFact: string;
  icon: string;
  unlocked: boolean;
}

export interface QuestStep {
  id: string;
  description: string;
  isCompleted: boolean;
  targetLocation?: LocationId;
  interactionTargetId?: string;
}

export interface Quest {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  objective: string;
  locationId: LocationId;
  steps: QuestStep[];
  rewardXP: number;
  unlockedClueId?: string;
  unlockedLocationId?: LocationId;
  unlocksPuzzleId?: string;
  historicalNarration: string;
  completed: boolean;
}

export interface InteractiveWorldObject {
  id: string;
  title: string;
  type: 'clue' | 'puzzle_trigger' | 'lore' | 'chest' | 'chariot_component';
  position: [number, number, number];
  rotation?: [number, number, number];
  interactionRadius: number;
  promptText: string;
  associatedClueId?: string;
  associatedPuzzleId?: string;
  alreadyInteracted?: boolean;
}

export interface HistoricalFigure {
  name: string;
  title: string;
  reign: string;
  description: string;
  quote: string;
  influence: string;
  unlocked: boolean;
}

export type ActiveModal = 
  | 'map' 
  | 'journal' 
  | 'puzzle' 
  | 'settings' 
  | 'collection' 
  | 'cinematic'
  | 'help'
  | null;

export interface ChatMessage {
  id: string;
  sender: 'player' | 'guide' | 'system';
  text: string;
  timestamp: string;
}

export interface PlayerStats {
  health: number;
  maxHealth: number;
  xp: number;
  level: number;
  score: number;
  hintsRemaining: number;
}

export interface Puzzle {
  id: string;
  title: string;
  locationName: string;
  type: 'architecture_cipher' | 'inscription_decoder' | 'timeline_ordering' | 'stone_chariot_rotator';
  difficulty: 'Apprentice' | 'Scholar' | 'Master' | 'Sacred';
  instructions: string;
  hint: string;
  rewardXP: number;
}
