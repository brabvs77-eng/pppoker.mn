---
Meta Title: Pot odds, equity, outs | Онлайн покер — Baatryn Öröö
Meta Description: Pot odds, equity, расчёт outs. Онлайн покер Монгол — математическая база для решений call или fold.
List Title: Pot odds и equity
Slug: pot-odds-ekviti
Source Slug: pot-odds-equity
Language: ru
Translated: 2026-08-24
Target Word Count: 900
Stage: final
---

# Pot odds, equity, outs — математическая база

**Pot odds** сравнивают размер банка с суммой, которую нужно поставить. **Equity** — вероятность выиграть раздачу. Вместе они помогают принимать решения call или fold. На столах [Baatryn Öröö](https://pppoker.mn/?lang=ru) эти расчёты нужны каждый день.

## Что такое pot odds?

**Формула:** Pot odds = Сумма call / (Pot + Сумма call)

**Пример:** Pot 1000₮, соперник поставил 500₮. Вам нужно call 500₮.
- Pot после call: 1000 + 500 + 500 = 2000₮
- Pot odds: 500 / 2000 = **25%**

Если equity выше 25% — call выгоден.

## Что такое equity?

**Equity** = вероятность выиграть раздачу с текущей рукой (%).

Пример: flush draw — 9 outs, 2 карты впереди. Примерно 35% equity (терн + ривер).

## Outs — сколько карт помогут?

**Out** — карта, которая улучшает вашу комбинацию.

| Draw | Outs (примерно) |
|------|-----------------|
| Flush draw (9 осталось) | 9 |
| Open-ended straight | 8 |
| Gutshot straight | 4 |
| Overpair vs underpair | 5 |

**Rule of 2 and 4:**
- На флопе: outs × 4 ≈ % (до ривера)
- На терне: outs × 2 ≈ % (до ривера)

9 outs на флопе: 9 × 4 = 36% equity примерно.

## Call или fold?

1. Посчитайте equity (outs или софт)
2. Посчитайте pot odds
3. Equity > pot odds → **call** (или raise)
4. Equity < pot odds → **fold**

**Пример:** 9 outs, 36% equity. Pot odds 25%. Call правильный.

## Implied odds

Возможность выиграть больше в будущих улицах. Пример: nut flush draw — у соперника сильная рука, он может поставить крупно. Pot odds недостаточны, но implied odds оправдывают call.

Новичкам: не переоценивайте implied odds — только на явных дро.

## Практика

1. Запомните 9 outs для flush draw
2. Сравнивайте размер ставки с pot
3. Крупная ставка = плохие pot odds — чаще fold ([размер ставок](https://pppoker.mn/ru/articles/razmer-stavok-poker/))
4. Защищайте [банкролл](https://pppoker.mn/ru/articles/bankroll-menedzhment/) — не call без расчёта

## Reverse implied odds

Иногда вы call с draw, но даже если улучшитесь — проиграете сильнейшей руке. Пример: non-nut flush draw против агрессивного соперника. Reverse implied odds — аргумент для fold даже при «достаточных» pot odds.

## Equity vs pot odds на практике

**Ситуация:** Pot 2000₮, bet 1000₮. Call 1000₮ в pot 3000₮ = 33% pot odds. У вас 8 outs на флопе ≈ 32% — пограничный call. С позицией и implied odds — call. OOP без implied odds — fold.

## Связь с размером ставок

Соперник ставит 75% pot — pot odds хуже, чем при 33%. Поэтому [размер ставок](https://pppoker.mn/ru/articles/razmer-stavok-poker/) влияет на ваши call/fold решения. Агрессивный sizing заставляет fold с marginal hands.

## Практика

Pot odds — часть [основ постфлопа](https://pppoker.mn/ru/articles/postflop-osnovy/). На префлопе тоже важны — см. [префлоп-стратегию](https://pppoker.mn/ru/articles/preflop-strategiya/).

## Частые ошибки

- Call «потому что видно» — без цифр
- Call крупной ставки с gutshot
- All-in call без pot odds

## FAQ

### Нужна ли полная математика?

Достаточно базы. 9 outs и rule of 2/4 работают для большинства дро.

### Есть ли калькулятор в PPPoker?

В PPPoker нет встроенного equity calculator. Считайте вручную или проверяйте после сессии.

### Решения на постфлопе

Framework — [основы постфлопа](https://pppoker.mn/ru/articles/postflop-osnovy/).

## Комбинирование outs

**Flush + straight draw (combo draw):** 15 outs — сильный call почти всегда. **Overcards + gutshot:** 6–7 outs — погранично. Считайте clean outs — иногда out даёт сопернику full house.

## Pot odds на разных улицах

| Улица | Outs × | Пример 9 outs |
|-------|--------|---------------|
| Флоп → ривер | ×4 | ~36% |
| Терн → ривер | ×2 | ~18% |

На терне pot odds строже — осталась одна карта.

## Практические упражнения

1. После каждой draw-ситуации — оцените outs и pot odds
2. Fold gutshot vs pot-sized bet — дисциплина
3. Call flush draw с позицией + implied odds
4. Записывайте решения — проверяйте после сессии
## Breakeven bluff

Bluff должен работать X% времени. Bet 50% pot → соперник fold 33%+ → bluff profitable (если 0% equity). С equity bluff нужен реже fold equity.

## Equity когда не all-in

Если не all-in — equity не static: turn/river могут изменить. Implied odds компенсируют. All-in на флоп — equity final для двух карт.

## Тренировка без софта

Flashcards: «9 outs, pot 1000, bet 500 — call?» Ответ: pot odds 25%, equity ~36% — call. 5 минут в день — через месяц автоматизм.
## MDF (minimum defense frequency)

Если соперник bet pot — MDF ~33% (нужно defend third range). Связь с [размером ставок](https://pppoker.mn/ru/articles/razmer-stavok-poker/). Продвинутая тема — после освоения базовых outs.

## Discounted outs

Не все outs clean. Out на flush при paired board может дать full house оппоненту. Считайте «грязные» outs с осторожностью.

---

[Покерные комбинации](https://pppoker.mn/ru/articles/poker-kombinatsii/) · [@BatrynOrooSupport](https://t.me/BatrynOrooSupport)
