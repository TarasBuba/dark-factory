"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ExternalLink,
  TrendingDown,
  TrendingUp,
  Minus,
  Tag,
  Clock,
  Filter,
  Search,
  LayoutGrid,
  List,
  Store,
  ChevronRight,
  Zap,
} from "lucide-react";

export type StoreDomain =
  | "HOME_DEPOT"
  | "KMS_TOOLS"
  | "ATLAS_MACHINERY"
  | "RONA"
  | "HOME_HARDWARE"
  | "CANADIAN_TIRE"
  | "FEDERATED_TOOL"
  | "WISE_LINE_TOOLS"
  | "AMAZON"
  | "OTHER";

export interface PriceRecord {
  id: string;
  price: number;
  isAvailable: boolean;
  recordedAt: string | Date;
}

export interface TrackedProduct {
  id: string;
  url: string;
  store: StoreDomain | string;
  sku?: string | null;
  title: string;
  imageUrl?: string | null;
  currency?: string;
  isActive?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  prices?: PriceRecord[];
  // Optional convenience fields if precomputed
  currentPrice?: number;
  previousPrice?: number;
  isAvailable?: boolean;
}

export interface ProductListProps {
  products?: TrackedProduct[];
  className?: string;
}

// Store configuration with distinct Canadian branding colors and labels
export const STORE_META: Record<
  string,
  {
    name: string;
    shortName: string;
    badgeStyle: string;
    borderStyle: string;
    accentDot: string;
  }
> = {
  HOME_DEPOT: {
    name: "The Home Depot Canada",
    shortName: "Home Depot",
    badgeStyle: "bg-orange-500/10 text-orange-600 border-orange-500/30 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/40",
    borderStyle: "hover:border-orange-500/50",
    accentDot: "bg-orange-500",
  },
  KMS_TOOLS: {
    name: "KMS Tools & Equipment",
    shortName: "KMS Tools",
    badgeStyle: "bg-blue-600/10 text-blue-600 border-blue-600/30 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/40",
    borderStyle: "hover:border-blue-500/50",
    accentDot: "bg-blue-600",
  },
  ATLAS_MACHINERY: {
    name: "Atlas Machinery Supply",
    shortName: "Atlas Machinery",
    badgeStyle: "bg-red-600/10 text-red-600 border-red-600/30 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/40",
    borderStyle: "hover:border-red-500/50",
    accentDot: "bg-red-600",
  },
  RONA: {
    name: "RONA+ / Rona Canada",
    shortName: "RONA",
    badgeStyle: "bg-sky-600/10 text-sky-700 border-sky-600/30 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/40",
    borderStyle: "hover:border-sky-500/50",
    accentDot: "bg-sky-600",
  },
  HOME_HARDWARE: {
    name: "Home Hardware Building Centre",
    shortName: "Home Hardware",
    badgeStyle: "bg-amber-600/10 text-amber-700 border-amber-600/30 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40",
    borderStyle: "hover:border-amber-500/50",
    accentDot: "bg-amber-500",
  },
  CANADIAN_TIRE: {
    name: "Canadian Tire Corp",
    shortName: "Canadian Tire",
    badgeStyle: "bg-rose-600/10 text-rose-600 border-rose-600/30 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/40",
    borderStyle: "hover:border-rose-500/50",
    accentDot: "bg-rose-600",
  },
  FEDERATED_TOOL: {
    name: "Federated Tool Supply",
    shortName: "Federated Tool",
    badgeStyle: "bg-emerald-600/10 text-emerald-700 border-emerald-600/30 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/40",
    borderStyle: "hover:border-emerald-500/50",
    accentDot: "bg-emerald-600",
  },
  WISE_LINE_TOOLS: {
    name: "Wise Line Tools",
    shortName: "Wise Line",
    badgeStyle: "bg-indigo-600/10 text-indigo-700 border-indigo-600/30 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/40",
    borderStyle: "hover:border-indigo-500/50",
    accentDot: "bg-indigo-600",
  },
  AMAZON: {
    name: "Amazon.ca Hardware",
    shortName: "Amazon CA",
    badgeStyle: "bg-amber-700/10 text-amber-800 border-amber-700/30 dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-500/40",
    borderStyle: "hover:border-amber-500/50",
    accentDot: "bg-amber-600",
  },
  OTHER: {
    name: "Canadian Retailer",
    shortName: "Other Store",
    badgeStyle: "bg-zinc-600/10 text-zinc-700 border-zinc-600/30 dark:bg-zinc-500/20 dark:text-zinc-300 dark:border-zinc-500/40",
    borderStyle: "hover:border-zinc-500/50",
    accentDot: "bg-zinc-500",
  },
};

