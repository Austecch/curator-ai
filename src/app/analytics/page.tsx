"use client";

import { DashboardShell } from "@/components/layout";
import { Card, Badge } from "@/components/ui";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Download,
  Calendar,
  Briefcase,
  Camera,
  Users,
  X,
  Play,
} from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

const overviewStats = [
  {
    label: "Total Reach",
    value: "1.2M",
    change: "+12.4%",
    trend: "up",
    icon: Eye,
  },
  {
    label: "Total Engagements",
    value: "89.5k",
    change: "+8.2%",
    trend: "up",
    icon: Heart,
  },
  {
    label: "Avg. Click Rate",
    value: "4.8%",
    change: "-0.3%",
    trend: "down",
    icon: TrendingDown,
  },
  {
    label: "Total Posts",
    value: "47",
    change: "+12",
    trend: "up",
    icon: Calendar,
  },
];

const topPosts = [
  {
    content: "Excited to announce our Q3 product roadmap!",
    platform: "linkedin",
    reach: 15400,
    engagements: 1230,
    ctr: 8.2,
    icon: Briefcase,
    color: "#0077B5",
  },
  {
    content: "Behind the scenes of our latest photoshoot",
    platform: "instagram",
    reach: 28500,
    engagements: 3420,
    ctr: 5.4,
    icon: Camera,
    color: "#E4405F",
  },
  {
    content: "Top 5 tips for boosting engagement",
    platform: "twitter",
    reach: 8900,
    engagements: 890,
    ctr: 6.1,
    icon: X,
    color: "#000000",
  },
];

const platformPerformance = [
  { platform: "Instagram", followers: "45.2k", reach: "124k", engagement: "5.8%", color: "#E4405F" },
  { platform: "LinkedIn", followers: "12.4k", reach: "45k", engagement: "4.2%", color: "#0077B5" },
  { platform: "Facebook", followers: "8.9k", reach: "32k", engagement: "3.9%", color: "#1877F2" },
  { platform: "X (Twitter)", followers: "32.1k", reach: "28k", engagement: "2.1%", color: "#000000" },
  { platform: "TikTok", followers: "108k", reach: "456k", engagement: "8.2%", color: "#000000" },
];

const weeklyData = [
  { day: "Mon", reach: 42000, engagement: 3200 },
  { day: "Tue", reach: 58000, engagement: 4100 },
  { day: "Wed", reach: 52000, engagement: 3800 },
  { day: "Thu", reach: 89000, engagement: 6200 },
  { day: "Fri", reach: 71000, engagement: 5100 },
  { day: "Sat", reach: 104000, engagement: 7800 },
  { day: "Sun", reach: 78000, engagement: 5600 },
];

const maxReach = Math.max(...weeklyData.map((d) => d.reach));

export default function AnalyticsPage() {
  return (
    <DashboardShell>
      <section className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#2e323d] mb-2">
            Analytics
          </h2>
          <p className="text-[#5b5f6b] font-medium">
            Track your performance across all platforms.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-[#f3f3fb] rounded-xl p-1">
            <button className="px-4 py-2 rounded-lg text-sm font-medium bg-white shadow-sm text-[#2e323d]">
              7 Days
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium text-[#5b5f6b] hover:text-[#2e323d] transition-colors">
              30 Days
            </button>
            <button className="px-4 py-2 rounded-lg text-sm font-medium text-[#5b5f6b] hover:text-[#2e323d] transition-colors">
              90 Days
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[#5b5f6b] hover:bg-[#f3f3fb] transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </section>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {overviewStats.map((stat) => (
          <Card key={stat.label} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-5 h-5 text-[#5b5f6b]" />
              <Badge variant={stat.trend === "up" ? "success" : "error"}>
                {stat.change}
              </Badge>
            </div>
            <p className="text-3xl font-extrabold tracking-tight">{stat.value}</p>
            <p className="text-sm text-[#5b5f6b] mt-1">{stat.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8 mb-8">
        <Card className="col-span-8 p-6">
          <h3 className="text-lg font-bold tracking-tight mb-6">Reach Overview</h3>
          <div className="h-64 flex items-end gap-4">
            {weeklyData.map((day, index) => (
              <div key={day.day} className="flex-1 flex flex-col items-center group">
                <div
                  className={cn(
                    "w-full rounded-t-xl transition-all group-hover:bg-[#d7e2ff] cursor-pointer relative",
                    index === 5 ? "bg-[#005cbb]" : "bg-[#f3f3fb]"
                  )}
                  style={{ height: `${(day.reach / maxReach) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0d0e12] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {formatNumber(day.reach)}
                  </div>
                </div>
                <span className="text-[10px] text-[#5b5f6b] mt-2">{day.day}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="col-span-4 p-6">
          <h3 className="text-lg font-bold tracking-tight mb-6">Platform Breakdown</h3>
          <div className="space-y-4">
            {platformPerformance.map((platform) => (
              <div key={platform.platform} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{platform.platform}</span>
                  <span className="text-xs text-[#5b5f6b]">{platform.engagement}</span>
                </div>
                <div className="h-2 bg-[#f3f3fb] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${parseFloat(platform.engagement) * 10}%`,
                      backgroundColor: platform.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-bold tracking-tight mb-6">Top Performing Posts</h3>
          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-[#f3f3fb] hover:bg-[#e6e7f4] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${post.color}20` }}
                  >
                    <post.icon className="w-4 h-4" style={{ color: post.color }} />
                  </div>
                  <span className="text-xs font-medium text-[#5b5f6b] capitalize">
                    {post.platform}
                  </span>
                  <Badge variant="primary" size="sm">
                    #{index + 1}
                  </Badge>
                </div>
                <p className="text-sm text-[#2e323d] mb-3 line-clamp-2">{post.content}</p>
                <div className="flex items-center gap-6 text-xs text-[#5b5f6b]">
                  <span>Reach: {formatNumber(post.reach)}</span>
                  <span>Eng: {formatNumber(post.engagements)}</span>
                  <span>CTR: {post.ctr}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold tracking-tight mb-6">Engagement Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Likes", value: "45.2k", change: "+12%", icon: Heart },
              { label: "Comments", value: "3.8k", change: "+8%", icon: MessageCircle },
              { label: "Shares", value: "12.1k", change: "+15%", icon: Share2 },
              { label: "Saves", value: "8.4k", change: "+22%", icon: Download },
            ].map((metric) => (
              <div key={metric.label} className="p-4 rounded-xl bg-[#f3f3fb]">
                <div className="flex items-center gap-2 mb-2">
                  <metric.icon className="w-4 h-4 text-[#5b5f6b]" />
                  <span className="text-sm text-[#5b5f6b]">{metric.label}</span>
                </div>
                <p className="text-2xl font-extrabold tracking-tight">{metric.value}</p>
                <p className="text-xs text-emerald-600 font-medium mt-1">{metric.change}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}
