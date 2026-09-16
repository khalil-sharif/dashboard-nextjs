"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useUIStore } from "@/store/uiStore";
import type { TrafficSource } from "@/lib/types";
import ChartCard from "./ChartCard";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#0ea5e9"];

export default function TrafficDonutChart({ data }: { data: TrafficSource[] }) {
  const darkMode = useUIStore((s) => s.darkMode);
  const total = data.reduce((sum, d) => sum + d.visits, 0);

  return (
    <ChartCard title="Traffic Source Breakdown" subtitle={`${total.toLocaleString()} total visits`}>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="visits"
              nameKey="source"
              innerRadius="55%"
              outerRadius="80%"
              paddingAngle={2}
              isAnimationActive={false}
            >
              {data.map((entry, idx) => (
                <Cell key={entry.source} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? "#0f172a" : "#ffffff",
                borderColor: darkMode ? "#1e293b" : "#e2e8f0",
                borderRadius: 8,
                fontSize: 12,
                color: darkMode ? "#e2e8f0" : "#0f172a",
              }}
              formatter={(value: number, name: string) => [
                `${value.toLocaleString()} (${((value / total) * 100).toFixed(1)}%)`,
                name,
              ]}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
