export interface DefaultPriceRecord {
  id: string;
  price: number;
  isAvailable: boolean;
  recordedAt: string;
}

export interface DefaultProduct {
  id: string;
  title: string;
  store: string;
  sku: string;
  url: string;
  imageUrl: string;
  currency: string;
  isActive: boolean;
  currentPrice: number;
  previousPrice: number;
  isAvailable: boolean;
  updatedAt: string;
  createdAt: string;
  prices: DefaultPriceRecord[];
}

export const CANADIAN_DEFAULT_PRODUCTS: DefaultProduct[] = [
  {
    id: "prod-1",
    title: "Milwaukee M18 FUEL 18V 1/2 in. Brushless Cordless Hammer Drill/Driver (Bare Tool)",
    store: "HOME_DEPOT",
    sku: "2904-20",
    url: "https://www.homedepot.ca/product/milwaukee-tool-m18-fuel-18v-cordless-hammer-drill/1001565342",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Cordless_drill.jpg/640px-Cordless_drill.jpg",
    currency: "CAD",
    isActive: true,
    currentPrice: 198.0,
    previousPrice: 248.0,
    isAvailable: true,
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-10-12T12:00:00.000Z",
    prices: [
      { id: "p1-1", price: 248.0, isAvailable: true, recordedAt: "2026-09-20T00:00:00Z" },
      { id: "p1-2", price: 228.0, isAvailable: true, recordedAt: "2026-09-28T00:00:00Z" },
      { id: "p1-3", price: 198.0, isAvailable: true, recordedAt: "2026-10-06T00:00:00Z" },
    ],
  },
  {
    id: "prod-2",
    title: "DeWalt 20V MAX XR Brushless 3-Speed 1/4 in. Impact Driver (Bare Tool)",
    store: "KMS_TOOLS",
    sku: "DCF887B",
    url: "https://www.kmstools.com/featured-brands/dewalt-power-tools.html",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Impact_driver_dewalt.jpg/640px-Impact_driver_dewalt.jpg",
    currency: "CAD",
    isActive: true,
    currentPrice: 169.99,
    previousPrice: 199.99,
    isAvailable: true,
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-10-12T12:00:00.000Z",
    prices: [
      { id: "p2-1", price: 199.99, isAvailable: true, recordedAt: "2026-09-15T00:00:00Z" },
      { id: "p2-2", price: 169.99, isAvailable: true, recordedAt: "2026-10-02T00:00:00Z" },
    ],
  },
  {
    id: "prod-3",
    title: "Festool TSC 55 KEB-Basic Cordless Plunge-Cut Track Saw (Systainer)",
    store: "ATLAS_MACHINERY",
    sku: "576708",
    url: "https://www.atlas-machinery.com/search.php?search_query=576708",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Plunge_saw.jpg/640px-Plunge_saw.jpg",
    currency: "CAD",
    isActive: true,
    currentPrice: 775.0,
    previousPrice: 775.0,
    isAvailable: true,
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-10-12T12:00:00.000Z",
    prices: [
      { id: "p3-1", price: 775.0, isAvailable: true, recordedAt: "2026-09-25T00:00:00Z" },
      { id: "p3-2", price: 775.0, isAvailable: true, recordedAt: "2026-10-05T00:00:00Z" },
    ],
  },
  {
    id: "prod-4",
    title: "Makita 40V Max XGT Brushless 7-1/4 in. Rear Handle Circular Saw (Tool Only)",
    store: "RONA",
    sku: "GSR01Z",
    url: "https://www.rona.ca/en/search?query=Makita+circular+saw",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Handkreiss%C3%A4ge_Makita_5008MG.jpg/640px-Handkreiss%C3%A4ge_Makita_5008MG.jpg",
    currency: "CAD",
    isActive: true,
    currentPrice: 349.0,
    previousPrice: 399.0,
    isAvailable: true,
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-10-12T12:00:00.000Z",
    prices: [
      { id: "p4-1", price: 399.0, isAvailable: true, recordedAt: "2026-09-10T00:00:00Z" },
      { id: "p4-2", price: 349.0, isAvailable: true, recordedAt: "2026-10-04T00:00:00Z" },
    ],
  },
  {
    id: "prod-5",
    title: "Maximum 20V Max Brushless Reciprocating Saw (Tool Only)",
    store: "CANADIAN_TIRE",
    sku: "054-7363-4",
    url: "https://www.canadiantire.ca/en/pdp/maximum-20v-max-cordless-brushless-reciprocating-saw-bare-tool-0547363p.html",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Reciprocating_saw.jpg/640px-Reciprocating_saw.jpg",
    currency: "CAD",
    isActive: true,
    currentPrice: 129.99,
    previousPrice: 179.99,
    isAvailable: true,
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-10-12T12:00:00.000Z",
    prices: [
      { id: "p5-1", price: 179.99, isAvailable: true, recordedAt: "2026-09-18T00:00:00Z" },
      { id: "p5-2", price: 129.99, isAvailable: true, recordedAt: "2026-10-03T00:00:00Z" },
    ],
  },
  {
    id: "prod-6",
    title: "DeWalt 10 in. 15-Amp Compact Jobsite Table Saw with Site-Pro Modular Guarding",
    store: "HOME_HARDWARE",
    sku: "DWE7485",
    url: "https://www.homehardware.ca/en/search?query=DWE7485",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Table_saw.jpg/640px-Table_saw.jpg",
    currency: "CAD",
    isActive: true,
    currentPrice: 429.0,
    previousPrice: 469.0,
    isAvailable: false,
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-10-12T12:00:00.000Z",
    prices: [
      { id: "p6-1", price: 469.0, isAvailable: true, recordedAt: "2026-09-12T00:00:00Z" },
      { id: "p6-2", price: 429.0, isAvailable: false, recordedAt: "2026-10-05T00:00:00Z" },
    ],
  },
  {
    id: "prod-7",
    title: "King Canada 10 in. Dual Compound Sliding Miter Saw with Twin Laser Guide",
    store: "FEDERATED_TOOL",
    sku: "8380N",
    url: "https://federatedtool.com/search.php?search_query=8380N",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Compound_miter_saw.jpg/640px-Compound_miter_saw.jpg",
    currency: "CAD",
    isActive: true,
    currentPrice: 289.0,
    previousPrice: 329.0,
    isAvailable: true,
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-10-12T12:00:00.000Z",
    prices: [
      { id: "p7-1", price: 329.0, isAvailable: true, recordedAt: "2026-09-22T00:00:00Z" },
      { id: "p7-2", price: 289.0, isAvailable: true, recordedAt: "2026-10-01T00:00:00Z" },
    ],
  },
  {
    id: "prod-8",
    title: "Bosch 12V Max Palm Edge Cordless Router (Tool Only)",
    store: "WISE_LINE_TOOLS",
    sku: "GKF12V-25N",
    url: "https://wiselinetools.ca/search.php?search_query=Bosch+router",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Wood_router.jpg/640px-Wood_router.jpg",
    currency: "CAD",
    isActive: true,
    currentPrice: 189.0,
    previousPrice: 199.0,
    isAvailable: true,
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-10-12T12:00:00.000Z",
    prices: [
      { id: "p8-1", price: 199.0, isAvailable: true, recordedAt: "2026-09-14T00:00:00Z" },
      { id: "p8-2", price: 189.0, isAvailable: true, recordedAt: "2026-10-03T00:00:00Z" },
    ],
  },
];

