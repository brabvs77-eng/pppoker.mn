# Geo content plan — pppoker.mn (Phase G)

Updated: 2026-09-16. **Baseline:** 60 MN articles · 240 article URLs · full EN/RU/ZH parity (`content/ARTICLE-PLAN.md`).

**Goal:** захватить **локальный и диаспорный** поисковый интент, который affiliate-сайты (pokermongolia.com) не закрывают — с опорой на реальные сущности Baatryn Öröö (ULAT, IBAN, Telegram, клубные столы).

**Принцип:** гео ≠ «doorway page на каждый аймак». Каждая статья отвечает на **конкретный вопрос тоглогча** в этой локации (интернет, время пик, оплата, expat/диаспора) и ведёт в клубный CTA.

---

## Summary

| Metric | Now | After Phase G |
|--------|----:|--------------:|
| MN articles | 60 | **90** (+30) |
| Geo-specific MN | 3 | **33** |
| New article URLs (MN only) | — | +30 |
| New URLs with i18n (est.) | — | **+72** (18 groups × EN/RU/ZH) |
| Sitemap (est.) | 246 | **~348** |

**Geo coverage today (published):**

| Slug | Geo angle |
|------|-----------|
| `online-poker-mongol-2026` | страна (pillar) |
| `ulaanbaatar-poker-2026` | столица, ULAT, пик 20:00–02:00 |
| `expat-poker-mongol` | inbound expat в Монголии |
| `mongol-tulbur-arga` | платежи (частично гео — IBAN по всей стране) |

**Gap:** нет городов №2–№10, нет региональных кластеров, нет диаспоры, нет соседних рынков (RU/CN/KR inbound).

---

## Geo framework — три кольца

```
        ┌─────────────────────────────────────┐
        │  Ring 3 — Diaspora (за рубежом)     │
        │  KR, AU, US, CZ, DE, JP, CN…        │
        └─────────────────────────────────────┘
        ┌─────────────────────────────────────┐
        │  Ring 2 — Aimag / регион (Монголия) │
        │  West, East, Gobi, Khövsgöl…        │
        └─────────────────────────────────────┘
        ┌─────────────────────────────────────┐
        │  Ring 1 — Hot (города 20k+)         │
        │  UB ✓ → Darkhan, Erdenet, Choibalsan│
        └─────────────────────────────────────┘
```

| Ring | Аудитория | Поисковый язык | I18n приоритет |
|------|-----------|----------------|----------------|
| **1 Hot cities** | резиденты города | MN Cyrillic + Latin | EN + RU |
| **2 Regions** | аймак, село, 4G | MN | EN (опц.) |
| **3 Diaspora** | монголы за границей | EN, MN, иногда RU/ZH | **EN first**, MN |
| **Inbound** | expat / соседи в MN | EN, RU, ZH, KR | по языку аудитории |

---

## Zipf — гео-ключи

### Head (1–3) — в Title/H1 geo-hub и pillar

| Query cluster | Placement |
|---------------|-----------|
| онлайн покер монгол / poker mongolia | pillar + geo hub |
| покер монгол / монгол покер | intro, meta |
| покер улаанбаатар | `ulaanbaatar-poker-2026` ✓ |

### Mid (4–10) — meta, первый экран

| Query cluster | Target |
|---------------|--------|
| покер дархан / darkhan poker | G1 |
| покер эрдэнэт / erdenet poker | G1 |
| poker in mongolia expat | `expat-poker-mongol` ✓ |
| online poker ulaanbaatar | `ulaanbaatar-poker-2026` ✓ |
| mongol poker korea / солонгост | G3 |
| покер монгол солонгос | G3 |

### Long tail — FAQ, H2, отдельные статьи

| Query | Article |
|-------|---------|
| покер ховд / khovd poker | G1 |
| покер дорнод / choibalsan | G1 |
| покер говь / gobi poker | G2 |
| покер хөвсгөл / murun | G1 |
| mongolian poker australia | G3 |
| покер цагийн бүс монгол | G0 hub FAQ |
| интернет 4g покер монгол | G4 |
| poker mongolia russian | G4 |

**Packaging:** покер-first H1; «PPPoker» — в блоке «как начать», не в title.

---

## Phase G0 — Geo hub (1 статья) — старт

Единая точка входа для всех локаций. Связывает Ring 1–3, усиливает internal link graph.

