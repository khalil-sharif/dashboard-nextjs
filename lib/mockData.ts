import type {
  CategoryOrders,
  DateRange,
  FunnelStage,
  Order,
  OrderStatus,
  RetentionRow,
  RevenuePoint,
  StatSummary,
  TrafficSource,
  TrendPoint,
} from "./types";

// Simple deterministic pseudo-random generator so server and client renders match.
function seededRandom(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function daysBetween(start: string, end: string): number {
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  return Math.max(1, Math.round((endMs - startMs) / 86400000) + 1);
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function rangeToDates(range: DateRange): string[] {
  const total = daysBetween(range.start, range.end);
  const start = new Date(range.start);
  const dates: string[] = [];
  for (let i = 0; i < total; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(formatDate(d));
  }
  return dates;
}

function seedFromRange(range: DateRange, salt: number): number {
  const s = `${range.start}_${range.end}_${salt}`;
  let hash = 0;
  for (let i = 0; i < s.length; i += 1) {
    hash = (hash * 31 + s.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash) || 1;
}

export function generateRevenueSeries(range: DateRange): RevenuePoint[] {
  const dates = rangeToDates(range);
  const rand = seededRandom(seedFromRange(range, 1));
  let base = 8000 + rand() * 4000;
  return dates.map((date, idx) => {
    const wave = Math.sin(idx / 4) * 900;
    const noise = (rand() - 0.5) * 1400;
    base += (rand() - 0.45) * 180;
    const revenue = Math.max(500, Math.round(base + wave + noise));
    const target = Math.round(base + 600);
    return { date, revenue, target };
  });
}

export function generateTrendPoints(range: DateRange, salt: number): TrendPoint[] {
  const dates = rangeToDates(range);
  const rand = seededRandom(seedFromRange(range, salt));
  let base = 50 + rand() * 50;
  return dates.map((date) => {
    base += (rand() - 0.48) * 6;
    return { date, value: Math.max(0, Math.round(base * 100) / 100) };
  });
}

export function generateStatSummaries(range: DateRange): StatSummary[] {
  const revenueSeries = generateRevenueSeries(range);
  const totalRevenue = revenueSeries.reduce((sum, p) => sum + p.revenue, 0);

  const usersTrend = generateTrendPoints(range, 2);
  const totalUsers = Math.round(
    usersTrend.reduce((sum, p) => sum + p.value, 0) * 12
  );

  const ordersTrend = generateTrendPoints(range, 3);
  const totalOrders = Math.round(
    ordersTrend.reduce((sum, p) => sum + p.value, 0) * 3
  );

  const conversionTrend = generateTrendPoints(range, 4).map((p) => ({
    ...p,
    value: Math.min(100, p.value / 4),
  }));
  const avgConversion =
    conversionTrend.reduce((sum, p) => sum + p.value, 0) /
    conversionTrend.length;

  const rand = seededRandom(seedFromRange(range, 99));
  const changeFor = () => Math.round((rand() * 20 - 8) * 10) / 10;

  return [
    {
      id: "revenue",
      label: "Revenue",
      value: totalRevenue,
      format: "currency",
      changePct: changeFor(),
      trend: revenueSeries.map((p) => ({ date: p.date, value: p.revenue })),
    },
    {
      id: "users",
      label: "Active Users",
      value: totalUsers,
      format: "number",
      changePct: changeFor(),
      trend: usersTrend,
    },
    {
      id: "orders",
      label: "Orders",
      value: totalOrders,
      format: "number",
      changePct: changeFor(),
      trend: ordersTrend,
    },
    {
      id: "conversion",
      label: "Conversion Rate",
      value: Math.round(avgConversion * 100) / 100,
      format: "percent",
      changePct: changeFor(),
      trend: conversionTrend,
    },
  ];
}

const CATEGORIES = [
  "Electronics",
  "Apparel",
  "Home & Garden",
  "Beauty",
  "Sports",
  "Toys",
  "Books",
];

export function generateOrdersByCategory(range: DateRange): CategoryOrders[] {
  const rand = seededRandom(seedFromRange(range, 5));
  return CATEGORIES.map((category) => ({
    category,
    orders: Math.round(80 + rand() * 420),
  }));
}

const TRAFFIC_SOURCES = ["Organic Search", "Direct", "Social", "Referral", "Email", "Paid Ads"];

export function generateTrafficSources(range: DateRange): TrafficSource[] {
  const rand = seededRandom(seedFromRange(range, 6));
  return TRAFFIC_SOURCES.map((source) => ({
    source,
    visits: Math.round(500 + rand() * 4500),
  }));
}

const FIRST_NAMES = [
  "Ava", "Liam", "Noah", "Emma", "Olivia", "Ethan", "Sophia", "Mason",
  "Isabella", "Lucas", "Mia", "Logan", "Amelia", "James", "Harper",
];
const LAST_NAMES = [
  "Johnson", "Smith", "Williams", "Brown", "Jones", "Garcia", "Miller",
  "Davis", "Rodriguez", "Martinez", "Wilson", "Anderson", "Taylor", "Thomas",
];
const STATUSES: OrderStatus[] = ["completed", "pending", "refunded", "cancelled"];

export function generateOrders(range: DateRange, count = 145): Order[] {
  const dates = rangeToDates(range);
  const rand = seededRandom(seedFromRange(range, 7));
  const orders: Order[] = [];

  for (let i = 0; i < count; i += 1) {
    const first = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const last = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    const dateIdx = Math.floor(rand() * dates.length);
    const category = CATEGORIES[Math.floor(rand() * CATEGORIES.length)];
    const statusRoll = rand();
    let status: OrderStatus = "completed";
    if (statusRoll > 0.92) status = "cancelled";
    else if (statusRoll > 0.82) status = "refunded";
    else if (statusRoll > 0.65) status = "pending";

    orders.push({
      id: `ORD-${(10000 + i).toString()}`,
      customer: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
      date: dates[dateIdx] ?? dates[0],
      category,
      amount: Math.round((20 + rand() * 480) * 100) / 100,
      status,
    });
  }

  return orders.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function generateFunnel(range: DateRange): FunnelStage[] {
  const rand = seededRandom(seedFromRange(range, 8));
  const signup = Math.round(8000 + rand() * 4000);
  const activation = Math.round(signup * (0.45 + rand() * 0.2));
  const purchase = Math.round(activation * (0.25 + rand() * 0.2));
  return [
    { stage: "Signup", count: signup },
    { stage: "Activation", count: activation },
    { stage: "Purchase", count: purchase },
  ];
}

export function generateRetention(range: DateRange): RetentionRow[] {
  const rand = seededRandom(seedFromRange(range, 9));
  const cohorts = ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"];
  return cohorts.map((cohort, idx) => {
    const size = Math.round(400 + rand() * 600);
    const weeks: number[] = [100];
    let retention = 100;
    for (let w = 1; w < cohorts.length - idx; w += 1) {
      retention = Math.max(4, retention - (8 + rand() * 12));
      weeks.push(Math.round(retention));
    }
    return { cohort, size, weeks };
  });
}

export function defaultDateRange(preset: DateRange["preset"] = "30d"): DateRange {
  const end = new Date();
  const start = new Date();
  const days = preset === "7d" ? 7 : preset === "90d" ? 90 : 30;
  start.setDate(end.getDate() - (days - 1));
  return {
    preset,
    start: formatDate(start),
    end: formatDate(end),
  };
}
