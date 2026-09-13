import { UserProgress, Badge } from '../types';

const STORAGE_KEY = 'culture_detective_v1';

export const DETECTIVE_RANKS = [
  { level: 1, minXp: 0, title: 'Apprentice Detective' },
  { level: 2, minXp: 250, title: 'Culture Scout' },
  { level: 3, minXp: 600, title: 'Heritage Tracker' },
  { level: 4, minXp: 1100, title: 'Tradition Sleuth' },
  { level: 5, minXp: 1800, title: 'Regional Investigator' },
  { level: 6, minXp: 2700, title: 'Culture Explorer' },
  { level: 7, minXp: 3800, title: 'Festive Detective' },
  { level: 8, minXp: 5100, title: 'Textile & Art Sleuth' },
  { level: 9, minXp: 6600, title: 'Spice & Melody Master' },
  { level: 10, minXp: 8500, title: 'Senior Heritage Detective' },
  { level: 12, minXp: 11000, title: 'National Heritage Guardian' },
  { level: 15, minXp: 15000, title: 'Grand Culture Sleuth' },
  { level: 20, minXp: 22000, title: 'Culture Champion' },
  { level: 25, minXp: 30000, title: 'Grand Bharat Detective' },
  { level: 30, minXp: 40000, title: 'Supreme Culture Legend' },
];

export function getRankForXp(xp: number) {
  let currentRank = DETECTIVE_RANKS[0];
  for (const rank of DETECTIVE_RANKS) {
    if (xp >= rank.minXp) {
      currentRank = rank;
    } else {
      break;
    }
  }
  return currentRank;
}

export function getNextRank(currentLevel: number) {
  const next = DETECTIVE_RANKS.find((r) => r.level > currentLevel);
  return next || DETECTIVE_RANKS[DETECTIVE_RANKS.length - 1];
}

const DEFAULT_CATEGORY_PROGRESS = {
  festivals: { currentLevel: 1, completedLevels: [], starsEarned: 0 },
  clothes: { currentLevel: 1, completedLevels: [], starsEarned: 0 },
  food: { currentLevel: 1, completedLevels: [], starsEarned: 0 },
  instruments: { currentLevel: 1, completedLevels: [], starsEarned: 0 },
  art: { currentLevel: 1, completedLevels: [], starsEarned: 0 },
  places: { currentLevel: 1, completedLevels: [], starsEarned: 0 },
};

const DEFAULT_PROGRESS: UserProgress = {
  displayName: 'Detective Veer',
  avatarId: 'aarav',
  score: 0,
  xp: 0,
  coins: 150,
  level: 1,
  title: 'Apprentice Detective',
  rankTitle: 'Apprentice Detective',
  streak: 1,
  lastPlayedDate: new Date().toISOString().split('T')[0],
  completedLevels: {},
  categoryProgress: DEFAULT_CATEGORY_PROGRESS,
  unlockedBadges: ['beginner-detective'],
  soundEnabled: true,
  musicEnabled: true,
  highContrast: false,
  reducedMotion: false,
  factsUnlocked: [],
};

