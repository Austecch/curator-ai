"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/layout";
import { Card, Badge } from "@/components/ui";
import { useAuth } from "@/lib/hooks/useAuth";
import { usePosts } from "@/lib/hooks/usePosts";
import { usePlatforms } from "@/lib/hooks/usePlatforms";
import { useNotifications } from "@/lib/hooks/useNotifications";
import {
  Briefcase,
  Camera,
  Users,
  X,
  Play,
  Pin,
  MessageCircle,
  Share,
  ChevronRight,
  TrendingUp,
  Plus,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";

const chartData = [
  { label: "Mon", value: 42, height: "40%" },
  { label: "Tue", value: 58, height: "60%" },
  { label: "Wed", value: 52, height: "55%" },
  { label: "Thu", value: 89, height: "85%" },
  { label: "Fri", value: 71, height: "70%" },
  { label: "Sat", value: 104, height: "100%" },
  { label: "Sun", value: 78, height: "75%" },
];

const stats = [
  { label: "Total Reach", value: "1.2M", change: "+12.4%", trend: "up" },
  { label: "Engagements", value: "89.5k", change: "+8.2%", trend: "up" },
  { label: "Posts This Month", value: "24", change: "+3", trend: "up" },
  { label: "Active Platforms", value: "8", change: "", trend: "neutral" },
];

export default function DashboardPage() {
  const { user, profile, isAuthenticated, loading: authLoading } = useAuth();
  const { posts, loading: postsLoading } = usePosts(user?.id || null);
  const { platforms, activePlatformsCount, loading: platformsLoading } = usePlatforms(user?.id || null);
  const { unreadCount } = useNotifications(user?.id || null);

  const loading = authLoading || postsLoading || platformsLoading;

  if (!loading && !isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  const upcomingPosts = posts
    .filter((post) => post.status === "scheduled")
    .slice(0, 3);

  return (
    <DashboardShell>
      <section className="mb-10">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#2e323d] mb-2">
          Command Center
        </h2>
        <p className="text-[#5b5f6b] font-medium">
          {loading ? (
            "Loading your dashboard..."
          ) : (
            <>
              Welcome back, {profile?.full_name || user?.email?.split("@")[0] || "User"}.{" "}
              {unreadCount > 0 && (
                <span className="text-[#005cbb] font-bold">{unreadCount} updates</span>
              )} pending review.
            </>
          )}
        </p>
      </section>

      <div className="grid grid-cols-12 gap-8">
        <Card className="col-span-8 p-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#5b5f6b] font-bold">
                Total Reach
              </span>
              <h3 className="text-4xl font-extrabold tracking-tight mt-1">
                1.2M{" "}
                <span className="text-sm font-bold text-[#005cbb] ml-2">+12.4%</span>
              </h3>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-full bg-[#f3f3fb] text-xs font-bold hover:bg-[#e6e7f4] transition-colors">
                Weekly
              </button>
              <button className="px-4 py-2 rounded-full bg-[#005cbb] text-[#f7f7ff] text-xs font-bold shadow-[0_10px_30px_rgba(0,92,187,0.2)]">
                Monthly
              </button>
            </div>
          </div>

          <div className="h-64 w-full flex items-end gap-3 px-2">
            {chartData.map((item, index) => (
              <div
                key={item.label}
                className="flex-1 flex flex-col items-center group"
              >
                <div
                  className={`w-full rounded-t-xl transition-all group-hover:bg-[#d7e2ff] cursor-pointer relative ${
                    index === 5 ? "bg-[#005cbb]" : "bg-[#f3f3fb]"
                  }`}
                  style={{ height: item.height }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0d0e12] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.value}k
                  </div>
                </div>
                <span className="text-[10px] text-[#5b5f6b] mt-2">{item.label}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="col-span-4 flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-bold tracking-tight text-lg">Upcoming</h3>
            <Link
              href="/scheduler"
              className="text-xs font-bold text-[#005cbb] hover:underline transition-all"
            >
              View Calendar
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingPosts.length > 0 ? (
              upcomingPosts.map((post) => (
                <Card
                  key={post.id}
                  variant="interactive"
                  className="p-5 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                    <Share className="w-5 h-5 text-[#0077B5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">
                      {post.content.slice(0, 30)}...
                    </p>
                    <p className="text-[10px] text-[#5b5f6b] font-medium mt-0.5">
                      {post.scheduled_at
                        ? new Date(post.scheduled_at).toLocaleString()
                        : "Not scheduled"}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#5b5f6b]/40 group-hover:text-[#005cbb] transition-colors" />
                </Card>
              ))
            ) : (
              <Card className="p-5">
                <p className="text-sm text-[#5b5f6b] text-center">
                  No scheduled posts yet
                </p>
                <Link
                  href="/create"
                  className="block text-center text-xs text-[#005cbb] font-medium mt-2 hover:underline"
                >
                  Create your first post
                </Link>
              </Card>
            )}
          </div>

          <Card className="mt-auto p-6 bg-[#d7e2ff]/30 border border-[#005cbb]/5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#005cbb]" />
              <p className="text-xs font-bold text-[#005cbb]">Curator Intelligence</p>
            </div>
            <p className="text-xs text-[#0050a3] leading-relaxed">
              Based on your audience activity, posting at <span className="font-bold">6 PM on Thursday</span> could increase reach by <span className="font-bold">18%</span>.
            </p>
          </Card>
        </div>

        <div className="col-span-12 mt-4">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-xl font-bold tracking-tight">
              Connected Platforms
              {platformsLoading ? (
                <span className="text-sm font-normal text-[#5b5f6b] ml-2">Loading...</span>
              ) : (
                <span className="text-sm font-normal text-[#5b5f6b] ml-2">
                  ({activePlatformsCount} active)
                </span>
              )}
            </h3>
            <Link
              href="/platforms"
              className="flex items-center gap-2 text-xs font-bold text-[#5b5f6b] hover:text-[#005cbb] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Connect New
            </Link>
          </div>

          <div className="grid grid-cols-5 gap-6">
            {platforms.length > 0 ? (
              platforms.slice(0, 8).map((platform) => {
                const icons: Record<string, typeof Briefcase> = {
                  linkedin: Briefcase,
                  instagram: Camera,
                  facebook: Users,
                  twitter: X,
                  youtube: Play,
                  pinterest: Pin,
                  reddit: MessageCircle,
                };
                const Icon = icons[platform.platform] || Share;
                const colors: Record<string, string> = {
                  linkedin: "#0077B5",
                  instagram: "#E4405F",
                  facebook: "#1877F2",
                  twitter: "#000000",
                  youtube: "#FF0000",
                  pinterest: "#BD081C",
                  reddit: "#FF4500",
                };

                return (
                  <Card
                    key={platform.id}
                    variant="interactive"
                    className="p-6 group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#f3f3fb] flex items-center justify-center">
                        <Icon className="w-5 h-5" style={{ color: colors[platform.platform] || "#005cbb" }} />
                      </div>
                      <Badge variant={platform.is_active ? "success" : "neutral"} size="sm">
                        {platform.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-xs font-bold text-[#5b5f6b] mb-1 capitalize">
                      {platform.platform_name || platform.platform}
                    </p>
                    <p className="text-xl font-extrabold tracking-tight">
                      {platform.followers_count
                        ? platform.followers_count >= 1000
                          ? `${(platform.followers_count / 1000).toFixed(1)}k`
                          : platform.followers_count
                        : "-"}
                    </p>
                    <p className="text-[10px] text-[#5b5f6b] mt-2">
                      {platform.followers_count ? "Followers" : "Not connected"}
                    </p>
                  </Card>
                );
              })
            ) : (
              <>
                {["linkedin", "instagram", "facebook", "twitter", "youtube"].map((platform) => {
                  const icons: Record<string, typeof Briefcase> = {
                    linkedin: Briefcase,
                    instagram: Camera,
                    facebook: Users,
                    twitter: X,
                    youtube: Play,
                  };
                  const Icon = icons[platform];
                  const colors: Record<string, string> = {
                    linkedin: "#0077B5",
                    instagram: "#E4405F",
                    facebook: "#1877F2",
                    twitter: "#000000",
                    youtube: "#FF0000",
                  };

                  return (
                    <Card
                      key={platform}
                      variant="interactive"
                      className="p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-full bg-[#f3f3fb] flex items-center justify-center">
                          <Icon className="w-5 h-5" style={{ color: colors[platform] }} />
                        </div>
                        <Badge variant="neutral" size="sm">Inactive</Badge>
                      </div>
                      <p className="text-xs font-bold text-[#5b5f6b] mb-1 capitalize">{platform}</p>
                      <p className="text-xl font-extrabold tracking-tight">-</p>
                      <p className="text-[10px] text-[#5b5f6b] mt-2">Not connected</p>
                    </Card>
                  );
                })}
              </>
            )}

            <Card className="p-6 bg-[#f3f3fb]/50 border-2 border-dashed border-[#aeb1bf]/30 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#f3f3fb] transition-all min-h-[140px]">
              <Plus className="w-6 h-6 text-[#aeb1bf] mb-2" />
              <p className="text-[10px] font-bold text-[#5b5f6b] uppercase tracking-tighter">
                Add More
              </p>
            </Card>
          </div>
        </div>

        <div className="col-span-12 grid grid-cols-4 gap-6 mt-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-6">
              <p className="text-[10px] uppercase tracking-widest text-[#5b5f6b] font-bold mb-2">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-extrabold tracking-tight">{stat.value}</p>
                {stat.change && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : stat.trend === "down" ? (
                      <TrendingDown className="w-3 h-3" />
                    ) : null}
                    {stat.change}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Link
        href="/create"
        className="fixed bottom-10 right-10 w-16 h-16 bg-[#005cbb] text-[#f7f7ff] rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-50 group"
      >
        <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
        <span className="absolute right-20 bg-[#0d0e12] text-white text-xs font-bold py-2 px-4 rounded-full opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all pointer-events-none whitespace-nowrap">
          Create New Post
        </span>
      </Link>
    </DashboardShell>
  );
}
