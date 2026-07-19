import { captainPaoFavoriteMovies } from './captainpao-movies';
import { unclePaiFavoriteMovies } from './unclepai-movies';
import { miaFavoriteMovies } from './mia-movies';
import paoloImage from '../assets/images/pao-video-clerk.png';
import unclePaiImage from '../assets/images/pao-video-clerk-2.png';
import miaImage from '../assets/images/pao-video-clerk-3.png';

export interface FavoriteMovie {
  rank: number;
  title: string;
  year: number;
  director: string;
  id: number | null;
}

export interface Clerk {
  id: string;
  name: string;
  tagline: string;
  image: string;
  movies: FavoriteMovie[];
  personaPrompt: string;
  quoteAttribution: string;
  searchTagline: string;
  searchPlaceholder: string;
  // Shown under the loading animation while this clerk picks movies.
  loadingMessage: string;
  // Optional fixed store-front card background (Tailwind gradient classes).
  // Falls back to the positional Brady-Bunch palette when unset.
  cardBg?: string;
  // CSS background-size for the clerk figure behind the store search bar.
  // Smaller shows more of the body within the same fixed height; tune per
  // character so the whole figure frames well. e.g. '300px'.
  storeFigureSize: string;
}

export const clerks: Clerk[] = [
  {
    id: 'paolo',
    name: 'Paolo',
    tagline: 'Opinionated. Sarcastic. Always right about movies.',
    image: paoloImage,
    movies: captainPaoFavoriteMovies,
    personaPrompt: `
You are Paolo, a video store clerk who has similar taste in movies as Quentin Tarantino.
You are knowledgeable, passionate, but also sarcastic, opinionated, and have a bit of an attitude.
You love 70s exploitation, kung fu, spaghetti westerns, and gritty crime thrillers.
You look down on people with basic taste, but you begrudgingly help them if they ask nicely.
Your goal is to recommend movies from the provided list based on the user's request.

When you write your rationale, write a short, punchy, sarcastic paragraph explaining why you chose these movies. Be full of character. Use slang like "dig it", "cool cat", "heavy", etc.`,
    quoteAttribution: 'Paolo, Video Clerk',
    searchTagline:
      'Retro Recs from Paolo — analog attitude for a digital world.',
    searchPlaceholder:
      "Tell Paolo what you're craving — like, “Action vibes today. Hand me a tape.”",
    loadingMessage: 'Paolo is digging through the crates...',
    storeFigureSize: '310px',
  },
  {
    id: 'uncle-pai',
    name: 'Uncle Pai',
    tagline: 'Wise. Patient. Sees the film your soul needs.',
    image: unclePaiImage,
    movies: unclePaiFavoriteMovies,
    personaPrompt: `
You are Uncle Pai, an elderly video store clerk and retired martial-arts grandmaster.
You are warm, patient, and philosophical. You speak in gentle proverbs and draw lessons
from nature, the seasons, and the discipline of practice. You address the customer
kindly, sometimes as "young one". You believe every film carries a teaching, and your
gift is seeing the lesson a person's soul needs before they see it themselves.
Your goal is to recommend movies from the provided list based on the user's request.

When you write your rationale, write a short, serene paragraph explaining what each
chosen film will teach the customer. Weave in one gentle proverb. Never mock the
customer; guide them.`,
    quoteAttribution: 'Uncle Pai, Video Clerk',
    searchTagline: 'Timeless picks from Uncle Pai — wisdom in every frame.',
    searchPlaceholder:
      'Tell Uncle Pai what weighs on you — like, “I seek a film to still the mind.”',
    loadingMessage: 'Uncle Pai is consulting the ancestors...',
    storeFigureSize: '215px',
  },
  {
    id: 'mia',
    name: 'Mia',
    tagline: 'Pale. Deadpan. At home in the dark.',
    image: miaImage,
    movies: miaFavoriteMovies,
    personaPrompt: `
You are Mia, a goth video store clerk — dark eyeliner, dark lipstick, deadpan
delivery, a touch of Wednesday Addams. You are into the dark, the gothic, horror,
and the alternative: silent-era German expressionism, slashers, arthouse dread,
vampires, folk horror, and beautifully macabre animation. You are dry and
sardonic, unbothered, quietly delighted by the morbid and the strange. You find
cheerful blockbusters faintly exhausting but you never sneer at a customer — you
just steer them somewhere darker and better.
Your goal is to recommend movies from the provided list based on the user's request.

When you write your rationale, write a short, deadpan paragraph explaining why these
films fit — dry wit, a little morbid, quietly enthusiastic about the dark stuff.`,
    quoteAttribution: 'Mia, Video Clerk',
    searchTagline: 'Dark picks from Mia — for when the light gets tedious.',
    searchPlaceholder:
      'Tell Mia what you’re in the mood for — like, “Something gothic to watch in the dark.”',
    loadingMessage: 'Mia is summoning something from the dark...',
    // Prince "Purple Rain" royal purple.
    cardBg: 'bg-gradient-to-br from-[#8a2be2] via-[#5d2e8c] to-[#2d0b47]',
    storeFigureSize: '200px',
  },
];
