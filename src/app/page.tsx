import React from "react";
import SearchForm from "@/components/SearchForm";
import ProductList from "@/components/ProductList";
import {
  Wrench,
  Hammer,
  Store,
  Clock,
  Coins,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 transition-colors dark:bg-black dark:text-zinc-100">
      {/* Top Notification Banner */}
      <div className="border-b border-red-500/20 bg-gradient-to-r from-red-600/10 via-amber-500/10 to-red-600/10 px-4 py-2 text-center text-xs font-medium text-red-700 dark:text-red-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block animate-pulse">🍁</span>
          <strong className="font-semibold">Canadian Hardware Tracker</strong> — Monitoring
          live CAD prices across 9 Canadian retailers including Home Depot CA, KMS Tools,
          Atlas Machinery &amp; RONA.
        </span>
      </div>

      {/* Main Header / Navigation */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-amber-600 text-white shadow-md shadow-red-500/20">
              <Wrench className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  CanTool Tracker
                </span>
                <span className="rounded-md bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-950/60 dark:text-red-400">
                  CAD $
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Dark Factory • Hardware Price Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-50/70 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 md:flex">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Scraper Engine Active</span>
            </div>

            <div className="flex items-center gap-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              <Coins className="h-3.5 w-3.5 text-amber-500" />
              <span>CAD Pricing</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-b from-white via-zinc-50/50 to-zinc-100/50 px-4 pt-12 pb-16 dark:border-zinc-800 dark:from-zinc-950 dark:via-zinc-900/40 dark:to-zinc-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50/80 px-3.5 py-1 text-xs font-semibold text-red-700 shadow-2xs dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300">
            <span>🍁 Canadian Retailer Network</span>
            <span className="h-1 w-1 rounded-full bg-red-400" />
            <span>Real-time Scraped Tool Prices</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl dark:text-white">
            Track Canadian Hardware &amp; Tool Prices{" "}
            <span className="bg-gradient-to-r from-red-600 via-amber-500 to-orange-500 bg-clip-text text-transparent">
              In Real-Time
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm text-zinc-600 sm:text-base dark:text-zinc-400">
            Never overpay for Milwaukee, DeWalt, Makita, or Festool again. Paste any Canadian store
            URL to track historical CAD price swings, seasonal tool discounts, and stock status.
          </p>

          {/* Quick Stats Grid */}
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-zinc-200 bg-white/80 p-3.5 text-center shadow-2xs backdrop-blur-xs dark:border-zinc-800 dark:bg-zinc-900/80">
              <div className="text-xl font-bold text-zinc-900 dark:text-white">9</div>
              <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                Canadian Stores
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white/80 p-3.5 text-center shadow-2xs backdrop-blur-xs dark:border-zinc-800 dark:bg-zinc-900/80">
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">-$50.00</div>
              <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                Top Deal Savings (CAD)
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white/80 p-3.5 text-center shadow-2xs backdrop-blur-xs dark:border-zinc-800 dark:bg-zinc-900/80">
              <div className="text-xl font-bold text-zinc-900 dark:text-white">100%</div>
              <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                Canadian Dollar (CAD)
              </div>
            </div>

            <div className="rounded-xl border border-zinc-200 bg-white/80 p-3.5 text-center shadow-2xs backdrop-blur-xs dark:border-zinc-800 dark:bg-zinc-900/80">
              <div className="text-xl font-bold text-zinc-900 dark:text-white">Hourly</div>
              <div className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                Automated Sync
              </div>
            </div>
          </div>

          {/* Interactive Search / URL Tracker Form */}
          <div className="mx-auto mt-8 max-w-3xl text-left">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Main Tracked Products Section */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              <Hammer className="h-6 w-6 text-red-600 dark:text-red-500" />
              Tracked Hardware Catalog
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Live price drops, store badges, and availability from verified Canadian retailers
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span className="flex items-center gap-1 font-medium text-zinc-700 dark:text-zinc-300">
              <Clock className="h-3.5 w-3.5 text-emerald-500" />
              Next price refresh in ~45 min
            </span>
          </div>
        </div>

        {/* Product List Grid */}
        <ProductList />
      </main>

      {/* Canadian Retailer Coverage Showcase */}
      <section className="border-t border-zinc-200 bg-white px-4 py-12 dark:border-zinc-800 dark:bg-zinc-950 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Supported Canadian Retailer Network
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Targeted adapters tailored for each hardware retailer&apos;s site structure and anti-bot systems
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {[
              { name: "The Home Depot CA", type: "National Chain", badge: "Orange" },
              { name: "KMS Tools", type: "Western Canada", badge: "Blue & Red" },
              { name: "Atlas Machinery", type: "Toronto Specialist", badge: "Crimson" },
              { name: "RONA+", type: "National Retailer", badge: "Sky Blue" },
              { name: "Canadian Tire", type: "Iconic Canadian", badge: "Ruby Red" },
              { name: "Home Hardware", type: "Dealer-Owned", badge: "Amber" },
              { name: "Federated Tool", type: "London, Ontario", badge: "Emerald" },
              { name: "Wise Line Tools", type: "Ontario Specialist", badge: "Indigo" },
              { name: "Amazon.ca", type: "Marketplace", badge: "Yellow" },
              { name: "Custom Stores", type: "Extensible", badge: "Slate" },
            ].map((store, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 text-center transition hover:border-zinc-300 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700"
              >
                <Store className="mb-1.5 h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-200">
                  {store.name}
                </span>
                <span className="mt-0.5 text-[10px] text-zinc-400 dark:text-zinc-500">
                  {store.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-zinc-50 py-8 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:bg-black dark:text-zinc-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p>
            CanTool Tracker • Dark Factory Automated Architecture • Built with Next.js 15, Prisma
            &amp; Tailwind CSS
          </p>
          <p className="mt-1 text-[11px] text-zinc-400 dark:text-zinc-600">
            All prices and discounts displayed in Canadian Dollars (CAD). Data refreshed
            periodically.
          </p>
        </div>
      </footer>
    </div>
  );
}
