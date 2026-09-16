"use client";

import { Line, LineChart, ResponsiveContainer } from "recharts";
import type { StatSummary } from "@/lib/types";

function formatValue(stat: StatSummary): string {
  if (stat.format === "currency") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(stat.value);
  }
  if (stat.format === "percent") {
    return `${stat.value.toFixed(2)}%`;
  }
  return new Intl.NumberFormat("en-US").format(stat.value);
}

export default function StatCard({ stat }: { stat: StatSummary }) {
  const positive = stat.changePct >= 0;

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {stat.label}
        </span>
        <span
          className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
            positive
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
              : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400"
          }`}
        >
          {positive ? "↑" : "↓"} {Math.abs(stat.changePct)}%
        </span>
      </div>
      <div className="text-2xl font-semibold tracking-tight">
        {formatValue(stat)}
      </div>
      <div className="h-10 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={stat.trend}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={positive ? "#10b981" : "#f43f5e"}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
