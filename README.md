# Portfolio — Aymeric Fremont (2026)

Personal portfolio showcasing UX/UI, branding, and design projects.

**Live:** [aymericfremont.com](https://aymericfremont.com)

## Stack

- [Astro 6](https://astro.build) — static site generator
- [Tailwind CSS 4](https://tailwindcss.com) — utility-first styling
- [Paper Shaders](https://github.com/paper-design/shaders) — WebGL halftone effect (about page)
- [Bun](https://bun.sh) — package manager & runtime
- Hosted on [Infomaniak](https://infomaniak.com) — eco-friendly Swiss hosting (100% renewable energy)
- Auto-deployed via GitHub Actions on push to `main`

## Getting started

```bash
# Clone
git clone https://github.com/Ayymer/Portfolio-Aymeric-2026.git
cd Portfolio-Aymeric-2026

# Install
bun install

# Dev server
bun run dev

# Build
bun run build
```

## Project structure

```
src/
├── layouts/          # Shared layout (header, footer, meta)
├── pages/            # Astro pages (index, about, works, lab)
├── components/       # Reusable UI components
├── content/          # Content collections (projects)
└── styles/           # Global CSS & Tailwind config
public/               # Static assets (images, fonts, SVGs)
.github/workflows/    # CI/CD (auto-deploy to Infomaniak via FTP)
```

## Design

Designed in Figma — [view the design file](https://www.figma.com/design/d387FE7lye4kCfo0pKDb46/Portfolio-Aymeric-2026).

Built using the Figma MCP → Claude Code workflow for design-to-code fidelity.

**Fonts:** TWK Lausanne, IBM Plex Mono

## Deployment

Pushes to `main` trigger an automatic build & deploy via GitHub Actions → FTP to Infomaniak shared hosting. Work on feature branches and merge to `main` when ready to go live.

## Project tracking

Issues tracked in [Linear](https://linear.app/ayymer/project/portfolio-070ab2cecdca/overview).

## License

All rights reserved. This is a personal portfolio — code and design are not licensed for reuse.
