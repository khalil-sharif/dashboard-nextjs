"use client";

import { useUIStore } from "@/store/uiStore";
import DarkModeToggle from "./DarkModeToggle";

export default function Topbar({ title }: { title: string }) {
  const setMobileDrawerOpen = useUIStore((s) => s.setMobileDrawerOpen);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setMobileDrawerOpen(true)}
          aria-label="Open menu"
          className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
        >
          &#9776;
        </button>
        <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h1>
      </div>
      <DarkModeToggle />
    </header>
  );
}
