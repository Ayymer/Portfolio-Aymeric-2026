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
