# Portfolio Aymeric 2026 — Design System

> Source: Figma file `d387FE7lye4kCfo0pKDb46`, page "Design"
> Kit: Shadcn (Obra) + custom tokens
> Stack target: Next.js · TypeScript · Tailwind CSS · shadcn/ui

---

## Concept

The UI is inspired by **IDE / code editor** interfaces:
- Folder-icon project lists (file explorer metaphor)
- Monospaced labels wrapped in parentheses: `(YEAR)`, `(SERVICES)`
- Section titles prefixed with a slash: `/ Work Selection - [7]`, `/ Project Name`
- Window title bars (`Hello World!` + minimize button)
- Two-panel layout: file-tree left, content right
- Dashed borders on metadata rows
- Frame panels with semi-transparent dark-green borders

Everything should feel **pixel-perfect, clean, and technically precise** with a subtle eco/nature palette.

---

## Color Tokens

Define these as CSS custom properties in `globals.css`:

```css
:root {
  /* Lime scale */
  --lime-1:  #fbfefa; /* page/panel background */
  --lime-11: #3b8021; /* accent green — labels, captions, metadata text */
  --lime-12: #273f1c; /* dark green — primary body text */

  /* Cyan scale */
  --cyan-1:  #f9fdfe; /* card / inner container background */
  --cyan-3:  #ddf7f8; /* active/hover state on list rows */

  /* Neutrals */
  --ghost:            rgba(255, 255, 255, 0); /* transparent ghost bg */
  --ghost-foreground: #404040;                /* secondary text (nav items) */
  --border-muted:     #737373;               /* list row separators */
  --frame-stroke:     rgba(39, 63, 28, 0.7); /* panel/frame borders */

  /* Utility */
  --placeholder: #d9d9d9; /* image placeholder bg */
}
```

### Color Usage

| Token            | Usage                                                      |
|------------------|------------------------------------------------------------|
| `--lime-1`       | Page bg, outer panel bg, logo widget bg                    |
| `--lime-11`      | Accent text, metadata labels/values, dashed row borders    |
| `--lime-12`      | Primary text — body copy, project names, nav active        |
| `--cyan-1`       | Inner card/container bg (nested inside lime-1 panels)      |
| `--cyan-3`       | Active project row background in the file-explorer list    |
| `--ghost-foreground` | Nav button text (inactive state at 50% opacity)        |
| `--frame-stroke` | All panel borders — outer frame, columns, cards            |
| `--border-muted` | Horizontal row separators in project list                  |

---

## Typography

### Fonts

| Family        | Weights Used | Role            |
|---------------|-------------|-----------------|
| TWK Lausanne  | 250, 350, 700 | All body & headings |
| IBM Plex Mono | 400 (Regular) | Labels, metadata, captions |

```css
/* In globals.css or font configuration */
@font-face { font-family: 'TWK Lausanne'; font-weight: 250; ... }
@font-face { font-family: 'TWK Lausanne'; font-weight: 350; ... }
@font-face { font-family: 'TWK Lausanne'; font-weight: 700; ... }
```

### Type Scale

| Token                  | Family       | Weight | Size | Line-height | Tracking | Usage                           |
|------------------------|-------------|--------|------|-------------|----------|---------------------------------|
| `paragraph/medium`     | TWK Lausanne | 350    | 16px | 24px        | 0        | Nav items, list items (default) |
| `paragraph/regular`    | TWK Lausanne | 250    | 16px | 24px        | 0        | Project names in file explorer  |
| `paragraph-lg/medium`  | TWK Lausanne | 350    | 24px | 27px        | 0        | Body copy, about text, subheadings |
| `paragraph-lg/regular` | TWK Lausanne | 250    | 24px | 27px        | 0        | Long-form text, project descriptions |
| `heading-1`            | TWK Lausanne | 700    | 48px | 48px        | -1.5px   | Project titles                  |
| `monospaced`           | IBM Plex Mono| 400    | 14px | 24px        | 0        | Labels `(YEAR)`, `(SERVICES)`, section titles `/ Name` |

### Tailwind font config example

