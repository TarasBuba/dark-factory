import * as cheerio from 'cheerio';
import { StoreDomain } from '@prisma/client';
import type { IScraper, ScrapedProduct } from '../index';

export class AtlasScraper implements IScraper {
  readonly store: StoreDomain = StoreDomain.ATLAS_MACHINERY;

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
      throw new Error(`Failed to fetch Atlas Machinery page: HTTP ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    let title = '';
    let price: number | null = null;
    let sku: string | null = null;
    let imageUrl: string | null = null;
    let isAvailable = true;

    // 1. Try to extract from Schema.org JSON-LD
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const json = JSON.parse($(el).text());
        const productObj =
          json['@type'] === 'Product'
            ? json
            : Array.isArray(json['@graph'])
            ? json['@graph'].find((item: { '@type': string }) => item['@type'] === 'Product')
            : null;

        if (productObj) {
          if (!title && productObj.name) {
            title = String(productObj.name).trim();
          }
          if (!sku && productObj.sku) {
            sku = String(productObj.sku).trim();
          }
          if (!imageUrl && productObj.image) {
            imageUrl = Array.isArray(productObj.image) ? productObj.image[0] : String(productObj.image);
          }
          if (productObj.offers) {
            const offer = Array.isArray(productObj.offers) ? productObj.offers[0] : productObj.offers;
            if (offer && offer.price !== undefined && price === null) {
              const parsed = parseFloat(String(offer.price).replace(/,/g, ''));
              if (!isNaN(parsed)) {
                price = parsed;
              }
            }
            if (offer && offer.availability) {
              const avail = String(offer.availability).toLowerCase();
              isAvailable = !avail.includes('outofstock');
            }
          }
        }
      } catch {
        // Ignore JSON parse errors and continue to fallback
      }
    });

    // 2. DOM fallbacks
    if (!title) {
      title =
        $('h1.productView-title').first().text().trim() ||
        $('h1').first().text().trim() ||
        $('meta[property="og:title"]').attr('content')?.trim() ||
        '';
    }

    if (price === null) {
      const rawPrice =
        $('[data-product-price-without-tax]').first().text().trim() ||
        $('.price--withoutTax').first().text().trim() ||
        $('.productView-price .price').first().text().trim() ||
        $('meta[property="og:price:amount"]').attr('content')?.trim() ||
        '';

      const priceMatch = rawPrice.replace(/,/g, '').match(/\d+(?:\.\d+)?/);
      if (priceMatch) {
        price = parseFloat(priceMatch[0]);
      }
    }

    if (!sku) {
      const rawSku =
        $('[data-product-sku]').first().text().trim() ||
        $('dd.productView-info-value').first().text().trim() ||
        '';
      sku = rawSku.replace(/^SKU:\s*/i, '').trim() || null;
    }

    if (!imageUrl) {
      imageUrl =
        $('meta[property="og:image"]').attr('content')?.trim() ||
        $('.productView-image img').first().attr('src')?.trim() ||
        null;
    }

    if (!title) {
      throw new Error(`Could not parse product title from Atlas Machinery: ${url}`);
    }

    if (price === null || isNaN(price)) {
      throw new Error(`Could not parse product price from Atlas Machinery: ${url}`);
    }

    return {
      title,
      price,
      currency: 'CAD',
      sku,
      imageUrl,
      isAvailable,
    };
  }
}
