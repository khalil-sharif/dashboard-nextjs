"use client";

import type { RetentionRow } from "@/lib/types";
import ChartCard from "./ChartCard";

function cellColor(pct: number): string {
  if (pct >= 80) return "bg-brand-600 text-white";
  if (pct >= 60) return "bg-brand-400 text-white";
  if (pct >= 40) return "bg-brand-300 text-brand-900";
  if (pct >= 20) return "bg-brand-100 text-brand-900 dark:bg-brand-900/50 dark:text-brand-200";
  if (pct > 0) return "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400";
  return "bg-transparent";
}

export default function RetentionGrid({ data }: { data: RetentionRow[] }) {
  const maxWeeks = Math.max(...data.map((row) => row.weeks.length));

  return (
    <ChartCard title="Cohort Retention" subtitle="Weekly retention by signup cohort">
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full min-w-[560px] border-separate border-spacing-1 text-xs">
          <thead>
            <tr>
              <th className="w-24 text-left font-medium text-slate-500 dark:text-slate-400">Cohort</th>
              <th className="w-16 text-left font-medium text-slate-500 dark:text-slate-400">Size</th>
              {Array.from({ length: maxWeeks }).map((_, idx) => (
                <th key={idx} className="w-14 text-center font-medium text-slate-500 dark:text-slate-400">
                  W{idx}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.cohort}>
                <td className="font-medium text-slate-600 dark:text-slate-300">{row.cohort}</td>
                <td className="text-slate-500 dark:text-slate-400">{row.size}</td>
                {Array.from({ length: maxWeeks }).map((_, idx) => {
                  const pct = row.weeks[idx];
                  return (
                    <td key={idx} className="p-0 text-center">
                      {pct !== undefined ? (
                        <div className={`rounded-md px-1.5 py-2 font-semibold ${cellColor(pct)}`}>
                          {pct}%
                        </div>
                      ) : (
                        <div className="rounded-md px-1.5 py-2 text-slate-300 dark:text-slate-700">
                          &mdash;
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ChartCard>
  );
}
