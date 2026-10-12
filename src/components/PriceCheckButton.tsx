"use client";

import React, { useState } from "react";
import { RefreshCw, CheckCircle2, TrendingDown, TrendingUp, AlertCircle } from "lucide-react";
import { refreshProductPrice } from "@/app/actions/product";

interface PriceCheckButtonProps {
  productId: string;
  variant?: "compact" | "full";
  className?: string;
  onUpdated?: (newPrice: number) => void;
}

export default function PriceCheckButton({
  productId,
  variant = "compact",
  className = "",
  onUpdated,
}: PriceCheckButtonProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    price?: number;
    message?: string;
  } | null>(null);

  const handleRefresh = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    setResult(null);

    try {
      const res = await refreshProductPrice(productId);
      if (res.success && res.newPrice) {
        setResult({
          success: true,
          price: res.newPrice,
          message: `Live: $${res.newPrice.toFixed(2)} CAD`,
        });

        if (onUpdated) {
          onUpdated(res.newPrice);
        }

        // Notify catalog update event
        if (typeof window !== "undefined" && res.product) {
          try {
            const key = "cantool_saved_products";
            const existing = JSON.parse(localStorage.getItem(key) || "[]");
            const filtered = existing.filter((p: { id: string }) => p.id !== productId);
            filtered.unshift(res.product);
            localStorage.setItem(key, JSON.stringify(filtered));
            window.dispatchEvent(new CustomEvent("tool-catalog-updated", { detail: res.product }));
          } catch {}
        }
      } else {
        setResult({
          success: false,
          message: res.error || "Could not reach retailer server",
        });
      }
    } catch {
      setResult({
        success: false,
        message: "Network timeout",
      });
    } finally {
      setLoading(false);
    }
  };

  if (variant === "full") {
    return (
      <div className={`space-y-2 ${className}`}>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-semibold text-sm shadow-md transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Checking Retailer Live Price..." : "Check Latest Price Now (CAD)"}</span>
        </button>

        {result && (
          <div
            className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-medium ${
              result.success
                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                : "bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
            }`}
          >
            {result.success ? (
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
            )}
            <span>{result.message}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <button
        onClick={handleRefresh}
        disabled={loading}
        title="Check latest price on retailer site"
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-xs font-semibold text-zinc-700 dark:text-zinc-200 transition-all shadow-2xs disabled:opacity-60"
      >
        <RefreshCw className={`w-3 h-3 text-emerald-600 dark:text-emerald-400 ${loading ? "animate-spin" : ""}`} />
        <span>{loading ? "Checking..." : result?.price ? `$${result.price.toFixed(2)}` : "Check Price"}</span>
      </button>
    </div>
  );
}
