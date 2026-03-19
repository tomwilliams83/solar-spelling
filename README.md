# 🚀 Solar Spelling Adventure

A Progressive Web App spelling game for Year 3 UK pupils. Journey through the solar system by spelling words correctly — starting from Ceres and working your way out to Jupiter!

## Features

- 🪐 **7 planet levels** — Ceres, Pluto, Mercury, Venus, Earth, Mars, Jupiter
- 🎧 **Three question types** — Listen & spell, choose the correct spelling, fill the missing word
- 🌍 **British English spellings** pitched at Year 3 level, getting harder as planets get bigger
- 🚀 **Rocket travel animations** — fly between worlds, passing planets along the way
- 🔭 **Fun space facts** unlocked after each level
- 🥇 **Medal system** — Bronze, Silver, Gold based on score
- 👩‍🚀 **Custom profile** — choose your name and astronaut avatar
- 💾 **Auto-save** — progress saved in localStorage
- 📱 **PWA** — install on phones and tablets, works offline
- 🔊 **Text-to-speech** — words and sentences are read aloud (Web Speech API)

## Tech Stack

- React 18 + Vite 5
- `vite-plugin-pwa` for service worker and manifest
- Web Speech API for audio
- No external UI dependencies — all CSS is hand-crafted

## Getting Started

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Building for Production

```bash
npm run build
npm run preview   # preview the production build locally
```

## Deploying to Vercel

### Option A — Vercel CLI (quickest)

```bash
npm i -g vercel
vercel
```

### Option B — GitHub + Vercel Dashboard

1. Push this repo to GitHub
2. Go to https://vercel.com/new and import the repo
3. Vercel will auto-detect Vite — just click **Deploy**

### Option C — GitHub Actions (automatic on push)

Add these secrets to your GitHub repo (Settings → Secrets → Actions):

| Secret | Where to find it |
|--------|-----------------|
| `VERCEL_TOKEN` | https://vercel.com/account/tokens |
| `VERCEL_ORG_ID` | `.vercel/project.json` after running `vercel` once |
| `VERCEL_PROJECT_ID` | `.vercel/project.json` after running `vercel` once |

Every push to `main` will then deploy automatically.

## PWA Icons

The app needs `pwa-192x192.png` and `pwa-512x512.png` in the `public/` folder for full PWA support. You can generate these from `public/favicon.svg` using any icon generator (e.g. https://realfavicongenerator.net).

## Curriculum Notes

Words are selected for Year 3 UK National Curriculum expectations:
- **Ceres & Pluto** — simple CVC and CCVC words (cat, run, cold, rock)
- **Mercury & Venus** — common digraphs and long vowel patterns (bright, night, cloud, orbit)
- **Earth & Mars** — two-syllable words with common suffixes (ocean, breathe, desert, explore)
- **Jupiter** — three-syllable words and more complex patterns (enormous, atmosphere, hydrogen)

All spellings follow British English conventions (e.g. *colour*, *centre*, *programme*).

## Customising

All word lists are in `src/data/levels.js`. Each planet object has:
- `words` — array of `{ word, distractors }` for the spelling tests
- `sentences` — array of `{ sentence, answer }` for the fill-the-gap questions  
- `facts` — array of fun facts shown after completing the level

## Licence

MIT — free to use in schools and at home.
