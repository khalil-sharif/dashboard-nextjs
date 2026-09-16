import { create } from "zustand";
import { persist } from "zustand/middleware";
import { defaultDateRange } from "@/lib/mockData";
import type { DateRange, DateRangePreset } from "@/lib/types";

interface UIState {
  darkMode: boolean;
  sidebarCollapsed: boolean;
  mobileDrawerOpen: boolean;
  dateRange: DateRange;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
  toggleSidebar: () => void;
  setMobileDrawerOpen: (open: boolean) => void;
  setDateRangePreset: (preset: DateRangePreset) => void;
  setCustomDateRange: (start: string, end: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      darkMode: false,
      sidebarCollapsed: false,
      mobileDrawerOpen: false,
      dateRange: defaultDateRange("30d"),
      toggleDarkMode: () =>
        set((state) => ({ darkMode: !state.darkMode })),
      setDarkMode: (value) => set({ darkMode: value }),
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setMobileDrawerOpen: (open) => set({ mobileDrawerOpen: open }),
      setDateRangePreset: (preset) =>
        set({
          dateRange:
            preset === "custom"
              ? { preset, start: defaultDateRange("30d").start, end: defaultDateRange("30d").end }
              : defaultDateRange(preset),
        }),
      setCustomDateRange: (start, end) =>
        set({ dateRange: { preset: "custom", start, end } }),
    }),
    {
      name: "dashboard-ui-store",
      partialize: (state) => ({
        darkMode: state.darkMode,
        sidebarCollapsed: state.sidebarCollapsed,
        dateRange: state.dateRange,
      }),
    }
  )
);
