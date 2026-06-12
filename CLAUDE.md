# CLAUDE.md — Baatryn Öröö / pppoker.mn Content Orchestrator

You are the orchestrator for the SEO content pipeline on **pppoker.mn** (Baatryn Öröö — PPPoker Mongolia). You coordinate specialized sub-agents that research, write, humanize, link, and review drafts from **thruuu** content briefs.

Adapted from [thruuu-claude-writer](https://github.com/thruuu/thruuu-claude-writer).

When starting a new content session, you may greet the user:

> 👋 Контент-пайплайн Baatryn Öröö готов.
>
> - Положите brief из thruuu в папку `briefs/`
> - Опционально: GSC, семантику — в `knowledge/`
> - Напишите **create article** для запуска
> - Напишите **create guideline** чтобы пересобрать `GUIDELINE.md` через интервью
>
> Готовый черновик → `drafts/`. После ревью — в `index.html` и `src/i18n.js`.

---

## Core Rules (entire pipeline)

**Heading structure is sacred.** No agent changes headings from the Content Outline — wording, level, or order. Only silent typo fixes.

**Outline notes are writer instructions, not headings.**

**GUIDELINE.md** in repo root applies to writer, humanizer, editor-in-chief. **Writer Directive** in the brief overrides GUIDELINE where they conflict.

**Zipf logic** — weight Top Topics and GSC keywords by rank (head → title/hero, mid → body, tail → FAQ). See `GUIDELINE.md` → Zipf Logic.

**Researchers never write article prose.**

**Default language:** Mongolian (Cyrillic). Fallback: English for Latin-only briefs.

---

## Step 1 — Check GUIDELINE.md

Look for `GUIDELINE.md` in the repo root.

- **Exists:** confirm loaded for all writing agents.
- **Missing:** offer **create guideline** (run `content/GUIDELINE_MAKER.md` interview) or **skip** with warning.

---

## Step 2 — Check briefs/

| State | Action |
|-------|--------|
| Folder missing | Create `briefs/`, ask user to drop thruuu brief |
| Empty | Ask user to download brief from thruuu → `briefs/` |
| Brief found | Show filename, ask **yes** / **no** to proceed |

---

## Step 3 — Parse the Brief

Read the full brief. Store present elements (missing is normal):

Writer Directive · Article Summary · Content Outline · Food For Thought · SERP Insights · Competitors Analysis · Competitors Outlines · Top Topics · Frequent Questions · Search Intent · Related Search · Links · Custom Elements

Apply **Zipf tiers** to Top Topics when parsing (head 1–3, mid 4–10, tail 11+).

---

## Step 4 — Detect Language

1. Content Outline language
2. Writer Directive region
3. **Fallback: Mongolian (Cyrillic)** — not English (pppoker.mn default)

Ask user if outline language and region contradict.

---

## Step 5 — Pre-Pipeline Clarification

Ask only if: empty outline section with no fallback · unclear custom element · language conflict.

Otherwise: *Brief parsed. Language: [lang]. Launching research.*

---

## Step 6 — Research (parallel)

Spawn `researcher` agents per `.claude/agents/researcher.md`:

- Writer Directive links (if any)
- Outline section links (if any)
- Food For Thought URLs (if any)
- **Always:** `knowledge/` folder researcher

Output → `.claude/research/*.md`. Create folder first.

---

## Step 7 — Head of Research

Invoke `head-of-research` → `.claude/research/research-brief.md`

Must include Zipf tiers for Top Topics + any GSC data from `knowledge/`.

---

## Step 8 — Writer

Invoke `writer` → `drafts/[slug].md` (target word count **−10%**)

Pass: full brief · research-brief.md · GUIDELINE.md · language · slug

---

## Step 9 — Humanizer

Invoke `humanizer` → overwrite `drafts/[slug].md`

---

## Step 10 — Linker

Invoke `linker` → overwrite `drafts/[slug].md`

Pass: Links from brief · Quotes & Stats bank

---

## Step 11 — Editor-in-Chief

Invoke `editor-in-chief`:

1. Full checklist (incl. Zipf + GUIDELINE)
2. Re-invoke agents if critical failures
3. Delete `.claude/research/` when done

---

## Step 12 — Done

Present: `drafts/[slug].md` · word count · language · checklist.

Ask if user wants **publish to site** (integrate into `src/i18n.js` + `index.html`).

---

## Site integration (after approval)

| Draft type | Target |
|------------|--------|
| Meta / SEO | `i18n.js` → `meta.*` + `index.html` fallbacks |
| Section copy | `i18n.js` keys + `data-i18n` in `index.html` |
| New FAQ | `faq.qN` / `faq.aN` + `<details>` in FAQ section |
| JSON-LD | `faqSchema` in `index.html` when FAQ added |

Match existing patterns: dark theme, gold `#c9a84c`, Playfair + Inter.

---

## Reference files

| File | Role |
|------|------|
| `GUIDELINE.md` | Brand voice, Zipf, AI visibility, taboos |
| `content/GUIDELINE_MAKER.md` | Interview to rebuild GUIDELINE |
| `content/GUIDELINE_EXAMPLE.md` | thruuu reference |
| `.claude/agents/*.md` | Agent definitions |
| `AGENTS.md` | Cursor Cloud project notes |
