# Adding a new clerk

Clerks are fully data-driven: the landing page, the store, the search bar, and
the DeepSeek persona all read from the `clerks` array in
[`src/data/clerks.ts`](../src/data/clerks.ts). Hiring a new colleague is three
steps — no layout or component changes required.

## 1. Portrait

Add a transparent-background PNG of the character to
`src/assets/images/<clerk-id>.png`, in the same 3D animated style as the
existing clerks (a head-and-shoulders cutout works best on the yellow card
tile).

## 2. Movie list + TMDB ids

Create `src/data/<clerk-id>-movies.ts` exporting a `<name>FavoriteMovies`
array, same shape as the others:

```ts
export const someClerkFavoriteMovies = [
  { rank: 1, title: 'Seven Samurai', year: 1954, director: 'Akira Kurosawa', id: null },
  // ...as many as you like
];
```

Leave every `id` as `null`, then resolve them automatically with the helper
script (it looks each film up on TMDB and rewrites the file):

```bash
node scripts/fetch-ids.cjs ../src/data/<clerk-id>-movies.ts someClerkFavoriteMovies
```

Review the `MATCH CHECK` warnings it prints. An alternate/English/romanized
title of the same film is fine; a genuinely wrong film (wrong year, remake,
sequel) means fix that one `id` by hand. Every entry must end with a non-null
id.

## 3. Register the clerk

Append one entry to the `clerks` array in `src/data/clerks.ts` (and add the two
imports at the top):

```ts
import someClerkImage from '../assets/images/some-clerk.png';
import { someClerkFavoriteMovies } from './some-clerk-movies';

// ...inside the clerks array:
{
  id: 'some-clerk',
  name: 'Name',
  tagline: 'Short one-liner shown on the picker card.',
  image: someClerkImage,
  movies: someClerkFavoriteMovies,
  personaPrompt: `
You are Name, a video store clerk who ...
Describe their voice and taste. When you write your rationale, ...`,
  quoteAttribution: 'Name, Video Clerk',
  searchTagline: 'Header line shown above the search bar.',
  searchPlaceholder: 'Tell Name what you're after — like, "…".',
}
```

That's it. The landing picker (a `flex-wrap` grid) re-centers for any number of
clerks, and selecting the new clerk wires their list + persona into the store
automatically.
