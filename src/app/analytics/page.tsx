"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout";
import { Card, Badge } from "@/components/ui";
import { useAuth } from "@/lib/hooks/useAuth";
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

interface AnalyticsData {
  total_reach: number;
  reach_change: number;
  total_engagements: number;
  engagement_change: number;
  total_posts: number;
  posts_this_month: number;
  upcoming_posts: number;
  connected_platforms: number;
  weekly_data: { day: string; reach: number; engagement: number }[];
  platform_breakdown: { platform: string; followers: number; reach: number; engagement: number }[];
  top_posts: { content: string; platform: string; reach: number; engagements: number; ctr: number }[];
}

export default function AnalyticsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("7d");

  useEffect(() => {
    if (user?.id && isAuthenticated) {
      fetchAnalytics();
    }
  }, [user?.id, isAuthenticated, period]);

  const fetchAnalytics = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/analytics?user_id=${user.id}&period=${period}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005cbb] mx-auto mb-4"></div>
            <p className="text-[#5b5f6b]">Loading analytics...</p>
          </div>
        </div>
      </DashboardShell>
    );
  }

  if (!isAuthenticated) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-[#5b5f6b]">Redirecting to login...</p>
        </div>
      </DashboardShell>
    );
  }

  const overviewStats = analytics
    ? [
        {
          label: "Total Reach",
          value: formatNumber(analytics.total_reach),
          change: `${analytics.reach_change >= 0 ? "+" : ""}${analytics.reach_change.toFixed(1)}%`,
          trend: analytics.reach_change >= 0 ? "up" : "down",
          icon: Eye,
        },
        {
          label: "Total Engagements",
          value: formatNumber(analytics.total_engagements),
          change: `${analytics.engagement_change >= 0 ? "+" : ""}${analytics.engagement_change.toFixed(1)}%`,
          trend: analytics.engagement_change >= 0 ? "up" : "down",
          icon: Heart,
        },
        {
          label: "Avg. Engagement Rate",
          value: `${(analytics.platform_breakdown.reduce((sum, p) => sum + p.engagement, 0) / Math.max(analytics.platform_breakdown.length, 1)).toFixed(1)}%`,
          change: `${analytics.engagement_change >= 0 ? "+" : ""}${analytics.engagement_change.toFixed(1)}%`,
          trend: analytics.engagement_change >= 0 ? "up" : "down",
          icon: TrendingUp,
        },
        {
          label: "Total Posts",
          value: analytics.total_posts.toString(),
          change: `+${analytics.posts_this_month}`,
          trend: "up",
          icon: Calendar,
        },
      ]
    : [];

  const maxReach = analytics?.weekly_data
    ? Math.max(...analytics.weekly_data.map((d) => d.reach))
    : 0;

  const platformIcons: Record<string, typeof Briefcase> = {
    linkedin: Briefcase,
    instagram: Camera,
    facebook: Users,
    twitter: X,
    youtube: Play,
  };

  const platformColors: Record<string, string> = {
    linkedin: "#0077B5",
    instagram: "#E4405F",
    facebook: "#1877F2",
    twitter: "#000000",
    youtube: "#FF0000",
  };

  const isPeriodActive = (p: string) => period === p;

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
  };

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
            <button
              onClick={() => handlePeriodChange("7d")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isPeriodActive("7d")
                  ? "bg-white shadow-sm text-[#2e323d]"
                  : "text-[#5b5f6b] hover:text-[#2e323d]"
              )}
            >
              7 Days
            </button>
            <button
              onClick={() => handlePeriodChange("30d")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isPeriodActive("30d")
                  ? "bg-white shadow-sm text-[#2e323d]"
                  : "text-[#5b5f6b] hover:text-[#2e323d]"
              )}
            >
              30 Days
            </button>
            <button
              onClick={() => handlePeriodChange("90d")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isPeriodActive("90d")
                  ? "bg-white shadow-sm text-[#2e323d]"
                  : "text-[#5b5f6b] hover:text-[#2e323d]"
              )}
            >
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
            {analytics?.weekly_data?.map((day, index) => (
              <div key={day.day} className="flex-1 flex flex-col items-center group">
                <div
                  className={cn(
                    "w-full rounded-t-xl transition-all group-hover:bg-[#d7e2ff] cursor-pointer relative",
                    index === (analytics.weekly_data?.length || 7) - 1 ? "bg-[#005cbb]" : "bg-[#f3f3fb]"
                  )}
                  style={{ height: `${maxReach > 0 ? (day.reach / maxReach) * 100 : 0}%` }}
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
            {analytics?.platform_breakdown?.map((platform) => (
              <div key={platform.platform} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{platform.platform}</span>
                  <span className="text-xs text-[#5b5f6b]">{platform.engagement.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-[#f3f3fb] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${platform.engagement * 10}%`,
                      backgroundColor: platformColors[platform.platform.toLowerCase()] || "#005cbb",
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
            {analytics?.top_posts?.map((post, index) => {
              const Icon = platformIcons[post.platform.toLowerCase()] || Share2;
              const color = platformColors[post.platform.toLowerCase()] || "#005cbb";
              return (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-[#f3f3fb] hover:bg-[#e6e7f4] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${color}20` }}
                    >
                      <Icon className="w-4 h-4" style={{ color }} />
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
                    <span>CTR: {post.ctr.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
            {(!analytics?.top_posts || analytics.top_posts.length === 0) && (
              <p className="text-sm text-[#5b5f6b] text-center py-8">No posts yet. Create your first post to see analytics.</p>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold tracking-tight mb-6">Engagement Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Likes", value: Math.floor((analytics?.total_engagements || 0) * 0.6), change: "+12%", icon: Heart },
              { label: "Comments", value: Math.floor((analytics?.total_engagements || 0) * 0.08), change: "+8%", icon: MessageCircle },
              { label: "Shares", value: Math.floor((analytics?.total_engagements || 0) * 0.2), change: "+15%", icon: Share2 },
              { label: "Saves", value: Math.floor((analytics?.total_engagements || 0) * 0.12), change: "+22%", icon: Download },
            ].map((metric) => (
              <div key={metric.label} className="p-4 rounded-xl bg-[#f3f3fb]">
                <div className="flex items-center gap-2 mb-2">
                  <metric.icon className="w-4 h-4 text-[#5b5f6b]" />
                  <span className="text-sm text-[#5b5f6b]">{metric.label}</span>
                </div>
                <p className="text-2xl font-extrabold tracking-tight">{formatNumber(metric.value)}</p>
                <p className="text-xs text-emerald-600 font-medium mt-1">{metric.change}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardShell>
  );
}