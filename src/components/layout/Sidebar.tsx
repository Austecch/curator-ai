"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  Layers,
  Calendar,
  BarChart3,
  Link2,
  Sparkles,
  Bell,
  Settings,
  ListOrdered,
  FileText,
  Image,
  Clock,
  GitCompare,
  HelpCircle,
  User,
  CreditCard,
  Workflow,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Create", href: "/create", icon: PlusCircle },
  { name: "Queue", href: "/queue", icon: ListOrdered },
  { name: "Scheduler", href: "/scheduler", icon: Calendar },
  { name: "Best Time", href: "/best-time", icon: Clock },
  { name: "Workflow", href: "/workflow", icon: Workflow },
  { name: "Preview", href: "/preview", icon: Smartphone },
  { name: "Content", href: "/content", icon: Layers },
  { name: "Media", href: "/media", icon: Image },
  { name: "Templates", href: "/templates", icon: FileText },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Compare", href: "/compare", icon: GitCompare },
  { name: "Platforms", href: "/platforms", icon: Link2 },
];

const settingsNavigation = [
  { name: "AI Settings", href: "/ai-settings", icon: Sparkles },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Account", href: "/settings", icon: User },
  { name: "Billing", href: "/settings", icon: CreditCard, badge: "Premium" },
  { name: "Help", href: "/help", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 backdrop-blur-[20px] bg-[#faf8fe]/80 border-r border-[#aeb1bf]/15 flex flex-col z-50 overflow-y-auto"
      style={{ WebkitBackdropFilter: "blur(20px)" }}
    >
      <div className="mb-6 px-6 pt-8">
        <Link href="/dashboard">
          <h1 className="text-xl font-bold tracking-tight text-[#2e323d]">Curator AI</h1>
          <p className="text-[10px] uppercase tracking-widest text-[#005cbb] font-bold mt-1">
            Premium Plan
          </p>
        </Link>
      </div>

      <nav className="px-4 space-y-1">
        {mainNavigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium tracking-tight text-sm transition-all duration-200",
                isActive
                  ? "text-[#005cbb] font-bold bg-[#d7e2ff] border-r-2 border-[#005cbb]"
                  : "text-[#2e323d]/60 hover:text-[#2e323d] hover:bg-[#f3f3fb]"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mt-6">
        <p className="text-[10px] uppercase tracking-widest text-[#5b5f6b]/40 font-bold px-4 mb-2">
          Settings
        </p>
        <nav className="space-y-1">
          {settingsNavigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium tracking-tight text-sm transition-all duration-200",
                  isActive
                    ? "text-[#005cbb] font-bold bg-[#d7e2ff] border-r-2 border-[#005cbb]"
                    : "text-[#2e323d]/60 hover:text-[#2e323d] hover:bg-[#f3f3fb]"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="ml-auto text-[10px] font-bold text-[#005cbb] bg-[#d7e2ff] px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto px-4 pb-8">
        <Link
          href="/create"
          className="w-full flex items-center justify-center gap-2 bg-[#005cbb] text-[#f7f7ff] px-6 py-3 rounded-xl font-bold text-sm transition-all duration-200 active:scale-[0.98] hover:bg-[#0050a5]"
          style={{ boxShadow: "0 10px 30px rgba(0, 92, 187, 0.2)" }}
        >
          <PlusCircle className="w-5 h-5" />
          Create Post
        </Link>

        <Link
          href="/settings"
          className="flex items-center gap-3 px-2 mt-6 hover:bg-[#f3f3fb] rounded-xl py-2 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-[#d7e2ff] flex items-center justify-center text-sm font-bold text-[#005cbb]">
            AR
          </div>
          <div className="flex-1">
            <span className="text-xs font-bold block">Alex Rivers</span>
            <span className="text-[10px] text-[#5b5f6b]">View Profile</span>
          </div>
        </Link>
      </div>
    </aside>
  );
}
