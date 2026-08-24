---
Meta Title: Чтение range — основы | Онлайн покер — Baatryn Öröö
Meta Description: Range reading в покере: префлоп, постфлоп, сужение range. Онлайн покер Монгол — Baatryn Öröö, blockers, exploit.
List Title: Чтение range
Slug: chtenie-range
Source Slug: range-unshih
Language: ru
Translated: 2026-08-24
Target Word Count: 900
Stage: final
---

# Чтение range — основы

**Range** — набор рук, которые соперник может иметь в конкретной ситуации. **Чтение range** — умение сужать этот набор по действиям на каждой улице. Это не угадывание одной руки, а работа с вероятностями. На столах [Baatryn Öröö](https://pppoker.mn/?lang=ru) range reading отделяет прибыльных игроков от убыточных.

База: [префлоп-стратегия](https://pppoker.mn/ru/articles/preflop-strategiya/) + [позиция в покере](https://pppoker.mn/ru/articles/pozitsiya-v-pokere/).

## Что такое range?

Пример: BTN open = ~40% рук (AA, 72o, suited connectors...). Вы не знаете точную руку — вы знаете **диапазон**.

| Действие | Примерный range |
|----------|-----------------|
| UTG raise | Тайтовый (~10%) |
| BTN raise | Широкий (~40%) |
| 3-bet | Premium + bluff |
| Call 3-bet | Средний, set mine |

Один игрок — один range на префлопе. Каждое действие на постфлопе **сужает** range.

## Шаг 1: префлоп action

Начните с префлопа:

- **Кто open?** UTG = тайто, BTN = широко
- **3-bet?** Value (AA–KK) + bluff (A5s)
- **Call или fold?** Call = средние руки, fold = слабые

Пример: CO open, BTN 3-bet, CO call. Range CO: QQ–TT, AQ, suited connectors. Не AA (часто 4-bet) и не 72o (fold).

Связь: [3-bet и 4-bet стратегия](https://pppoker.mn/ru/articles/3bet-4bet-strategiya/).

## Шаг 2: постфлоп action

Действия на флопе сужают range:

- **C-bet** = range сильнее на этом борде (или bluff)
- **Check** = слабая рука или trap (slow play)
- **Raise** = сильная рука или semi-bluff

Пример: BTN open, BB call. Флоп A72. BTN c-bet, BB call. Range BB сузился: Ax, 77, 22, иногда float.

C-bet логика: [c-bet стратегия](https://pppoker.mn/ru/articles/cbet-strategiya/).

## Шаг 3: сужение по улицам

Каждая улица — новая информация:

**Пример линии:** BTN open → флоп c-bet → терн check → ривер bet

Интерпретация: c-bet = широкий range. Терн check = слабость или pot control. Ривер bet = чаще value (средняя+ рука), реже bluff.

Терн и ривер — range самый узкий: [игра на терне и ривере](https://pppoker.mn/ru/articles/turn-river-igra/).

## Blockers

Ваши карты **блокируют** часть range соперника:

- **A♠ в руке** — у него меньше nut flush combinations
- **K♥ на борде K83** — у него меньше Kx
- Bluff с blocker сильнее — соперник реже имеет nuts

Bluff с A♠ на flush board — классика. Без blocker — bluff слабее.

Теория bluff: [искусство блефа](https://pppoker.mn/ru/articles/iskusstvo-blufa/).

## Range vs конкретная рука

Ошибка новичка: «у него точно AA». Правильно: «у него AA, KK, AK, иногда QQ — 15% range».

Решения через equity против range:

- Ваша рука vs его range → call, raise или fold?
- [Pot odds и equity](https://pppoker.mn/ru/articles/pot-odds-ekviti/) считаются против range, не против одной руки

## Позиция и range

Позиция влияет на range:

- **IP** — видите действия, range соперника уже сужен к вашему ходу
- **OOP** — действуете первым, range шире (вы не знаете, что он сделает)

BTN open range шире UTG — потому что позиция. BB defense range широкий — pot odds.

## Multiway и range

В [multiway pot](https://pppoker.mn/ru/articles/multiway-pot/) range каждого игрока отдельный. Сложнее сужать — больше неизвестных. Фокус на том, кто показал силу (raise, крупный bet).

## Exploit через range

Если соперник:

- **Fold to c-bet 70%** — c-bet bluff чаще
- **Never fold** — value, не bluff
- **3-bet only AA** — fold на его 3-bet без premium

[Статистика покера](https://pppoker.mn/ru/articles/statistika-pokera/) даёт данные для exploit. VPIP, PFR, 3-bet%, Fold to C-bet — ключевые метрики.

## Практический алгоритм

1. **Префлоп:** позиция + action → начальный range
2. **Флоп:** борд + action → сузить range
3. **Терн:** новая карта + action → ещё уже
4. **Ривер:** финальный range → value, bluff catch или fold

Записывайте линии в блокнот. «BTN open, c-bet, терн check, ривер bet» — повторяющийся паттерн = value.

## Типичные линии и range

| Линия | Вероятный range |
|-------|-----------------|
| Open, c-bet, c-bet, check | Средняя рука, pot control |
| Open, c-bet, check, bet | Часто value на ривере |
| Check-raise флоп | Set, two pair, strong draw |
| Call, call, call | Draw или weak made hand |

Check-raise: [check-raise тактика](https://pppoker.mn/ru/articles/check-raise-taktika/).

## Ошибки в чтении range

- Приписывать одну руку вместо range
- Игнорировать позицию
- Не обновлять range на новой улице
- Не учитывать статистику соперника

## Range и размер ставки

Размер bet сужает range:

- **Overbet (100%+ pot)** — polarized: nuts или bluff
- **Малый bet (25–33%)** — thin value, слабые руки
- **Стандарт 50–66%** — смешанный range

Соперник bet 120% pot на ривере — чаще value (set, two pair) или pure bluff. Средняя рука редко overbet. Подробнее: [размер ставок в покере](https://pppoker.mn/ru/articles/razmer-stavok-poker/).

## FAQ

### Можно ли знать range точно?

Нет. Это вероятности. «Скорее всего Ax или pair» — достаточно для решения.

### Range reading на низких лимитах?

Работает. На 250/500 игроки предсказуемее — exploit проще. [Онлайн покер Монгол 2026](https://pppoker.mn/ru/articles/online-poker-mongoliya-2026/).

### Связь с постфлопом?

Range reading — основа [основ постфлопа](https://pppoker.mn/ru/articles/postflop-osnovy/). Без range вы играете вслепую.

### Где практиковать?

[Baatryn Öröö](https://pppoker.mn/?lang=ru) — разбирайте раздачи после сессии. [Правила Hold'em](https://pppoker.mn/ru/articles/holdem-pravila-polnostyu/) + range = фундамент.

---

[Размер ставок](https://pppoker.mn/ru/articles/razmer-stavok-poker/) · [Банкролл-менеджмент](https://pppoker.mn/ru/articles/bankroll-menedzhment/) · [@BatrynOrooSupport](https://t.me/BatrynOrooSupport)
