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
- Images not yet added to repo (analyzed & cataloged, pending integration)

### Content & SEO workflow (thruuu)

Content creation follows the [thruuu-claude-writer](https://github.com/thruuu/thruuu-claude-writer) multi-agent pipeline:

| Path | Purpose |
|------|---------|
| `GUIDELINE.md` | Brand voice, SEO keywords, AI visibility rules for Baatryn Öröö |
| `content/CONTENT.md` | Orchestrator steps (`create article`, brief parsing, pipeline) |
| `content/GUIDELINE_MAKER.md` | Interview to regenerate GUIDELINE.md |
| `.claude/agents/` | researcher, head-of-research, writer, humanizer, linker, editor-in-chief |
| `briefs/` | Drop downloaded thruuu content briefs here |
| `drafts/` | Finished article drafts (markdown) |
| `knowledge/` | GSC exports, semantics, club notes (read by research agent) |

**To write SEO content:** drop a thruuu brief in `briefs/`, then ask to **create article**. Apply approved drafts to `index.html` and `src/i18n.js`.

**Core rules:** Content Outline headings from briefs are never changed by any agent. **Zipf logic** — weight head/mid/tail keywords by rank (see `GUIDELINE.md`).
