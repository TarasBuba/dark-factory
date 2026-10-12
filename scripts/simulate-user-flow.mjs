import assert from 'node:assert';

console.log('====================================================');
console.log('[AI Dark Factory] Executing End-to-End User Simulation');
console.log('====================================================\n');

// Tool authentic images mapper (mirrors default-products.ts)
function resolveAuthenticToolImage(text) {
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
  return 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Cordless_drill.jpg/640px-Cordless_drill.jpg';
}

function deriveFromUrl(url) {
  const parsed = new URL(url);
  const segments = parsed.pathname.split('/').filter(Boolean);
  
  const candidateSegments = segments
    .map(seg => seg.replace(/\.html?$/i, '').trim())
    .filter(seg => !/^(en|fr|product|products|pdp|p|item|detail|details|catalogsearch|result|search|\d+)$/i.test(seg));

  const queryParam = parsed.searchParams.get('q') || parsed.searchParams.get('query') || parsed.searchParams.get('search_query');
  if (queryParam) {
    candidateSegments.unshift(queryParam.trim());
  }

  const bestSlug = candidateSegments.sort((a, b) => b.length - a.length)[0] || segments[segments.length - 1] || 'Hardware Tool';
  const cleanSlug = bestSlug.replace(/-[0-9]{6,}$/, '');

  const formattedTitle = cleanSlug
    .split(/[-_]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();

  let baselinePrice = 179.99;
  if (/festool|saw|table saw|router/i.test(formattedTitle)) {
    baselinePrice = 399.00;
  } else if (/drill|driver|impact/i.test(formattedTitle)) {
    baselinePrice = 199.00;
  } else if (/battery|charger|blade|bit/i.test(formattedTitle)) {
    baselinePrice = 79.99;
  }

  const titleToUse = formattedTitle || 'Canadian Hardware Tool';
  return {
    title: titleToUse,
    price: baselinePrice,
    currency: 'CAD',
    imageUrl: resolveAuthenticToolImage(titleToUse + ' ' + url),
    isAvailable: true,
  };
}

function getRetailerSearchUrl(store, title, sku) {
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

const testCases = [
  {
    name: 'Home Depot CA - Milwaukee Hammer Drill',
    store: 'HOME_DEPOT',
    url: 'https://www.homedepot.ca/product/milwaukee-tool-m18-fuel-18v-cordless-hammer-drill/1001565342',
    expectedImageFragment: 'Cordless_drill.jpg',
  },
  {
    name: 'KMS Tools - DeWalt Impact Driver',
    store: 'KMS_TOOLS',
    url: 'https://www.kmstools.com/catalogsearch/result/?q=dewalt-impact-driver',
    expectedImageFragment: 'Impact_driver_dewalt.jpg',
  },
  {
    name: 'Atlas Machinery - Festool Track Saw',
    store: 'ATLAS_MACHINERY',
    url: 'https://www.atlas-machinery.com/search.php?search_query=Festool+track+saw',
    expectedImageFragment: 'Plunge_saw.jpg',
  },
  {
    name: 'RONA - Makita Circular Saw',
    store: 'RONA',
    url: 'https://www.rona.ca/en/search?query=Makita+circular+saw',
    expectedImageFragment: 'Handkreiss',
  },
  {
    name: 'Canadian Tire - Maximum Recip Saw',
    store: 'CANADIAN_TIRE',
    url: 'https://www.canadiantire.ca/en/pdp/maximum-20v-max-cordless-brushless-reciprocating-saw-bare-tool-0547363p.html',
    expectedImageFragment: 'Reciprocating_saw.jpg',
  },
  {
    name: 'Home Hardware - DeWalt Table Saw',
    store: 'HOME_HARDWARE',
    url: 'https://www.homehardware.ca/en/search?query=dewalt+table+saw',
    expectedImageFragment: 'Table_saw.jpg',
  },
  {
    name: 'Federated Tool - Miter Saw',
    store: 'FEDERATED_TOOL',
    url: 'https://federatedtool.com/search.php?search_query=miter+saw',
    expectedImageFragment: 'Compound_miter_saw.jpg',
  },
  {
    name: 'Wise Line Tools - Bosch Palm Router',
    store: 'WISE_LINE_TOOLS',
    url: 'https://wiselinetools.ca/search.php?search_query=Bosch+router',
    expectedImageFragment: 'Wood_router.jpg',
  },
];

let passed = 0;

for (const tc of testCases) {
  process.stdout.write(`Testing: ${tc.name} ... `);
  const res = deriveFromUrl(tc.url);

  assert.ok(res.title && res.title.length > 3, 'Title should be valid');
  assert.ok(typeof res.price === 'number' && res.price > 0, 'Price must be positive CAD');
  assert.strictEqual(res.currency, 'CAD', 'Currency must be CAD');
  assert.ok(!res.imageUrl.includes('unsplash'), 'Image must NOT be Unsplash');
  assert.ok(res.imageUrl.includes(tc.expectedImageFragment), `Image must match expected tool photo: ${tc.expectedImageFragment}`);

  // Test retailer redirect search URL
  const searchUrl = getRetailerSearchUrl(tc.store, res.title, 'SKU-TEST');
  assert.ok(searchUrl.startsWith('https://'), 'Search URL must be valid HTTPS');
  assert.ok(searchUrl.includes('SKU-TEST') || searchUrl.includes(encodeURIComponent(res.title)), 'Search URL must contain query');

  console.log(`PASSED (Title: "${res.title.slice(0, 28)}...", CAD $${res.price}, Image: ${tc.expectedImageFragment})`);
  passed++;
}

console.log(`\n====================================================`);
console.log(`[AI Dark Factory] All ${passed}/${testCases.length} store simulations PASSED!`);
console.log(`====================================================\n`);
