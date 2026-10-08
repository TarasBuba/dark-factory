import * as cheerio from 'cheerio';
import { StoreDomain } from '@prisma/client';
import type { IScraper, ScrapedProduct } from '../index';

export class KmsScraper implements IScraper {
  readonly store: StoreDomain = StoreDomain.KMS_TOOLS;

  async scrape(url: string): Promise<ScrapedProduct> {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch KMS Tools page: HTTP ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // 1. Title
    const title =
      $('h1.page-title span.base').first().text().trim() ||
      $('h1.page-title').first().text().trim() ||
      $('h1').first().text().trim() ||
      $('meta[property="og:title"]').attr('content')?.trim() ||
      '';

    if (!title) {
      throw new Error(`Could not parse product title from KMS Tools: ${url}`);
    }

    // 2. Price
    const rawPrice =
      $('[data-price-type="finalPrice"] .price').first().text().trim() ||
      $('.price-wrapper .price').first().text().trim() ||
      $('.special-price .price').first().text().trim() ||
      $('.price-box .price').first().text().trim() ||
      $('meta[property="product:price:amount"]').attr('content')?.trim() ||
      '';

    const priceMatch = rawPrice.replace(/,/g, '').match(/\d+(?:\.\d+)?/);
    if (!priceMatch) {
      throw new Error(`Could not parse product price from KMS Tools: ${url} (found: "${rawPrice}")`);
    }
    const price = parseFloat(priceMatch[0]);

    // 3. SKU
    const sku =
      $('.sku .value').first().text().trim() ||
      $('[itemprop="sku"]').first().text().trim() ||
      $('.product.attribute.sku .value').first().text().trim() ||
      null;

    // 4. Image
    const imageUrl =
      $('meta[property="og:image"]').attr('content')?.trim() ||
      $('.gallery-placeholder img').first().attr('src')?.trim() ||
      null;

    // 5. Availability
    const isUnavailable = $('.stock.unavailable').length > 0;
    const isAvailable = !isUnavailable;

    return {
      title,
      price,
      currency: 'CAD',
      sku: sku || null,
      imageUrl: imageUrl || null,
      isAvailable,
    };
  }
}
