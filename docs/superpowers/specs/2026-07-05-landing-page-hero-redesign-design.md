# Landing Page Hero Redesign — Design

**Date:** 2026-07-05
**Branch:** `feature/landing-redesign` (off `main` @ 9bade42)

## Problem

The current landing page ([landing-page.ts](../../../src/components/landing-page.ts)) reads as "floating in a void": a dark gradient, a gold Bungee title, a one-line subtitle, and two glassmorphism cards suspended in empty space. The two clerks — the page's best asset — have no environment to stand in, so the page feels unfinished.

## Direction (chosen)

Ground the page with a **generated hero storefront band** at the top, rendered in the same 3D animated-film style as the clerks, so the picker cards sit *inside a place* instead of a void. The store's marquee sign is left blank in the image and the real **Bungee "PAO FICTION" wordmark is overlaid in CSS** — pixel-perfect brand type, correct spelling, crisp at every size.

The generated night-sky blues intentionally match the page's existing `from-blue-900 via-indigo-900 to-slate-900` gradient, so the hero melts into the card section below with no hard seam.

## Asset

- **File:** `src/assets/images/pao-fiction-storefront.webp` (already generated + committed with this work; 3168×1344, 21:9, ~288 KB).
- Content: Pixar/Disney-style 3D night storefront — VHS video store on a rain-slick corner, warm-lit windows full of tape spines, neon accents, puddle reflections, deep blue/purple sky. A **blank illuminated marquee** framed with round bulbs sits upper-center. No people, no text.
- Source: Higgsfield `nano_banana_pro`, 21:9 2k. Full-res PNG backup in `.scratch/` (not committed).

## Component design — `src/components/landing-page.ts`

Restructure `render()` into two stacked regions. Light DOM + Tailwind only (unchanged conventions). The `clerk-selected` event and the clerk-card markup/behavior are **unchanged** — only their surrounding layout changes.

### 1. Hero band

```
<div class="relative w-full">           // positioning context for the overlay
  <img src=heroImg
       alt="The Pao Fiction video store at night"
       class="w-full h-auto block select-none pointer-events-none" />
  // bottom fade so the image melts into the page gradient
  <div class="absolute inset-x-0 bottom-0 h-24 sm:h-32
              bg-gradient-to-b from-transparent to-slate-900
              pointer-events-none"></div>
  // Bungee wordmark on the marquee (real <h1>, not baked into the image)
  <h1 class="absolute left-1/2 -translate-x-1/2 top-[13%]
             w-[26%] text-center leading-none font-bungee
             text-transparent bg-clip-text bg-gradient-to-br
             from-[#fff200] via-[#ffe600] to-[#d57e05]
             drop-shadow-[0_2px_0_rgba(0,0,0,0.35)]
             text-[clamp(0.7rem,3.6vw,4rem)]">
    PAO FICTION
  </h1>
</div>
```

- The wordmark is the semantic `<h1>` (real text → SEO/screen readers); the image `alt` describes the scene.
- **Marquee-fit values (`top`, `w`, font `clamp`) are starting points and MUST be tuned live** against the rendered image in the browser preview — raster-overlay alignment always needs a nudge. The marquee blank panel sits roughly: horizontal center ≈ 54% of image width, vertical band ≈ 8%–30% of image height. Tune until the wordmark sits cleanly inside the bulb frame at desktop (≥1280px), tablet, and 375px mobile.
- Because positioning is percentage-based over a non-cropped `w-full h-auto` image, the overlay tracks the marquee across widths.

### 2. Picker section (below hero)

```
<div class="px-4 pb-12 -mt-4 sm:-mt-8">   // slight overlap pulls cards up into the scene
  <p class="text-center text-lg sm:text-xl text-indigo-200 mb-8">
    The video store. Choose your clerk.
  </p>
  <div class="flex flex-col sm:flex-row gap-8 w-full max-w-3xl mx-auto justify-center">
    ...existing clerk-card buttons, unchanged...
  </div>
</div>
```

- Subtitle moves out of the hero to just above the cards (its old spot under the floating title is gone).
- Cards keep the existing glassmorphism + hover + `clerk-selected` dispatch verbatim.

### Outer wrapper

`landing-page` renders inside `movie-app`'s existing `min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900` wrapper, which supplies the page background the hero fades into. The landing component itself adds **no** background/gradient (as today). Remove the old `min-h-screen flex items-center justify-center` centering wrapper — content now flows top-down from the hero.

## Responsive behavior

- **Desktop/tablet:** hero spans full width at 21:9; wordmark on the marquee; cards row below.
- **Mobile (375px):** 21:9 hero becomes a short full-width band; wordmark scales via the `clamp()` font size; cards stack vertically (already the case). Verify the wordmark still fits the marquee at this width during live tuning.

## Error handling / edge cases

- Image is a bundled static asset (Vite import), so no network failure path. If the import fails at build, the build fails — caught pre-ship.
- `pointer-events-none` on image + fade so only the cards are interactive.

## Testing

No unit-test framework in this repo. Gates:
- `npm run build` exits 0.
- `npm run lint` introduces no new non-prettier errors on the touched file.
- **Live preview walkthrough** (the real test): hero renders, Bungee wordmark sits cleanly on the marquee at desktop / tablet / 375px, night sky blends into the cards with no hard seam, both clerk cards still select and fire `clerk-selected`, "Change clerk" still returns here.

## Out of scope (YAGNI)

Store-view changes, card redesign, animations beyond existing hover, parallax/motion on the hero, generating alternate hero variants (locked on the one image; credits exhausted anyway).