// Rich realistic default products across Canadian hardware retailers
export const DEFAULT_TRACKED_PRODUCTS: TrackedProduct[] = [
  {
    id: "prod-1",
    title: "Milwaukee M18 FUEL 18V 1/2 in. Brushless Cordless Hammer Drill/Driver (Bare Tool)",
    store: "HOME_DEPOT",
    sku: "2904-20",
    url: "https://www.homedepot.ca/product/milwaukee-tool-m18-fuel-18v-cordless-hammer-drill/1001565342",
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80",
    currency: "CAD",
    isActive: true,
    currentPrice: 198.0,
    previousPrice: 248.0,
    isAvailable: true,
    updatedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
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
    url: "https://www.kmstools.com/dewalt-20v-max-xr-brushless-1-4-impact-driver-bare-tool.html",
    imageUrl: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=600&q=80",
    currency: "CAD",
    isActive: true,
    currentPrice: 169.99,
    previousPrice: 199.99,
    isAvailable: true,
    updatedAt: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
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
    url: "https://www.atlas-machinery.com/festool/576708-tsc-55-k-cordless-track-saw/",
    imageUrl: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=600&q=80",
    currency: "CAD",
    isActive: true,
    currentPrice: 775.0,
    previousPrice: 775.0,
    isAvailable: true,
    updatedAt: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
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
    url: "https://www.rona.ca/en/product/makita-40v-max-xgt-brushless-circular-saw-7-1-4-in-hs003gz-33075249",
    imageUrl: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=600&q=80",
    currency: "CAD",
    isActive: true,
    currentPrice: 349.0,
    previousPrice: 399.0,
    isAvailable: true,
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
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
    imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    currency: "CAD",
    isActive: true,
    currentPrice: 129.99,
    previousPrice: 179.99,
    isAvailable: true,
    updatedAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
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
    url: "https://www.homehardware.ca/en/10-15-amp-compact-jobsite-table-saw/p/1240892",
    imageUrl: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=600&q=80",
    currency: "CAD",
    isActive: true,
    currentPrice: 429.0,
    previousPrice: 469.0,
    isAvailable: false,
    updatedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
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
    url: "https://www.federatedtool.com/king-canada-10-dual-compound-sliding-miter-saw-8380n/",
    imageUrl: "https://images.unsplash.com/photo-1513467535987-fd81bc7d62f8?auto=format&fit=crop&w=600&q=80",
    currency: "CAD",
    isActive: true,
    currentPrice: 289.0,
    previousPrice: 329.0,
    isAvailable: true,
    updatedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
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
    url: "https://www.wiselinetools.ca/bosch-gkf12v-25n-palm-router.html",
    imageUrl: "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=600&q=80",
    currency: "CAD",
    isActive: true,
    currentPrice: 189.0,
    previousPrice: 199.0,
    isAvailable: true,
    updatedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    prices: [
      { id: "p8-1", price: 199.0, isAvailable: true, recordedAt: "2026-09-14T00:00:00Z" },
      { id: "p8-2", price: 189.0, isAvailable: true, recordedAt: "2026-10-03T00:00:00Z" },
    ],
  },
];