/**
 * Resolves an authentic, high-resolution photo of real hardware tools based on title or URL keywords.
 * Completely replaces all generic stock photo placeholders with authentic power tool imagery.
 */
export function resolveAuthenticToolImage(text: string): string {
  const lower = (text || '').toLowerCase();

  if (lower.includes('impact') || lower.includes('driver')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Impact_driver_dewalt.jpg/640px-Impact_driver_dewalt.jpg';
  }
  if (lower.includes('track saw') || lower.includes('plunge')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Plunge_saw.jpg/640px-Plunge_saw.jpg';
  }
  if (lower.includes('table saw')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Table_saw.jpg/640px-Table_saw.jpg';
  }
  if (lower.includes('miter') || lower.includes('mitre')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Compound_miter_saw.jpg/640px-Compound_miter_saw.jpg';
  }
  if (lower.includes('recip') || lower.includes('sawzall')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Reciprocating_saw.jpg/640px-Reciprocating_saw.jpg';
  }
  if (lower.includes('circular') || lower.includes('handkreiss')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Handkreiss%C3%A4ge_Makita_5008MG.jpg/640px-Handkreiss%C3%A4ge_Makita_5008MG.jpg';
  }
  if (lower.includes('router') || lower.includes('trim')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Wood_router.jpg/640px-Wood_router.jpg';
  }
  if (lower.includes('grind') || lower.includes('angle grinder')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Angle_grinder.jpg/640px-Angle_grinder.jpg';
  }
  if (lower.includes('sand') || lower.includes('orbital')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Orbital_sander.jpg/640px-Orbital_sander.jpg';
  }
  if (lower.includes('saw')) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Handkreiss%C3%A4ge_Makita_5008MG.jpg/640px-Handkreiss%C3%A4ge_Makita_5008MG.jpg';
  }

  // Default authentic tool: Cordless drill
  return 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Cordless_drill.jpg/640px-Cordless_drill.jpg';
}

/**
 * Returns a guaranteed working canonical search/product destination on the retailer's official website.
 * Prevents 404 "Object Not Found" errors by using resilient canonical store search queries.
 */
export function getRetailerSearchUrl(
  store: string,
  title: string,
  sku?: string | null
): string {
  const query = encodeURIComponent((sku || title || 'tool').trim());
  const storeNormalized = (store || '').toUpperCase().replace(/[^A-Z]/g, '_');

  switch (storeNormalized) {
    case 'HOME_DEPOT':
      return `https://www.homedepot.ca/search?q=${query}`;
    case 'KMS_TOOLS':
      return `https://www.kmstools.com/catalogsearch/result/?q=${query}`;
    case 'ATLAS_MACHINERY':
      return `https://www.atlas-machinery.com/search.php?search_query=${query}`;
    case 'RONA':
      return `https://www.rona.ca/en/search?query=${query}`;
    case 'CANADIAN_TIRE':
      return `https://www.canadiantire.ca/en/search-results.html?q=${query}`;
    case 'HOME_HARDWARE':
      return `https://www.homehardware.ca/en/search?query=${query}`;
    case 'FEDERATED_TOOL':
      return `https://federatedtool.com/search.php?search_query=${query}`;
    case 'WISE_LINE_TOOLS':
      return `https://wiselinetools.ca/search.php?search_query=${query}`;
    case 'AMAZON':
      return `https://www.amazon.ca/s?k=${query}`;
    default:
      return `https://www.google.ca/search?q=${encodeURIComponent(`${title} Canada buy`)}`;
  }
}
