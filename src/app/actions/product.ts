'use server';

import { PrismaClient, StoreDomain, Product, PriceHistory } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getScraper, detectStore, ScrapedProduct } from '../../lib/scrapers';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

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

import { CANADIAN_DEFAULT_PRODUCTS } from '@/lib/constants/default-products';

/**
 * Fetch all products with their latest price history entry.
 * Merges persisted database products with verified Canadian hardware defaults.
 */
export async function getProducts(): Promise<ProductWithPrices[]> {
  const defaultsFormatted: ProductWithPrices[] = CANADIAN_DEFAULT_PRODUCTS.map((p) => ({
    id: p.id,
    url: p.url,
    store: p.store as StoreDomain,
    sku: p.sku,
    title: p.title,
    imageUrl: p.imageUrl,
    currency: p.currency,
    isActive: p.isActive,
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt),
    prices: p.prices.map((pr) => ({
      id: pr.id,
      productId: p.id,
      price: pr.price,
      isAvailable: pr.isAvailable,
      recordedAt: new Date(pr.recordedAt),
    })),
  }));

  try {
    const dbProducts = await prisma.product.findMany({
      include: {
        prices: {
          orderBy: { recordedAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (dbProducts && dbProducts.length > 0) {
      // Prepend user-added DB products, append non-conflicting default catalog items
      const existingUrls = new Set(dbProducts.map((p) => p.url));
      const nonDuplicatedDefaults = defaultsFormatted.filter((p) => !existingUrls.has(p.url));
      return [...dbProducts, ...nonDuplicatedDefaults];
    }

    return defaultsFormatted;
  } catch (error) {
    console.warn('Database query fallback to default hardware catalog:', error);
    return defaultsFormatted;
  }
}

/**
 * Fetch a single product by ID with full price history.
 */
export async function getProductById(id: string): Promise<ProductWithPrices | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        prices: {
          orderBy: { recordedAt: 'asc' },
        },
      },
    });
    if (product) return product;
  } catch (error) {
    console.warn(`Database query failed for product ID ${id}:`, error);
  }

  // Lookup in default catalog
  const defaultItem = CANADIAN_DEFAULT_PRODUCTS.find((p) => p.id === id);
  if (defaultItem) {
    return {
      id: defaultItem.id,
      url: defaultItem.url,
      store: defaultItem.store as StoreDomain,
      sku: defaultItem.sku,
      title: defaultItem.title,
      imageUrl: defaultItem.imageUrl,
      currency: defaultItem.currency,
      isActive: defaultItem.isActive,
      createdAt: new Date(defaultItem.createdAt),
      updatedAt: new Date(defaultItem.updatedAt),
      prices: defaultItem.prices.map((pr) => ({
        id: pr.id,
        productId: defaultItem.id,
        price: pr.price,
        isAvailable: pr.isAvailable,
        recordedAt: new Date(pr.recordedAt),
      })),
    };
  }

  return null;
}
