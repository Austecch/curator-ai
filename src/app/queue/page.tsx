"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout";
import { Card, Badge, Button } from "@/components/ui";
import {
  ListOrdered,
  Plus,
  GripVertical,
  Play,
  Pause,
  Trash2,
  Clock,
  ArrowRight,
  Briefcase,
  Camera,
  Users,
  X,
  Edit,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QueuedPost {
  id: string;
  content: string;
  platforms: string[];
  scheduledTime: string;
  status: "queued" | "scheduled" | "published" | "paused";
  position: number;
}

const queuedPosts: QueuedPost[] = [
  {
    id: "1",
    content: "Excited to announce our new product line launching next month! Stay tuned for more details.",
    platforms: ["linkedin", "twitter"],
    scheduledTime: "2024-10-25T18:00:00",
    status: "queued",
    position: 1,
  },
  {
    id: "2",
    content: "Behind the scenes of our latest photoshoot. The team is working hard!",
    platforms: ["instagram", "facebook"],
    scheduledTime: "2024-10-26T10:00:00",
    status: "queued",
    position: 2,
  },
  {
    id: "3",
    content: "Pro tip: Consistency is key when growing your social media presence. Here's what worked for us...",
    platforms: ["linkedin", "twitter", "facebook"],
    scheduledTime: "2024-10-27T12:00:00",
    status: "queued",
    position: 3,
  },
  {
    id: "4",
    content: "Customer spotlight: See how @company transformed their workflow with our solution.",
    platforms: ["linkedin"],
    scheduledTime: "2024-10-28T09:00:00",
    status: "queued",
    position: 4,
  },
  {
    id: "5",
    content: "Happy Friday! What are your weekend plans? Let us know in the comments!",
    platforms: ["instagram", "facebook"],
    scheduledTime: "2024-10-28T16:00:00",
    status: "queued",
    position: 5,
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

export default function QueuePage() {
  const [posts, setPosts] = useState(queuedPosts);
  const [isQueueActive, setIsQueueActive] = useState(true);

  const moveUp = (id: string) => {
    setPosts((prev) => {
      const index = prev.findIndex((p) => p.id === id);
      if (index <= 0) return prev;
      const newPosts = [...prev];
      [newPosts[index - 1], newPosts[index]] = [newPosts[index], newPosts[index - 1]];
      return newPosts.map((p, i) => ({ ...p, position: i + 1 }));
    });
  };

  const moveDown = (id: string) => {
    setPosts((prev) => {
      const index = prev.findIndex((p) => p.id === id);
      if (index >= prev.length - 1) return prev;
      const newPosts = [...prev];
      [newPosts[index], newPosts[index + 1]] = [newPosts[index + 1], newPosts[index]];
      return newPosts.map((p, i) => ({ ...p, position: i + 1 }));
    });
  };

  const removeFromQueue = (id: string) => {
    setPosts((prev) =>
      prev.filter((p) => p.id !== id).map((p, i) => ({ ...p, position: i + 1 }))
    );
  };

  return (
    <DashboardShell>
      <section className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#2e323d] mb-2">
            Content Queue
          </h2>
          <p className="text-[#5b5f6b] font-medium">
            Manage your upcoming posts in a sequential queue.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={isQueueActive ? "secondary" : "primary"}
            onClick={() => setIsQueueActive(!isQueueActive)}
          >
            {isQueueActive ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause Queue
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Resume Queue
              </>
            )}
          </Button>
          <Button variant="primary">
            <Plus className="w-5 h-5 mr-2" />
            Add to Queue
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <ListOrdered className="w-5 h-5 text-[#005cbb]" />
                <h3 className="font-bold">Queue ({posts.length} posts)</h3>
              </div>
              {isQueueActive && (
                <Badge variant="success">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 mr-2 animate-pulse" />
                  Active
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              {posts.map((post, index) => (
                <div
                  key={post.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl transition-all",
                    "bg-[#f3f3fb] hover:bg-[#e6e7f4]",
                    !isQueueActive && "opacity-60"
                  )}
                >
                  <div className="cursor-move text-[#5b5f6b]">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#d7e2ff] text-[#005cbb] font-bold text-sm">
                    {post.position}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{post.content}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        {post.platforms.map((platform) => {
                          const Icon = platformIcons[platform] || Briefcase;
                          return (
                            <div
                              key={platform}
                              className="w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: `${platformColors[platform]}20` }}
                            >
                              <Icon
                                className="w-3 h-3"
                                style={{ color: platformColors[platform] }}
                              />
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#5b5f6b]">
                        <Clock className="w-3 h-3" />
                        {new Date(post.scheduledTime).toLocaleString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveUp(post.id)}
                      disabled={index === 0}
                      className="p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-30"
                    >
                      <ArrowRight className="w-4 h-4 rotate-[-90deg]" />
                    </button>
                    <button
                      onClick={() => moveDown(post.id)}
                      disabled={index === posts.length - 1}
                      className="p-2 rounded-lg hover:bg-white transition-colors disabled:opacity-30"
                    >
                      <ArrowRight className="w-4 h-4 rotate-90" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white transition-colors">
                      <Edit className="w-4 h-4 text-[#5b5f6b]" />
                    </button>
                    <button
                      onClick={() => removeFromQueue(post.id)}
                      className="p-2 rounded-lg hover:bg-[#fe8983]/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-[#9f403d]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="col-span-4 space-y-6">
          <Card className="p-6">
            <h3 className="font-bold mb-4">Queue Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[#5b5f6b]">Total in Queue</span>
                <span className="font-bold">{posts.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5b5f6b]">This Week</span>
                <span className="font-bold">{posts.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5b5f6b]">Next Post</span>
                <span className="font-bold text-[#005cbb]">
                  {posts[0] ? new Date(posts[0].scheduledTime).toLocaleDateString() : "-"}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4">Auto-Scheduler</h3>
            <p className="text-sm text-[#5b5f6b] mb-4">
              Automatically distribute posts throughout the week at optimal times.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Posts per day</span>
                <span className="font-bold">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Best times only</span>
                <Badge variant="success">On</Badge>
              </div>
              <Button variant="secondary" className="w-full mt-2">
                Configure Auto-Scheduler
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Import from CSV
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <ListOrdered className="w-4 h-4 mr-2" />
                Duplicate Week
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Trash2 className="w-4 h-4 mr-2 text-[#9f403d]" />
                Clear Queue
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
