# Uncle Pai + Pao Fiction Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Uncle Pai as a second selectable video clerk with his own 100-film list and warm-sage AI persona, behind a new "Pao Fiction" landing page.

**Architecture:** A `Clerk` config object (`src/data/clerks.ts`) carries each clerk's name, portrait, movie list, and DeepSeek persona prompt. A new `<landing-page>` component fires `clerk-selected`; `movie-app` holds `_clerk` state and renders landing vs. store. `deepseek-service` takes the persona as a parameter instead of hardcoding Paolo.

**Tech Stack:** LitElement 3.x (Light DOM), TailwindCSS 3.x, TypeScript, Vite. No test framework exists in this repo — verification gates are `npm run lint`, `npm run build` (runs `tsc`), the id-resolution script's logged warnings, and manual dev-server checks.

## Global Constraints

- Branch: `feature/uncle-pai` (already created; spec committed).
- LitElement components use Light DOM: `createRenderRoot() { return this; }`.
- Styling: Tailwind utility classes only; no `static styles`, no new CSS classes.
- Do not modify Paolo's list (`src/data/captainpao-movies.ts`) or his persona text (moves verbatim into config).
- Do NOT push or create PRs — the user commits/pushes themselves. Local commits only.
- The store UI (search, grid, detail, pagination) must behave exactly as today once a clerk is chosen.

---

### Task 1: Uncle Pai assets + movie data + TMDB id resolution

**Files:**
- Create: `src/assets/images/pao-video-clerk-2.png` (copy from main checkout)
- Create: `src/data/unclepai-movies.ts`
- Modify: `scripts/fetch-ids.cjs` (parameterize file path + export name)

**Interfaces:**
- Produces: `export const unclePaiFavoriteMovies` — array of `{ rank, title, year, director, id }`, same shape as `captainPaoFavoriteMovies` in `src/data/captainpao-movies.ts`.

- [ ] **Step 1: Copy the portrait into the worktree**

```bash
cp /Users/kokwaileong/Documents/Career/pao-movies/src/assets/images/pao-video-clerk-2.png src/assets/images/pao-video-clerk-2.png
```

- [ ] **Step 2: Create `src/data/unclepai-movies.ts`**

Same JSON-in-TS format as `captainpao-movies.ts` (quoted keys — the fetch script `JSON.parse`s the array literal). All ids start `null`; the script fills them. Full list (100 films — grandmaster taste: King Hu wuxia, Shaw Brothers, Kurosawa, samurai cinema, Bruce Lee, contemplative masters, and Kill Bill Vol. 2 as the self-aware wink at rank 100):

