# Changelog

All notable changes to this project are documented in this file.

## [1.0.6] — Unreleased

Ongoing development.

## [1.0.5] — 2026-04-01

### Added

- **Works** — On desktop, the works index preview column reuses the homepage grid trail and ripples while idle (`data-works-grid-root` + `initHomeGridTrail`); the effect stops while a row hover preview is open and restarts when the pointer leaves.

## [1.0.4] — 2026-04-01

### Added

- **Home** — Interactive square-cell trail and cyan ripples on canvas (`homeGridTrail.js`, `homeGridPage.ts`); `ParticlesSwarm` retired from the live bundle and preserved under `archive/home-particles-swarm/`.
- **Works** — Desktop hover preview in the works index sidebar (`worksIndexPreview.js`) with the same pixel-reveal treatment as case imagery.
- **Build & SEO** — `scripts/build-og-default.mjs` and `prebuild` hook; default Open Graph image at `public/og-default.png`; `src/pages/robots.txt.ts` with sitemap hint.
- **Security** — `public/_headers` (Netlify-style) and `vercel.json` response headers: Content-Security-Policy (Umami + self), Referrer-Policy, X-Content-Type-Options, X-Frame-Options, Permissions-Policy.
- **Dependencies** — Committed `package-lock.json` for reproducible installs.

### Changed

- **Performance** — Home grid animation schedules `requestAnimationFrame` only while there is trail, ripple, or pointer work; pauses when the document is hidden; pointer listeners use capture on the home root instead of `window`.
- **Code quality** — Shared `src/scripts/pixelReveal.ts` for `PixelImage` and works preview; typography scale tokens in `global.css` (`text-body-lg`, `text-mono-sm`, `text-nav`, `text-display`) replace repeated arbitrary `text-[…px]` utilities across layout and pages.
- **Accessibility** — Mobile menu: **Escape** closes overlay; focus moves to the first nav link when opened and returns to the menu button when closed (without stealing focus on initial load).

### Removed

- **`src/components/ParticlesSwarm.astro`** — Removed from active source; copy lives in `archive/home-particles-swarm/`.

## [1.0.4] — 2026-04-01

### Added

- **Home** — Interactive square-cell trail and cyan ripples on canvas (`homeGridTrail.js`, `homeGridPage.ts`); `ParticlesSwarm` retired from the live bundle and preserved under `archive/home-particles-swarm/`.
- **Works** — Desktop hover preview in the works index sidebar (`worksIndexPreview.js`) with the same pixel-reveal treatment as case imagery.
- **Build & SEO** — `scripts/build-og-default.mjs` and `prebuild` hook; default Open Graph image at `public/og-default.png`; `src/pages/robots.txt.ts` with sitemap hint.
- **Security** — `public/_headers` (Netlify-style) and `vercel.json` response headers: Content-Security-Policy (Umami + self), Referrer-Policy, X-Content-Type-Options, X-Frame-Options, Permissions-Policy.
- **Dependencies** — Committed `package-lock.json` for reproducible installs.

### Changed

- **Performance** — Home grid animation schedules `requestAnimationFrame` only while there is trail, ripple, or pointer work; pauses when the document is hidden; pointer listeners use capture on the home root instead of `window`.
- **Code quality** — Shared `src/scripts/pixelReveal.ts` for `PixelImage` and works preview; typography scale tokens in `global.css` (`text-body-lg`, `text-mono-sm`, `text-nav`, `text-display`) replace repeated arbitrary `text-[…px]` utilities across layout and pages.
- **Accessibility** — Mobile menu: **Escape** closes overlay; focus moves to the first nav link when opened and returns to the menu button when closed (without stealing focus on initial load).

### Removed

- **`src/components/ParticlesSwarm.astro`** — Removed from active source; copy lives in `archive/home-particles-swarm/`.

## [1.0.3] — 2026-03-30

### Added

- **About** — `HalftoneDotsImage` (paper halftone WebGL) and `TwinkleMask` block with mask asset under `public/masks/`; new imagery in `src/assets/about/` (lily, portrait).
- **Accessibility & shell** — Skip link to `#main-content`, `theme-color` matching page background, `main` landmark id, mobile menu `aria-expanded` / `aria-controls`, global `:focus-visible` outlines and `touch-action: manipulation` on links and buttons.
- **Motion** — `prefers-reduced-motion` respected for the loader, hover text shuffle, `PixelImage` reveal, halftone hosts, twinkle canvas, homepage particles (static cyan fallback), and the works case-study infinite scroll; `motion-reduce:` on key CSS transitions.
- **Config** — `site` in `astro.config.mjs` for canonical and Open Graph URLs.

### Changed

- **Design tokens** — Ghost foreground and border-muted aligned with `DESIGN_SYSTEM.md`; HTML/body background uses lime-1; Tangerine uses `font-display: swap`.
- **Header** — Current route is a focusable link with `aria-current="page"`; IBM Plex Mono import limited to weight 400.
- **Works** — Listing preview `<img>` with explicit dimensions and lazy loading; mono section labels at 14px; long project names truncate; case-study title uses Lausanne book (300) with `text-balance`.
- **Particles / debug UI** — Clear color and dev panel chrome read from CSS custom properties instead of hardcoded hex.
- **Halftone shader colors** — Derived from document tokens via `getComputedStyle` where applicable.

### Removed

- `HalftonePortrait.astro` and `public/about-background.png` (superseded by the new about visuals).

## [1.0.2] — 2026-03-30

### Added

- **Home** — `ParticlesSwarm` canvas background (Three.js) and refreshed bio copy on the landing view.
- **Loader** — Full-viewport load transition wired through `BaseLayout`.
- **About** — New long-form layout: hero line, About / Values / Get in touch sections (two-column on large screens, stacked on small), placeholder image blocks, and mailto to `contact@aymericfremont.com`.
- **Works listing** — Visual and interaction updates on the works index page.
- **Case studies** — `PixelImage` treatment for case imagery; small integration tweaks on project pages.
- **Typography** — Tangerine webfont (`public/fonts/Tangerine-Regular.woff2`) and `.rendering-pixelated` utility for crisp upscaled bitmaps.
- **Dependencies** — `three` and `@types/three` for the home experience.

### Changed

- **SEO** — Project collection entries renamed so URLs read `/works/lounge-cruise/` and `/works/tico/` instead of generic `project-one` / `project-two` slugs.
- **Layout & nav** — Header and shell adjustments alongside the loader; `LogoWidget` removed in favor of the new home treatment.

### Removed

- `LogoWidget.astro` (superseded by updated home layout).

## [1.0.1] — 2026-03-23

The TiCO case study is now live with full sections and image assets.

The content schema now supports image-only section variants.

Case study pages include an email button so visitors can reach out directly.

The site favicon has been replaced with a custom AF monogram.

## [1.0.0] — 2026-03-22

The portfolio is now live, hosted on Infomaniak — an eco-friendly Swiss provider running on 100% renewable energy.

Pushing to `main` now triggers an automated GitHub Actions pipeline that handles FTP deployment with no manual steps.

The Lounge Cruise case study is included at launch with full sections and image compositions.

The About page features a halftone dot shader effect built with paper-design/shaders.

Analytics are handled by Umami — privacy-friendly and cookie-free by default.

The codebase went through a full audit before launch covering image optimization, font pruning, design token usage, and component extraction.
