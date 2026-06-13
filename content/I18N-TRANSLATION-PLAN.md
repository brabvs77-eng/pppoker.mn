# I18n Translation Plan — pppoker.mn

Updated: 2026-06-12. Status: **planning** (MN = source of truth, 18 articles published).

## Current state

| Layer | Languages | Mechanism |
|-------|-----------|-----------|
| **Homepage** (`index.html`) | MN, EN, ZH, RU | Client-side `src/i18n.js` + `?lang=en\|zh\|ru` |
| **Articles** (`/articles/*`) | MN only | `content/articles/*.md` → `build-articles.mjs` |
| **hreflang** | Homepage only | `/?lang=en` etc. — articles have no alternates |
| **FAQ JSON-LD** | MN only | Static in `index.html`; not synced on lang switch |
| **Sitemap** | MN URLs only | `public/sitemap.xml` — 18 article + home + hub |

**Gap:** switching language on the homepage does not translate articles. Article hub, nav, footer, and 18 long-form pages are MN-only. SEO for EN/RU/ZH relies on homepage meta only.

---

## Goals

1. Give expats and RU/ZH speakers full access to club info and guides.
2. Capture non-Cyrillic search demand (`poker mongolia`, `online poker mongolia`, `mongol poker download`).
3. Keep MN as **canonical** (`x-default`) — Mongolia-first brand.
4. Reuse existing pipeline (`content/` → `build-articles.mjs` → Vite MPA).

---

## Target languages (priority)

| Priority | Lang | Code | Rationale |
|----------|------|------|-----------|
| 1 | English | `en` | Expats, international SERP, Latin queries |
| 2 | Russian | `ru` | Large RU-speaking audience in MN; switcher already live |
| 3 | Chinese | `zh` | Switcher exists; smaller but high-value VIP segment |
| — | Mongolian | `mn` | Source — no translation, maintain first |

**Do not add** more languages until EN + RU article coverage ≥ 50%.

---

## URL strategy (recommended)

### Homepage
Keep `?lang=` for now (already wired). Optional later: `/en/`, `/ru/`, `/zh/` with redirect from query param.

### Articles — path prefix (SEO-friendly)

```
/articles/{slug}/              → MN (canonical, x-default)
/en/articles/{slug}/           → English
/ru/articles/{slug}/           → Russian
/zh/articles/{slug}/           → Chinese
```

Hub pages:
```
/articles/          → MN index
/en/articles/       → EN index
```

**Why not `?lang=` on articles:** shared URL dilutes hreflang; Google prefers distinct URLs per language for long-form content.

**Slug policy:**
- MN slugs stay as-is (`mongol-poker-sistem`) — already indexed.
- Translated slugs: Latin, keyword-aware (`mongol-poker-system`, `download-poker-mongolia`) — one slug per lang, linked via `hreflang`, not forced slug parity.

---

## Content structure (source files)

### Option A — folder per article (recommended)

```
content/articles/
  mongol-poker-sistem/
    mn.md          # existing copy (move from flat file)
    en.md
    ru.md
    zh.md
  mongol-poker-tatah/
    mn.md
    ...
```

Shared frontmatter per file:
```yaml
Meta Title: ...
Meta Description: ...
List Title: ...
Slug: mongol-poker-sistem      # URL slug for THIS language
Language: mn
Source Slug: mongol-poker-sistem   # cross-lang group id
Stage: final
```

### Option B — flat files (faster migration, messier at scale)

```
content/articles/mongol-poker-sistem.mn.md
content/articles/mongol-poker-sistem.en.md
```

**Decision:** Option A when refactoring pipeline; until then, add `.{lang}.md` siblings without breaking MN build.

---

## Translation tiers (what to translate, in order)

### Tier 1 — Pillars (3 articles) — **Phase I18n-1**
| MN slug | EN focus | Notes |
|---------|----------|-------|
| `mongol-poker-sistem` | mongol poker system | Core entity page |
| `mongol-poker-tatah` | download / install | High intent |
| `online-poker-mongol-2026` | where to play poker mongolia | Comparison / trust |

### Tier 2 — Trust & money (5 articles) — **Phase I18n-2**
`deposit-withdraw-mongol`, `100-bonus-nuhtsul`, `pppoker-klub-vs-betting`, `cash-game-mongol`, `bluff-poker-mongolia`

### Tier 3 — Academy essentials (5 articles) — **Phase I18n-3**
`poker-kombinatsiud`, `holdem-vs-omaha`, `ehnii-gar-songolt`, `poker-terms-mn`, `bankroll-udirdlaga`

### Tier 4 — Remaining academy + strategy (5 articles) — **Phase I18n-4**
`pozitsiin-huch`, `poker-setgel-zui`, `blef-uriag`, `floating-taktik`, `statistik-analiz`

**Total:** 18 articles × 3 langs = **54 translated pages** (+ 18 MN = 72 article URLs).

---

## Writing rules (per GUIDELINE.md)