```ts
export const unclePaiFavoriteMovies = [
  { "rank": 1, "title": "Seven Samurai", "year": 1954, "director": "Akira Kurosawa", "id": null },
  { "rank": 2, "title": "A Touch of Zen", "year": 1971, "director": "King Hu", "id": null },
  { "rank": 3, "title": "The 36th Chamber of Shaolin", "year": 1978, "director": "Lau Kar-leung", "id": null },
  { "rank": 4, "title": "Harakiri", "year": 1962, "director": "Masaki Kobayashi", "id": null },
  { "rank": 5, "title": "Enter the Dragon", "year": 1973, "director": "Robert Clouse", "id": null },
  { "rank": 6, "title": "Crouching Tiger, Hidden Dragon", "year": 2000, "director": "Ang Lee", "id": null },
  { "rank": 7, "title": "Hero", "year": 2002, "director": "Zhang Yimou", "id": null },
  { "rank": 8, "title": "Yojimbo", "year": 1961, "director": "Akira Kurosawa", "id": null },
  { "rank": 9, "title": "Come Drink with Me", "year": 1966, "director": "King Hu", "id": null },
  { "rank": 10, "title": "Ikiru", "year": 1952, "director": "Akira Kurosawa", "id": null },
  { "rank": 11, "title": "Rashomon", "year": 1950, "director": "Akira Kurosawa", "id": null },
  { "rank": 12, "title": "The Sword of Doom", "year": 1966, "director": "Kihachi Okamoto", "id": null },
  { "rank": 13, "title": "Fist of Fury", "year": 1972, "director": "Lo Wei", "id": null },
  { "rank": 14, "title": "The Grandmaster", "year": 2013, "director": "Wong Kar-wai", "id": null },
  { "rank": 15, "title": "Dragon Inn", "year": 1967, "director": "King Hu", "id": null },
  { "rank": 16, "title": "Once Upon a Time in China", "year": 1991, "director": "Tsui Hark", "id": null },
  { "rank": 17, "title": "Drunken Master", "year": 1978, "director": "Yuen Woo-ping", "id": null },
  { "rank": 18, "title": "The Legend of Drunken Master", "year": 1994, "director": "Lau Kar-leung", "id": null },
  { "rank": 19, "title": "Samurai I: Musashi Miyamoto", "year": 1954, "director": "Hiroshi Inagaki", "id": null },
  { "rank": 20, "title": "Samurai II: Duel at Ichijoji Temple", "year": 1955, "director": "Hiroshi Inagaki", "id": null },
  { "rank": 21, "title": "Samurai III: Duel at Ganryu Island", "year": 1956, "director": "Hiroshi Inagaki", "id": null },
  { "rank": 22, "title": "Sanjuro", "year": 1962, "director": "Akira Kurosawa", "id": null },
  { "rank": 23, "title": "Throne of Blood", "year": 1957, "director": "Akira Kurosawa", "id": null },
  { "rank": 24, "title": "Ran", "year": 1985, "director": "Akira Kurosawa", "id": null },
  { "rank": 25, "title": "Kagemusha", "year": 1980, "director": "Akira Kurosawa", "id": null },
  { "rank": 26, "title": "The Hidden Fortress", "year": 1958, "director": "Akira Kurosawa", "id": null },
  { "rank": 27, "title": "Red Beard", "year": 1965, "director": "Akira Kurosawa", "id": null },
  { "rank": 28, "title": "High and Low", "year": 1963, "director": "Akira Kurosawa", "id": null },
  { "rank": 29, "title": "Dersu Uzala", "year": 1975, "director": "Akira Kurosawa", "id": null },
  { "rank": 30, "title": "Sanshiro Sugata", "year": 1943, "director": "Akira Kurosawa", "id": null },
  { "rank": 31, "title": "Samurai Rebellion", "year": 1967, "director": "Masaki Kobayashi", "id": null },
  { "rank": 32, "title": "Kwaidan", "year": 1964, "director": "Masaki Kobayashi", "id": null },
  { "rank": 33, "title": "Ugetsu", "year": 1953, "director": "Kenji Mizoguchi", "id": null },
  { "rank": 34, "title": "Sansho the Bailiff", "year": 1954, "director": "Kenji Mizoguchi", "id": null },
  { "rank": 35, "title": "Tokyo Story", "year": 1953, "director": "Yasujiro Ozu", "id": null },
  { "rank": 36, "title": "Late Spring", "year": 1949, "director": "Yasujiro Ozu", "id": null },
  { "rank": 37, "title": "An Autumn Afternoon", "year": 1962, "director": "Yasujiro Ozu", "id": null },
  { "rank": 38, "title": "The Burmese Harp", "year": 1956, "director": "Kon Ichikawa", "id": null },
  { "rank": 39, "title": "Lone Wolf and Cub: Sword of Vengeance", "year": 1972, "director": "Kenji Misumi", "id": null },
  { "rank": 40, "title": "Lone Wolf and Cub: Baby Cart at the River Styx", "year": 1972, "director": "Kenji Misumi", "id": null },
  { "rank": 41, "title": "Lady Snowblood", "year": 1973, "director": "Toshiya Fujita", "id": null },
  { "rank": 42, "title": "Zatoichi", "year": 2003, "director": "Takeshi Kitano", "id": null },
  { "rank": 43, "title": "Fireworks", "year": 1997, "director": "Takeshi Kitano", "id": null },
  { "rank": 44, "title": "Kikujiro", "year": 1999, "director": "Takeshi Kitano", "id": null },
  { "rank": 45, "title": "The Twilight Samurai", "year": 2002, "director": "Yoji Yamada", "id": null },
  { "rank": 46, "title": "13 Assassins", "year": 2010, "director": "Takashi Miike", "id": null },
  { "rank": 47, "title": "The Big Boss", "year": 1971, "director": "Lo Wei", "id": null },
  { "rank": 48, "title": "The Way of the Dragon", "year": 1972, "director": "Bruce Lee", "id": null },
  { "rank": 49, "title": "One-Armed Swordsman", "year": 1967, "director": "Chang Cheh", "id": null },
  { "rank": 50, "title": "Five Deadly Venoms", "year": 1978, "director": "Chang Cheh", "id": null },
  { "rank": 51, "title": "The Eight Diagram Pole Fighter", "year": 1984, "director": "Lau Kar-leung", "id": null },
  { "rank": 52, "title": "Executioners from Shaolin", "year": 1977, "director": "Lau Kar-leung", "id": null },
  { "rank": 53, "title": "Master of the Flying Guillotine", "year": 1976, "director": "Jimmy Wang Yu", "id": null },
  { "rank": 54, "title": "The Prodigal Son", "year": 1981, "director": "Sammo Hung", "id": null },
  { "rank": 55, "title": "The Magnificent Butcher", "year": 1979, "director": "Yuen Woo-ping", "id": null },
  { "rank": 56, "title": "Iron Monkey", "year": 1993, "director": "Yuen Woo-ping", "id": null },
  { "rank": 57, "title": "Fong Sai-yuk", "year": 1993, "director": "Corey Yuen", "id": null },
  { "rank": 58, "title": "Once Upon a Time in China II", "year": 1992, "director": "Tsui Hark", "id": null },
  { "rank": 59, "title": "New Dragon Gate Inn", "year": 1992, "director": "Raymond Lee", "id": null },
  { "rank": 60, "title": "The Blade", "year": 1995, "director": "Tsui Hark", "id": null },
  { "rank": 61, "title": "Ashes of Time", "year": 1994, "director": "Wong Kar-wai", "id": null },
  { "rank": 62, "title": "Swordsman II", "year": 1992, "director": "Ching Siu-tung", "id": null },
  { "rank": 63, "title": "Police Story", "year": 1985, "director": "Jackie Chan", "id": null },
  { "rank": 64, "title": "Project A", "year": 1983, "director": "Jackie Chan", "id": null },
  { "rank": 65, "title": "Fearless", "year": 2006, "director": "Ronny Yu", "id": null },
  { "rank": 66, "title": "Ip Man", "year": 2008, "director": "Wilson Yip", "id": null },
  { "rank": 67, "title": "Kung Fu Hustle", "year": 2004, "director": "Stephen Chow", "id": null },
  { "rank": 68, "title": "Shaolin Soccer", "year": 2001, "director": "Stephen Chow", "id": null },
  { "rank": 69, "title": "House of Flying Daggers", "year": 2004, "director": "Zhang Yimou", "id": null },
  { "rank": 70, "title": "Raise the Red Lantern", "year": 1991, "director": "Zhang Yimou", "id": null },
  { "rank": 71, "title": "To Live", "year": 1994, "director": "Zhang Yimou", "id": null },
  { "rank": 72, "title": "Shadow", "year": 2018, "director": "Zhang Yimou", "id": null },
  { "rank": 73, "title": "Farewell My Concubine", "year": 1993, "director": "Chen Kaige", "id": null },
  { "rank": 74, "title": "The Assassin", "year": 2015, "director": "Hou Hsiao-hsien", "id": null },
  { "rank": 75, "title": "In the Mood for Love", "year": 2000, "director": "Wong Kar-wai", "id": null },
  { "rank": 76, "title": "Eat Drink Man Woman", "year": 1994, "director": "Ang Lee", "id": null },
  { "rank": 77, "title": "Yi Yi", "year": 2000, "director": "Edward Yang", "id": null },
  { "rank": 78, "title": "Spring, Summer, Fall, Winter... and Spring", "year": 2003, "director": "Kim Ki-duk", "id": null },
  { "rank": 79, "title": "Why Has Bodhi-Dharma Left for the East?", "year": 1989, "director": "Bae Yong-kyun", "id": null },
  { "rank": 80, "title": "Poetry", "year": 2010, "director": "Lee Chang-dong", "id": null },
  { "rank": 81, "title": "The Way Home", "year": 2002, "director": "Lee Jeong-hyang", "id": null },
  { "rank": 82, "title": "Departures", "year": 2008, "director": "Yojiro Takita", "id": null },
  { "rank": 83, "title": "After Life", "year": 1998, "director": "Hirokazu Kore-eda", "id": null },
  { "rank": 84, "title": "Still Walking", "year": 2008, "director": "Hirokazu Kore-eda", "id": null },
  { "rank": 85, "title": "Shoplifters", "year": 2018, "director": "Hirokazu Kore-eda", "id": null },
  { "rank": 86, "title": "Perfect Days", "year": 2023, "director": "Wim Wenders", "id": null },
  { "rank": 87, "title": "Paterson", "year": 2016, "director": "Jim Jarmusch", "id": null },
  { "rank": 88, "title": "Ghost Dog: The Way of the Samurai", "year": 1999, "director": "Jim Jarmusch", "id": null },
  { "rank": 89, "title": "Le Samourai", "year": 1967, "director": "Jean-Pierre Melville", "id": null },
  { "rank": 90, "title": "The Seventh Seal", "year": 1957, "director": "Ingmar Bergman", "id": null },
  { "rank": 91, "title": "Wild Strawberries", "year": 1957, "director": "Ingmar Bergman", "id": null },
  { "rank": 92, "title": "Andrei Rublev", "year": 1966, "director": "Andrei Tarkovsky", "id": null },
  { "rank": 93, "title": "Stalker", "year": 1979, "director": "Andrei Tarkovsky", "id": null },
  { "rank": 94, "title": "Baraka", "year": 1992, "director": "Ron Fricke", "id": null },
  { "rank": 95, "title": "Groundhog Day", "year": 1993, "director": "Harold Ramis", "id": null },
  { "rank": 96, "title": "The Straight Story", "year": 1999, "director": "David Lynch", "id": null },
  { "rank": 97, "title": "Unforgiven", "year": 1992, "director": "Clint Eastwood", "id": null },
  { "rank": 98, "title": "The Karate Kid", "year": 1984, "director": "John G. Avildsen", "id": null },
  { "rank": 99, "title": "Spirited Away", "year": 2001, "director": "Hayao Miyazaki", "id": null },
  { "rank": 100, "title": "Kill Bill: Vol. 2", "year": 2004, "director": "Quentin Tarantino", "id": null }
];
```

