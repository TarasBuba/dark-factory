<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 🏭 AI Dark Factory Operating Harness (21no.de Architecture)

Цей репозиторій функціонує за моделлю **Lights-Out Software Foundry** (Темна Фабрика ШІ) згідно з архітектурним маніфестом [21no.de/publications/ai-dark-factories](https://21no.de/publications/ai-dark-factories/).

## 🌟 Засадничий закон: Повна автономність (Zero Human Seams)
1. **Людина — це Steering Committee / Goal Engineer:** Людина ставить бізнес-намір (Goal Intent). Людина не бере участі у рутинних операціях розробки, написання коду, дебагу чи запуску білдів.
2. **Жодних запитань про дозволи чи рутинний вибір:** Агент самостійно аналізує код, вирішує архітектурні дилеми спираючись на системні інваріанти (`.darkfactory/invariants/`) і автономно доводить задачу до зеленого стану через детерміновані гейти верифікації.
3. **Ескалація лише при фатальних блокуваннях:** Запитувати людину дозволено тільки якщо вичерпано всі автономні цикли самовідновлення (Auto-Fix budget) або вимагається дія поза машиною (наприклад, реєстрація стороннього платного акаунта).

---

## 🏛️ Трьохрівнева Архітектура Системи

```
  ┌─────────────────────────────────────────────────────────────┐
  │                 Layer 1: The Goal Foundry                   │
  │  (Human sets intent -> Machine derives formal Goal Tree)    │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                Layer 2: The Production Mesh                 │
  │  [Orchestrator] -> [Architect] -> [Design Gate]             │
  │                 -> [Coder]                                  │
  │                 -> [Reviewer] / [Tester] / [Security]       │
  │                 -> [Independent Verification Gate]          │
  │                 -> [Operator] -> [Deploy]                   │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                 Layer 3: The Feedback Loop                  │
  │  (Production Telemetry -> Anomaly Detector -> Auto-Fix/RCA) │
  └─────────────────────────────────────────────────────────────┘
```

---

## ⚙️ Ролі у Виробничій Сітці (Production Mesh Roles)

| Роль | Ідентифікатор | Відповідальність | Тип моделі |
| :--- | :--- | :--- | :--- |
| **0️⃣ Orchestrator** | `orchestrator` | Керування графом завдань, балансування бюджетів, контроль гейтів | Inherit / Pro |
| **1️⃣ Architect** | `architect` | Декомпозиція Goal Tree на контракти, схеми даних та інтерфейси | Pro |
| **2️⃣ Coder** | `coder` | Реалізація коду за контрактами. Ізольований від holdout-тестів | Flash / Inherit |
| **3️⃣ Reviewer** | `reviewer` | Змагальний аудит (Red-Team) коду на регресії, витоки та антипатерни | Pro |
| **4️⃣ Test Engineer** | `tester` | Генерація стрес-тестів, holdout-сценаріїв та симуляцій | Flash / Pro |
| **5️⃣ Security Auditor** | `security` | SAST, валідація відсутності секретів, аналіз вразливостей | Pro |
| **6️⃣ Documentation Agent** | `docs` | Актуалізація документації, README та runbooks ДО деплою | Flash |
| **7️⃣ Compliance Agent** | `compliance` | Крос-перевірка ліцензій, інваріантів та цілісності даних на кожному кроці | Pro |
| **8️⃣ Operator** | `operator` | Виконання детермінованих верифікацій, білду, міграцій та git push | Inherit |

---

## 🔬 Незалежний Верифікаційний Гейт (Verification Gate)
Жоден артефакт не потрапляє у гілку `main` і не деплоїться без проходження скрипта `scripts/verify-gate.ps1`:
1. **Type Safety:** `npm run build` або `tsc --noEmit` без жодної помилки.
2. **Lint & Formatting:** `npm run lint` без блокуючих помилок.
3. **Security Invariant:** Жодного незашифрованого API-ключа чи пароля у вихідному коді.
4. **Data Safety:** Жодного деструктивного `DROP` або незворотного скидання БД без згоди.
5. **Execution Verification:** Успішний прогін верифікаційного ланцюжка із генерацією `.darkfactory/telemetry/audit-trail.json`.

---

## 🔄 Цикл Самовідновлення (Auto-Fix Protocol)
Якщо верифікаційний гейт падає:
1. Operator генерує звіт про помилку (RCA) у `.darkfactory/telemetry/incident-latest.json`.
2. Задача автоматично повертається Coder'у із вхідними даними помилки (до 3 ітерацій).
3. Якщо після 3 ітерацій проблема не вирішена — підключається Architect для рефакторингу або формується чіткий звіт людині-Goal Engineer.
