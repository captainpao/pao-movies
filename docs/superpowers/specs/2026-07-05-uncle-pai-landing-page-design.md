# Uncle Pai + Pao Fiction Landing Page — Design

**Date:** 2026-07-05
**Branch:** `feature/uncle-pai`

## Goal

Add a second video clerk, **Uncle Pai** (wise, warm, philosophical martial-arts grandmaster — inspired by Pai Mei in Kill Bill), alongside Paolo. A new landing page for the "Pao Fiction" video store lets the visitor choose which clerk serves them. Each clerk has his own 100-film favourites list and his own recommendation persona.

## Decisions

- **Switching clerks:** "Change clerk" button returns to the landing page. No in-app toggle.
- **Persistence:** none — landing page shows on every visit/reload.
- **Uncle Pai's voice:** warm sage. Gentle proverbs, kind philosophical elder; sees the lesson your soul needs in each film. (Contrast with Paolo's sarcastic Tarantino-clerk voice.)

## Components

### 1. Clerk config — `src/data/clerks.ts`

```ts
interface Clerk {
  id: 'paolo' | 'uncle-pai';
  name: string;
  tagline: string;
  image: string;            // imported asset
  movies: FavoriteMovie[];  // the clerk's 100-film list
  personaPrompt: string;    // system prompt for DeepSeek
  quoteAttribution: string; // e.g. "Paolo, Video Clerk"
}
```

Exports `clerks: Clerk[]` with both configs. Paolo's existing persona prompt moves out of `deepseek-service.ts` into his config, unchanged. Uncle Pai's prompt: warm sage persona, recommends 3–5 films from his list, returns the same JSON shape (`recommendations` ids + `rationale`).

### 2. Uncle Pai's list — `src/data/unclepai-movies.ts`

Same shape as `captainpao-movies.ts` (`rank, title, year, director, id`). 100 films: King Hu wuxia, Shaw Brothers kung fu, Kurosawa, samurai cinema (Harakiri, Sword of Doom, Lone Wolf and Cub), Bruce Lee, Zhang Yimou, Wong Kar-wai's The Grandmaster, Korean/Japanese philosophical cinema (Spring Summer Fall Winter… and Spring, Ikiru, Departures), Ozu, and kindred spirits.

**TMDB id verification:** a one-off script in `scripts/` fetches each id via the backend TMDB proxy and flags title mismatches. Fix all mismatches before merge.

### 3. Landing page — `src/components/landing-page.ts`

Full-screen "Pao Fiction" storefront. Title, two clerk portraits side by side (stacked on mobile), name + tagline under each. Click a clerk → dispatch `clerk-selected` event with the clerk. Tailwind only, Light DOM, matches existing blue/indigo gradient aesthetic.

### 4. `movie-app` changes

- New state `_clerk: Clerk | null = null`.
- `null` → render `<landing-page>`; selected → existing store UI.
- Clerk-specific reads: `this._clerk.movies` (replaces hardcoded `captainPaoFavoriteMovies`), `this._clerk.image` (search-bar background), `this._clerk.quoteAttribution` (rationale cite).
- "← Change clerk" button near the top: sets `_clerk = null`, resets movies/search/rationale state.
- `deepseekService.getRecommendations(prompt, availableMovies, personaPrompt)` — persona becomes a parameter.

## Error handling

Existing fallbacks cover failed TMDB fetches (placeholder movie object). Verification script is the safety net against wrong ids. No new error paths.

## Testing

- Verification script must report 100/100 title matches for Uncle Pai's list.
- Manual: landing → pick Paolo → browse/search/detail works as before → change clerk → pick Uncle Pai → his list loads, search returns sage-voiced rationale attributed to Uncle Pai.

## Out of scope (YAGNI)

Routing, localStorage persistence, clerk registry beyond two entries, animations beyond simple hover states.
