"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout";
import { Card, Badge, Button } from "@/components/ui";
import {
  GitCompare,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Calendar,
  Briefcase,
  Camera,
  Users,
  X,
} from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

interface PostComparison {
  id: string;
  content: string;
  platform: string;
  date: string;
  metrics: {
    reach: number;
    impressions: number;
    engagements: number;
    clicks: number;
    likes: number;
    comments: number;
    shares: number;
  };
}

const posts: PostComparison[] = [
  {
    id: "1",
    content: "Excited to announce our Q3 product roadmap! We've been working tirelessly to bring you features that will transform how you manage social media.",
    platform: "linkedin",
    date: "2024-10-20",
    metrics: {
      reach: 15400,
      impressions: 22400,
      engagements: 1230,
      clicks: 892,
      likes: 567,
      comments: 89,
      shares: 45,
    },
  },
  {
    id: "2",
    content: "Behind the scenes of our latest photoshoot. The team absolutely crushed it today!",
    platform: "instagram",
    date: "2024-10-18",
    metrics: {
      reach: 28500,
      impressions: 45600,
      engagements: 3420,
      clicks: 1203,
      likes: 2800,
      comments: 420,
      shares: 200,
    },
  },
  {
    id: "3",
    content: "Top 5 tips for boosting your LinkedIn engagement. Thread incoming...",
    platform: "twitter",
    date: "2024-10-15",
    metrics: {
      reach: 8900,
      impressions: 12300,
      engagements: 890,
      clicks: 456,
      likes: 523,
      comments: 234,
      shares: 133,
    },
  },
  {
    id: "4",
    content: "Our new collection is finally here! Check out the link in bio.",
    platform: "instagram",
    date: "2024-10-12",
    metrics: {
      reach: 45600,
      impressions: 67800,
      engagements: 5680,
      clicks: 2340,
      likes: 4200,
      comments: 890,
      shares: 590,
    },
  },
];

const platformIcons: Record<string, typeof Briefcase> = {
  linkedin: Briefcase,
  instagram: Camera,
  facebook: Users,
  twitter: X,
};

const platformColors: Record<string, string> = {
  linkedin: "#0077B5",
  instagram: "#E4405F",
  facebook: "#1877F2",
  twitter: "#000000",
};

const metricIcons: Record<string, typeof Eye> = {
  reach: Eye,
  impressions: Eye,
  engagements: Heart,
  clicks: TrendingUp,
  likes: Heart,
  comments: MessageCircle,
  shares: Share2,
};

