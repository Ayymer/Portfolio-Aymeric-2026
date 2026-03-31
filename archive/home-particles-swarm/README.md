# Archived: ParticlesSwarm (homepage background)

This folder preserves the previous full-frame **Three.js** hero from the portfolio homepage.

## Original location

- Component: `src/components/ParticlesSwarm.astro` (removed from the live tree when archived)

## How it was used

```astro
import ParticlesSwarm from '../components/ParticlesSwarm.astro';
<!-- ... -->
<ParticlesSwarm />
```

Mounted inside `src/pages/index.astro` in a `relative min-h-0 flex-1` wrapper with `#swarm-container` (`absolute inset-0`).

## Dependencies

- `three` (npm), including `EffectComposer`, `RenderPass`, `UnrealBloomPass` from `three/examples/jsm/postprocessing/`

## Behaviour notes

- **Reduced motion**: If `prefers-reduced-motion: reduce`, WebGL is skipped and a solid `--color-cyan-1` div is shown instead.
- **Debug**: **Shift+D** toggled an on-screen panel for swarm parameters (not for production visitors).

## Restore

Copy `ParticlesSwarm.astro` back to `src/components/`, import it again in `src/pages/index.astro`, and remove or hide the replacement hero component.
