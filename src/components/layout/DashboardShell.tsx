"use client";

import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { KeyboardShortcuts } from "./KeyboardShortcuts";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[#faf8fe]">
      <Sidebar />
      <Header />
      <main className="ml-64 pt-24 pb-12 px-10 min-h-screen">
        {children}
      </main>
      <KeyboardShortcuts />
    </div>
  );
}
