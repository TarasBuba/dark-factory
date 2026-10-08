"use client";

import React, { useState } from "react";
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
} from "lucide-react";

export interface SearchFormProps {
  onAddProduct?: (url: string) => Promise<void> | void;
  className?: string;
}

// Known Canadian hardware retailers and their domains
const CANADIAN_RETAILERS = [
  {
    name: "Home Depot CA",
    domain: "homedepot.ca",
    badgeColor: "bg-orange-500/15 text-orange-600 border-orange-500/30 dark:bg-orange-500/20 dark:text-orange-400",
    sampleUrl: "https://www.homedepot.ca/product/milwaukee-tool-m18-fuel-18v-cordless-hammer-drill/1001565342",
    sampleLabel: "Milwaukee M18 Hammer Drill",
  },
  {
    name: "KMS Tools",
    domain: "kmstools.com",
    badgeColor: "bg-blue-600/15 text-blue-600 border-blue-600/30 dark:bg-blue-500/20 dark:text-blue-400",
    sampleUrl: "https://www.kmstools.com/dewalt-20v-max-xr-brushless-1-4-impact-driver-bare-tool.html",
    sampleLabel: "DeWalt 20V XR Impact Driver",
  },
  {
    name: "Atlas Machinery",
    domain: "atlas-machinery.com",
    badgeColor: "bg-red-600/15 text-red-600 border-red-600/30 dark:bg-red-500/20 dark:text-red-400",
    sampleUrl: "https://www.atlas-machinery.com/festool/576708-tsc-55-k-cordless-track-saw/",
    sampleLabel: "Festool TSC 55 Track Saw",
  },
  {
    name: "RONA",
    domain: "rona.ca",
    badgeColor: "bg-sky-600/15 text-sky-700 border-sky-600/30 dark:bg-sky-500/20 dark:text-sky-300",
    sampleUrl: "https://www.rona.ca/en/product/makita-40v-max-xgt-brushless-circular-saw-7-1-4-in-hs003gz-33075249",
    sampleLabel: "Makita 40V XGT Saw",
  },
  {
    name: "Canadian Tire",
    domain: "canadiantire.ca",
    badgeColor: "bg-rose-600/15 text-rose-600 border-rose-600/30 dark:bg-rose-500/20 dark:text-rose-400",
    sampleUrl: "https://www.canadiantire.ca/en/pdp/maximum-20v-max-cordless-brushless-reciprocating-saw-bare-tool-0547363p.html",
    sampleLabel: "Maximum 20V Recip Saw",
  },
  {
    name: "Home Hardware",
    domain: "homehardware.ca",
    badgeColor: "bg-amber-600/15 text-amber-700 border-amber-600/30 dark:bg-amber-500/20 dark:text-amber-300",
    sampleUrl: "https://www.homehardware.ca/en/10-15-amp-compact-jobsite-table-saw/p/1240892",
    sampleLabel: "DeWalt Jobsite Table Saw",
  },
];

export default function SearchForm({ onAddProduct, className = "" }: SearchFormProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info";
    text: string;
  } | null>(null);

  // Detect which Canadian store the user is pasting
  const detectedStore = CANADIAN_RETAILERS.find((retailer) =>
    url.toLowerCase().includes(retailer.domain)
  );

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        setStatusMessage(null);
      }
    } catch {
      setStatusMessage({
        type: "info",
        text: "Clipboard access denied. Please paste using Ctrl+V or Cmd+V.",
      });
    }
  };

  const handleQuickSample = (sampleUrl: string) => {
    setUrl(sampleUrl);
    setStatusMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = url.trim();

    if (!cleanUrl) {
      setStatusMessage({
        type: "error",
        text: "Please enter or paste a valid product URL.",
      });
      return;
    }

    try {
      // Basic URL format validation
      new URL(cleanUrl);
    } catch {
      setStatusMessage({
        type: "error",
        text: "Invalid URL format. Please provide a full link starting with https://",
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      if (onAddProduct) {
        await onAddProduct(cleanUrl);
      } else {
        // Fallback simulated tracking registration
        await new Promise((resolve) => setTimeout(resolve, 900));
      }

      setStatusMessage({
        type: "success",
        text: detectedStore
          ? `Successfully added tool from ${detectedStore.name}! Price tracker is active.`
          : "Successfully queued tool for automated price tracking (CAD)!",
      });
      setUrl("");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to add product. Please try again.";
      setStatusMessage({
        type: "error",
        text: message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`w-full rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-xl shadow-zinc-200/50 backdrop-blur-xl transition-all dark:border-zinc-800 dark:bg-zinc-900/80 dark:shadow-none ${className}`}
    >
      <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            <PlusCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Track New Hardware Product
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Paste any Canadian retailer tool link to monitor CAD price drops & stock history
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
              <LinkIcon className="h-4 w-4" />
            </div>

            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (statusMessage) setStatusMessage(null);
              }}
              placeholder="https://www.homedepot.ca/product/... or kmstools.com / atlas-machinery.com"
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
            disabled={isLoading || !url.trim()}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-zinc-950 sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Tracking...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Start Tracking</span>
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

        {/* Supported Canadian Retailers Quick Pills */}
        <div className="pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
              Supported Retailers:
            </span>
            {CANADIAN_RETAILERS.map((retailer) => {
              const isMatch = detectedStore?.domain === retailer.domain;
              return (
                <button
                  type="button"
                  key={retailer.domain}
                  onClick={() => handleQuickSample(retailer.sampleUrl)}
                  className={`group flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition-all ${
                    isMatch
                      ? "ring-2 ring-emerald-500 font-bold " + retailer.badgeColor
                      : "border-zinc-200 bg-zinc-50/60 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-200"
                  }`}
                  title={`Click to test with sample: ${retailer.sampleLabel}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 transition group-hover:scale-125" />
                  <span>{retailer.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
}
