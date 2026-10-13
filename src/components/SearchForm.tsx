"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Link as LinkIcon,
  PlusCircle,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ClipboardPaste,
  Sparkles,
  ArrowRight,
  Store,
  Trophy,
  Zap,
} from "lucide-react";
import { compareTool } from "@/app/actions/compare";
import { ToolComparisonResult } from "@/lib/comparison/types";
import PriceComparisonCard from "./PriceComparisonCard";

export interface SearchFormProps {
  onAddProduct?: (url: string) => Promise<any> | any;
  className?: string;
}

// Known Canadian hardware retailers and their sample search targets
const CANADIAN_RETAILERS = [
  {
    name: "Home Depot CA",
    domain: "homedepot.ca",
    badgeColor: "bg-orange-500/15 text-orange-600 border-orange-500/30 dark:bg-orange-500/20 dark:text-orange-400",
    sampleQuery: "Milwaukee M18 Fuel hammer drill",
    sampleUrl: "https://www.homedepot.ca/product/milwaukee-tool-m18-fuel-18v-cordless-hammer-drill/1001565342",
  },
  {
    name: "KMS Tools",
    domain: "kmstools.com",
    badgeColor: "bg-blue-600/15 text-blue-600 border-blue-600/30 dark:bg-blue-500/20 dark:text-blue-400",
    sampleQuery: "DeWalt 20V impact driver DCF887",
    sampleUrl: "https://www.kmstools.com/catalogsearch/result/?q=dewalt+impact+driver",
  },
  {
    name: "Atlas Machinery",
    domain: "atlas-machinery.com",
    badgeColor: "bg-red-600/15 text-red-600 border-red-600/30 dark:bg-red-500/20 dark:text-red-400",
    sampleQuery: "Festool track saw TS 55",
    sampleUrl: "https://www.atlas-machinery.com/search.php?search_query=Festool+track+saw",
  },
  {
    name: "RONA",
    domain: "rona.ca",
    badgeColor: "bg-sky-600/15 text-sky-700 border-sky-600/30 dark:bg-sky-500/20 dark:text-sky-300",
    sampleQuery: "Makita cordless circular saw",
    sampleUrl: "https://www.rona.ca/en/search?query=Makita+circular+saw",
  },
  {
    name: "Canadian Tire",
    domain: "canadiantire.ca",
    badgeColor: "bg-rose-600/15 text-rose-600 border-rose-600/30 dark:bg-rose-500/20 dark:text-rose-400",
    sampleQuery: "Maximum 20V reciprocating saw",
    sampleUrl: "https://www.canadiantire.ca/en/search-results.html?q=maximum+reciprocating+saw",
  },
  {
    name: "Home Hardware",
    domain: "homehardware.ca",
    badgeColor: "bg-amber-600/15 text-amber-700 border-amber-600/30 dark:bg-amber-500/20 dark:text-amber-300",
    sampleQuery: "DeWalt 10 in compact table saw DWE7485",
    sampleUrl: "https://www.homehardware.ca/en/search?query=dewalt+table+saw",
  },
];

