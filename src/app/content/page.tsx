"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout";
import { Card, Badge, Button } from "@/components/ui";
import {
  Search,
  Filter,
  Grid3x3,
  List,
  MoreVertical,
  Edit,
  Copy,
  Trash2,
  Share,
  Calendar,
  Briefcase,
  Camera,
  Users,
  X,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";

const posts = [
  {
    id: "1",
    content: "Excited to announce our Q3 product roadmap! We've been working tirelessly to bring you features that will transform how you manage social media.",
    platforms: ["linkedin", "twitter"],
    status: "published",
    publishedAt: "2024-10-20T14:30:00",
    analytics: { reach: 12400, engagements: 890 },
  },
  {
    id: "2",
    content: "Behind the scenes of our latest photoshoot. The team absolutely crushed it today!",
    platforms: ["instagram", "facebook"],
    status: "scheduled",
    scheduledAt: "2024-10-25T10:00:00",
    analytics: null,
  },
  {
    id: "3",
    content: "Top 5 tips for boosting your LinkedIn engagement. Thread incoming...",
    platforms: ["linkedin", "twitter"],
    status: "draft",
    publishedAt: null,
    analytics: null,
  },
  {
    id: "4",
    content: "Our new collection is finally here! Check out the link in bio.",
    platforms: ["instagram", "tiktok"],
    status: "published",
    publishedAt: "2024-10-18T09:00:00",
    analytics: { reach: 45600, engagements: 3420 },
  },
  {
    id: "5",
    content: "Community spotlight: Meet Sarah, our head of product design.",
    platforms: ["linkedin"],
    status: "published",
    publishedAt: "2024-10-15T16:00:00",
    analytics: { reach: 8900, engagements: 567 },
  },
];

const platformIcons: Record<string, typeof Briefcase> = {
  linkedin: Briefcase,
  instagram: Camera,
  facebook: Users,
  twitter: X,
  tiktok: Play,
};

export default function ContentPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter((post) => {
    if (filter !== "all" && post.status !== filter) return false;
    if (searchQuery && !post.content.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge variant="success">Published</Badge>;
      case "scheduled":
        return <Badge variant="primary">Scheduled</Badge>;
      case "draft":
        return <Badge variant="neutral">Draft</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <DashboardShell>
      <section className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#2e323d] mb-2">
          Content Library
        </h2>
        <p className="text-[#5b5f6b] font-medium">
          Manage all your posts, drafts, and scheduled content in one place.
        </p>
      </section>

      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#5b5f6b]/60" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f3f3fb] border-none rounded-full py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-[#005cbb]/20 outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#f3f3fb] rounded-xl p-1">
            {["all", "published", "scheduled", "draft"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all",
                  filter === status
                    ? "bg-white shadow-sm text-[#2e323d]"
                    : "text-[#5b5f6b] hover:text-[#2e323d]"
                )}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex bg-[#f3f3fb] rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === "grid" ? "bg-white shadow-sm" : ""
              )}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === "list" ? "bg-white shadow-sm" : ""
              )}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Card key={post.id} variant="interactive" className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {post.platforms.map((platform) => {
                    const Icon = platformIcons[platform] || Briefcase;
                    return (
                      <div
                        key={platform}
                        className="w-6 h-6 rounded-full bg-[#f3f3fb] flex items-center justify-center"
                      >
                        <Icon className="w-3 h-3 text-[#5b5f6b]" />
                      </div>
                    );
                  })}
                </div>
                {getStatusBadge(post.status)}
              </div>

              <p className="text-sm text-[#2e323d] line-clamp-3 mb-4">
                {post.content}
              </p>

              {post.analytics && (
                <div className="flex items-center gap-4 text-xs text-[#5b5f6b] mb-4">
                  <span>Reach: {post.analytics.reach.toLocaleString()}</span>
                  <span>Eng: {post.analytics.engagements.toLocaleString()}</span>
                </div>
              )}

              {post.scheduledAt && (
                <div className="flex items-center gap-2 text-xs text-[#5b5f6b] mb-4">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.scheduledAt).toLocaleString()}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-[#aeb1bf]/15">
                <span className="text-[10px] text-[#5b5f6b]">
                  {post.publishedAt
                    ? `Published ${new Date(post.publishedAt).toLocaleDateString()}`
                    : post.scheduledAt
                    ? `Scheduled ${new Date(post.scheduledAt).toLocaleDateString()}`
                    : "Draft"}
                </span>
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-lg hover:bg-[#f3f3fb] transition-colors">
                    <Edit className="w-4 h-4 text-[#5b5f6b]" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-[#f3f3fb] transition-colors">
                    <Copy className="w-4 h-4 text-[#5b5f6b]" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-[#f3f3fb] transition-colors">
                    <Share className="w-4 h-4 text-[#5b5f6b]" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-[#f3f3fb] transition-colors">
                    <Trash2 className="w-4 h-4 text-[#9f403d]" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="p-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 w-32">
                  {post.platforms.map((platform) => {
                    const Icon = platformIcons[platform] || Briefcase;
                    return (
                      <div
                        key={platform}
                        className="w-8 h-8 rounded-full bg-[#f3f3fb] flex items-center justify-center"
                      >
                        <Icon className="w-4 h-4 text-[#5b5f6b]" />
                      </div>
                    );
                  })}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#2e323d] truncate">{post.content}</p>
                </div>

                <div className="w-32">
                  {getStatusBadge(post.status)}
                </div>

                <div className="w-32 text-sm text-[#5b5f6b]">
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString()
                    : post.scheduledAt
                    ? new Date(post.scheduledAt).toLocaleDateString()
                    : "-"}
                </div>

                {post.analytics && (
                  <div className="w-40 flex items-center gap-4 text-sm text-[#5b5f6b]">
                    <span>Reach: {post.analytics.reach.toLocaleString()}</span>
                    <span>Eng: {post.analytics.engagements}</span>
                  </div>
                )}

                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-lg hover:bg-[#f3f3fb] transition-colors">
                    <Edit className="w-4 h-4 text-[#5b5f6b]" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-[#f3f3fb] transition-colors">
                    <Copy className="w-4 h-4 text-[#5b5f6b]" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-[#f3f3fb] transition-colors">
                    <Trash2 className="w-4 h-4 text-[#9f403d]" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