Note: write it in the exact serialized style of `captainpao-movies.ts` (one key per line, 2-space indent) so the fetch script's regex and rewrite round-trip cleanly. The script rewrites the file with `JSON.stringify(..., null, 2)` anyway.

- [ ] **Step 3: Parameterize `scripts/fetch-ids.cjs`**

Replace the two hardcoded constants with argv (defaults preserve current behavior), and log the matched title so mismatches are visible. Change:

```js
const dataFilePath = path.join(__dirname, '../src/data/captainpao-movies.ts');
```

to:

```js
// Usage: node scripts/fetch-ids.cjs [dataFile] [exportName]
const dataFile = process.argv[2] || '../src/data/captainpao-movies.ts';
const exportName = process.argv[3] || 'captainPaoFavoriteMovies';
const dataFilePath = path.isAbsolute(dataFile) ? dataFile : path.join(__dirname, dataFile);
```

In `fetchMovieId`, log the matched title for verification:

```js
    if (data.results && data.results.length > 0) {
      const hit = data.results[0];
      if (hit.title.toLowerCase() !== title.toLowerCase()) {
        console.warn(`  MATCH CHECK: asked "${title}" got "${hit.title}" (${(hit.release_date || '').slice(0, 4)})`);
      }
      return hit.id;
    }
```

