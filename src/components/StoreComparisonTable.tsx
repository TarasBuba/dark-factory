'use client';

import React from 'react';
import { StoreOffer } from '@/lib/comparison/types';
import {
  ExternalLink,
  Trophy,
  CheckCircle2,
  XCircle,
  Store,
  TrendingDown,
  ArrowUpRight,
} from 'lucide-react';

export interface StoreComparisonTableProps {
  offers: StoreOffer[];
  currency?: string;
  className?: string;
}

const STORE_STYLES: Record<
  string,
  { name: string; badge: string; border: string; buttonBg: string }
> = {
  HOME_DEPOT: {
    name: 'Home Depot CA',
    badge: 'bg-orange-500/15 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 border-orange-500/30',
    border: 'border-orange-500/20',
    buttonBg: 'hover:bg-orange-600 hover:text-white',
  },
  KMS_TOOLS: {
    name: 'KMS Tools',
    badge: 'bg-blue-600/15 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-600/30',
    border: 'border-blue-600/20',
    buttonBg: 'hover:bg-blue-600 hover:text-white',
  },
  ATLAS_MACHINERY: {
    name: 'Atlas Machinery',
    badge: 'bg-red-600/15 text-red-700 dark:bg-red-500/20 dark:text-red-300 border-red-600/30',
    border: 'border-red-600/20',
    buttonBg: 'hover:bg-red-600 hover:text-white',
  },
  RONA: {
    name: 'RONA',
    badge: 'bg-sky-600/15 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300 border-sky-600/30',
    border: 'border-sky-600/20',
    buttonBg: 'hover:bg-sky-600 hover:text-white',
  },
  CANADIAN_TIRE: {
    name: 'Canadian Tire',
    badge: 'bg-rose-600/15 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border-rose-600/30',
    border: 'border-rose-600/20',
    buttonBg: 'hover:bg-rose-600 hover:text-white',
  },
  HOME_HARDWARE: {
    name: 'Home Hardware',
    badge: 'bg-amber-600/15 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border-amber-600/30',
    border: 'border-amber-600/20',
    buttonBg: 'hover:bg-amber-600 hover:text-white',
  },
  FEDERATED_TOOL: {
    name: 'Federated Tool',
    badge: 'bg-emerald-600/15 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-600/30',
    border: 'border-emerald-600/20',
    buttonBg: 'hover:bg-emerald-600 hover:text-white',
  },
  WISE_LINE_TOOLS: {
    name: 'Wise Line Tools',
    badge: 'bg-purple-600/15 text-purple-800 dark:bg-purple-500/20 dark:text-purple-300 border-purple-600/30',
    border: 'border-purple-600/20',
    buttonBg: 'hover:bg-purple-600 hover:text-white',
  },
  AMAZON: {
    name: 'Amazon CA',
    badge: 'bg-amber-500/15 text-amber-900 dark:bg-amber-500/20 dark:text-amber-200 border-amber-500/30',
    border: 'border-amber-500/20',
    buttonBg: 'hover:bg-amber-600 hover:text-white',
  },
};

