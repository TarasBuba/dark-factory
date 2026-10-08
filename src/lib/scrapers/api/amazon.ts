import { StoreDomain } from '@prisma/client';
import type { IScraper, ScrapedProduct } from '../index';

export class AmazonScraper implements IScraper {
  readonly store: StoreDomain = StoreDomain.AMAZON;

  async scrape(url: string): Promise<ScrapedProduct> {
    // Stub implementation returning mock data for Amazon CA
    return {
      title: 'DEWALT 20V MAX Cordless Drill Combo Kit (Amazon Canada)',
      price: 179.99,
      currency: 'CAD',
      sku: 'B08XYZ1234',
      imageUrl: 'https://m.media-amazon.com/images/I/71dummy-amazon.jpg',
      isAvailable: true,
    };
  }
}