```js
// tailwind.config.ts
fontFamily: {
  lausanne: ['TWK Lausanne', 'sans-serif'],
  mono: ['IBM Plex Mono', 'monospace'],
},
fontWeight: {
  light: '250',
  regular: '350',
  bold: '700',
},
```

---

## Spacing Tokens

```css
:root {
  --3xs: 2px;
  --2xs: 4px;
  --xs:  8px;
  --sm:  12px;
  --md:  16px;   /* default gap, page padding desktop (used as gap-4) */
  --lg:  20px;
  --xl:  24px;
  --2xl: 32px;
  --7xl: 96px;
  --10xl: 144px;

  --rounded-sm: 1px;   /* inner card radius */
  --rounded-lg: 8px;   /* button / ghost element radius */
}
```

### Common Spacing Patterns

| Context                          | Value |
|----------------------------------|-------|
| Page outer padding (desktop)     | 16px  |
| Page outer padding (mobile)      | 8px   |
| Gap between columns              | 16px  |
| Panel inner padding              | 4px   |
| Card inner padding               | 12px  |
| Content section inner padding    | 20px  |
| Body copy horizontal indent      | 144px |
| Logo widget horizontal padding   | 96px  |
| Row vertical padding (list)      | 4px   |
| Nav button padding               | px 8px py 2px |
| Social link padding              | px 4px py 2px |

---

## Layout

### Desktop (1440px)

```
┌─────────────────────────────────────────────────────────┐ 16px padding
│  [Logo] [Home] [Works] [Lab] [About]    [Email, Insta, LinkedIn] │ 36px header
│                                                         │ 8px gap
│  ┌──────────────────┐  ┌──────────────────────────────┐ │
│  │  Left column     │  │  Right column                │ │
│  │  459px           │  │  933px                       │ │
│  │  (file explorer) │  │  (project detail / content)  │ │
│  └──────────────────┘  └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Mobile (390px)

- Single column layout
- 8px page padding
- Header: logo left, hamburger menu right
- Full-width panels, same border/color system
- No file explorer split — list becomes full-width, then project detail below

### Panel Structure

Every major content area follows this nesting pattern:

```
outer panel (bg: --lime-1, border: --frame-stroke 1px, p: 4px)
  └── inner card (bg: --cyan-1, border: --frame-stroke 1px, radius: 1px, p: 12px–20px)
        └── content
```

---

## Components

### Navbar

- Logo (SVG, ~43px wide) + nav buttons + social links
- Nav buttons: ghost bg, `rounded-lg` (8px), `px-xs py-3xs`
- **Active state**: full opacity, `--lime-12` text
- **Inactive state**: `opacity-50`, `--ghost-foreground` (#404040) text
- Socials: comma-separated links (Email, Instagram, LinkedIn), same ghost styling

```tsx
// Pattern
<nav className="flex items-center gap-0">
  <Logo />
  <NavButton label="Home"  active />
  <NavButton label="Works" />
  <NavButton label="Lab"   />
  <NavButton label="About" />
</nav>
<Socials /> {/* right side */}
```

### Nav Button

```tsx
// Default (inactive)
<button className="... opacity-50 px-2 py-0.5 rounded-lg text-[--ghost-foreground]">
  Label
</button>

// Active / hover
<div className="... opacity-100 px-2 py-0.5 rounded-lg text-[--lime-12]">
  Label
</div>
```

### Section Title (IDE style)

```tsx
// Monospaced, small, dark green
<p className="font-mono text-[14px] leading-6 text-[--lime-12]">
  / Work Selection - [7]
</p>

<p className="font-mono text-[14px] leading-6 text-[--lime-12]">
  / Project Name
</p>
```

### Project List Row

Each row is 32px tall with a bottom border:

```tsx
// Inactive row
<div className="flex items-center gap-2 py-1 border-b border-[--border-muted]">
  <FolderIcon className="size-4" />
  <span className="font-lausanne font-light text-[16px] text-[--lime-12]">
    Project name
  </span>
</div>

