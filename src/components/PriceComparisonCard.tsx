'use client';

import React, { useState } from 'react';
import { ToolComparisonResult } from '@/lib/comparison/types';
import StoreComparisonTable from './StoreComparisonTable';
import {
  Trophy,
  TrendingDown,
  Sparkles,
  BookmarkPlus,
  CheckCircle2,
  Package,
  Tag,
  DollarSign,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export interface PriceComparisonCardProps {
  comparison: ToolComparisonResult;
  onTrackTool?: (url: string) => Promise<any> | any;
  className?: string;
}

export default function PriceComparisonCard({
  comparison,
  onTrackTool,
  className = '',
}: PriceComparisonCardProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const { intent, bestOffer, lowestPrice, highestPrice, maxSavings, averagePrice, offers } =
    comparison;

  const handleTrack = async () => {
    if (!onTrackTool) return;
    setIsAdding(true);
    try {
      await onTrackTool(bestOffer.url);
      setAddedSuccess(true);
    } catch (err) {
      console.error('Failed to track tool:', err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      className={`w-full rounded-3xl border border-zinc-200/90 bg-white/95 p-6 sm:p-8 shadow-xl shadow-zinc-200/40 backdrop-blur-xl transition-all dark:border-zinc-800/90 dark:bg-zinc-950/95 dark:shadow-none ${className}`}
    >
      {/* Top Header: Comparison Badge & Timestamps */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-zinc-100 dark:border-zinc-900">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Live Canada Price Comparison
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Across 9 Canadian Retailers
          </span>
        </div>

        <div className="flex items-center gap-2">
          {intent.brand && (
            <span className="px-2.5 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              {intent.brand}
            </span>
          )}
          {intent.category && (
            <span className="px-2.5 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              {intent.category}
            </span>
          )}
          {intent.model && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-400">
              <Tag className="w-3 h-3" />
              {intent.model}
            </span>
          )}
        </div>
      </div>

      {/* Main Tool Highlight Section */}
      <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left: Authentic Tool Image */}
        <div className="lg:col-span-4 flex justify-center">
          <div className="relative w-full aspect-square max-w-[260px] rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60 p-4 flex items-center justify-center group overflow-hidden">
            {intent.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={intent.imageUrl}
                alt={intent.cleanTitle}
                className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-zinc-400 gap-2">
                <Package className="w-12 h-12 stroke-1" />
                <span className="text-xs">Authentic Hardware Tool</span>
              </div>
            )}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-zinc-900/80 text-white text-[10px] font-bold backdrop-blur-xs">
              🍁 CAD Pricing
            </div>
          </div>
        </div>

        {/* Right: Deal Summary & Stats */}
        <div className="lg:col-span-8 space-y-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
              {intent.cleanTitle}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Search query analyzed: &quot;{intent.query}&quot;
            </p>
          </div>

          {/* Deal Showcase Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-teal-500/10 border border-emerald-500/30 dark:border-emerald-500/20">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  <Trophy className="w-4 h-4" />
                  <span>Lowest Price in Canada</span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                  ${lowestPrice.toFixed(2)}{' '}
                  <span className="text-sm font-semibold uppercase text-emerald-700 dark:text-emerald-500">
                    CAD
                  </span>
                </div>
                <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Available at <span className="font-bold underline">{bestOffer.storeName}</span>
                </div>
              </div>

              {maxSavings > 0 && (
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-sm">
                    <TrendingDown className="w-3.5 h-3.5" />
                    Save up to ${maxSavings.toFixed(2)} CAD
                  </div>
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                    vs competitor high (${highestPrice.toFixed(2)} CAD)
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">Lowest</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                ${lowestPrice.toFixed(2)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">Average</span>
              <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                ${averagePrice.toFixed(2)}
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800/60">
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">Highest</span>
              <span className="text-sm font-bold text-rose-600 dark:text-rose-400">
                ${highestPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <a
              href={bestOffer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-[0.98]"
            >
              <span>Buy at {bestOffer.storeName} (${lowestPrice.toFixed(2)} CAD)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {onTrackTool && (
              <button
                type="button"
                onClick={handleTrack}
                disabled={isAdding || addedSuccess}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-all active:scale-[0.98] disabled:opacity-70"
              >
                {addedSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Added to Tracker!</span>
                  </>
                ) : isAdding ? (
                  <span>Adding...</span>
                ) : (
                  <>
                    <BookmarkPlus className="w-3.5 h-3.5" />
                    <span>Add to Tracker</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Table Section */}
      <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-900 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            All 9 Store Offers Ranked by Price
          </h3>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            Click any store to visit official Canadian catalog
          </span>
        </div>

        <StoreComparisonTable offers={offers} currency="CAD" />
      </div>
    </div>
  );
}
