# Software Design Document (SDD): Canadian Hardware Price Tracker v1.0

## 1. Архітектура Системи (System Architecture)
Вузькоспеціалізована система для трекінгу цін на будівельні інструменти у канадських ритейлерів (Home Depot CA, KMS Tools, Atlas Machinery, RONA, Home Hardware, Canadian Tire, Federated Tool Supply, Wise Line Tools, Amazon CA).
- **Frontend/Backend:** Next.js 15 (App Router).
- **База даних:** Supabase (PostgreSQL) + Prisma ORM.
- **Оркестрація:** Vercel Cron Jobs.
- **Джерело даних (Скрейпінг):** Оскільки жоден із цих магазинів не має відкритого API, система використовуватиме архітектуру "Адаптерів". Для Home Depot та Amazon використовуватимуться публічні Scraper API (наприклад, BrightData або ScrapingBee для обходу захисту), а для менших сайтів типу KMS Tools/Atlas — кастомні DOM-парсери (Cheerio) через Proxy.

## 2. Схема Бази Даних (Prisma Schema)
Замість ASIN ми тепер використовуємо `url` як унікальний ідентифікатор, і додаємо категоризацію за магазином.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

enum StoreDomain {
  HOME_DEPOT
  KMS_TOOLS
  ATLAS_MACHINERY
  RONA
  HOME_HARDWARE
  CANADIAN_TIRE
  FEDERATED_TOOL
  WISE_LINE_TOOLS
  AMAZON
  OTHER
}

model Product {
  id          String         @id @default(cuid())
  url         String         @unique // Унікальне посилання
  store       StoreDomain    // Домен магазину
  sku         String?        // Артикул магазину (якщо вдалося спарсити)
  title       String         // Назва інструменту
  imageUrl    String?        // Фото
  currency    String         @default("CAD") // Базова валюта - Канадський долар
  isActive    Boolean        @default(true)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  prices      PriceHistory[]

  @@index([store])
}

model PriceHistory {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  price       Float    
  isAvailable Boolean  @default(true) 
  recordedAt  DateTime @default(now())

  @@index([productId, recordedAt(sort: Desc)]) 
}
```

## 3. Стратегія Інтеграції (Scraping Adapters)
- **Фабрика Скрейперів (Scraper Factory):** Бекенд міститиме інтерфейс `IScraper`. Залежно від переданого URL, система динамічно викликатиме потрібний адаптер:
  - `HomeDepotAdapter`, `RonaAdapter`, `CanadianTireAdapter`: використовують Scraping API (через сильний захист від ботів у великих національних мереж).
  - `KmsToolsAdapter`, `AtlasAdapter`, `HomeHardwareAdapter`, `FederatedToolAdapter`, `WiseLineAdapter`: використовують `fetch` + `cheerio` (спеціалізовані магазини з простішим DOM).
  - `AmazonAdapter`: використовує Scraping API.
- **Відмовостійкість:** Якщо DOM сайту змінився (KMS оновили дизайн), адаптер кидає помилку, Cron це логує, товар позначається як `isAvailable: false`, але інші товари продовжують оновлюватися.

## 4. Frontend Архітектура
- **Головна (`/`):** 
  - Форма додавання: Користувач просто кидає URL. Бекенд сам визначає магазин.
  - Дашборд карток інструментів з бейджами магазинів (Home Depot, KMS тощо) та індикатором ціни в CAD.
- **Деталі (`/product/[id]`):** Графік цін (`recharts`), де чітко видно історію.

## 5. Cron Job (Батч-Оновлення)
- Ендпоінт `GET /api/cron/sync` захищений.
- Оскільки кожен магазин має свої ліміти, Cron спочатку групує товари за `store`, і робить запити з різними затримками (delay), щоб KMS Tools не заблокував наш IP за спам-запитами.

## 6. Детальний План Оркестрації (DAG Waves)

### Wave 0: Інфраструктура (Виконує Root Agent, Model: pro)
- Ініціалізація Next.js.
- Налаштування Prisma зі схемою `StoreDomain`.

### Wave 1: Паралельна реалізація (Виконують 3 Subagents, Model: flash, Workspace: branch)
- **Subagent A (Scraping Core):** 
  - *Дозволені файли:* `src/lib/scrapers/*`, `src/app/actions/product.ts`.
  - *Завдання:* Написати патерн "Фабрика". Створити базові парсери для KMS Tools та Atlas Machinery (за допомогою `cheerio`). Створити заглушки для Home Depot. Реалізувати `addProduct(url)`.
- **Subagent B (Frontend-UI):** 
  - *Дозволені файли:* `src/app/page.tsx`, `src/components/SearchForm.tsx`, `src/components/ProductList.tsx`.
  - *Завдання:* Зверстати дашборд. Додати візуальні бейджі для кожного канадського магазину.
- **Subagent C (Charts):** 
  - *Дозволені файли:* `src/app/product/[id]/page.tsx`, `src/components/PriceChart.tsx`.

### Wave 2: Інтеграція Cron (Виконує Root Agent, Workspace: inherit)
- *Дозволені файли:* `src/app/api/cron/sync/route.ts`.
- *Завдання:* Написати логіку, яка групує товари за магазином і виконує оновлення.

### Wave 3: Adversarial Code Review (Виконує Verifier Agent, Model: pro)
- Перевірка на витоки пам'яті, необроблені DOM-помилки в скрейперах, закриття з'єднань з БД.
