import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PrismaClient } from "@prisma/client";
import PriceChart from "@/components/PriceChart";
import {
  ExternalLink,
  ArrowLeft,
  Store,
  Tag,
  Calendar,
  Clock,
  TrendingDown,
  TrendingUp,
  Minus,
  CheckCircle2,
  XCircle,
  Package,
} from "lucide-react";

// Singleton PrismaClient for Next.js Server Components
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

interface PageProps {
  params: Promise<{ id: string }>;
}

const STORE_CONFIG: Record<
  string,
  { name: string; color: string; badgeBg: string }
> = {
  HOME_DEPOT: {
    name: "The Home Depot",
    color: "text-orange-700 dark:text-orange-400",
    badgeBg: "bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-900/60",
  },
  KMS_TOOLS: {
    name: "KMS Tools",
    color: "text-blue-700 dark:text-blue-400",
    badgeBg: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60",
  },
  ATLAS_MACHINERY: {
    name: "Atlas Machinery",
    color: "text-red-700 dark:text-red-400",
    badgeBg: "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/60",
  },
  RONA: {
    name: "RONA",
    color: "text-blue-700 dark:text-blue-400",
    badgeBg: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60",
  },
  HOME_HARDWARE: {
    name: "Home Hardware",
    color: "text-amber-700 dark:text-amber-400",
    badgeBg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60",
  },
  CANADIAN_TIRE: {
    name: "Canadian Tire",
    color: "text-rose-700 dark:text-rose-400",
    badgeBg: "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60",
  },
  FEDERATED_TOOL: {
    name: "Federated Tool",
    color: "text-emerald-700 dark:text-emerald-400",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60",
  },
  WISE_LINE_TOOLS: {
    name: "Wise Line Tools",
    color: "text-purple-700 dark:text-purple-400",
    badgeBg: "bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/60",
  },
  AMAZON: {
    name: "Amazon Canada",
    color: "text-amber-700 dark:text-amber-400",
    badgeBg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60",
  },
  OTHER: {
    name: "Other Retailer",
    color: "text-zinc-700 dark:text-zinc-400",
    badgeBg: "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800",
  },
};

function formatStoreName(store: string) {
  return STORE_CONFIG[store]?.name || store.replace(/_/g, " ");
}

function getStoreStyle(store: string) {
  return (
    STORE_CONFIG[store] || {
      name: store.replace(/_/g, " "),
      color: "text-zinc-700 dark:text-zinc-400",
      badgeBg: "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700",
    }
  );
}

// Fallback demo product for preview/local dev testing
function getDemoProduct() {
  const now = new Date();
  const makeDate = (daysAgo: number) =>
    new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

  return {
    id: "demo",
    title: "Milwaukee M18 FUEL 1/2 in. Hammer Drill/Driver (Bare Tool)",
    url: "https://www.homedepot.ca/product/milwaukee-tool-m18-fuel-1-2-inch-hammer-drill-driver-bare-tool/1001683412",
    store: "HOME_DEPOT" as const,
    sku: "1001683412",
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80",
    currency: "CAD",
    isActive: true,
    createdAt: makeDate(45),
    updatedAt: now,
    prices: [
      { id: "p1", productId: "demo", price: 239.0, isAvailable: true, recordedAt: makeDate(45) },
      { id: "p2", productId: "demo", price: 239.0, isAvailable: true, recordedAt: makeDate(38) },
      { id: "p3", productId: "demo", price: 219.0, isAvailable: true, recordedAt: makeDate(30) },
      { id: "p4", productId: "demo", price: 219.0, isAvailable: true, recordedAt: makeDate(22) },
      { id: "p5", productId: "demo", price: 249.0, isAvailable: true, recordedAt: makeDate(15) },
      { id: "p6", productId: "demo", price: 229.0, isAvailable: true, recordedAt: makeDate(8) },
      { id: "p7", productId: "demo", price: 199.0, isAvailable: true, recordedAt: makeDate(3) },
      { id: "p8", productId: "demo", price: 199.0, isAvailable: true, recordedAt: now },
    ],
  };
}

