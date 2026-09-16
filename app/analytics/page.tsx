"use client";

import { useQuery } from "@tanstack/react-query";
import { useUIStore } from "@/store/uiStore";
import { generateFunnel, generateRetention } from "@/lib/mockData";
import Topbar from "@/components/Topbar";
import DateRangePicker from "@/components/DateRangePicker";
import FunnelChart from "@/components/FunnelChart";
import RetentionGrid from "@/components/RetentionGrid";

export default function AnalyticsPage() {
  const dateRange = useUIStore((s) => s.dateRange);

  const { data } = useQuery({
    queryKey: ["analytics", dateRange.start, dateRange.end],
    queryFn: () => ({
      funnel: generateFunnel(dateRange),
      retention: generateRetention(dateRange),
    }),
  });

  return (
    <>
      <Topbar title="Analytics" />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <DateRangePicker />

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {data && <FunnelChart data={data.funnel} />}
          {data && <RetentionGrid data={data.retention} />}
        </section>
      </main>
    </>
  );
}