1. **MN → target:** translate meaning, not word-for-word. Ski-ramp intro in first 20–30%.
2. **Keep in Latin:** PPPoker, Hold'em, Omaha, USDT, TRC20, IBAN, Telegram, VPIP, PFR, Royal Flush.
3. **Localize:** ₮ amounts, «10,000₮», support @BatrynOrooSupport — same across langs.
4. **Keywords per lang:**
   - EN: `poker mongolia`, `online poker mongolia`, `baatryn oroo`, `mongol poker download`
   - RU: `онлайн покер монгол`, `покер монгол`, `монгол покер скачать`
   - ZH: `蒙古扑克`, `在线扑克蒙古`
5. **Tone:** GUIDELINE 2/5 expertise — brief term explanations, no lecture.
6. **Pipeline:** writer → humanizer agents (`CLAUDE.md`); `Stage: final` before build.

---

## Technical implementation

### 1. `build-articles.mjs` refactor
- [ ] Scan `content/articles/{slug}/{lang}.md` (or `*.{lang}.md`)
- [ ] Output: `articles/{slug}/index.html` (MN), `en/articles/{slug}/index.html`, etc.
- [ ] `lang` attribute on `<html>`, `inLanguage` in JSON-LD
- [ ] `hreflang` link block per article (mn, en, ru, zh, x-default → MN)
- [ ] `canonical` = language-specific URL
- [ ] Nav/footer strings from shared `article-i18n.json` or import from `i18n.js`
- [ ] Lang switcher in article header (same UX as homepage)

### 2. `vite.config.js`
- [ ] Register `en/articles/**/index.html` (and ru, zh) in `getArticleInputs()`

### 3. Homepage
- [ ] Sync FAQ JSON-LD on lang change (`main.js`) OR static blocks per lang
- [ ] Article cards in academy: optional `data-i18n` titles — or keep MN titles with «read in EN» badge until translated

### 4. Sitemap
- [ ] Auto-generate `sitemap.xml` in build script (backlog)
- [ ] Include all lang URLs with `xhtml:link` hreflang entries

### 5. `robots.txt`
- No change — single sitemap is enough.

---

## SEO checklist (per translated page)

- [ ] Unique `title` + `meta description` in target language
- [ ] `link rel="canonical"` → self
- [ ] `hreflang` cluster: mn, en, ru, zh, x-default
- [ ] `og:locale` + `og:locale:alternate`
- [ ] JSON-LD `Article.inLanguage`
- [ ] Internal links → same-language article paths where translation exists; fallback to MN with `hreflang` (avoid mixed-lang link graphs)

---

## Workflow (per article batch)

1. **Brief** — copy MN `meta` + H2 outline to `content/briefs/{slug}-{lang}.md`
2. **Translate** — writer agent, target word count ±10% of MN
3. **Humanize** — humanizer agent
4. **Review** — native speaker spot-check EN/RU (ZH optional Phase 2)
5. **Build** — `npm run articles:build && npm run build`
6. **QA** — link check, hreflang pairs, mobile, lang switcher
7. **Deploy** — GSC: submit sitemap, inspect sample EN/RU URLs

---

## Effort estimate (technical, not calendar)

| Task | Scope |
|------|-------|
| Pipeline refactor (multi-lang build) | `build-articles.mjs`, `vite.config.js`, article nav i18n |
| Tier 1 content (3 × 3 langs) | 9 new markdown files |
| Tier 2–4 content | 45 new markdown files |
| Sitemap auto-gen | 1 script module |
| FAQ schema i18n | `main.js` small update |

**Content volume:** ~1,100 words avg × 54 pages ≈ **60k words** translated (EN+RU+ZH).

---

## Risks & mitigations

| Risk | Mitigation |
|------|------------|
| Duplicate content (MN vs EN same SERP) | hreflang + distinct URLs; EN targets different queries |
| Broken internal links across langs | `Source Slug` group id in frontmatter; build-time link resolver |
| Stale translations | MN is source; add `Translated: 2026-06-12` in frontmatter |
| Article nav still MN | Phase 1 ships `article-i18n.json` with nav/footer/play CTA |
| Scope creep | Strict tier order; no ZH until EN+RU Tier 1 live |

---

## Phase roadmap

```
I18n-0  Plan + pipeline refactor          ← this document
I18n-1  EN: Tier 1 pillars (3)            ← done
I18n-2  RU: Tier 1 pillars (3)            ← done (2026-06-13)
I18n-3  EN+RU: Tier 2 trust (5)           ← done (2026-06-13)
I18n-4  EN: Tier 3 academy (5)           ← next
I18n-5  RU: Tier 2–3 remaining
I18n-6  ZH: Tier 1 + Tier 2 (8)
I18n-7  Auto sitemap + FAQ schema i18n
I18n-8  Tier 4 + remaining ZH
```

---

## Immediate next steps

1. Approve URL scheme (`/en/articles/{slug}/`).
2. Refactor `build-articles.mjs` for multi-lang (keep MN output paths stable).
3. Translate **3 Tier-1 articles to EN** as pilot.
4. Add lang switcher + hreflang to article template.
5. Deploy pilot → GSC validate hreflang → scale Tier 2.

---

## References

- `GUIDELINE.md` — voice, Zipf, entities
- `knowledge/semantic-core.md` — keyword tiers
- `content/ARTICLE-PLAN.md` — MN article inventory (Phase 4 complete)
- `src/i18n.js` — homepage strings (reuse for article chrome)