| # | Slug | Title (MN) | Focus | Words |
|---|------|------------|-------|------:|
| G0-1 | `mongol-poker-bairshil` | Монгол покер — байршлаар | «покер монгол хаана», индекс городов/регионов/диаспоры | 1400 | **published** |

**Outline (sacred for thruuu):**
1. Товч хариулт — онлайн клуб бүх аймгийн тоглогчид
2. Hot хотууд (карта/таблица → G1 slugs)
3. Аймгийн бүсүүд (→ G2 slugs)
4. Гадаадад байгаа монголчууд (→ G3 slugs)
5. Expat Монголд (→ `expat-poker-mongol`)
6. Цагийн бүс ULAT + peak times
7. Төлбөр — IBAN бүх банк, USDT
8. FAQ (5–7 tail queries)
9. CTA — татах, бүртгэл, Telegram

**I18n:** EN + RU + ZH сразу (pillar-level).

---

## Phase G1 — Hot cities (8 статей)

Города **≥20k** или стратегический туризм/граница. Шаблон статьи (не копипаст — уникальные факты):

- Интернет (4G/5G, типичные операторы)
- Пик столов в ULAT vs локальная привычка
- IBAN — тот же процесс, местный банк
- Соседние города / кто играет «отсюда»
- 2+ internal links на pillar + 1 на `mongol-poker-bairshil`

| # | Slug | City | Head keyword | Unique angle |
|---|------|------|--------------|--------------|
| G1-1 | `darkhan-poker-2026` | Darkhan | покер дархан | №2 город, промышленный, близко к UB | **published** (MN+EN+RU) |
| G1-2 | `erdenet-poker-2026` | Erdenet | покер эрдэнэт | №3, Orkhon, сменные графики | **published** (MN+EN+RU) |
| G1-3 | `choibalsan-poker-mongol` | Choibalsan | покер чойбалсан / дорнод | восток, RU-влияние, граница | **published** (MN+EN+RU) |
| G1-4 | `khovd-poker-mongol` | Khovd | покер ховд | запад, Oirat/Kazakh community | **published** (MN+EN+RU) |
| G1-5 | `murun-poker-mongol` | Murun | покер мөрөн / хөвсгөл | туризм, сезонность | **published** (MN+EN) |
| G1-6 | `dalanzadgad-poker-mongol` | Dalanzadgad | покер даланзадгад / говь | Gobi, низкая плотность, 4G | **published** (MN+EN) |
| G1-7 | `ulaangom-poker-mongol` | Ulaangom | покер улаангом | Bayan-Ölgii, казахскоязычный контекст | **published** (MN+EN) |
| G1-8 | `sainshand-poker-mongol` | Sainshand | покер сайншанд | Dornogovi, транзит UB–CN | **published** (MN+EN) |

**Не делаем:** отдельные страницы на 21 аймак без объёма — только hot + региональные кластеры (G2).

**I18n tier G1:** EN + RU для G1-1…G1-4; EN only для G1-5…G1-8 (batch после GSC 4 нед).

---

## Phase G2 — Regional clusters (6 статей)

Группируем аймаки по **смыслу**, не по админкарте ради SEO.

| # | Slug | Region | Covers (aimags) | Angle |
|---|------|--------|-----------------|-------|
| G2-1 | `baruun-mongol-poker` | Баруун | Khovd, Uvs, Bayan-Ölgii, Govi-Altai, Zavkhan | запад, расстояния, мобильный интернет | **published** (MN+EN) |
| G2-2 | `dorvon-mongol-poker` | Дорнод | Dornod, Sukhbaatar, Khentii | восток, РФ-соседство, русский FAQ block | **published** (MN+EN) |
| G2-3 | `tov-aimag-poker-mongol` | Төв | Töv + rural UB commuter | «гэрээсээ», спутниковый/4G | **published** (MN) |
| G2-4 | `govi-poker-mongol` | Говь | Dundgovi, Dornogovi, Ömnögovi | ночные столы, жара, низкий ping | **published** (MN) |
| G2-5 | `hovsgol-poker-mongol` | Хөвсгөл | Khövsgöl (+ Murun link) | сезон, туристы, летний всплеск | **published** (MN) |
| G2-6 | `arkhangai-dundgovi-poker` | Төв-зүүн | Arkhangai, Bulgan, Övörkhangai | мал отгон, вечерний прайм | **published** (MN) |

**I18n:** MN only сначала; EN для G2-1, G2-2 (граница + expat).

---

## Phase G3 — Diaspora (8 статей)