// Helper to format currency in Canadian Dollars
export function formatCAD(amount: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Relative time formatter component (hydration safe)
function TimeAgo({ dateString }: { dateString?: string | Date }) {
  const [timeAgo, setTimeAgo] = React.useState<string>("Recently");

  React.useEffect(() => {
    if (!dateString) return;
    const date = new Date(dateString);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

    if (seconds < 60) setTimeAgo("Just now");
    else {
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) setTimeAgo(`${minutes}m ago`);
      else {
        const hours = Math.floor(minutes / 60);
        if (hours < 24) setTimeAgo(`${hours}h ago`);
        else {
          const days = Math.floor(hours / 24);
          setTimeAgo(`${days}d ago`);
        }
      }
    }
  }, [dateString]);

  return <>{timeAgo}</>;
}

export type SortOption = "lowest" | "highest" | "discount" | "newest";

export default function ProductList({
  products = DEFAULT_TRACKED_PRODUCTS,
  className = "",
}: ProductListProps) {
  const [selectedStore, setSelectedStore] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("discount");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Derive price details for each product
  const enrichedProducts = useMemo(() => {
    return products.map((item) => {
      // Calculate latest price & previous price if not already set
      let curr = item.currentPrice;
      let prev = item.previousPrice;
      let inStock = item.isAvailable ?? true;

      if (item.prices && item.prices.length > 0) {
        // Sort price records by date desc
        const sorted = [...item.prices].sort(
          (a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime()
        );
        curr = sorted[0].price;
        inStock = sorted[0].isAvailable;

        if (sorted.length > 1) {
          prev = sorted[1].price;
        }
      }

      const diff = prev !== undefined && curr !== undefined ? curr - prev : 0;
      const diffPercent = prev && prev > 0 && curr !== undefined ? ((curr - prev) / prev) * 100 : 0;

      return {
        ...item,
        resolvedPrice: curr ?? 0,
        resolvedPrevPrice: prev,
        priceDiff: diff,
        priceDiffPercent: diffPercent,
        inStock,
      };
    });
  }, [products]);

  // Unique stores present in the product set
  const storeCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: enrichedProducts.length };
    for (const p of enrichedProducts) {
      counts[p.store] = (counts[p.store] || 0) + 1;
    }
    return counts;
  }, [enrichedProducts]);

  // Filter & sort
  const filteredProducts = useMemo(() => {
    return enrichedProducts
      .filter((p) => {
        if (selectedStore !== "ALL" && p.store !== selectedStore) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const titleMatch = p.title.toLowerCase().includes(q);
          const skuMatch = p.sku ? p.sku.toLowerCase().includes(q) : false;
          const storeMatch = p.store.toLowerCase().includes(q);
          if (!titleMatch && !skuMatch && !storeMatch) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "lowest") return a.resolvedPrice - b.resolvedPrice;
        if (sortBy === "highest") return b.resolvedPrice - a.resolvedPrice;
        if (sortBy === "discount") {
          // Biggest discount first (most negative diff)
          return a.priceDiff - b.priceDiff;
        }
        return (
          new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
        );
      });
  }, [enrichedProducts, selectedStore, searchQuery, sortBy]);

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Control Bar: Filter pills, Search, Sort & View toggles */}
      <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white/70 p-4 shadow-sm backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/70">
        {/* Store Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => setSelectedStore("ALL")}
            className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              selectedStore === "ALL"
                ? "bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
                : "border border-zinc-200 bg-zinc-50/70 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            <span>All Stores</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                selectedStore === "ALL"
                  ? "bg-zinc-700 text-zinc-100 dark:bg-zinc-300 dark:text-zinc-900"
                  : "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"
              }`}
            >
              {storeCounts["ALL"] || 0}
            </span>
          </button>

          {Object.entries(STORE_META).map(([key, meta]) => {
            const count = storeCounts[key] || 0;
            if (count === 0 && selectedStore !== key) return null; // keep clean
            const isSelected = selectedStore === key;

            return (
              <button
                key={key}
                onClick={() => setSelectedStore(key)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? `ring-2 ring-emerald-500/80 font-bold ${meta.badgeStyle}`
                    : "border-zinc-200 bg-zinc-50/70 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${meta.accentDot}`} />
                <span>{meta.shortName}</span>
                <span className="rounded-full bg-black/5 px-1.5 py-0.2 text-[10px] font-bold dark:bg-white/10">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tool name, model, or SKU (e.g. M18, Festool, 2904-20)..."
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50/80 py-2 pl-9.5 pr-4 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-zinc-700/80 dark:bg-zinc-800/60 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50/80 px-2.5 py-1.5 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-200">
              <Filter className="h-3.5 w-3.5 text-zinc-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort tracked products"
                className="bg-transparent font-medium focus:outline-none"
              >
                <option value="discount" className="dark:bg-zinc-800">Biggest Discount</option>
                <option value="lowest" className="dark:bg-zinc-800">Lowest Price (CAD)</option>
                <option value="highest" className="dark:bg-zinc-800">Highest Price (CAD)</option>
                <option value="newest" className="dark:bg-zinc-800">Recently Updated</option>
              </select>
            </div>

            {/* View Mode Grid/List */}
            <div className="flex items-center rounded-xl border border-zinc-200 bg-zinc-50/80 p-0.5 dark:border-zinc-700 dark:bg-zinc-800/60">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Grid view"
                className={`rounded-lg p-1.5 transition ${
                  viewMode === "grid"
                    ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white"
                    : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                title="List view"
                className={`rounded-lg p-1.5 transition ${
                  viewMode === "list"
                    ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white"
                    : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                }`}
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product count and active deals counter */}
      <div className="flex items-center justify-between px-1 text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-1.5">
          <span>Showing</span>
          <strong className="text-zinc-900 dark:text-zinc-100">{filteredProducts.length}</strong>
          <span>of {products.length} tracked Canadian hardware items</span>
        </div>
        <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
          <Zap className="h-3.5 w-3.5" />
          <span>Real-time CAD currency active</span>
        </div>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white/50 p-12 text-center dark:border-zinc-800 dark:bg-zinc-900/30">
          <Store className="mb-3 h-10 w-10 text-zinc-400 dark:text-zinc-600" />
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            No products match this filter
          </h3>
          <p className="mt-1 max-w-sm text-xs text-zinc-500 dark:text-zinc-400">
            Try adjusting your store filter or search keyword, or paste a new URL above to start tracking.
          </p>
          <button
            onClick={() => {
              setSelectedStore("ALL");
              setSearchQuery("");
            }}
            className="mt-4 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => {
            const storeMeta = STORE_META[product.store] || STORE_META.OTHER;
            const hasDiscount = product.priceDiff < 0;
            const hasIncrease = product.priceDiff > 0;

            return (
              <div
                key={product.id}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-300/40 dark:border-zinc-800/80 dark:bg-zinc-900/90 dark:hover:shadow-black/60 ${storeMeta.borderStyle}`}
              >
                {/* Card Top: Badges & Stock */}
                <div className="p-4 pb-0">
                  <div className="flex items-center justify-between gap-2">
                    {/* Canadian Store Badge */}
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold tracking-tight shadow-2xs ${storeMeta.badgeStyle}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${storeMeta.accentDot}`} />
                      {storeMeta.shortName}
                    </span>

                    {/* Stock Status */}
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        product.inStock
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                          : "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400"
                      }`}
                    >
                      {product.inStock ? (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>In Stock</span>
                        </>
                      ) : (
                        <>
                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                          <span>Out of Stock</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Card Image */}
                <div className="relative mt-3 h-44 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800/50">
                  {product.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-zinc-400">
                      <Store className="h-12 w-12 opacity-30" />
                    </div>
                  )}

                  {/* SKU Pill if available */}
                  {product.sku && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-mono font-medium text-white backdrop-blur-xs">
                      <Tag className="h-2.5 w-2.5" />
                      <span>SKU: {product.sku}</span>
                    </div>
                  )}

                  {/* Deal Tag */}
                  {hasDiscount && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-bold text-white shadow-md">
                      <TrendingDown className="h-3.5 w-3.5" />
                      <span>SAVE {Math.abs(product.priceDiffPercent).toFixed(0)}%</span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h3
                      className="line-clamp-2 text-sm font-semibold text-zinc-900 transition group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400"
                      title={product.title}
                    >
                      {product.title}
                    </h3>

                    {/* Price section in CAD */}
                    <div className="mt-3 flex items-baseline justify-between gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800/60">
                      <div>
                        <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                          Current Price
                        </div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                            {formatCAD(product.resolvedPrice)}
                          </span>
                          <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                            CAD
                          </span>
                        </div>
                      </div>

                      {/* Previous Price & Change */}
                      {product.resolvedPrevPrice !== undefined && (
                        <div className="text-right">
                          <span className="block text-xs text-zinc-400 line-through dark:text-zinc-500">
                            {formatCAD(product.resolvedPrevPrice)}
                          </span>
                          <span
                            className={`inline-flex items-center gap-0.5 text-xs font-bold ${
                              hasDiscount
                                ? "text-emerald-600 dark:text-emerald-400"
                                : hasIncrease
                                ? "text-red-500 dark:text-red-400"
                                : "text-zinc-400"
                            }`}
                          >
                            {hasDiscount && <TrendingDown className="h-3 w-3" />}
                            {hasIncrease && <TrendingUp className="h-3 w-3" />}
                            {!hasDiscount && !hasIncrease && <Minus className="h-3 w-3" />}
                            <span>
                              {product.priceDiff < 0
                                ? `-${formatCAD(Math.abs(product.priceDiff))}`
                                : product.priceDiff > 0
                                ? `+${formatCAD(product.priceDiff)}`
                                : "No change"}
                            </span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Metadata & Actions */}
                  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span><TimeAgo dateString={product.updatedAt} /></span>
                      </span>
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                      >
                        <span>Visit Store</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    <Link
                      href={`/product/${product.id}`}
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 text-xs font-semibold text-zinc-800 shadow-2xs transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-emerald-500 dark:hover:bg-zinc-750 dark:hover:text-emerald-300"
                    >
                      <span>View Price History</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
          {filteredProducts.map((product) => {
            const storeMeta = STORE_META[product.store] || STORE_META.OTHER;
            const hasDiscount = product.priceDiff < 0;

            return (
              <div
                key={product.id}
                className="group flex flex-col gap-4 p-4 transition hover:bg-zinc-50/80 dark:hover:bg-zinc-850/60 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Image + Title */}
                <div className="flex items-center gap-4">
                  <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800">
                    {product.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <Store className="h-8 w-8 text-zinc-400" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-bold ${storeMeta.badgeStyle}`}
                      >
                        <span className={`h-1.5 w-1.5 rounded-full ${storeMeta.accentDot}`} />
                        {storeMeta.shortName}
                      </span>
                      {product.sku && (
                        <span className="font-mono text-[10px] text-zinc-500">
                          SKU: {product.sku}
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          product.inStock
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                        }`}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>

                    <h3 className="mt-1 line-clamp-1 font-semibold text-zinc-900 group-hover:text-emerald-600 dark:text-zinc-100 dark:group-hover:text-emerald-400 sm:max-w-md">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <span>Updated <TimeAgo dateString={product.updatedAt} /></span>
                    </div>
                  </div>
                </div>

                {/* Price and actions */}
                <div className="flex items-center justify-between gap-6 sm:justify-end">
                  <div className="text-right">
                    <div className="flex items-baseline gap-1 justify-end">
                      <span className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50">
                        {formatCAD(product.resolvedPrice)}
                      </span>
                      <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                        CAD
                      </span>
                    </div>
                    {product.resolvedPrevPrice !== undefined && (
                      <div className="flex items-center justify-end gap-1.5 text-xs">
                        <span className="text-zinc-400 line-through">
                          {formatCAD(product.resolvedPrevPrice)}
                        </span>
                        {hasDiscount && (
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            (-{Math.abs(product.priceDiffPercent).toFixed(0)}%)
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open store page"
                      className="rounded-xl border border-zinc-200 p-2 text-zinc-500 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                    <Link
                      href={`/product/${product.id}`}
                      className="rounded-xl bg-zinc-900 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                      History
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