In `main()`, replace the two uses of the export name:

```js
  const match = fileContent.match(new RegExp(`export const ${exportName} = (\\[[\\s\\S]*?\\]);`));
```

```js
  const newContent = `export const ${exportName} = ${JSON.stringify(updatedMovies, null, 2)};\n`;
```

- [ ] **Step 4: Run the script and review matches**

```bash
node scripts/fetch-ids.cjs ../src/data/unclepai-movies.ts unclePaiFavoriteMovies
```

Expected: `Processing 100 movies...`, one `Fetching ID for #N: <title>` line per film, ending `Done! Updated file with IDs.` Review every `MATCH CHECK`/`Could not find ID` warning. Non-English titles often return the English title from TMDB search — a MATCH CHECK where the hit is the known English/alternate title of the same film (e.g. "Fireworks" → "Hana-bi", "Le Samourai" → "Le Samouraï") is fine. For a genuinely wrong film or a null id, look the movie up manually (`https://www.themoviedb.org/search?query=<title>`) and correct the `id` in `src/data/unclepai-movies.ts` by hand. Every entry must end with a non-null id.

- [ ] **Step 5: Verify the file still parses and lints**

```bash
npm run lint
```

Expected: exit 0. (The data file is plain TS; `tsc` runs in Task 5's build gate.)

- [ ] **Step 6: Commit**

```bash
git add src/assets/images/pao-video-clerk-2.png src/data/unclepai-movies.ts scripts/fetch-ids.cjs
git commit -m "feat: add Uncle Pai's 100 favourite movies with TMDB ids"
```

---

### Task 2: Clerk config + persona parameter in deepseek-service

**Files:**
- Create: `src/data/clerks.ts`
- Modify: `src/services/deepseek-service.ts`

**Interfaces:**
- Consumes: `unclePaiFavoriteMovies` from Task 1; existing `captainPaoFavoriteMovies`.
- Produces:
  - `interface FavoriteMovie { rank: number; title: string; year: number; director: string; id: number | null }`
  - `interface Clerk { id: string; name: string; tagline: string; image: string; movies: FavoriteMovie[]; personaPrompt: string; quoteAttribution: string }`
  - `export const clerks: Clerk[]` (Paolo first, Uncle Pai second)
  - `deepseekService.getRecommendations(prompt: string, availableMovies: FavoriteMovie[], personaPrompt: string)` — same return type as today.

- [ ] **Step 1: Create `src/data/clerks.ts`**

Paolo's persona text is moved **verbatim** from `deepseek-service.ts` (the character portion — the stock-list and JSON-format instructions stay in the service, which appends them for every clerk):

```ts
import { captainPaoFavoriteMovies } from './captainpao-movies';
import { unclePaiFavoriteMovies } from './unclepai-movies';
import paoloImage from '../assets/images/pao-video-clerk.png';
import unclePaiImage from '../assets/images/pao-video-clerk-2.png';

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
  },
];
```

- [ ] **Step 2: Update `src/services/deepseek-service.ts`**

Replace the hardcoded persona with a parameter; the service composes persona + stock list + JSON-format instructions:

```ts
import { DEEPSEEK_API_URL } from '../config/api';
import { FavoriteMovie } from '../data/clerks';

export const deepseekService = {
  async getRecommendations(prompt: string, availableMovies: FavoriteMovie[], personaPrompt: string): Promise<{ recommendations: FavoriteMovie[], rationale: string }> {
    const movieList = availableMovies.map(m => `- ${m.title} (ID: ${m.id})`).join('\n');

    const systemPrompt = `
${personaPrompt}

Here is the list of movies you have in stock:
${movieList}

When the user asks for a recommendation, you must:
1. Select 3-5 movies from the list that best match their request.
2. Write your rationale in your own voice as described above.
3. Return ONLY a JSON object with the following structure:
{
  "recommendations": [123, 456, 789],
  "rationale": "Your explanation here..."
}
4. Do not include any other text or explanation in the response, just the JSON.
    `;
```

The rest of the function body (fetch, JSON extraction, filter by ids, return) is unchanged, except the error message `'Invalid response format from Paolo'` becomes `'Invalid response format from the clerk'`.

- [ ] **Step 3: Lint**

```bash
npm run lint
```

Expected: FAIL or type errors are acceptable here ONLY from `movie-app.ts` still calling the 2-arg signature — actually `movie-app.ts` passes `(query, captainPaoFavoriteMovies)`; TS will flag the missing third argument at build time, and lint may pass. To keep this task independently green, do NOT run `tsc` here; Task 3+4 restore full type-correctness. If `npm run lint` fails on the changed files themselves, fix before committing.

- [ ] **Step 4: Commit**

```bash
git add src/data/clerks.ts src/services/deepseek-service.ts
git commit -m "feat: clerk config with per-clerk persona; deepseek persona as parameter"
```

---

### Task 3: Landing page component

**Files:**
- Create: `src/components/landing-page.ts`

**Interfaces:**
- Consumes: `clerks`, `Clerk` from `src/data/clerks.ts`.
- Produces: `<landing-page>` custom element dispatching `clerk-selected` (`CustomEvent<{ clerk: Clerk }>`, `bubbles: true, composed: true`).

- [ ] **Step 1: Create `src/components/landing-page.ts`**

```ts
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { clerks, Clerk } from '../data/clerks';

@customElement('landing-page')
export class LandingPage extends LitElement {
  createRenderRoot() {
    return this;
  }

  private _selectClerk(clerk: Clerk) {
    this.dispatchEvent(
      new CustomEvent('clerk-selected', {
        detail: { clerk },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <h1 class="text-5xl sm:text-7xl font-extrabold text-yellow-400 tracking-tight text-center" style="font-family: 'Impact', 'Arial Black', sans-serif;">
          PAO FICTION
        </h1>
        <p class="mt-3 text-lg sm:text-xl text-indigo-200 text-center">The video store. Choose your clerk.</p>

        <div class="mt-12 flex flex-col sm:flex-row gap-8 w-full max-w-3xl justify-center">
          ${clerks.map(
            (clerk) => html`
              <button
                class="group flex-1 bg-white/10 backdrop-blur rounded-2xl p-6 flex flex-col items-center
                       border border-white/20 hover:border-yellow-400 hover:bg-white/20
                       transition-all duration-200 cursor-pointer"
                @click=${() => this._selectClerk(clerk)}
              >
                <img
                  src=${clerk.image}
                  alt=${clerk.name}
                  class="h-56 sm:h-64 object-contain group-hover:scale-105 transition-transform duration-200"
                />
                <h2 class="mt-4 text-2xl font-bold text-white">${clerk.name}</h2>
                <p class="mt-1 text-sm text-indigo-200 text-center">${clerk.tagline}</p>
              </button>
            `
          )}
        </div>
      </div>
    `;
  }
}
```

(No gradient here — `movie-app`'s existing outer wrapper already provides the page background.)

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Expected: exit 0 for this file.

- [ ] **Step 3: Commit**

```bash
git add src/components/landing-page.ts
git commit -m "feat: Pao Fiction landing page with clerk selection"
```

---

### Task 4: Wire clerk selection through movie-app

**Files:**
- Modify: `src/components/movie-app.ts`

**Interfaces:**
- Consumes: `Clerk` / `clerks` types, `<landing-page>` + `clerk-selected` event (Task 3), 3-arg `deepseekService.getRecommendations` (Task 2).

- [ ] **Step 1: Update imports and state in `movie-app.ts`**

Remove:

```ts
import { captainPaoFavoriteMovies } from '../data/captainpao-movies';
import paoVideoClerkBg from '../assets/images/pao-video-clerk.png';
```

Add:

```ts
import { Clerk } from '../data/clerks';
import './landing-page';
```

Add state field alongside the others:

```ts
  private _clerk: Clerk | null = null;