Монголы **за пределами MN** — играют в ULAT peak или в свободные часы. EN-title допустим в meta для EN SERP.

| # | Slug | Market | Head keyword | Angle |
|---|------|--------|--------------|-------|
| G3-1 | `mongol-poker-south-korea` | 🇰🇷 South Korea | mongol poker korea / монгол покер солонгос | крупнейшая диаспора, KST vs ULAT | **published** (MN+EN) |
| G3-2 | `mongol-poker-australia` | 🇦🇺 Australia | mongolian poker australia | AEST, MNT deposit via family IBAN | **published** (EN) |
| G3-3 | `mongol-poker-usa` | 🇺🇸 USA | mongolian poker usa | US time zones, VPN myths (factual) |
| G3-4 | `mongol-poker-czech` | 🇨🇿 Czech Republic | mongol poker czech | сильная MN community |
| G3-5 | `mongol-poker-germany` | 🇩🇪 Germany | mongol poker germany | EU, USDT path |
| G3-6 | `mongol-poker-japan` | 🇯🇵 Japan | mongol poker japan | JST, workers |
| G3-7 | `mongol-poker-china` | 🇨🇳 China / Inner Mongolia | mongol poker china | ZH support, cross-border intent |
| G3-8 | `mongol-poker-timezone-guide` | Global | poker mongolia timezone | ULAT table, когда открыты столы |

**I18n:** EN **обязательно** для всех G3; MN mirror для G3-1, G3-8; ZH для G3-7.

---

## Phase G4 — Inbound & connectivity (4 статьи)

Аудитории **внутри или на границе** Монголии, не покрытые expat-guide.

| # | Slug | Audience | Focus |
|---|------|----------|-------|
| G4-1 | `poker-mongolia-russian-speakers` | RU-язычные в MN | покер монголия русский, оплата, поддержка |
| G4-2 | `poker-mongolia-chinese-players` | китайский / 华人 | ZH CTA, USDT, UB |
| G4-3 | `korean-community-poker-mongolia` | корейцы в UB | KR expat, Gangnam-style? → факты UB |
| G4-4 | `internet-4g-poker-mongol` | rural / mobile | 4G покер, nomadic, data caps |

**I18n:** RU (G4-1), ZH (G4-2), EN+KR context (G4-3), MN+EN (G4-4).

---

## Phase G5 — Geo × format (3 статьи, опционально)

Локальный контекст + уже существующие темы (не дублировать Phase 6 academy).

| # | Slug | Combo |
|---|------|-------|
| G5-1 | `ulaanbaatar-cash-game-guide` | UB + micro 250/500 + VIP (линк на `micro-stakes-250-500`, `vip-shiree-mongol`) |
| G5-2 | `darkhan-erdenet-poker-community` | сравнение двух городов №2/№3 |
| G5-3 | `border-poker-mongolia-russia` | Чойбалсан / Altanbulag — только факты, без юр. советов |

**Gate:** публиковать после G1-3 и G2-2 в индексе.

---

## Phase G6 — Geo-parasite (max 3, ≤10% нового корпуса)

По правилам `content/BRAND-PARASITE-STRATEGY.md` — **club-first**, один конкурент на страницу.

| # | Slug | Intent | Risk |
|---|------|--------|------|
| G6-1 | `pokerstars-mongolia-darkhan` | «PokerStars Darkhan» tail | medium |
| G6-2 | `ggpoker-mongolia-alternative` | room vs club | medium |
| G6-3 | `1xbet-poker-mongolia-club` | отток с казино-RNG | high — factual only |

**Не активировать**, пока G0 + ≥6 статей G1 не дадут impressions в GSC.

---

## Internal linking architecture

```
online-poker-mongol-2026 (country pillar)
        │
        ├── mongol-poker-bairshil (GEO HUB) ← NEW
        │         ├── G1 city pages
        │         ├── G2 region pages
        │         └── G3 diaspora pages
        │
        ├── ulaanbaatar-poker-2026 ✓
        ├── expat-poker-mongol ✓
        └── mongol-tulbur-arga ✓
```

**Правила:**
- Каждая geo-статья: **≥2** ссылки на pillar/hub, **≥1** на `mongol-poker-tatah` или `burtgel-alham-alham`
- Geo-hub (`mongol-poker-bairshil`) — ссылки на **все** опубликованные G1–G3
- Homepage `#academy` — не перегружать; опционально блок «Байршлаар» после G0

