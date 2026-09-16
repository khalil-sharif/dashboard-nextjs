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
import type { FunnelStage } from "@/lib/types";
import ChartCard from "./ChartCard";

export default function FunnelChart({ data }: { data: FunnelStage[] }) {
  const darkMode = useUIStore((s) => s.darkMode);
  const gridColor = darkMode ? "#1e293b" : "#e2e8f0";
  const textColor = darkMode ? "#94a3b8" : "#64748b";

  const chartData = data.map((stage, idx) => {
    const prev = idx === 0 ? stage.count : data[idx - 1].count;
    return {
      ...stage,
      conversionFromPrev: idx === 0 ? 100 : Math.round((stage.count / prev) * 1000) / 10,
    };
  });

  return (
    <ChartCard title="Signup &rarr; Activation &rarr; Purchase" subtitle="Funnel conversion by stage">
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 4, right: 24, left: 8, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: textColor }}
              tickLine={false}
              axisLine={{ stroke: gridColor }}
            />
            <YAxis
              type="category"
              dataKey="stage"
              tick={{ fontSize: 12, fill: textColor }}
              tickLine={false}
              axisLine={{ stroke: gridColor }}
              width={90}
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
              formatter={(value: number, _name, props) => [
                `${value.toLocaleString()} (${props.payload.conversionFromPrev}% of prior stage)`,
                "Count",
              ]}
            />
            <Bar dataKey="count" name="Count" fill="#8b5cf6" radius={[0, 6, 6, 0]} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
