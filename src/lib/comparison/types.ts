import { StoreDomain } from '@prisma/client';

export interface StoreOffer {
  store: StoreDomain;
  storeName: string;
  price: number;
  isAvailable: boolean;
  url: string;
  isBestDeal: boolean;
  priceDifference: number; // CAD difference relative to best deal (0 for best deal)
  sku?: string | null;
  currency?: string;
}

export interface ToolIntent {
  query: string;
  brand: string;
  model: string | null;
  category: string;
  cleanTitle: string;
  imageUrl: string;
}

export interface ToolComparisonResult {
  intent: ToolIntent;
  bestOffer: StoreOffer;
  lowestPrice: number;
  highestPrice: number;
  maxSavings: number;
  averagePrice: number;
  offers: StoreOffer[];
  timestamp: string;
}
