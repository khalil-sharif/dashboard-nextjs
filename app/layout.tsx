import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";
import Sidebar from "@/components/Sidebar";
import ThemeSync from "@/components/ThemeSync";

export const metadata: Metadata = {
  title: "Pulse Dashboard",
  description: "A production-style analytics dashboard built with Next.js.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <QueryProvider>
          <ThemeSync />
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex min-w-0 flex-1 flex-col">{children}</div>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
