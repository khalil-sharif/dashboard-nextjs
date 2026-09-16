export type DateRangePreset = "7d" | "30d" | "90d" | "custom";

export interface DateRange {
  preset: DateRangePreset;
  start: string; // ISO date
  end: string; // ISO date
}

export interface TrendPoint {
  date: string;
  value: number;
}

export interface StatSummary {
  id: string;
  label: string;
  value: number;
  format: "currency" | "number" | "percent";
  changePct: number;
  trend: TrendPoint[];
}

export interface RevenuePoint {
  date: string;
  revenue: number;
  target: number;
}

export interface CategoryOrders {
  category: string;
  orders: number;
}

export interface TrafficSource {
  source: string;
  visits: number;
}

export type OrderStatus = "completed" | "pending" | "refunded" | "cancelled";

export interface Order {
  id: string;
  customer: string;
  email: string;
  date: string;
  category: string;
  amount: number;
  status: OrderStatus;
}

export interface FunnelStage {
  stage: "Signup" | "Activation" | "Purchase";
  count: number;
}

export interface RetentionRow {
  cohort: string;
  size: number;
  weeks: number[]; // retention pct per week index, 0-100
}

export type MetricKey =
  | "revenue"
  | "users"
  | "orders"
  | "conversion"
  | "traffic";

export interface SavedReport {
  id: string;
  name: string;
  metrics: MetricKey[];
  range: DateRange;
  createdAt: string;
}

export const METRIC_LABELS: Record<MetricKey, string> = {
  revenue: "Revenue",
  users: "Users",
  orders: "Orders",
  conversion: "Conversion Rate",
  traffic: "Traffic",
};
