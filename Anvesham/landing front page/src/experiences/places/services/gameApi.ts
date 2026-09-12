import { MONUMENTS } from '../data/monuments';
import { QUESTS } from '../data/quests';

export interface GameContext {
  currentLocation: string;
  currentQuestTitle: string;
  currentQuestObjective: string;
  discoveredCluesCount: number;
  solvedPuzzlesCount: number;
  unlockedLocations: string[];
}

export const gameApi = {
  async askAIGuide(message: string, context: GameContext): Promise<string> {
    try {
      const response = await fetch('/api/ai/guide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, gameContext: context })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.reply) {
          return data.reply;
        }
      }
    } catch (e) {
      console.log('AI guide backend call fell back to local lore engine:', e);
    }

    // Contextual intelligent historical guide fallback
    return getLocalHistorianResponse(message, context);
  },

  async savePlayerProgress(progressData: unknown) {
    try {
      localStorage.setItem('hampi_echoes_save', JSON.stringify(progressData));
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress: progressData })
      }).catch(() => {});
    } catch (e) {
      console.warn('Local storage save only', e);
    }
  },

  async getPlayerProgress() {
    try {
      const local = localStorage.getItem('hampi_echoes_save');
      if (local) return JSON.parse(local);
    } catch (_) {}
    return null;
  },

  getMonuments() {
    return MONUMENTS;
  },

  getQuests() {
    return QUESTS;
  }
};

function getLocalHistorianResponse(message: string, context: GameContext): string {
  const lower = message.toLowerCase();

  if (lower.includes('decree') || lower.includes('secret') || lower.includes('emperor')) {
    return "The royal decree of Emperor Krishnadevaraya was sealed behind five interlocking astronomical emblems inside the Stone Chariot. Each monument you explore provides one piece of the sacred key.";
  }

  if (lower.includes('bazaar') || lower.includes('chest') || lower.includes('map')) {
    return "Look carefully between the twin stone arcades of Hampi Bazaar. The merchant elders once hid the cartographic parchment within an engraved chest resting near the central pavilion.";
  }

  if (lower.includes('chariot') || lower.includes('wheel') || lower.includes('garuda')) {
    return "The Stone Chariot at Vitthala is dedicated to Garuda. Notice how its wheels are carved with concentric solar motifs. Only when the four directional symbols—Lotus, Boar, Garuda, and Sun—align will the hidden mechanical compartment yield.";
  }

  if (lower.includes('virupaksha') || lower.includes('shadow') || lower.includes('gopuram')) {
    return "At Virupaksha Temple, the 50-meter gateway holds an ancient optical secret. Sunlight streaming through an opening behind the sanctum casts an inverted shadow upon the wall, revealing the hidden geometry of the city.";
  }

  if (lower.includes('musical') || lower.includes('pillar') || lower.includes('vitthala')) {
    return "The 56 pillars of Vitthala's Maha Mandapa were carved to resonate like temple bells. Listen closely to the harmonic frequencies—they match the astronomical proportions used by royal masons.";
  }

  if (lower.includes('timeline') || lower.includes('history') || lower.includes('krishnadevaraya')) {
    return "Remember the chronological rhythm: First Sage Vidyaranya's foundation in 1336 CE, then Devaraya's maritime expansion, followed by Emperor Krishnadevaraya's golden coronation in 1509 CE.";
  }

  if (lower.includes('puzzle') || lower.includes('stuck') || lower.includes('help') || lower.includes('hint')) {
    return `In your current quest "${context.currentQuestTitle}", observe the glowing markers in your surroundings. Step closer to inspect carved symbols and consult your Journal for historical alignments.`;
  }

  return `Greetings, Explorer! We stand in ${context.currentLocation}. Pay heed to the stone carvings around you—every frieze tells the story of Vijayanagara's zenith under King Krishnadevaraya. What mystery shall we investigate next?`;
}
