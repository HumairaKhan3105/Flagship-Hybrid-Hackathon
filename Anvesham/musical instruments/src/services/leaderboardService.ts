import { LeaderboardEntry } from '../types.ts';

const LEADERBOARD_STORAGE_KEY = 'itihaasx_quiz_leaderboard';

const DEFAULT_ENTRIES: LeaderboardEntry[] = [
  {
    id: 'seed-1',
    name: 'Ananya Sharma',
    points: 1450,
    score: 10,
    totalQuestions: 10,
    accuracy: 100,
    title: 'Sangeet Mahacharya',
    streak: 10,
    date: 'Today',
    gameName: 'Culture Quiz',
  },
  {
    id: 'seed-2',
    name: 'Rohan Deshmukh',
    points: 1220,
    score: 9,
    totalQuestions: 10,
    accuracy: 90,
    title: 'Heritage Vidwan',
    streak: 7,
    date: 'Yesterday',
    gameName: 'Taala Rhythm Tap',
  },
  {
    id: 'seed-3',
    name: 'Meera Nambiar',
    points: 1080,
    score: 8,
    totalQuestions: 10,
    accuracy: 85,
    title: 'Sur Rasika',
    streak: 5,
    date: '2 days ago',
    gameName: 'Blind Sound Guesser',
  },
  {
    id: 'seed-4',
    name: 'Kabir Sengupta',
    points: 950,
    score: 8,
    totalQuestions: 10,
    accuracy: 80,
    title: 'Sur Rasika',
    streak: 4,
    date: '3 days ago',
    gameName: 'Acoustic Family Sorter',
  },
  {
    id: 'seed-5',
    name: 'Devika Patel',
    points: 890,
    score: 7,
    totalQuestions: 10,
    accuracy: 75,
    title: 'Dharohar Shishya',
    streak: 3,
    date: '4 days ago',
    gameName: 'Gharana & Maestro Match',
  },
];

export function getLeaderboardEntries(gameFilter?: string): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
    let entries: LeaderboardEntry[] = raw ? JSON.parse(raw) : DEFAULT_ENTRIES;

    if (gameFilter && gameFilter !== 'All') {
      entries = entries.filter((e) => !e.gameName || e.gameName === gameFilter);
    }

    return entries.sort((a, b) => b.points - a.points);
  } catch {
    return DEFAULT_ENTRIES;
  }
}

export function saveLeaderboardEntry(
  entry: Omit<LeaderboardEntry, 'id' | 'date'> & { gameName?: string }
): LeaderboardEntry {
  const current = getLeaderboardEntries();
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: `entry-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    date: 'Just now',
  };

  const updated = [newEntry, ...current]
    .sort((a, b) => b.points - a.points)
    .slice(0, 50); // Keep top 50

  try {
    localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save score to leaderboard:', err);
  }

  // Also update player lifetime stats
  updatePlayerLifetimeStats(entry.points, entry.streak);

  return newEntry;
}

export function getHonorificTitle(points: number, accuracy: number): string {
  if (points >= 1200 && accuracy >= 90) return 'Sangeet Mahacharya';
  if (points >= 900 && accuracy >= 80) return 'Heritage Vidwan';
  if (points >= 600 && accuracy >= 70) return 'Sur Rasika';
  return 'Dharohar Shishya';
}

const STATS_STORAGE_KEY = 'itihaasx_player_stats';

export interface PlayerStats {
  totalPoints: number;
  gamesPlayed: number;
  bestStreak: number;
  lastPlayed: string;
}

export function getPlayerLifetimeStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return {
    totalPoints: 0,
    gamesPlayed: 0,
    bestStreak: 0,
    lastPlayed: 'Never',
  };
}

function updatePlayerLifetimeStats(addedPoints: number, streak: number) {
  try {
    const stats = getPlayerLifetimeStats();
    stats.totalPoints += addedPoints;
    stats.gamesPlayed += 1;
    if (streak > stats.bestStreak) {
      stats.bestStreak = streak;
    }
    stats.lastPlayed = new Date().toLocaleDateString();
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}
