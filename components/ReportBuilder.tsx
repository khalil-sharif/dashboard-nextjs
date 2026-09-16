"use client";

import { useState } from "react";
import { useReportsStore } from "@/store/reportsStore";
import { useUIStore } from "@/store/uiStore";
import { METRIC_LABELS, type MetricKey } from "@/lib/types";

const ALL_METRICS = Object.keys(METRIC_LABELS) as MetricKey[];

export default function ReportBuilder() {
  const dateRange = useUIStore((s) => s.dateRange);
  const reports = useReportsStore((s) => s.reports);
  const addReport = useReportsStore((s) => s.addReport);
  const removeReport = useReportsStore((s) => s.removeReport);

  const [name, setName] = useState("");
  const [selectedMetrics, setSelectedMetrics] = useState<Set<MetricKey>>(
    new Set(["revenue", "users"])
  );

  const toggleMetric = (metric: MetricKey) => {
    setSelectedMetrics((prev) => {
      const next = new Set(prev);
      if (next.has(metric)) {
        next.delete(metric);
      } else {
        next.add(metric);
      }
      return next;
    });
  };

  const handleSave = () => {
    if (!name.trim() || selectedMetrics.size === 0) return;
    addReport(name.trim(), Array.from(selectedMetrics), dateRange);
    setName("");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="card flex flex-col gap-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Build a Custom Report
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Pick metrics and a date range, then save it for later.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="report-name" className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Report name
          </label>
          <input
            id="report-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Weekly Revenue Snapshot"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700 placeholder:text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Metrics
          </span>
          <div className="flex flex-wrap gap-2">
            {ALL_METRICS.map((metric) => {
              const active = selectedMetrics.has(metric);
              return (
                <button
                  key={metric}
                  type="button"
                  onClick={() => toggleMetric(metric)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    active
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {METRIC_LABELS[metric]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Date range
          </span>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            {dateRange.start} &rarr; {dateRange.end}{" "}
            <span className="text-xs text-slate-400">({dateRange.preset})</span>
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={!name.trim() || selectedMetrics.size === 0}
          className="self-start rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Save Report
        </button>
      </div>

      <div className="card flex flex-col gap-3">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
          Saved Reports
        </h3>
        {reports.length === 0 ? (
          <p className="text-sm text-slate-400 dark:text-slate-500">
            No saved reports yet. Build one on the left to get started.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {reports.map((report) => (
              <li
                key={report.id}
                className="flex flex-col gap-1 rounded-lg border border-slate-200 p-3 dark:border-slate-800"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {report.name}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">
                      {report.range.start} &rarr; {report.range.end}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeReport(report.id)}
                    aria-label={`Delete ${report.name}`}
                    className="rounded-md px-2 py-1 text-xs text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/30"
                  >
                    Delete
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {report.metrics.map((m) => (
                    <span
                      key={m}
                      className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 dark:bg-brand-900/40 dark:text-brand-300"
                    >
                      {METRIC_LABELS[m]}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
