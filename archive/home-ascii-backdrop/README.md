# Archived: HomeAsciiBackdrop (homepage shader ASCII)

This folder preserves the **Three.js** full-frame hero: extruded `TextGeometry` (“AYMERIC”) rendered to an off-screen target, then a **fragment shader** samples luma/edges and maps them to an ASCII glyph atlas.

## Original location

- Component: `src/components/HomeAsciiBackdrop.astro` (removed from the live tree when archived)

## Assets

- `fonts/helvetiker_regular.typeface.json` — Three.js `FontLoader` typeface (was served from `public/fonts/`).

## How it was used

```astro
import HomeAsciiBackdrop from '../components/HomeAsciiBackdrop.astro';
<!-- ... -->
<HomeAsciiBackdrop />
```

Mounted in `src/pages/index.astro` inside a `relative flex-1 min-h-0` wrapper with bio copy as an `absolute` overlay (`z-[1]`).

## Dependencies

- `three` (npm): `WebGLRenderer`, `ShaderMaterial`, `TextGeometry`, `FontLoader`, render targets.

## Behaviour notes

- **Reduced motion**: If `prefers-reduced-motion: reduce`, WebGL is skipped and a solid `--color-cyan-1` div fills the root.
- **DPR**: Capped for performance; `saveData` and narrow viewports use lower effective DPR.
- **Atlas**: Refreshed after `document.fonts.ready` so IBM Plex Mono metrics match the canvas-drawn glyph atlas.

## Restore

1. Add `three` (and optionally `@types/three`) back to `package.json`, then `npm install`.
2. Copy `HomeAsciiBackdrop.astro` to `src/components/`.
3. Copy `fonts/helvetiker_regular.typeface.json` to `public/fonts/helvetiker_regular.typeface.json`.
4. Import and mount `<HomeAsciiBackdrop />` on the homepage again (with a sized parent, e.g. `relative flex-1 min-h-0`).
