import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import { ScraperFactory } from '@/lib/scrapers';

const prisma = new PrismaClient();

// Затримка між запитами для обходу блокування (Rate Limiting)
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const instant = false;

export async function GET(request: Request) {
  try {
    // Перевірка авторизації крону (Vercel Cron Secret)
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Беремо всі активні продукти
    const products = await prisma.product.findMany({
      where: { isActive: true },
    });

    if (products.length === 0) {
      return NextResponse.json({ status: 'ok', message: 'No active products to sync.' });
    }

    // Групуємо товари за магазинами
    const productsByStore = products.reduce((acc, product) => {
      const store = product.store;
      if (!acc[store]) acc[store] = [];
      acc[store].push(product);
      return acc;
    }, {} as Record<string, typeof products>);

    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Оновлюємо по черзі кожен магазин, щоб не отримати бан IP
    for (const [store, storeProducts] of Object.entries(productsByStore)) {
      console.log(`Syncing store: ${store} (${storeProducts.length} items)`);
      
      for (const product of storeProducts) {
        try {
          const scraper = ScraperFactory.getScraper(product.store);
          if (!scraper) {
            throw new Error(`No scraper found for ${product.store}`);
          }

          const scrapedData = await scraper.scrape(product.url);

          // Записуємо історію
          await prisma.priceHistory.create({
            data: {
              productId: product.id,
              price: scrapedData.price,
              isAvailable: scrapedData.isAvailable,
            },
          });

          results.success++;

          // Робимо паузу між запитами до одного магазину (2-5 секунд)
          await delay(2000 + Math.random() * 3000);

        } catch (error: any) {
          console.error(`Failed to sync product ${product.id}:`, error);
          results.failed++;
          results.errors.push(`[${product.id}] ${error.message}`);
          
          // Якщо товар недоступний, записуємо це
          await prisma.priceHistory.create({
            data: {
              productId: product.id,
              price: 0,
              isAvailable: false,
            },
          });
        }
      }
    }

    return NextResponse.json({ status: 'success', results });
  } catch (error: any) {
    console.error('Cron Error:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
