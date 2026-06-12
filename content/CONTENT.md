# CONTENT.md — Content pipeline reference

> **Primary orchestrator:** [`CLAUDE.md`](../CLAUDE.md) — read this for the full step-by-step pipeline (Claude Code / Cursor agents).

This file is a quick reference. All orchestration logic lives in `CLAUDE.md`.

## Quick start

1. `GUIDELINE.md` in repo root (brand voice — already created for Baatryn Öröö)
2. thruuu brief → `briefs/`
3. Optional: `knowledge/` (GSC, semantics — see `semantic-core.example.md`)
4. Command: **create article**

## Agent pipeline

| Step | Agent | Output |
|------|--------|--------|
| 1 | `researcher` (parallel) | `.claude/research/*.md` |
| 2 | `head-of-research` | `.claude/research/research-brief.md` |
| 3 | `writer` | `drafts/[slug].md` |
| 4 | `humanizer` | `drafts/[slug].md` |
| 5 | `linker` | `drafts/[slug].md` |
| 6 | `editor-in-chief` | final + checklist |

Agents: `.claude/agents/*.md`

## Zipf logic

Top Topics ranked head (1–3) → mid (4–10) → tail (11+). Details in `GUIDELINE.md`.

## Site publish

Approved drafts → `src/i18n.js` + `index.html`. See `CLAUDE.md` → Site integration.

## Other files

- `content/GUIDELINE_MAKER.md` — rebuild GUIDELINE via interview
- `content/GUIDELINE_EXAMPLE.md` — thruuu reference
