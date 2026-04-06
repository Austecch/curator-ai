"use client";

import { Search, Bell, Settings, HelpCircle } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header
      className="fixed top-0 right-0 h-16 backdrop-blur-[20px] bg-[#faf8fe]/80 border-b border-[#aeb1bf]/15 flex justify-between items-center px-8 z-40"
      style={{ width: "calc(100% - 16rem)", WebkitBackdropFilter: "blur(20px)" }}
    >
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5b5f6b]/60 group-focus-within:text-[#005cbb] transition-colors" />
          <input
            className="w-full bg-[#f3f3fb] border-none rounded-full py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#005cbb]/20 transition-all outline-none"
            placeholder="Search analytics, posts, or platforms..."
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        
        <Link href="/help" className="p-2.5 rounded-full hover:bg-[#f3f3fb] transition-colors">
          <HelpCircle className="w-5 h-5 text-[#5b5f6b]" />
        </Link>
        
        <Link href="/notifications" className="p-2.5 rounded-full hover:bg-[#f3f3fb] transition-colors relative">
          <Bell className="w-5 h-5 text-[#5b5f6b]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#9f403d] rounded-full border-2 border-[#faf8fe]" />
        </Link>
        
        <Link href="/settings" className="p-2.5 rounded-full hover:bg-[#f3f3fb] transition-colors">
          <Settings className="w-5 h-5 text-[#5b5f6b]" />
        </Link>

        <div className="h-8 w-[1px] bg-[#aeb1bf]/20 mx-3" />

        <div className="w-8 h-8 rounded-full bg-[#005cbb]/10 flex items-center justify-center text-[#005cbb] font-bold text-xs">
          AR
        </div>
      </div>
    </header>
  );
}
