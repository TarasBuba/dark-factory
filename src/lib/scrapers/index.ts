import { StoreDomain } from '@prisma/client';
import { KmsScraper } from './cheerio/kms';
import { AtlasScraper } from './cheerio/atlas';
import { FederatedScraper } from './cheerio/federated';
import { HomeDepotScraper } from './api/homedepot';
import { AmazonScraper } from './api/amazon';

export interface ScrapedProduct {
  title: string;
  price: number;
  currency?: string;
  sku?: string | null;
  imageUrl?: string | null;
  isAvailable?: boolean;
}

export interface IScraper {
  readonly store: StoreDomain;
  scrape(url: string): Promise<ScrapedProduct>;
}

/**
 * Detects the store domain from a URL based on known Canadian retailer domains.
 */
export function detectStore(url: string): StoreDomain {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();

    if (host.includes('kmstools.com') || host.includes('kms-tools.com')) {
      return StoreDomain.KMS_TOOLS;
    }
    if (host.includes('atlas-machinery.com')) {
      return StoreDomain.ATLAS_MACHINERY;
    }
    if (host.includes('federatedtool.com')) {
      return StoreDomain.FEDERATED_TOOL;
    }
    if (host.includes('homedepot.ca') || host.includes('homedepot.com')) {
      return StoreDomain.HOME_DEPOT;
    }
    if (host.includes('amazon.ca') || host.includes('amazon.com')) {
      return StoreDomain.AMAZON;
    }
    if (host.includes('rona.ca')) {
      return StoreDomain.RONA;
    }
    if (host.includes('homehardware.ca')) {
      return StoreDomain.HOME_HARDWARE;
    }
    if (host.includes('canadiantire.ca')) {
      return StoreDomain.CANADIAN_TIRE;
    }
    if (host.includes('wiselinetools.ca')) {
      return StoreDomain.WISE_LINE_TOOLS;
    }

    return StoreDomain.OTHER;
  } catch {
    throw new Error(`Invalid URL format: ${url}`);
  }
}

export function getStoreFromUrl(url: string): StoreDomain {
  return detectStore(url);
}

/**
 * Factory class for managing and retrieving store scrapers.
 */
export class ScraperFactory {
  private static scrapers: Map<StoreDomain, IScraper> = new Map();
  private static initialized = false;

  private static initDefaults(): void {
    if (this.initialized) return;
    this.scrapers.set(StoreDomain.KMS_TOOLS, new KmsScraper());
    this.scrapers.set(StoreDomain.ATLAS_MACHINERY, new AtlasScraper());
    this.scrapers.set(StoreDomain.FEDERATED_TOOL, new FederatedScraper());
    this.scrapers.set(StoreDomain.HOME_DEPOT, new HomeDepotScraper());
    this.scrapers.set(StoreDomain.AMAZON, new AmazonScraper());
    this.initialized = true;
  }

  public static register(store: StoreDomain, scraper: IScraper): void {
    this.initDefaults();
    this.scrapers.set(store, scraper);
  }

  public static getScraper(urlOrStore: string | StoreDomain): IScraper {
    this.initDefaults();

    let store: StoreDomain;
    if (typeof urlOrStore === 'string' && Object.values(StoreDomain).includes(urlOrStore as StoreDomain)) {
      store = urlOrStore as StoreDomain;
    } else if (typeof urlOrStore === 'string') {
      store = detectStore(urlOrStore);
    } else {
      store = urlOrStore;
    }

    const scraper = this.scrapers.get(store);
    if (!scraper) {
      throw new Error(`No scraper registered for store domain: ${store}`);
    }

    return scraper;
  }
}

/**
 * Convenience helper to get a scraper by URL or StoreDomain.
 */
export function getScraper(urlOrStore: string | StoreDomain): IScraper {
  return ScraperFactory.getScraper(urlOrStore);
}

// Re-export scrapers
export { KmsScraper } from './cheerio/kms';
export { AtlasScraper } from './cheerio/atlas';
export { FederatedScraper } from './cheerio/federated';
export { HomeDepotScraper } from './api/homedepot';
export { AmazonScraper } from './api/amazon';