export default function SearchForm({ onAddProduct, className = "" }: SearchFormProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<ToolComparisonResult | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  // Detect which Canadian store the user might have pasted
  const detectedStore = CANADIAN_RETAILERS.find((retailer) =>
    query.toLowerCase().includes(retailer.domain)
  );

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setQuery(text.trim());
        setStatusMessage(null);
      }
    } catch {
      setStatusMessage({
        type: "info",
        text: "Clipboard access denied. Please paste using Ctrl+V or Cmd+V.",
      });
    }
  };

  const handleQuickSample = async (sampleText: string) => {
    setQuery(sampleText);
    setStatusMessage(null);
    await executeComparison(sampleText);
  };

  const executeComparison = async (inputText: string) => {
    const cleanInput = inputText.trim();
    if (!cleanInput) {
      setStatusMessage({
        type: "error",
        text: "Please enter a tool name (e.g. Milwaukee M18 drill) or paste a retailer URL.",
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      // 1. Run live multi-store comparison across 9 Canadian retailers
      const compRes = await compareTool(cleanInput);
      if (compRes.success) {
        setComparisonResult(compRes.data);
        setStatusMessage({
          type: "success",
          text: `Found best price across Canada: $${compRes.data.lowestPrice.toFixed(2)} CAD at ${compRes.data.bestOffer.storeName}! (Save up to $${compRes.data.maxSavings.toFixed(2)} CAD)`,
        });

        // 2. Also register in database/tracker if onAddProduct provided and it's a URL or best offer
        if (onAddProduct) {
          const targetUrl = /^https?:\/\//i.test(cleanInput)
            ? cleanInput
            : compRes.data.bestOffer.url;
          
          try {
            const addRes = await onAddProduct(targetUrl);
            if (addRes && typeof addRes === "object" && addRes.product && typeof window !== "undefined") {
              const key = "cantool_saved_products";
              const existing = JSON.parse(localStorage.getItem(key) || "[]");
              const filtered = existing.filter((p: { url: string }) => p.url !== addRes.product.url);
              filtered.unshift(addRes.product);
              localStorage.setItem(key, JSON.stringify(filtered));
              window.dispatchEvent(new CustomEvent("tool-catalog-updated", { detail: addRes.product }));
            }
          } catch (trackErr) {
            console.warn("Auto-track background error:", trackErr);
          }
        }
      } else {
        setStatusMessage({
          type: "error",
          text: compRes.error || "Failed to compare Canadian tool prices.",
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to execute price comparison.";
      setStatusMessage({
        type: "error",
        text: msg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await executeComparison(query);
  };

  const handleTrackToolFromCard = async (targetUrl: string) => {
    if (!onAddProduct) return;
    try {
      const res = await onAddProduct(targetUrl);
      if (res && res.product && typeof window !== "undefined") {
        const key = "cantool_saved_products";
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        const filtered = existing.filter((p: { url: string }) => p.url !== res.product.url);
        filtered.unshift(res.product);
        localStorage.setItem(key, JSON.stringify(filtered));
        window.dispatchEvent(new CustomEvent("tool-catalog-updated", { detail: res.product }));
        router.refresh();
      }
    } catch (err) {
      console.error("Track from card error:", err);
    }
  };

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* Search & Compare Box */}
      <div className="w-full rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-xl shadow-zinc-200/50 backdrop-blur-xl transition-all dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-none">
        <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              <Zap className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              Canadian Hardware Price Comparison Engine
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Search any tool name, brand, or paste any Canadian store link to find the cheapest price across Canada
            </p>
          </div>

          {detectedStore && (
            <div
              className={`flex items-center gap-1.5 self-start rounded-full border px-3 py-1 text-xs font-semibold sm:self-auto ${detectedStore.badgeColor}`}
            >
              <Store className="h-3.5 w-3.5" />
              <span>Detected: {detectedStore.name}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
                <Search className="h-4 w-4" />
              </div>

              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (statusMessage) setStatusMessage(null);
                }}
                placeholder="Enter tool (e.g. Milwaukee M18 drill, Festool track saw) or paste store link..."
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50/70 py-3.5 pr-28 pl-10 text-sm text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-emerald-400 dark:focus:bg-zinc-850"
                disabled={isLoading}
              />

              <button
                type="button"
                onClick={handlePaste}
                title="Paste from clipboard"
                className="absolute inset-y-1.5 right-1.5 flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-white px-2.5 text-xs font-medium text-zinc-600 shadow-sm transition hover:bg-zinc-50 hover:text-zinc-900 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              >
                <ClipboardPaste className="h-3.5 w-3.5" />
                <span>Paste</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-zinc-950 sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Comparing Across Canada...</span>
                </>
              ) : (
                <>
                  <Trophy className="h-4 w-4" />
                  <span>Find Best Deal</span>
                  <ArrowRight className="h-4 w-4 opacity-80" />
                </>
              )}
            </button>
          </div>

          {/* Status Messages */}
          {statusMessage && (
            <div
              className={`flex items-start gap-2.5 rounded-xl border p-3 text-sm transition-all ${
                statusMessage.type === "success"
                  ? "border-emerald-200 bg-emerald-50/80 text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : statusMessage.type === "error"
                  ? "border-red-200 bg-red-50/80 text-red-800 dark:border-red-800/60 dark:bg-red-950/40 dark:text-red-300"
                  : "border-blue-200 bg-blue-50/80 text-blue-800 dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-300"
              }`}
            >
              {statusMessage.type === "success" && (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              )}
              {statusMessage.type === "error" && (
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
              )}
              {statusMessage.type === "info" && (
                <Search className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
              )}
              <span className="flex-1">{statusMessage.text}</span>
            </div>
          )}

          {/* Supported Canadian Retailers & Quick Test Pills */}
          <div className="pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
                Quick Deal Search:
              </span>
              {CANADIAN_RETAILERS.map((retailer) => {
                return (
                  <button
                    type="button"
                    key={retailer.name}
                    onClick={() => handleQuickSample(retailer.sampleQuery)}
                    className="group flex items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50/60 px-2.5 py-1 text-xs text-zinc-600 transition-all hover:border-emerald-400 hover:bg-emerald-50/50 hover:text-emerald-800 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400 dark:hover:border-emerald-500/50 dark:hover:text-emerald-300"
                    title={`Click to compare: ${retailer.sampleQuery}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 transition group-hover:scale-125" />
                    <span>{retailer.name}</span>
                    <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">
                      ({retailer.sampleQuery.split(" ")[0]})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </form>
      </div>

      {/* Live Comparison Card Result (Rendered immediately upon search/compare) */}
      {comparisonResult && (
        <PriceComparisonCard
          comparison={comparisonResult}
          onTrackTool={handleTrackToolFromCard}
        />
      )}
    </div>
  );
}
