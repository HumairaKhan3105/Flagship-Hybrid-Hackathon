import { Request, Response, NextFunction } from 'express';
import { initialInstruments } from '../data/instrumentsData.ts';

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  instrumentSlug?: string;
}

const quizBank: QuizQuestion[] = [
  {
    id: 1,
    question: 'Which bowed folk instrument featuring a coconut resonator and jingle bells is traditionally associated with Rajasthan and the story of Pabuji?',
    options: ['Ravanahatha', 'Shehnai', 'Santoor', 'Ghatam'],
    correctAnswer: 'Ravanahatha',
    explanation: 'The Ravanahatha is an ancient bowed folk chordophone with a coconut-shell body and ghungroos on the bow, played by Bhopa minstrels in Rajasthan.',
    instrumentSlug: 'ravanahatha'
  },
  {
    id: 2,
    question: 'The Santoor, a hammered dulcimer with approximately 100 strings played with curved walnut mallets, originates from which region?',
    options: ['Jammu & Kashmir', 'Kerala', 'Assam', 'Gujarat'],
    correctAnswer: 'Jammu & Kashmir',
    explanation: 'The Santoor originated in the Kashmir Valley as part of Sufiana Maqam music before being introduced to classical concert stages by Pt. Shivkumar Sharma.',
    instrumentSlug: 'santoor'
  },
  {
    id: 3,
    question: 'Which instrument consists of two flutes blown simultaneously in the mouth using continuous circular breathing?',
    options: ['Algoza', 'Bansuri', 'Shehnai', 'Nadaswaram'],
    correctAnswer: 'Algoza',
    explanation: 'The Algoza is a pair of beaked flutes played simultaneously in Rajasthan and Punjab—one sustains a continuous drone while the other plays melodies.',
    instrumentSlug: 'algoza'
  },
  {
    id: 4,
    question: 'Which percussion instrument is an acoustic baked clay pot whose bass can be modulated by pressing its opening against the player’s stomach?',
    options: ['Ghatam', 'Tabla', 'Chenda', 'Thavil'],
    correctAnswer: 'Ghatam',
    explanation: 'The Ghatam is a Carnatic clay pot drum, famously made from Manamadurai clay infused with brass and iron filings.',
    instrumentSlug: 'ghatam'
  },
  {
    id: 5,
    question: 'The sacred, auspicious quadruple-reed wind instrument played at North Indian weddings and sanctums of Varanasi is the:',
    options: ['Shehnai', 'Pepa', 'Algoza', 'Bansuri'],
    correctAnswer: 'Shehnai',
    explanation: 'The Shehnai is regarded as a Mangala Vadya (auspicious instrument) and was elevated to world concert stages by Bharat Ratna Ustad Bismillah Khan.',
    instrumentSlug: 'shehnai'
  },
  {
    id: 6,
    question: 'Which double-headed barrel drum is celebrated as the primary rhythmic backbone of Carnatic classical music in South India?',
    options: ['Mridangam', 'Dholak', 'Dhol', 'Pakhawaj'],
    correctAnswer: 'Mridangam',
    explanation: 'The Mridangam is crafted from jackfruit wood and is the premier percussion instrument of Carnatic classical recitals.',
    instrumentSlug: 'mridangam'
  },
  {
    id: 7,
    question: 'The iconic Assamese hornpipe instrument made from the horn of a water buffalo, played during the spring Bihu festival, is called:',
    options: ['Pepa', 'Tumbi', 'Morchang', 'Hudka'],
    correctAnswer: 'Pepa',
    explanation: 'The Pepa is crafted from domestic water buffalo horn and bamboo reed, sounding the opening call of the Rongali Bihu festival in Assam.',
    instrumentSlug: 'pepa'
  },
  {
    id: 8,
    question: 'Which rustic one-stringed instrument is played by the mystic wandering Baul and Fakir minstrels of Bengal?',
    options: ['Ektara', 'Sarod', 'Sitar', 'Rudra Veena'],
    correctAnswer: 'Ektara',
    explanation: 'The Ektara (literally "one string") is made from split bamboo and dried gourd, plucked to accompany devotional Baul songs.',
    instrumentSlug: 'ektara'
  },
  {
    id: 9,
    question: 'Which high-speed metal jaw harp is held against the front teeth, using the player’s mouth and throat as an acoustic resonance chamber?',
    options: ['Morchang', 'Kartal', 'Damru', 'Kanjira'],
    correctAnswer: 'Morchang',
    explanation: 'The Morchang (Morsing in South India) uses the mouth cavity to modulate harmonic overtone frequencies.',
    instrumentSlug: 'morchang'
  },
  {
    id: 10,
    question: 'The energetic Pung Cholom dance, where performers leap and spin in mid-air while playing a drum, originates from which state?',
    options: ['Manipur', 'Himachal Pradesh', 'Punjab', 'Karnataka'],
    correctAnswer: 'Manipur',
    explanation: 'Pung Cholom is a spectacular Manipuri dance art where drummers execute acrobatic leaps while playing the cylindrical Pung drum.',
    instrumentSlug: 'pung'
  },
  {
    id: 11,
    question: 'The thunderous, cylindrical Chenda drum hung from the shoulder is central to the temple festivals and Kathakali dramas of which state?',
    options: ['Kerala', 'West Bengal', 'Rajasthan', 'Uttar Pradesh'],
    correctAnswer: 'Kerala',
    explanation: 'The Chenda is an imposing cylindrical wooden drum integral to Kerala’s temple melams (like Thrissur Pooram) and Kathakali.',
    instrumentSlug: 'chenda'
  },
  {
    id: 12,
    question: 'The Sitar’s expressive microtonal pitch pulling technique that allows sliding notes across frets without shifting position is known as:',
    options: ['Meend', 'Jhala', 'Taan', 'Gat'],
    correctAnswer: 'Meend',
    explanation: 'Meend refers to the smooth, continuous glide between musical notes, achieved on the sitar by pulling the melody string across the curved brass frets.',
    instrumentSlug: 'sitar'
  }
];

export const quizController = {
  getQuiz(req: Request, res: Response, next: NextFunction) {
    try {
      // Shuffle question pool and pick 10
      const shuffled = [...quizBank].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 10).map((q, idx) => {
        // Also randomize options order
        const shuffledOptions = [...q.options].sort(() => 0.5 - Math.random());
        return {
          id: idx + 1,
          question: q.question,
          options: shuffledOptions,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          instrumentSlug: q.instrumentSlug,
        };
      });

      return res.json({
        success: true,
        count: selected.length,
        data: selected,
      });
    } catch (error) {
      next(error);
    }
  },
};