**Schema:** `Article` + `FAQPage` на hub; для городов — `areaServed: { "@type": "City", "name": "Darkhan" }` в JSON-LD (добавить в `build-articles.mjs` при публикации G0).

---

## I18n strategy (post-60)

| Tier | Scope | Langs | When |
|------|-------|-------|------|
| **GT0** | Geo hub G0-1 | EN, RU, ZH | сразу с MN |
| **GT1** | G1 cities G1-1…G1-4 | EN, RU | batch после MN |
| **GT2** | G1 cities G1-5…G1-8 | EN | по GSC |
| **GT3** | G3 diaspora (all) | EN (+ ZH G3-7) | сразу с MN |
| **GT4** | G2 regions | EN selective | 50% G2 live |
| **GT5** | G4 inbound | RU, ZH | per article |

**Не гнаться за 4-lang parity** на все 30 geo — приоритет EN для диаспоры, RU для востока/границы, ZH для G3-7/G4-2.

---

## Production roadmap

Рекомендуемый порядок (MN first, thruuu brief каждый):

```
Batch GA  G0 hub (1)                    → geo index live
Batch GB  G1 cities (8)               → hot coverage
Batch GC  G3 diaspora (8)             → EN demand, parallel with GB
Batch GD  G2 regions (6)              → depth
Batch GE  G4 inbound (4)              → language niches
Batch GF  G5 format-geo (3)           → optional
Batch GG  G6 parasite (0–3)           → GSC gate only
```

| Batch | Articles | Cumulative MN | Est. new URLs (with i18n) |
|-------|----------|---------------|---------------------------|
| GA | +1 | 61 | +4 |
| GB | +8 | 69 | +28 |
| GC | +8 | 77 | +40 |
| GD | +6 | 83 | +46 |
| GE | +4 | 87 | +54 |
| GF | +3 | 90 | +60 |
| GG | +0–3 | 90–93 | +0–12 |

**Темп:** 2 geo-статьи / неделю MN → ~15 недель до 90 без G6.

---

## Quality gates (анти-doorway)

Перед `Stage: final` каждая geo-статья проходит чеклист:

1. **≥3 уникальных локальных факта** (не выдуманных): часовой пояс, оператор, расстояние до UB, типичный банк/связь
2. **Ski Ramp** — первый абзац отвечает на «можно ли играть из [город]» → да, клуб
3. **Нет** копии абзаца из другого города с подстановкой имени
4. **Word count** ≥ 900 (города), ≥ 1100 (hub, diaspora)
5. **Cover image** — уникальный WebP `public/images/articles/{slug}.webp`
6. **Нет юридических обещаний** про азартные законы других стран (диаспора — «проверьте местные правила»)
7. **GSC tail** в FAQ — минимум 2 вопроса из semantic map выше

---

## Brief checklist (per geo article)

1. thruuu brief: Writer Directive = geo ring + competitor gap
2. Content Outline headings **sacred**
3. Zipf: head в title, mid в meta, tail в FAQ
4. Links: pillar + geo hub + 1 payment/onboarding
5. `npm run articles:build && npm run build && npm run test:seo`
6. GSC inspect 2–4 недели; `npm run gsc:export` → filter by page path `/articles/darkhan-*`

---

## KPI (GSC)

| Metric | Target (6 mo after GA) |
|--------|------------------------|
| Geo URLs indexed | ≥ 25/30 |
| Impressions on `*poker*mongol*` + city tails | +40% vs baseline |
| Avg position city tails | < 15 |
| Clicks from EN diaspora URLs | measurable segment |
| Cannibalization vs `ulaanbaatar-poker-2026` | watch — differentiate H1 |

Обновлять `knowledge/semantic-core.md` после каждого batch с реальными GSC queries.

---

## References

- `content/ARTICLE-PLAN.md` — baseline 60/60 corpus
- `content/BRAND-PARASITE-STRATEGY.md` — G6 rules
- `content/I18N-TRANSLATION-PLAN.md` — translation workflow
- `GUIDELINE.md` — voice, Zipf, taboos
- `knowledge/semantic-core.md` — keyword tiers
- `CLAUDE.md` — **create article** pipeline

---

## Quick start

1. Положить thruuu brief для `mongol-poker-bairshil` в `briefs/`
2. Написать **create article**
3. После ревью — i18n GT0 (EN/RU/ZH)
4. Параллельно briefs для `darkhan-poker-2026` + `mongol-poker-south-korea`
