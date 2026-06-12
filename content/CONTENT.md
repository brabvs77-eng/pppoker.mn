# CONTENT.md — Article & SEO Content Orchestrator (thruuu pipeline)

Adapted from [thruuu-claude-writer](https://github.com/thruuu/thruuu-claude-writer). Use when creating articles, landing copy, or SEO expansions for **pppoker.mn**.

## Quick start

1. Ensure `GUIDELINE.md` exists in repo root (brand voice for Baatryn Öröö)
2. Download a content brief from [thruuu](https://thruuu.com) → save to `briefs/`
3. Optional: add notes, GSC exports, or stats to `knowledge/`
4. Tell the agent: **create article**

## Core rules (entire pipeline)

- **Heading structure is sacred** — no agent changes Content Outline headings (wording, level, or order). Only silent typo fixes.
- **Outline notes are writer instructions**, not headings.
- **GUIDELINE.md** applies to writer, humanizer, editor-in-chief. **Writer Directive** in the brief overrides GUIDELINE where they conflict.
- **Researchers never write article prose.**

## Agent pipeline

| Step | Agent | Output |
|------|--------|--------|
| 1 | `researcher` (parallel) | `.claude/research/*.md` |
| 2 | `head-of-research` | `.claude/research/research-brief.md` |
| 3 | `writer` | `drafts/[slug].md` (−10% word count) |
| 4 | `humanizer` | `drafts/[slug].md` |
| 5 | `linker` | `drafts/[slug].md` |
| 6 | `editor-in-chief` | final draft + checklist; deletes `.claude/research/` |

Agent definitions: `.claude/agents/*.md`

## Brief elements

| Element | Usage |
|---------|--------|
| Writer Directive | Highest priority instructions |
| Article Summary | Title, slug, meta, word count, tone |
| Content Outline | Exact heading structure |
| Food For Thought | Research URLs (first 800 words each) |
| Top Topics | Keywords to weave in |
| Frequent Questions | Answer in body, not as headings |
| Links | Placed by linker agent |

## Language detection

1. Content Outline language
2. Writer Directive region
3. Default: **Mongolian (Cyrillic)** for this site

## Site integration

After `drafts/[slug].md` is approved:

- Short copy → `src/i18n.js` keys + `data-i18n` in `index.html`
- New sections → follow existing CSS patterns (`section`, `section-title`, `gold` accent)
- Meta → `i18n.js` `meta` block + static fallback in `index.html`

## Reference files

- `content/GUIDELINE_MAKER.md` — interview to rebuild GUIDELINE.md
- `content/GUIDELINE_EXAMPLE.md` — thruuu reference example
