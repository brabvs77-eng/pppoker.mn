# GUIDELINE.md — Baatryn Öröö (pppoker.mn) Writing Style Guide

## Brand Context
Baatryn Öröö is Mongolia's PPPoker club — an online poker community for Hold'em and Omaha. The site (`pppoker.mn`) is a Mongolian-language marketing and info hub: games, bonuses, deposits, academy content, and support via Telegram.

## Target Audience
Mongolian poker players (and Russian/English speakers in Mongolia) looking for a trusted online club. Mix of beginners and regulars. They search in Cyrillic Mongolian and Latin (`poker`, `pppoker`, `baatryn oroo`, `монгол покер`, `онлайн покер монгол`).

Expertise level: 2/5 — explain poker terms briefly when needed, but don't lecture.

## Brand Voice
- Confident and welcoming
- Direct and practical
- Premium but not arrogant (gold/dark brand aesthetic)
- Mongolian-first (Cyrillic); Latin for brands (PPPoker, Hold'em, USDT)

## Tone
Energetic, trustworthy, player-focused. Use «та» sparingly; prefer inclusive «тоглогч» / «та бүхэн» where natural. No hype or guaranteed-win language. Support channels: @BatrynOrooSupport.

## Writing Style

### Language
- **Primary:** Mongolian (Cyrillic)
- **Secondary in meta/keywords:** Latin (`poker mongolia`, `baatryn oroo`, `bluff poker mongolia`, `pppoker`)
- Keep FAQ answers concise (2–4 sentences)

### Sentence and Paragraph Length
- Short paragraphs: 2–3 sentences max
- Scannable lists for steps, features, and FAQ

### Intros
- Lead with the player benefit or answer (Ski Ramp)
- No «энэ нийтлэлд бид…» filler

### SEO Keywords (GSC — weave naturally)
- монгол покер систэм, монгол покер татах
- онлайн покер монгол, покер монгол, монгол покер
- baatryn oroo, bluff poker mongolia, pppoker

## AI Visibility Settings
- **Ski Ramp: A** — Key insight or CTA in the first 20–30% of each section/page block
- **H2s as User Prompts: B** — Use question-style H2 in FAQ where natural; declarative elsewhere
- **Definitive Language: B** — «PPPoker бол…», «Монгол покер систем нь…» for definitions
- **Entity Richness: B** — Name PPPoker, Hold'em, Omaha, USDT, IBAN, Telegram; avoid trash-talking competitors
- **Sentiment Target: ~0.45** — Facts + light enthusiasm, no hard sell

## Entity and Reference Style
- Brand: **Baatryn Öröö** / **Баатрын Өрөө** / `baatryn oroo`
- Platform: **PPPoker**, **PPPoker Mongolia**
- Games: Texas Hold'em, Omaha (PLO)
- Payments: 10,000₮ min deposit, IBAN, USDT (TRC20) after 100,000₮
- Support: @BatrynOrooSupport, @BaatrynOroo_support_bot

## Formatting Rules
- Markdown for drafts in `drafts/`
- Use `##` / `###` per content brief outline — **never change brief headings**
- Bold key terms sparingly
- No tables unless the brief requires comparison

## Taboos
- No guaranteed winnings or «бүр мөнгө хожино» claims
- No em-dashes
- No filler: «өнөөдрийн дижитал ертөнцөд», «мэдээж»
- No fake stats or invented quotes
- No API keys or secrets in content files
- Don't copy competitor app copy verbatim (e.g. Bluff Poker) — position Baatryn Öröö distinctly

## Content Pipeline
Based on [thruuu-claude-writer](https://github.com/thruuu/thruuu-claude-writer):
1. Drop thruuu brief in `briefs/`
2. Optional context in `knowledge/`
3. Run pipeline per `content/CONTENT.md` (research → write → humanize → link → edit)
4. Output in `drafts/` — integrate into `index.html` / `i18n.js` when publishing to site
