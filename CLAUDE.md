# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**ska032104** — Personal portfolio website for software & hardware projects.
Live at `ska032104.online`, hosted on GitHub Pages (repo: `Ska0321/ska032104.online`).

**Stack:** React 18, Vite, Tailwind CSS v3, Framer Motion, React Icons

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Dev server → http://localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

## Deployment

Auto-deploys via `.github/workflows/deploy.yml` on push to `main`/`master`.
GitHub Pages must have **Source: GitHub Actions** enabled in repo settings.
Custom domain is configured via `public/CNAME` → `ska032104.online`.

## Architecture

Single-page app, smooth-scroll between sections. No routing library needed.

| Component | Purpose |
|-----------|---------|
| `Navbar` | Fixed top bar, transparent → blurred on scroll, mobile hamburger |
| `Hero` | Full-screen with CSS grid background + Framer Motion stagger |
| `Projects` | Filterable card grid (All / Software / Hardware) with `AnimatePresence` |
| `Resume` | Two-column: experience/education timeline (left) + skill tags (right) |
| `Contact` | Social links + async Formspree form with sent/error state |
| `Footer` | Copyright + social icons |

**All content lives in `src/data/`** — edit `projects.js` and `resume.js` to update the site without touching components.

## Design System

Custom Tailwind tokens — use these instead of raw hex values:

| Token | Value | Usage |
|-------|-------|-------|
| `bg-bg` | `#07090F` | Page background |
| `bg-surface` | `#0C1018` | Elevated surfaces |
| `bg-card` | `#111826` | Card backgrounds |
| `border-border` | `#1A2236` | Default borders |
| `text-accent` / `bg-accent` | `#00D4AA` | Teal accent — CTAs, highlights |

Fonts: `font-display` (Space Grotesk, headings) · `font-sans` (IBM Plex Sans, body) · `font-mono` (JetBrains Mono, labels/tags).

CSS utilities defined in `src/index.css`: `.glass` (glassmorphism card), `.bg-grid` (dot-grid pattern), `.bg-vignette` (edge fade), `.glow-accent`.

## Project Data Schema (`src/data/projects.js`)

Each project object supports:
```js
{
  id,          // unique number
  title,
  description, // short (shown on card)
  longDescription, // optional, shown on featured card
  tags,        // string[]
  category,    // 'software' | 'hardware'
  year,        // string
  featured,    // boolean — only ONE project should be featured; renders as FeaturedCard
  github,      // URL or null → shows lock icon when both null
  live,        // URL or null
  logo,        // path to image (featured card only)
  images,      // string[] — paths under /projects/; featured card shows 3 at a time
  image,       // single image path (non-featured fallback)
  comingSoon,  // boolean — renders dimmed ComingSoonCard, no image needed
}
```

Images live in `public/projects/` and are referenced as `/projects/filename.ext`.

## Content Files

- `src/data/projects.js` — project cards (see schema above)
- `src/data/resume.js` — exports `experience[]`, `education[]`, `skills[]`
- `src/components/Hero.jsx` — name, tagline, social links
- `src/components/Contact.jsx` — Formspree ID, LinkedIn, email
- `src/components/Footer.jsx` — LinkedIn link
- `public/resume.pdf` — CV linked from Navbar and Resume section
