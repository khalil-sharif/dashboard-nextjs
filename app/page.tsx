"use client";

import { useQuery } from "@tanstack/react-query";
import { useUIStore } from "@/store/uiStore";
import {
  generateOrders,
  generateOrdersByCategory,
  generateRevenueSeries,
  generateStatSummaries,
  generateTrafficSources,
} from "@/lib/mockData";
import Topbar from "@/components/Topbar";
import DateRangePicker from "@/components/DateRangePicker";
import StatCard from "@/components/StatCard";
import RevenueLineChart from "@/components/RevenueLineChart";
import OrdersBarChart from "@/components/OrdersBarChart";
import TrafficDonutChart from "@/components/TrafficDonutChart";
import DataTable from "@/components/DataTable";

export default function OverviewPage() {
  const dateRange = useUIStore((s) => s.dateRange);

  const { data } = useQuery({
    queryKey: ["overview", dateRange.start, dateRange.end],
    queryFn: () => ({
      stats: generateStatSummaries(dateRange),
      revenue: generateRevenueSeries(dateRange),
      ordersByCategory: generateOrdersByCategory(dateRange),
      trafficSources: generateTrafficSources(dateRange),
      orders: generateOrders(dateRange),
    }),
  });

  return (
    <>
      <Topbar title="Overview" />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <DateRangePicker />

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {data?.stats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            {data && <RevenueLineChart data={data.revenue} />}
          </div>
          <div>{data && <TrafficDonutChart data={data.trafficSources} />}</div>
        </section>

        <section className="grid grid-cols-1 gap-4">
          {data && <OrdersBarChart data={data.ordersByCategory} />}
        </section>

        <section>{data && <DataTable orders={data.orders} />}</section>
      </main>
    </>
  );
}
