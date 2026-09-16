# Pulse Dashboard

A production-style analytics dashboard built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand, TanStack Query, and Recharts. All data is generated client-side from deterministic mock generators — there is no backend.

## Tech stack

- **Next.js 14** — App Router, client components for interactive widgets
- **TypeScript** — strict mode throughout
- **Tailwind CSS** — utility styling with `darkMode: 'class'`
- **Zustand** — UI state (`store/uiStore.ts`) and saved reports (`store/reportsStore.ts`), both persisted to `localStorage`
- **TanStack Query** — caches derived mock datasets per page, keyed by the active date range
- **Recharts** — line, bar, and pie/donut charts, all theme-aware via `ResponsiveContainer`

## Architecture

```
app/
  layout.tsx          Root layout: sidebar + QueryProvider + ThemeSync
  page.tsx             Overview route (stat cards, revenue/orders/traffic charts, data table)
  analytics/page.tsx    Funnel + cohort retention grid
  reports/page.tsx      Custom report builder + saved reports list
components/            Shared UI: Sidebar, Topbar, StatCard, chart wrappers, DataTable, ReportBuilder, etc.
store/                 Zustand stores (ui state, saved reports)
lib/                   Shared types and mock data generators
```

### Data flow

1. **Global UI state** lives in `store/uiStore.ts`: the active date range (7d/30d/90d/custom), dark mode flag, and sidebar/drawer state. It's persisted to `localStorage` via Zustand's `persist` middleware.
2. **Pages** read the current date range from the store and pass it into pure functions in `lib/mockData.ts` (`generateStatSummaries`, `generateRevenueSeries`, `generateOrdersByCategory`, `generateTrafficSources`, `generateOrders`, `generateFunnel`, `generateRetention`).
3. **TanStack Query** wraps those generator calls in `useQuery`, keyed by the date range, so switching ranges or revisiting a page reuses cached results instead of recomputing every render.
4. **Mock generators are deterministic**: they seed a small linear-congruential PRNG from a hash of the date range (and a per-series salt), so the same range always produces the same numbers — safe for server/client rendering and stable across re-renders.
5. **Charts** (`components/RevenueLineChart.tsx`, `OrdersBarChart.tsx`, `TrafficDonutChart.tsx`, `FunnelChart.tsx`) read `darkMode` from the UI store to swap grid/axis/tooltip colors, and always render inside Recharts' `ResponsiveContainer` for fluid sizing.
6. **DataTable** (`components/DataTable.tsx`) does client-side search, multi-column sort, pagination, column visibility toggling, and CSV export (built with a `Blob` + temporary `<a download>` link — no server round trip).
7. **Reports** (`components/ReportBuilder.tsx`) let you pick metrics + reuse the active date range, then save the selection to `store/reportsStore.ts`, which is persisted to `localStorage` independently from UI state.

### Dark mode

`store/uiStore.ts` holds a `darkMode` boolean persisted to `localStorage`. `components/ThemeSync.tsx` is a client component mounted once in the root layout that toggles the `dark` class on `<html>` whenever the flag changes, which drives every `dark:` Tailwind utility in the app (see `tailwind.config.ts`, `darkMode: 'class'`).

### Responsive layout

- The sidebar (`components/Sidebar.tsx`) is a fixed column on desktop (collapsible via a toggle button) and becomes a slide-in drawer with a backdrop on mobile, opened from the hamburger button in `components/Topbar.tsx`.
- Stat cards and chart grids use Tailwind's responsive grid utilities (`grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`, etc.) to stack on small screens and lay out side-by-side on desktop.
- The data table and retention grid scroll horizontally on narrow viewports instead of breaking the page layout.

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. No environment variables or backend services are required — everything renders from mock data generated in the browser.

## Scripts

- `npm run dev` — start the Next.js dev server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run Next.js's ESLint config
