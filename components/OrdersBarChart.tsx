"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useUIStore } from "@/store/uiStore";
import type { CategoryOrders } from "@/lib/types";
import ChartCard from "./ChartCard";

export default function OrdersBarChart({ data }: { data: CategoryOrders[] }) {
  const darkMode = useUIStore((s) => s.darkMode);
  const gridColor = darkMode ? "#1e293b" : "#e2e8f0";
  const textColor = darkMode ? "#94a3b8" : "#64748b";

  return (
    <ChartCard title="Orders by Category" subtitle="Total orders in selected range">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="category"
              tick={{ fontSize: 11, fill: textColor }}
              tickLine={false}
              axisLine={{ stroke: gridColor }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tick={{ fontSize: 11, fill: textColor }}
              tickLine={false}
              axisLine={{ stroke: gridColor }}
              width={40}
            />
            <Tooltip
              cursor={{ fill: darkMode ? "#1e293b" : "#f1f5f9" }}
              contentStyle={{
                backgroundColor: darkMode ? "#0f172a" : "#ffffff",
                borderColor: gridColor,
                borderRadius: 8,
                fontSize: 12,
                color: darkMode ? "#e2e8f0" : "#0f172a",
              }}
            />
            <Bar dataKey="orders" name="Orders" fill="#6366f1" radius={[6, 6, 0, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
