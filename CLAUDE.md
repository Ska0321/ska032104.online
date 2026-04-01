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

## Customization Checklist

- `src/data/projects.js` — replace placeholder projects with real ones
- `src/data/resume.js` — replace placeholder experience, education, skills
- `src/components/Hero.jsx` — replace "Your Name" and social links/email
- `src/components/Contact.jsx` — replace Formspree ID (`YOUR_FORM_ID`), LinkedIn, email
- `src/components/Footer.jsx` — update LinkedIn link
- `public/resume.pdf` — add CV PDF (linked from Navbar CV button + Resume Download CV button)

## Contact Form Setup

The form uses [Formspree](https://formspree.io) (free tier, no backend needed):
1. Sign up at formspree.io
2. Create a new form, copy the form ID
3. Replace `YOUR_FORM_ID` in `src/components/Contact.jsx`