```

Remove the `connectedCallback` auto-load (movies now load on clerk selection):

```ts
  connectedCallback(): void {
    super.connectedCallback();
  }
```

(or delete the override entirely — preferred.)

- [ ] **Step 2: Rename `_loadCaptainPaoMovies` → `_loadClerkMovies` and use the clerk's list**

Same body, with `captainPaoFavoriteMovies` replaced by `this._clerk!.movies` (both occurrences: the slice source and the `totalPages` computation). Update the one other caller: `_handleSearchClear`, and `_handlePageChange`'s else-branch.

- [ ] **Step 3: Use the clerk's persona and list in `_searchMovies`**

```ts
      const { recommendations, rationale } = await deepseekService.getRecommendations(
        query,
        this._clerk!.movies,
        this._clerk!.personaPrompt
      );
```

- [ ] **Step 4: Add selection + change-clerk handlers**

```ts
  private _handleClerkSelected(event: CustomEvent) {
    this._clerk = event.detail.clerk;
    this._loadClerkMovies();
  }

  private _handleChangeClerk() {
    this._clerk = null;
    this._movies = [];
    this._rationale = '';
    this._searchMode = false;
    this._currentQuery = '';
    this._selectedMovie = null;
    this._detailError = '';
    this.requestUpdate();
  }