export class StorageService {
  public static loadProgress(): UserProgress {
    if (typeof window === 'undefined') return DEFAULT_PROGRESS;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveProgress(DEFAULT_PROGRESS);
        return DEFAULT_PROGRESS;
      }
      const parsed: UserProgress = JSON.parse(data);
      // Validate streak
      const today = new Date().toISOString().split('T')[0];
      const last = parsed.lastPlayedDate;
      if (last) {
        const lastDate = new Date(last);
        const currentDate = new Date(today);
        const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          // Continuous day
          parsed.streak = (parsed.streak || 0) + 1;
          parsed.lastPlayedDate = today;
          this.saveProgress(parsed);
        } else if (diffDays > 1) {
          // Streak broken
          parsed.streak = 1;
          parsed.lastPlayedDate = today;
          this.saveProgress(parsed);
        }
      }
      return {
        ...DEFAULT_PROGRESS,
        ...parsed,
        rankTitle: parsed.rankTitle || parsed.title || 'Apprentice Detective',
        categoryProgress: {
          ...DEFAULT_CATEGORY_PROGRESS,
          ...(parsed.categoryProgress || {}),
        },
      };
    } catch {
      return DEFAULT_PROGRESS;
    }
  }

  public static saveProgress(progress: UserProgress): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }

  public static completeLevel(
    category: import('../types').CategoryId,
    levelNum: number,
    stars: number,
    xpGained: number,
    coinsGained: number
  ): UserProgress {
    const current = this.loadProgress();
    const cat = current.categoryProgress[category] || {
      currentLevel: 1,
      completedLevels: [],
      starsEarned: 0,
    };

    if (!cat.completedLevels.includes(levelNum)) {
      cat.completedLevels.push(levelNum);
      cat.starsEarned += stars;
    }

    if (levelNum >= cat.currentLevel && levelNum < 50) {
      cat.currentLevel = levelNum + 1;
    }

    current.categoryProgress[category] = cat;
    current.xp += xpGained;
    current.coins += coinsGained;
    current.score += xpGained;

    // Update rank title and level
    const rank = getRankForXp(current.xp);
    current.level = rank.level;
    current.title = rank.title;
    current.rankTitle = rank.title;

    // Check badge milestones
    const totalSolved = Object.values(current.categoryProgress).reduce(
      (acc, c) => acc + (c.completedLevels?.length || 0),
      0
    );
    if (totalSolved >= 1 && !current.unlockedBadges.includes('first-mystery')) {
      current.unlockedBadges.push('first-mystery');
    }
    if (totalSolved >= 10 && !current.unlockedBadges.includes('ten-cases')) {
      current.unlockedBadges.push('ten-cases');
    }
    if (totalSolved >= 25 && !current.unlockedBadges.includes('twenty-five-cases')) {
      current.unlockedBadges.push('twenty-five-cases');
    }
    if (totalSolved >= 50 && !current.unlockedBadges.includes('fifty-cases')) {
      current.unlockedBadges.push('fifty-cases');
    }
    if (totalSolved >= 100 && !current.unlockedBadges.includes('hundred-cases')) {
      current.unlockedBadges.push('hundred-cases');
    }

    this.saveProgress(current);
    return current;
  }

  public static addRewards(xp: number, coins: number): UserProgress {
    const current = this.loadProgress();
    current.xp += xp;
    current.coins += coins;
    current.score += xp;
    const rank = getRankForXp(current.xp);
    current.level = rank.level;
    current.title = rank.title;
    current.rankTitle = rank.title;
    this.saveProgress(current);
    return current;
  }

  public static unlockBadge(badgeId: string): UserProgress {
    const current = this.loadProgress();
    if (!current.unlockedBadges.includes(badgeId)) {
      current.unlockedBadges.push(badgeId);
      this.saveProgress(current);
    }
    return current;
  }

  public static resetProgress(): UserProgress {
    return this.resetData();
  }

  public static updateLevelCompletion(
    levelKey: string,
    stars: number,
    points: number,
    factId?: string
  ): {
    progress: UserProgress;
    leveledUp: boolean;
    oldLevel: number;
    newLevel: number;
    newBadges: string[];
    isFirstCompletion: boolean;
  } {
    const current = this.loadProgress();
    const isFirstCompletion = !current.completedLevels[levelKey];
    const previous = current.completedLevels[levelKey] || { stars: 0, highscore: 0, completedAt: '' };

    const newStars = Math.max(previous.stars, stars);
    const newHighscore = Math.max(previous.highscore, points);

    current.completedLevels[levelKey] = {
      stars: newStars,
      highscore: newHighscore,
      completedAt: new Date().toISOString(),
    };

    // Calculate score & XP additions
    const earnedXp = points + (stars * 25);
    const earnedCoins = stars * 15 + (isFirstCompletion ? 30 : 5);

    current.score += points;
    current.xp += earnedXp;
    current.coins += earnedCoins;

    if (factId && !current.factsUnlocked.includes(factId)) {
      current.factsUnlocked.push(factId);
    }

    // Check level rank
    const oldLevel = current.level;
    const rank = getRankForXp(current.xp);
    const leveledUp = rank.level > oldLevel;
    current.level = rank.level;
    current.title = rank.title;

    // Check Badges
    const newBadges: string[] = [];
    const totalCompleted = Object.keys(current.completedLevels).length;
    const totalStars = Object.values(current.completedLevels).reduce((acc, l) => acc + l.stars, 0);

    const checkBadge = (id: string, condition: boolean) => {
      if (condition && !current.unlockedBadges.includes(id)) {
        current.unlockedBadges.push(id);
        newBadges.push(id);
      }
    };

    checkBadge('first-mystery', totalCompleted >= 1);
    checkBadge('ten-cases', totalCompleted >= 10);
    checkBadge('twenty-five-cases', totalCompleted >= 25);
    checkBadge('fifty-cases', totalCompleted >= 50);
    checkBadge('hundred-cases', totalCompleted >= 100);
    checkBadge('three-star-scholar', totalStars >= 30);
    checkBadge('gold-collector', current.coins >= 500);
    checkBadge('speed-demon', points >= 180);
    checkBadge('streak-warrior', current.streak >= 3);
    checkBadge('culture-champion', rank.level >= 10);

    this.saveProgress(current);

    return {
      progress: current,
      leveledUp,
      oldLevel,
      newLevel: current.level,
      newBadges,
      isFirstCompletion,
    };
  }

  public static spendCoins(amount: number): boolean {
    const current = this.loadProgress();
    if (current.coins >= amount) {
      current.coins -= amount;
      this.saveProgress(current);
      return true;
    }
    return false;
  }

  public static addCoins(amount: number): UserProgress {
    const current = this.loadProgress();
    current.coins += amount;
    this.saveProgress(current);
    return current;
  }

  public static resetData(): UserProgress {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    return DEFAULT_PROGRESS;
  }
}
