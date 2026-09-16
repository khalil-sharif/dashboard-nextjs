"use client";

import { useState } from "react";
import { useUIStore } from "@/store/uiStore";
import type { DateRangePreset } from "@/lib/types";

const PRESETS: { value: DateRangePreset; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "custom", label: "Custom" },
];

export default function DateRangePicker() {
  const dateRange = useUIStore((s) => s.dateRange);
  const setDateRangePreset = useUIStore((s) => s.setDateRangePreset);
  const setCustomDateRange = useUIStore((s) => s.setCustomDateRange);
  const [showCustom, setShowCustom] = useState(false);

  const handlePresetClick = (preset: DateRangePreset) => {
    if (preset === "custom") {
      setShowCustom(true);
      setDateRangePreset("custom");
      return;
    }
    setShowCustom(false);
    setDateRangePreset(preset);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
        {PRESETS.map((p) => (
          <button
            key={p.value}
            type="button"
            onClick={() => handlePresetClick(p.value)}
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              dateRange.preset === p.value
                ? "bg-brand-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      {showCustom && dateRange.preset === "custom" && (
        <div className="flex items-center gap-2 text-sm">
          <input
            type="date"
            value={dateRange.start}
            max={dateRange.end}
            onChange={(e) => setCustomDateRange(e.target.value, dateRange.end)}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
          <span className="text-slate-400">to</span>
          <input
            type="date"
            value={dateRange.end}
            min={dateRange.start}
            onChange={(e) => setCustomDateRange(dateRange.start, e.target.value)}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </div>
      )}
    </div>
  );
}
