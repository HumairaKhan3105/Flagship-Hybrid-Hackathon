import { GameCategory, LevelData } from '../../types';
import { FESTIVALS_LEVELS } from './festivals';
import { CLOTHES_LEVELS } from './clothes';
import { FOOD_LEVELS } from './food';
import { INSTRUMENTS_LEVELS } from './instruments';
import { ART_LEVELS } from './art';
import { PLACES_LEVELS } from './places';

export const ALL_LEVELS: Record<GameCategory, LevelData[]> = {
  festivals: FESTIVALS_LEVELS,
  clothes: CLOTHES_LEVELS,
  food: FOOD_LEVELS,
  instruments: INSTRUMENTS_LEVELS,
  art: ART_LEVELS,
  places: PLACES_LEVELS,
};

export function getLevelsForCategory(category: GameCategory): LevelData[] {
  return ALL_LEVELS[category] || [];
}

export function getLevel(category: GameCategory, levelNum: number): LevelData | undefined {
  const levels = ALL_LEVELS[category];
  if (!levels) return undefined;
  return levels.find((l) => l.level === levelNum);
}

export function getTotalLevelCount(): number {
  return Object.values(ALL_LEVELS).reduce((acc, cat) => acc + cat.length, 0);
}
