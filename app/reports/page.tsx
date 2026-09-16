"use client";

import Topbar from "@/components/Topbar";
import DateRangePicker from "@/components/DateRangePicker";
import ReportBuilder from "@/components/ReportBuilder";

export default function ReportsPage() {
  return (
    <>
      <Topbar title="Reports" />
      <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <DateRangePicker />
        <ReportBuilder />
      </main>
    </>
  );
}
