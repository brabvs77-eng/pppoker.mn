# AGENTS.md

## Cursor Cloud specific instructions

This repository (`pppoker.mn`) is the Baatryn Öröö poker club website — a Mongolian-language marketing/info site.

### Tech stack
- **Vite** (vanilla JS, no framework)
- **Node.js 20+** required

### Commands
- `npm install` — install dependencies
- `npm run dev` — start dev server (port 5173)
- `npm run build` — production build to `dist/`
- `npm run preview` — preview production build

### Dev notes
- All content is in Mongolian (Cyrillic script)
- Design: dark theme (#0a0a0f), gold accents (#c9a84c), Playfair Display + Inter fonts
- Site sections: Hero, Games, Features, How-to, Academy, Cinema, FAQ, Footer
- No backend — static site only
- Images in `public/images/` (logo.png, slide-*.png, og-cover.png); favicons in `public/`

### Content & SEO workflow (thruuu)

Orchestrator: **`CLAUDE.md`** (full pipeline). Quick ref: `content/CONTENT.md`.

| Path | Purpose |
|------|---------|
| **`CLAUDE.md`** | **Orchestrator** — `create article`, 12-step agent pipeline |
| `GUIDELINE.md` | Brand voice, Zipf logic, AI visibility, GSC keywords |
| `content/CONTENT.md` | Short reference (points to CLAUDE.md) |
| `content/GUIDELINE_MAKER.md` | Interview to regenerate GUIDELINE.md |
| `.claude/agents/` | researcher → editor-in-chief (6 agents) |
| `briefs/` | thruuu content briefs |
| `drafts/` | Finished markdown drafts |
| `knowledge/` | GSC, semantics (`semantic-core.example.md`) |

**Commands:** `create article` · `create guideline` · after draft: publish to `i18n.js` / `index.html`

**Core rules:** Sacred outline headings · Zipf keyword tiers · Default language: Mongolian