async function fetchProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        prices: {
          orderBy: { recordedAt: "asc" },
        },
      },
    });
    if (product) return product;
  } catch (error) {
    console.warn("Prisma query warning:", error);
  }

  // Support demo preview when DB is not yet populated
  if (id === "demo") {
    return getDemoProduct();
  }

  return null;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }

  const latestPrice =
    product.prices.length > 0
      ? `$${product.prices[product.prices.length - 1].price.toFixed(2)} ${product.currency}`
      : "";

  return {
    title: `${product.title} - ${latestPrice} | Price History`,
    description: `Track price history, discounts, and availability for ${product.title} at ${formatStoreName(
      product.store
    )}.`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const product = await fetchProduct(id);

  if (!product) {
    notFound();
  }

  const prices = product.prices || [];
  const latestPriceEntry = prices.length > 0 ? prices[prices.length - 1] : null;
  const initialPriceEntry = prices.length > 0 ? prices[0] : null;

  const currentPrice = latestPriceEntry ? latestPriceEntry.price : null;
  const isAvailable = latestPriceEntry ? latestPriceEntry.isAvailable : product.isActive;

  const priceValues = prices.map((p) => p.price);
  const lowestPrice = priceValues.length > 0 ? Math.min(...priceValues) : null;
  const highestPrice = priceValues.length > 0 ? Math.max(...priceValues) : null;
  const isAllTimeLow =
    currentPrice !== null && lowestPrice !== null && currentPrice <= lowestPrice;

  const priceDifference =
    currentPrice !== null && initialPriceEntry !== null
      ? currentPrice - initialPriceEntry.price
      : 0;
  const priceDifferencePercent =
    initialPriceEntry && initialPriceEntry.price > 0
      ? (priceDifference / initialPriceEntry.price) * 100
      : 0;

  const storeStyle = getStoreStyle(product.store);

  return (
    <div className="min-h-screen bg-zinc-50/60 dark:bg-black font-sans text-zinc-900 dark:text-zinc-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Products</span>
          </Link>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${storeStyle.badgeBg} ${storeStyle.color}`}
            >
              <Store className="w-3.5 h-3.5" />
              {storeStyle.name}
            </span>

            {product.isActive ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Tracking
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                Tracking Inactive
              </span>
            )}
          </div>
        </div>

        {/* Product Overview Card */}
        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Product Image / Visual */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full aspect-square max-w-md rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden flex items-center justify-center p-6 group">
                {product.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 gap-3">
                    <Package className="w-16 h-16 stroke-1" />
                    <span className="text-xs font-medium">No Image Available</span>
                  </div>
                )}

                {isAllTimeLow && (
                  <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-sm flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" />
                    All-Time Low!
                  </div>
                )}
              </div>

              {/* Direct Link to Retailer */}
              <a
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full max-w-md inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold transition-all shadow-sm"
              >
                <span>Visit on {storeStyle.name}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Right: Product Details & Key Metrics */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                {/* SKU & Category Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {product.sku && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-xs font-mono">
                      <Tag className="w-3 h-3" />
                      SKU: {product.sku}
                    </span>
                  )}
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                    ID: {product.id}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-snug">
                  {product.title}
                </h1>
              </div>

              {/* Current Price Box */}
              <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/70 dark:border-zinc-800/70">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div>
                    <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Current Tracked Price
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white">
                        {currentPrice !== null
                          ? `$${currentPrice.toFixed(2)}`
                          : "N/A"}
                      </span>
                      <span className="text-sm font-bold text-zinc-500 uppercase">
                        {product.currency}
                      </span>
                    </div>
                  </div>

                  {/* Stock Status Badge */}
                  <div className="flex items-center gap-1.5 self-start sm:self-center">
                    {isAvailable ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 text-xs font-semibold">
                        <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Price Change Indicators */}
                {initialPriceEntry && currentPrice !== null && (
                  <div className="mt-3 pt-3 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-2 text-xs">
                    <span className="text-zinc-500 dark:text-zinc-400">
                      Overall change:
                    </span>
                    {priceDifference < 0 ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                        <TrendingDown className="w-3.5 h-3.5" />
                        -${Math.abs(priceDifference).toFixed(2)} (
                        {priceDifferencePercent.toFixed(1)}%)
                      </span>
                    ) : priceDifference > 0 ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400">
                        <TrendingUp className="w-3.5 h-3.5" />
                        +${priceDifference.toFixed(2)} (+
                        {priceDifferencePercent.toFixed(1)}%)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-medium text-zinc-500">
                        <Minus className="w-3.5 h-3.5" />
                        No price change since tracking began
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Price Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1">
                    All-Time Low
                  </span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {lowestPrice !== null ? `$${lowestPrice.toFixed(2)}` : "—"}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1">
                    All-Time High
                  </span>
                  <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
                    {highestPrice !== null ? `$${highestPrice.toFixed(2)}` : "—"}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block mb-1">
                    Check Count
                  </span>
                  <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {prices.length}
                  </span>
                </div>
              </div>

              {/* Metadata Timestamps */}
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-zinc-500 dark:text-zinc-400 pt-2">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  <span>
                    Started:{" "}
                    {new Date(product.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>
                    Last Checked:{" "}
                    {new Date(product.updatedAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Price History Chart */}
        <section className="space-y-4">
          <PriceChart
            data={prices}
            currency={product.currency}
          />
        </section>

        {/* Section: Price Log Table */}
        <section className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm p-6">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-900">
            <div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Recorded Price Snapshots
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Full chronological audit of price changes
              </p>
            </div>
          </div>

          {prices.length === 0 ? (
            <div className="py-8 text-center text-sm text-zinc-500">
              No price history entries recorded yet.
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-900 text-zinc-500 dark:text-zinc-400 font-medium">
                    <th className="py-2.5 px-3">Date & Time</th>
                    <th className="py-2.5 px-3">Recorded Price</th>
                    <th className="py-2.5 px-3">Difference</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900">
                  {[...prices]
                    .reverse()
                    .slice(0, 10)
                    .map((item, index, arr) => {
                      const nextOlder = arr[index + 1];
                      const diff = nextOlder ? item.price - nextOlder.price : 0;

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40 transition-colors"
                        >
                          <td className="py-3 px-3 text-zinc-700 dark:text-zinc-300 font-mono">
                            {new Date(item.recordedAt).toLocaleString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </td>
                          <td className="py-3 px-3 font-semibold text-zinc-900 dark:text-white">
                            ${item.price.toFixed(2)}{" "}
                            <span className="text-[10px] text-zinc-400 uppercase font-normal">
                              {product.currency}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            {diff < 0 ? (
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-0.5">
                                <TrendingDown className="w-3 h-3" />
                                -${Math.abs(diff).toFixed(2)}
                              </span>
                            ) : diff > 0 ? (
                              <span className="text-rose-600 dark:text-rose-400 font-medium inline-flex items-center gap-0.5">
                                <TrendingUp className="w-3 h-3" />
                                +${diff.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-zinc-400 font-medium">—</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            {item.isAvailable ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Available
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium">
                                <XCircle className="w-3.5 h-3.5" />
                                Out of stock
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {prices.length > 10 && (
                <p className="text-[11px] text-zinc-400 text-center mt-3">
                  Showing 10 most recent snapshots out of {prices.length} total.
                </p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