// Active row (selected)
<div className="flex items-center gap-2 py-1 border-b border-[--border-muted] bg-[--cyan-3]">
  <FolderOpenIcon className="size-4" />
  <span className="font-lausanne font-light text-[16px] text-[--lime-12]">
    Project name
  </span>
</div>
```

### Project Detail Panel

```tsx
<div className="...outer-panel...">
  <span className="font-mono text-xs text-[--lime-12]">/ Project Name</span>

  <div className="...inner-card...">
    {/* Heading */}
    <h1 className="font-lausanne font-bold text-[48px] leading-[48px] tracking-[-1.5px] text-[--lime-12]">
      Project Name
    </h1>

    {/* Metadata table (right-aligned, ~393px wide) */}
    <div className="flex flex-col w-[393px]">
      <div className="flex justify-between py-1.5 border-b border-dashed border-[--lime-11]">
        <span className="font-mono text-[14px] text-[--lime-11]">(YEAR)</span>
        <span className="font-mono text-[14px] text-[--lime-11]">2023</span>
      </div>
      <div className="flex justify-between py-1.5 border-b border-dashed border-[--lime-11]">
        <span className="font-mono text-[14px] text-[--lime-11]">(SERVICES)</span>
        <span className="font-mono text-[14px] text-[--lime-11] text-right">
          Web design<br />Art direction<br />Web development
        </span>
      </div>
    </div>

    {/* Content */}
    <img className="w-full" ... />
    <p className="font-lausanne text-[24px] leading-[27px] text-[--lime-11]">About</p>
    <p className="font-lausanne font-light text-[24px] leading-[27px] text-[--lime-11] px-36">
      Description...
    </p>
  </div>
</div>
```

### Logo Widget (Homepage)

Window-style component with title bar and minimize button:

```tsx
<div className="bg-[--lime-1] border border-[--frame-stroke] p-[6.44px] flex flex-col gap-[6.44px]">
  {/* Title bar */}
  <div className="flex justify-between items-center">
    <span className="font-mono text-xs text-[--lime-12]">Hello World!</span>
    <MinusIcon className="size-6 cursor-pointer" />
  </div>
  {/* Logo display area */}
  <div className="bg-[--cyan-1] border border-[--frame-stroke] rounded-[1.61px] flex items-center justify-center py-10 px-8">
    <LogoSvg className="w-full" />
  </div>
</div>
```

### Homepage Body Text

```tsx
<p className="font-lausanne font-regular text-[24px] leading-[27px] text-[--lime-11] max-w-[552px]">
  I am Aymeric, ...
</p>
```

---

## Icons

- Source: Shadcn/Obra kit (Lucide-style)
- Used icons: `folder`, `folder-open`, `minus`
- Size: 16×16px for list rows
- Color: inherits from parent (`currentColor`)
- Import via Lucide React or inline SVG

---

## Responsive Breakpoints

| Breakpoint | Width  | Notes                          |
|-----------|--------|--------------------------------|
| Mobile    | 390px  | Single column, 8px padding     |
| Desktop   | 1440px | Two-column split, 16px padding |

No intermediate breakpoints observed in the design — implement mobile-first with a single `md:` or `lg:` breakpoint for the two-column layout.

---

## Tokens NOT Used (from Shadcn kit)

The Shadcn/Obra kit defines many tokens; only these are actively used in this portfolio:
- Colors: lime scale (1, 11, 12), cyan scale (1, 3), ghost, border-5
- Spacing: 3xs, 2xs, xs, sm, lg, xl, 2xl, 7xl, 10xl
- Radius: rounded-lg (8px), rounded-sm (1px)

Avoid bringing in unused Shadcn tokens to keep the design system lean.

---

## Pages

| Route      | Frame in Figma             | Description                           |
|-----------|---------------------------|---------------------------------------|
| `/`        | Desktop/Mobile - Homepage | Bio text + logo widget                |
| `/works`   | Desktop/Mobile - Works    | File-explorer list + project detail   |
| `/about`   | Desktop/Mobile - About    | Full-width heading + portrait image   |
| `/lab`     | (not in Design page)      | TBD                                   |
