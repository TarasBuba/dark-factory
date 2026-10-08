import { StoreDomain } from '@prisma/client';
import type { IScraper, ScrapedProduct } from '../index';

export class HomeDepotScraper implements IScraper {
  readonly store: StoreDomain = StoreDomain.HOME_DEPOT;

  async scrape(url: string): Promise<ScrapedProduct> {
    // Stub implementation returning mock data for Home Depot
    return {
      title: 'DEWALT 20V MAX Cordless Compact Drill/Driver Kit (Home Depot CA)',
      price: 199.0,
      currency: 'CAD',
      sku: 'HD-1001234567',
      imageUrl: 'https://images.homedepot.ca/productimages/dummy-drill.jpg',
      isAvailable: true,
    };
  }
}
