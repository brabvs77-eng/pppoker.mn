# GUIDELINE.md — Baatryn Öröö Writing Style Guide

## Brand Context

Baatryn Öröö (PPPoker Mongolia) is Mongolia's online poker club on the PPPoker platform. The site `pppoker.mn` is a Mongolian-language marketing hub: Hold'em and Omaha, 24/7 tables, deposits from 10,000₮, 100% bonus, USDT for qualified players, and 24/7 Telegram support.

## Target Audience

Mongolian poker players and expats in Mongolia. Mix of beginners learning Hold'em/Omaha and regular cash-game players. They search in **Cyrillic Mongolian** and **Latin** (`poker`, `pppoker`, `baatryn oroo`, `монгол покер`).

**Expertise level:** 2/5 — explain terms briefly, never lecture.

**Typical intent:** find a trusted club, download the app, understand deposits/bonuses, compare formats (Hold'em vs Omaha).

## Brand Voice

- Confident and welcoming
- Direct and practical
- Premium but not arrogant (dark + gold brand)
- Mongolian-first; Latin for global brands (PPPoker, Hold'em, USDT)

## Tone

Energetic, trustworthy, player-focused. Prefer «тоглогч» / «та бүхэн» over heavy «та». No guaranteed-win hype. Support: @BatrynOrooSupport.

For EN/ZH/RU variants in `i18n.js`: same voice, culturally natural — not machine-translated stiffness.

## Writing Style

### Language
- **Primary:** Mongolian (Cyrillic)
- **Meta/keywords:** Cyrillic + Latin (`poker mongolia`, `baatryn oroo`, `bluff poker mongolia`)
- FAQ answers: 2–4 sentences

### Sentence and paragraph length
- Short paragraphs: 2–3 sentences max
- Lists for steps, features, FAQ, academy tips

### Intros (Ski Ramp)
- Lead with benefit or direct answer in first 20–30%
- No «энэ нийтлэлд бид…», no slow warm-up

### How insights are delivered
- Facts first: limits, blinds, deposit minimums, support hours
- Name real entities: PPPoker, IBAN, USDT TRC20, Telegram
- Tie claims to club specifics (VIP tables, club names: UlaanBator VIP, etc.)

### Structural patterns
- `##` / `###` per thruuu outline only — never invent extra heading levels
- Bold sparingly for key terms
- Numbered steps for how-to content

## Zipf Logic (keyword distribution)

**Zipf's law:** frequency ≈ 1/rank. Few head terms drive most volume; long tail of rare queries adds up.

| Tier | Role | pppoker.mn examples | Placement |
|------|------|---------------------|-----------|
| **Head** | High volume, high competition | `poker`, `покер`, `онлайн покер` | Title, H1, hero, intro |
| **Mid** | Brand + intent | `pppoker`, `poker mongolia`, `онлайн покер монгол`, `baatryn oroo` | Meta, features, section intros |
| **Long tail** | Low each, high aggregate | `монгол покер систэм`, `монгол покер татах`, `bluff poker mongolia` | FAQ, how-to, app download |

### Writer rules
1. Weight by rank — don't stuff head terms in every paragraph
2. Rank 1–3 prominent; 4–10 at least once; tail → dedicated FAQ/block
3. Pillar (head/mid) + tail pages link internally to CTA
4. Manual/NaN topics in briefs: include ≥1 time
5. Mongolia: flat Zipf curve — GSC impressions with 0 clicks still matter

### GSC queries (confirmed on site)
| Query | Tier |
|-------|------|
| монгол покер систэм | tail |
| монгол покер татах | tail |
| bluff poker mongolia | tail |
| baatryn oroo | mid |
| онлайн покер монгол | mid |
| покер монгол / монгол покер | mid/tail |

## AI Visibility Settings

- **Ski Ramp: A (Always)** — Key insight or CTA in first 20–30%. Example: «PPPoker клубт 10,000₮-өөр эхлэж болно» before background.
- **H2s as User Prompts: B (When it fits)** — FAQ as questions («Монгол покер хэрхэн татах вэ?»); declarative H2 elsewhere.
- **Definitive Language: B (Usually)** — «Монгол покер систем нь…», «PPPoker бол…» for definitions; narrative allowed in academy/cinema.
- **Entity Richness: B (Moderate)** — Name PPPoker, Hold'em, Omaha, USDT, IBAN, Telegram; competitors only for positioning, not promotion.
- **Sentiment Target: ~0.45** — Fact + light enthusiasm. State terms, then why it matters to the player.

## Entity and Reference Style

| Entity | Usage |
|--------|--------|
| Baatryn Öröö / Баатрын Өрөө / baatryn oroo | Brand |
| PPPoker / PPPoker Mongolia | Platform |
| Texas Hold'em, Omaha (PLO) | Games |
| 10,000₮ min deposit/withdrawal | Payments |
| IBAN, USDT (TRC20) after 100,000₮ | Payments |
| @BatrynOrooSupport | Support |

## Formatting Rules

- Markdown in `drafts/`
- Never change brief outline headings
- Bold key terms sparingly
- Tables only when brief requires comparison
- Site HTML: use existing `section`, `section-title`, `gold` span classes

## Taboos

- No guaranteed winnings («бүр хожино», «ашиг бүртгэл»)
- No em-dashes
- No filler: «өнөөдрийн дижитал ертөнцөд», «мэдээж», «чухал нь»
- No invented stats or fake quotes
- No API keys in content files
- No verbatim competitor copy (Bluff Poker, PokerStars, etc.)
- No Russian SEO spam in Mongolian body copy unless brief targets RU

## Benchmark References

Awareness only — do not copy tone or copy:

- PPPoker global brand (platform mechanics)
- Google Trends MN competitors: turbo poker, megamax poker, one king poker (app discovery queries)
- Mongolian search: Latin `poker` often beats Cyrillic in Trends — use both in meta

## Content Pipeline

Orchestrator: **`CLAUDE.md`**

1. thruuu brief → `briefs/`
2. GSC / semantics → `knowledge/`
3. **create article** → agents in `.claude/agents/`
4. Approve `drafts/[slug].md` → `src/i18n.js` + `index.html`