```

- [ ] **Step 5: Update `render()`**

Top of the template: when no clerk is chosen, show the landing page inside the existing gradient wrapper. When chosen, render the store as today with clerk-driven values plus a "Change clerk" button:

```ts
  render() {
    return html`
      <div class="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900">
        <div class="max-w-[1600px] mx-auto relative">
          ${!this._clerk
            ? html`<landing-page @clerk-selected=${this._handleClerkSelected}></landing-page>`
            : html`
                <div class="p-4">
                  <button
                    class="mb-2 text-sm text-indigo-200 hover:text-yellow-400 transition-colors duration-200"
                    @click=${this._handleChangeClerk}
                  >
                    ← Change clerk
                  </button>
                  ...existing detail/store template unchanged...
                </div>
              `}
        </div>
        ...existing error toast unchanged...
      </div>
    `;
  }
```

Inside the store branch, two substitutions:
- search-bar wrapper background: `url('${this._clerk.image}')` instead of `url('${paoVideoClerkBg}')`
- rationale cite: `<cite class="block text-right text-sm italic mt-2">${this._clerk.quoteAttribution}</cite>`

- [ ] **Step 6: Build + lint**

```bash
npm run lint && npm run build
```

Expected: both exit 0 (this is the first point since Task 2 where `tsc` must fully pass).

- [ ] **Step 7: Commit**

```bash
git add src/components/movie-app.ts
git commit -m "feat: clerk selection flow — landing page gates the store"
```

---

### Task 5: End-to-end verification

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server and walk the flow**

```bash
npm run dev
```

Then in the browser (backend at `localhost:3001` must be running for TMDB/DeepSeek):
1. Landing shows "PAO FICTION" + both clerks. No movie grid behind it.
2. Pick **Paolo** → his 100 films load (page 1 of 5), search "something with revenge" → sarcastic rationale cited "Paolo, Video Clerk".
3. "← Change clerk" → landing again (no state leaking: no old grid/rationale flash).
4. Pick **Uncle Pai** → his list loads with posters (proves TMDB ids are right — spot-check ~10 across pages 1–5: titles match ranks). Search "I feel lost in my career" → serene proverb rationale cited "Uncle Pai, Video Clerk".
5. Click a movie → detail loads → back works. Pagination works on both clerks.
6. Mobile width (375px): clerk cards stack vertically; everything reachable.

- [ ] **Step 2: Fix anything found, re-run `npm run lint && npm run build`, commit fixes**

```bash
git commit -am "fix: <what was found>"
```

(Only if fixes were needed.)

---

## Self-Review Notes

- Spec coverage: clerk config (T2), Uncle Pai list + id verification (T1), landing page (T3), movie-app wiring + change-clerk + persona param (T2/T4), manual test plan (T5). Persistence/routing intentionally absent per spec.
- Type consistency: `FavoriteMovie.id: number | null` matches the `null`-seeded data file and existing fallback path in `movie-app` (`(m as any).id` check). `getRecommendations` 3-arg signature used consistently in T2 and T4.
- No test framework exists; gates are lint + tsc-via-build + script match-check output + the T5 manual walkthrough. This follows the repo's existing practice.
