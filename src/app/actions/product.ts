'use server';

import { PrismaClient, StoreDomain, Product, PriceHistory } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getScraper, detectStore, ScrapedProduct } from '../../lib/scrapers';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export type ProductWithPrices = Product & {
  prices: PriceHistory[];
};

export interface AddProductResult {
  success: boolean;
  product?: ProductWithPrices;
  scrapedData?: ScrapedProduct;
  error?: string;
}

/**
 * Server action to add a product by its URL.
 * Automatically detects the store, selects the appropriate scraper,
 * fetches product metadata and current price, and saves to the database.
 */
export async function addProduct(input: string | FormData): Promise<AddProductResult> {
  try {
    let url: string;

    if (typeof input === 'string') {
      url = input.trim();
    } else if (input instanceof FormData) {
      const urlValue = input.get('url');
      if (typeof urlValue !== 'string') {
        return { success: false, error: 'URL field must be a valid string.' };
      }
      url = urlValue.trim();
    } else {
      return { success: false, error: 'Invalid input provided. Expected string or FormData.' };
    }

    if (!url) {
      return { success: false, error: 'Product URL is required.' };
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return { success: false, error: 'Invalid URL format.' };
    }

    // Detect retailer domain
    const store = detectStore(url);
    if (store === StoreDomain.OTHER) {
      return {
        success: false,
        error: 'Unsupported store domain. Supported retailers: KMS Tools, Atlas Machinery, Federated Tool, Home Depot, Amazon.',
      };
    }

    // Get scraper and execute scraping
    const scraper = getScraper(url);
    const scrapedData = await scraper.scrape(url);

    if (!scrapedData.title || typeof scrapedData.price !== 'number' || isNaN(scrapedData.price)) {
      return {
        success: false,
        error: 'Failed to extract required product details (title or price) from the page.',
      };
    }

    // Persist product and price history in database
    const product = await prisma.product.upsert({
      where: { url },
      update: {
        title: scrapedData.title,
        sku: scrapedData.sku ?? undefined,
        imageUrl: scrapedData.imageUrl ?? undefined,
        currency: scrapedData.currency ?? 'CAD',
        isActive: true,
      },
      create: {
        url,
        store,
        sku: scrapedData.sku ?? null,
        title: scrapedData.title,
        imageUrl: scrapedData.imageUrl ?? null,
        currency: scrapedData.currency ?? 'CAD',
        isActive: true,
      },
    });

    const priceEntry = await prisma.priceHistory.create({
      data: {
        productId: product.id,
        price: scrapedData.price,
        isAvailable: scrapedData.isAvailable ?? true,
      },
    });

    revalidatePath('/');

    return {
      success: true,
      product: {
        ...product,
        prices: [priceEntry],
      },
      scrapedData,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred while adding the product.';
    console.error('Failed to add product:', error);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Fetch all products with their latest price history entry.
 */
export async function getProducts(): Promise<ProductWithPrices[]> {
  try {
    return await prisma.product.findMany({
      include: {
        prices: {
          orderBy: { recordedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

/**
 * Fetch a single product by ID with full price history.
 */
export async function getProductById(id: string): Promise<ProductWithPrices | null> {
  try {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        prices: {
          orderBy: { recordedAt: 'asc' },
        },
      },
    });
  } catch (error) {
    console.error(`Failed to fetch product with ID ${id}:`, error);
    return null;
  }
}