export default function ComparePage() {
  const [selectedPosts, setSelectedPosts] = useState<string[]>(["1", "2"]);
  const [sortBy, setSortBy] = useState<keyof PostComparison["metrics"]>("engagements");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const toggleSelection = (id: string) => {
    setSelectedPosts((prev) => {
      if (prev.includes(id)) {
        return prev.filter((p) => p !== id);
      }
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const sortedPosts = [...posts].sort((a, b) => {
    const aVal = a.metrics[sortBy];
    const bVal = b.metrics[sortBy];
    return sortOrder === "desc" ? bVal - aVal : aVal - bVal;
  });

  const selectedPostData = posts.filter((p) => selectedPosts.includes(p.id));

  const maxMetrics = {
    reach: Math.max(...selectedPostData.map((p) => p.metrics.reach)),
    impressions: Math.max(...selectedPostData.map((p) => p.metrics.impressions)),
    engagements: Math.max(...selectedPostData.map((p) => p.metrics.engagements)),
    clicks: Math.max(...selectedPostData.map((p) => p.metrics.clicks)),
    likes: Math.max(...selectedPostData.map((p) => p.metrics.likes)),
    comments: Math.max(...selectedPostData.map((p) => p.metrics.comments)),
    shares: Math.max(...selectedPostData.map((p) => p.metrics.shares)),
  };

  return (
    <DashboardShell>
      <section className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#2e323d] mb-2">
          Performance Comparison
        </h2>
        <p className="text-[#5b5f6b] font-medium">
          Compare post performance side by side to understand what works best.
        </p>
      </section>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <Card className="p-4">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <GitCompare className="w-4 h-4" />
              Select Posts ({selectedPosts.length}/4)
            </h3>
            <div className="space-y-2">
              {posts.map((post) => {
                const Icon = platformIcons[post.platform] || Briefcase;
                const isSelected = selectedPosts.includes(post.id);
                return (
                  <button
                    key={post.id}
                    onClick={() => toggleSelection(post.id)}
                    className={cn(
                      "w-full p-3 rounded-xl text-left transition-all",
                      isSelected
                        ? "bg-[#d7e2ff] ring-2 ring-[#005cbb]"
                        : "bg-[#f3f3fb] hover:bg-[#e6e7f4]"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${platformColors[post.platform]}20` }}
                      >
                        <Icon
                          className="w-3 h-3"
                          style={{ color: platformColors[post.platform] }}
                        />
                      </div>
                      <span className="text-xs text-[#5b5f6b]">
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs line-clamp-2">{post.content}</p>
                  </button>
                );
              })}
            </div>
          </Card>
        </div>

        <div className="col-span-9 space-y-6">
          {selectedPosts.length >= 2 && (
            <Card className="p-6">
              <h3 className="text-lg font-bold tracking-tight mb-6">Side-by-Side Comparison</h3>

              <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${selectedPosts.length}, 1fr)` }}>
                {selectedPostData.map((post) => {
                  const Icon = platformIcons[post.platform] || Briefcase;
                  return (
                    <div key={post.id} className="space-y-4">
                      <div className="p-4 bg-[#f3f3fb] rounded-xl">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${platformColors[post.platform]}20` }}
                          >
                            <Icon
                              className="w-4 h-4"
                              style={{ color: platformColors[post.platform] }}
                            />
                          </div>
                          <span className="text-sm font-medium capitalize">{post.platform}</span>
                        </div>
                        <p className="text-sm line-clamp-3">{post.content}</p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-[#5b5f6b]">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {Object.entries(post.metrics).map(([key, value]) => {
                          const Icon = metricIcons[key] || Eye;
                          const maxVal = maxMetrics[key as keyof typeof maxMetrics];
                          const percentage = (value / maxVal) * 100;

                          return (
                            <div key={key}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-[#5b5f6b] capitalize flex items-center gap-1">
                                  <Icon className="w-3 h-3" />
                                  {key}
                                </span>
                                <span className="text-sm font-bold">{formatNumber(value)}</span>
                              </div>
                              <div className="h-2 bg-[#f3f3fb] rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#005cbb] rounded-full transition-all"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold tracking-tight">All Posts</h3>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[#5b5f6b]">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as keyof PostComparison["metrics"])}
                  className="bg-[#f3f3fb] border-none rounded-lg px-3 py-2 text-sm outline-none"
                >
                  <option value="reach">Reach</option>
                  <option value="engagements">Engagements</option>
                  <option value="clicks">Clicks</option>
                  <option value="likes">Likes</option>
                  <option value="comments">Comments</option>
                  <option value="shares">Shares</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                  className="p-2 rounded-lg bg-[#f3f3fb] hover:bg-[#e6e7f4] transition-colors"
                >
                  <TrendingUp className={cn("w-4 h-4", sortOrder === "asc" && "rotate-180")} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#aeb1bf]/20">
                    <th className="text-left py-3 px-4 text-xs font-bold text-[#5b5f6b] uppercase tracking-wider">
                      Post
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-bold text-[#5b5f6b] uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-[#5b5f6b] uppercase tracking-wider">
                      Reach
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-[#5b5f6b] uppercase tracking-wider">
                      Engagements
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-[#5b5f6b] uppercase tracking-wider">
                      CTR
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-bold text-[#5b5f6b] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPosts.map((post) => {
                    const Icon = platformIcons[post.platform] || Briefcase;
                    const ctr = ((post.metrics.clicks / post.metrics.reach) * 100).toFixed(1);
                    const isSelected = selectedPosts.includes(post.id);

                    return (
                      <tr
                        key={post.id}
                        className={cn(
                          "border-b border-[#aeb1bf]/10 transition-colors",
                          isSelected && "bg-[#d7e2ff]/20"
                        )}
                      >
                        <td className="py-4 px-4">
                          <p className="text-sm truncate max-w-[300px]">{post.content}</p>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: `${platformColors[post.platform]}20` }}
                            >
                              <Icon
                                className="w-4 h-4"
                                style={{ color: platformColors[post.platform] }}
                              />
                            </div>
                            <span className="text-sm font-medium capitalize">{post.platform}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-sm font-bold">{formatNumber(post.metrics.reach)}</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span className="text-sm font-bold">{formatNumber(post.metrics.engagements)}</span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <Badge variant={parseFloat(ctr) > 5 ? "success" : "neutral"}>
                            {ctr}%
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => toggleSelection(post.id)}
                              className={cn(
                                "p-2 rounded-lg transition-colors",
                                isSelected
                                  ? "bg-[#d7e2ff] text-[#005cbb]"
                                  : "hover:bg-[#f3f3fb]"
                              )}
                            >
                              <GitCompare className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
