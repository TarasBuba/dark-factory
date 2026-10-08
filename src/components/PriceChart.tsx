"use client";

import React, { useState, useMemo, useSyncExternalStore } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from "recharts";
import {
  TrendingDown,
  TrendingUp,
  Minus,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

export interface PriceRecord {
  id?: string;
  price: number;
  recordedAt: Date | string;
  isAvailable?: boolean;
}

export interface PriceChartProps {
  data: PriceRecord[];
  currency?: string;
  className?: string;
}

type TimeRange = "7d" | "30d" | "90d" | "all";

interface FormattedDataPoint {
  rawDate: Date;
  timestamp: number;
  dateLabel: string;
  fullDateLabel: string;
  price: number;
  isAvailable: boolean;
}

const emptySubscribe = () => () => {};

function useIsClient() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

export default function PriceChart({
  data = [],
  currency = "CAD",
  className = "",
}: PriceChartProps) {
  const isClient = useIsClient();
  const [timeRange, setTimeRange] = useState<TimeRange>("all");

  // Format and sort incoming data chronologically
  const sortedData = useMemo(() => {
    return [...data]
      .map((item) => {
        const d = new Date(item.recordedAt);
        return {
          rawDate: d,
          timestamp: d.getTime(),
          dateLabel: d.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          }),
          fullDateLabel: d.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          price: Number(item.price),
          isAvailable: item.isAvailable !== false,
        };
      })
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [data]);

  // Filter based on selected time range relative to the most recent data point (pure)
  const filteredData = useMemo(() => {
    if (timeRange === "all" || sortedData.length === 0) return sortedData;

    const latestTimestamp = sortedData[sortedData.length - 1].timestamp;
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;
    const cutoff = latestTimestamp - days * 24 * 60 * 60 * 1000;

    const filtered = sortedData.filter((item) => item.timestamp >= cutoff);
    return filtered.length > 0 ? filtered : sortedData;
  }, [sortedData, timeRange]);

  // Price calculations and metrics
  const stats = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        min: 0,
        max: 0,
        avg: 0,
        current: 0,
        first: 0,
        change: 0,
        percentChange: 0,
        isDrop: false,
      };
    }

    const prices = filteredData.map((d) => d.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const sum = prices.reduce((acc, curr) => acc + curr, 0);
    const avg = sum / prices.length;
    const first = filteredData[0].price;
    const current = filteredData[filteredData.length - 1].price;
    const change = current - first;
    const percentChange = first !== 0 ? (change / first) * 100 : 0;

    return {
      min,
      max,
      avg,
      current,
      first,
      change,
      percentChange,
      isDrop: change < 0,
    };
  }, [filteredData]);

  // Y-axis min/max domain padding
  const yDomain = useMemo(() => {
    if (filteredData.length === 0) return [0, 100];
    const buffer = (stats.max - stats.min) * 0.15 || stats.min * 0.1 || 5;
    const minDomain = Math.max(0, Math.floor(stats.min - buffer));
    const maxDomain = Math.ceil(stats.max + buffer);
    return [minDomain, maxDomain];
  }, [filteredData, stats.min, stats.max]);

  // Client-side hydration placeholder
  if (!isClient) {
    return (
      <div
        className={`w-full h-80 rounded-2xl bg-zinc-100/60 dark:bg-zinc-900/60 animate-pulse border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-center ${className}`}
      >
        <div className="flex items-center gap-2 text-zinc-400 text-sm">
          <Calendar className="w-4 h-4 animate-spin" />
          <span>Loading price chart...</span>
        </div>
      </div>
    );
  }

  // Empty state handling
  if (sortedData.length === 0) {
    return (
      <div
        className={`w-full rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-800 p-8 text-center bg-zinc-50/50 dark:bg-zinc-950/50 ${className}`}
      >
        <div className="inline-flex p-3 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mb-3">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          No Price History Recorded Yet
        </h4>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
          Price snapshots will appear here over time as the tool tracks this
          product across stores.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`w-full rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm p-5 sm:p-6 transition-all ${className}`}
    >
      {/* Header with Title, Stats, and Time Range Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-100 dark:border-zinc-900">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Price History
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              {filteredData.length}{" "}
              {filteredData.length === 1 ? "entry" : "entries"}
            </span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Historical price variations tracked in {currency}
          </p>
        </div>

        {/* Time Filter Tabs */}
        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl self-start sm:self-auto">
          {(
            [
              { label: "7D", value: "7d" },
              { label: "30D", value: "30d" },
              { label: "90D", value: "90d" },
              { label: "All", value: "all" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.value}
              onClick={() => setTimeRange(tab.value)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all ${
                timeRange === tab.value
                  ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stat Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/60">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Current</span>
          <p className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
            ${stats.current.toFixed(2)}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/60">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Lowest
          </span>
          <p className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
            ${stats.min.toFixed(2)}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/60">
          <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
            Highest
          </span>
          <p className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
            ${stats.max.toFixed(2)}
          </p>
        </div>

        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-100 dark:border-zinc-800/60">
          <span className="text-xs text-zinc-500 dark:text-zinc-400">Trend</span>
          <div className="flex items-center gap-1 mt-0.5">
            {stats.change < 0 ? (
              <>
                <TrendingDown className="w-4 h-4 text-emerald-500" />
                <span className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {stats.percentChange.toFixed(1)}%
                </span>
              </>
            ) : stats.change > 0 ? (
              <>
                <TrendingUp className="w-4 h-4 text-rose-500" />
                <span className="text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-400">
                  +{stats.percentChange.toFixed(1)}%
                </span>
              </>
            ) : (
              <>
                <Minus className="w-4 h-4 text-zinc-400" />
                <span className="text-xs sm:text-sm font-semibold text-zinc-500">
                  0.0%
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recharts Responsive Line Chart */}
      <div className="w-full h-72 sm:h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={filteredData}
            margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e4e4e7"
              className="dark:stroke-zinc-800/80"
            />
            <XAxis
              dataKey="dateLabel"
              tickLine={false}
              axisLine={{ stroke: "#e4e4e7" }}
              tick={{ fill: "#71717a", fontSize: 11 }}
              dy={6}
            />
            <YAxis
              domain={yDomain}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#71717a", fontSize: 11 }}
              tickFormatter={(val: number) => `$${val.toFixed(0)}`}
              dx={-4}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length > 0) {
                  const item = payload[0].payload as FormattedDataPoint;
                  return (
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-3.5 shadow-xl text-xs space-y-2">
                      <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{item.fullDateLabel}</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-extrabold text-zinc-900 dark:text-white">
                          ${item.price.toFixed(2)}
                        </span>
                        <span className="text-[11px] font-medium text-zinc-500 uppercase">
                          {currency}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 pt-1 border-t border-zinc-100 dark:border-zinc-800">
                        {item.isAvailable ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                              In Stock
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 text-rose-500" />
                            <span className="text-rose-700 dark:text-rose-400 font-medium">
                              Out of Stock
                            </span>
                          </>
                        )}
                        {item.price === stats.min && (
                          <span className="ml-auto px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                            Lowest
                          </span>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            {filteredData.length > 1 && stats.min < stats.max && (
              <ReferenceLine
                y={stats.min}
                stroke="#10b981"
                strokeDasharray="4 4"
                strokeWidth={1}
                label={{
                  value: `Low: $${stats.min.toFixed(0)}`,
                  fill: "#10b981",
                  fontSize: 10,
                  position: "insideBottomRight",
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="price"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={{
                r: filteredData.length <= 15 ? 4 : 2,
                fill: "#2563eb",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "#2563eb",
                stroke: "#ffffff",
                strokeWidth: 2,
              }}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