export default function StoreComparisonTable({
  offers,
  currency = 'CAD',
  className = '',
}: StoreComparisonTableProps) {
  if (!offers || offers.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-zinc-500">
        No retailer pricing offers available for comparison.
      </div>
    );
  }

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Desktop Table View (Hidden on mobile) */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/80 text-xs font-semibold text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
              <th className="py-3 px-4 w-16">Rank</th>
              <th className="py-3 px-4">Canadian Retailer</th>
              <th className="py-3 px-4">Availability</th>
              <th className="py-3 px-4 text-right">Price ({currency})</th>
              <th className="py-3 px-4 text-right">vs Best Deal</th>
              <th className="py-3 px-4 text-center w-36">Store Link</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-900 font-medium">
            {offers.map((offer, idx) => {
              const rank = idx + 1;
              const storeStyle = STORE_STYLES[offer.store] || {
                name: offer.storeName,
                badge: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200',
                border: 'border-zinc-200',
                buttonBg: 'hover:bg-zinc-800 hover:text-white',
              };

              return (
                <tr
                  key={offer.store + idx}
                  className={`transition-colors ${
                    offer.isBestDeal
                      ? 'bg-emerald-50/60 hover:bg-emerald-50 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30'
                      : 'hover:bg-zinc-50/70 dark:hover:bg-zinc-900/40'
                  }`}
                >
                  {/* Rank */}
                  <td className="py-3.5 px-4">
                    {offer.isBestDeal ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-600 text-white shadow-xs" title="Best Price in Canada">
                        <Trophy className="w-3.5 h-3.5" />
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-semibold">
                        #{rank}
                      </span>
                    )}
                  </td>

                  {/* Store Name & Branding */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${storeStyle.badge}`}
                      >
                        <Store className="w-3 h-3 shrink-0" />
                        <span>{offer.storeName}</span>
                      </span>

                      {offer.isBestDeal && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-xs">
                          <TrendingDown className="w-3 h-3" />
                          Best Price in Canada
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Availability */}
                  <td className="py-3.5 px-4">
                    {offer.isAvailable ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>In Stock</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                        <XCircle className="w-4 h-4" />
                        <span>Check Store</span>
                      </span>
                    )}
                  </td>

                  {/* Price */}
                  <td className="py-3.5 px-4 text-right">
                    <span
                      className={`text-base font-bold ${
                        offer.isBestDeal
                          ? 'text-emerald-600 dark:text-emerald-400 text-lg'
                          : 'text-zinc-900 dark:text-white'
                      }`}
                    >
                      ${offer.price.toFixed(2)}
                    </span>
                    <span className="ml-1 text-[11px] text-zinc-400 font-normal">
                      {currency}
                    </span>
                  </td>

                  {/* Price Difference */}
                  <td className="py-3.5 px-4 text-right">
                    {offer.isBestDeal ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        Lowest Price
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                        +${offer.priceDifference.toFixed(2)}
                      </span>
                    )}
                  </td>

                  {/* Store Direct Link */}
                  <td className="py-3.5 px-4 text-center">
                    <a
                      href={offer.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-800 dark:text-zinc-200 transition-all shadow-xs ${storeStyle.buttonBg}`}
                      title={`Visit ${offer.storeName} to view or buy this tool`}
                    >
                      <span>Buy on {offer.storeName.replace(' Canada', '')}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View (Shown on mobile only) */}
      <div className="block md:hidden space-y-3">
        {offers.map((offer, idx) => {
          const rank = idx + 1;
          const storeStyle = STORE_STYLES[offer.store] || {
            name: offer.storeName,
            badge: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200',
            border: 'border-zinc-200',
            buttonBg: 'hover:bg-zinc-800 hover:text-white',
          };

          return (
            <div
              key={offer.store + idx}
              className={`rounded-2xl border p-4 shadow-xs transition-all ${
                offer.isBestDeal
                  ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20 dark:border-emerald-700/60 ring-2 ring-emerald-500/20'
                  : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      offer.isBestDeal
                        ? 'bg-emerald-600 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    #{rank}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${storeStyle.badge}`}
                  >
                    <Store className="w-3 h-3" />
                    <span>{offer.storeName}</span>
                  </span>
                </div>

                {offer.isBestDeal ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white">
                    <Trophy className="w-3 h-3" />
                    Best Price!
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
                    +${offer.priceDifference.toFixed(2)} CAD
                  </span>
                )}
              </div>

              <div className="flex items-baseline justify-between mb-3">
                <div>
                  <span
                    className={`text-xl font-extrabold ${
                      offer.isBestDeal
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-zinc-900 dark:text-white'
                    }`}
                  >
                    ${offer.price.toFixed(2)}
                  </span>
                  <span className="ml-1 text-xs text-zinc-500">{currency}</span>
                </div>

                <div>
                  {offer.isAvailable ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      In Stock
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                      <XCircle className="w-3.5 h-3.5" />
                      Check Store
                    </span>
                  )}
                </div>
              </div>

              <a
                href={offer.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-xs font-semibold transition-all shadow-xs"
              >
                <span>Buy at {offer.storeName}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
