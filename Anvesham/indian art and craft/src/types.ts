export interface CharacterCustomization {
  gender: 'male' | 'female' | 'neutral';
  skinTone: string;
  hairStyle: 'classic' | 'curly' | 'braid' | 'short' | 'classic_crop';
  hairColor: string;
  outfit: 'kurta_stole' | 'dhoti_vest' | 'saree_dupatta' | 'heritage_jacket';
  outfitColor: string;
  accessory: 'none' | 'pagdi' | 'angavastram' | 'satchel' | 'rudraksha';
  name: string;
}

export interface PlayerProfile {
  name: string;
  customization: CharacterCustomization;
  level: number;
  xp: number;
  completedCrafts: string[];
  unlockedRegions: string[];
  unlockedRegionIds: string[];
  badges: string[];
  unlockedBadgeIds: string[];
  discoveredArtifactIds: string[];
  collectedArtifactIds: string[];
  savedArtworks: SavedArtwork[];
  stats: {
    paintingsCreated: number;
    puzzlesSolved: number;
    quizzesCompleted: number;
    artifactsFound: number;
  };
}

export interface SavedArtwork {
  id: string;
  title: string;
  craftId?: string;
  craftName: string;
  region: string;
  dataUrl: string;
  createdAt: string;
  xpEarned?: number;
  score?: number;
}

export interface CulturalArtifact {
  id: string;
  name: string;
  craftId: string;
  region: string;
  icon: string;
  description: string;
  interestingFact: string;
  position3D: [number, number, number]; // [x, y, z] in the 3D village
  color: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PuzzlePiece {
  id: string;
  label: string;
  svgPath?: string;
  shapeDescription: string;
  targetSlotId: string;
  currentSlotId?: string;
  color: string;
}

export interface PatternPuzzleData {
  title: string;
  subtitle: string;
  gridSize: number; // e.g., 4 or 6 slots
  patternTheme: string;
  slots: {
    id: string;
    expectedPieceId: string;
    hint: string;
  }[];
  pieces: PuzzlePiece[];
}

export interface PaintingTemplate {
  id: string;
  name: string;
  motif: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Master';
  svgOutline: string; // SVG path or template rendering helper
}

export interface ArtisanInfo {
  name: string;
  title: string;
  greeting: string;
  culturalLore: string[];
  portraitUrl?: string;
}

export interface CraftRegion {
  id: string;
  name: string;
  state: string;
  region: string;
  craftName: string;
  tagline: string;
  description: string;
  history: string;
  traditionalTechnique: string;
  culturalSignificance: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xpReward: number;
  initialUnlocked: boolean;
  accentColor: string;
  theme: 'bihar_madhubani' | 'maharashtra_warli' | 'odisha_pattachitra' | 'other';
  environmentTheme: {
    skyColor: string;
    groundColor: string;
    fogColor: string;
    houseStyle: string;
  };
  artisan: ArtisanInfo;
  missionName: string;
  missionObjective: string;
  artifacts: CulturalArtifact[];
  paintingTemplates: PaintingTemplate[];
  patternPuzzle: PatternPuzzleData;
  quiz: QuizQuestion[];
}

export interface BadgeItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  category: 'art' | 'puzzle' | 'exploration' | 'mastery';
}

export interface MissionObjective {
  id: string;
  label: string;
  completed: boolean;
}

export interface ActiveMission {
  id: string;
  title: string;
  description: string;
  objectives: MissionObjective[];
}

export type GameView =
  | 'home'
  | 'world_map'
  | 'explore_3d'
  | 'painting_studio'
  | 'pattern_puzzle'
  | 'art_state_match'
  | 'quiz'
  | 'level_complete'
  | 'artworks_gallery'
  | 'cultural_museum'
  | 'character_customizer'
  | 'badges'
  | 'settings';
