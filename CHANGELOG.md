# Changelog

All notable changes to this project are documented in this file.

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
