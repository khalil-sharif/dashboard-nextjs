import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DateRange, MetricKey, SavedReport } from "@/lib/types";

interface ReportsState {
  reports: SavedReport[];
  addReport: (name: string, metrics: MetricKey[], range: DateRange) => void;
  removeReport: (id: string) => void;
}

export const useReportsStore = create<ReportsState>()(
  persist(
    (set) => ({
      reports: [],
      addReport: (name, metrics, range) =>
        set((state) => ({
          reports: [
            {
              id: `report-${Date.now()}-${Math.round(Math.random() * 1000)}`,
              name,
              metrics,
              range,
              createdAt: new Date().toISOString(),
            },
            ...state.reports,
          ],
        })),
      removeReport: (id) =>
        set((state) => ({
          reports: state.reports.filter((r) => r.id !== id),
        })),
    }),
    {
      name: "dashboard-reports-store",
    }
  )
);
