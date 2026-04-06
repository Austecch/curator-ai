"use client";

import { useState, useEffect } from "react";
import { DashboardShell } from "@/components/layout";
import { Card, Badge, Button } from "@/components/ui";
import { useAuth } from "@/lib/hooks/useAuth";
import { usePosts } from "@/lib/hooks/usePosts";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Share,
  Camera,
  MessageCircle,
  Edit,
  Trash2,
  Briefcase,
  Users,
  X,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const platformIcons: Record<string, typeof Share> = {
  linkedin: Briefcase,
  instagram: Camera,
  facebook: Users,
  twitter: X,
  youtube: Play,
  reddit: MessageCircle,
};

const platformColors: Record<string, string> = {
  linkedin: "#0077B5",
  instagram: "#E4405F",
  facebook: "#1877F2",
  twitter: "#000000",
  youtube: "#FF0000",
  reddit: "#FF4500",
};

interface ScheduledPost {
  id: string;
  content: string;
  scheduled_at: string;
  platforms: string[];
}

export default function SchedulerPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { posts, loading: postsLoading, deletePost } = usePosts(user?.id || null);
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

  const scheduledPosts = posts.filter((post) => post.status === "scheduled" && post.scheduled_at);
  const upcomingPosts = scheduledPosts
    .filter((post) => new Date(post.scheduled_at!) > new Date())
    .sort((a, b) => new Date(a.scheduled_at!).getTime() - new Date(b.scheduled_at!).getTime())
    .slice(0, 5);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (number | null)[] = [];

    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  const getPostsForDay = (day: number) => {
    return scheduledPosts.filter((post) => {
      const postDate = new Date(post.scheduled_at!);
      return (
        postDate.getDate() === day &&
        postDate.getMonth() === currentDate.getMonth() &&
        postDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm("Are you sure you want to delete this scheduled post?")) {
      await deletePost(postId);
    }
  };

  if (authLoading || postsLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005cbb] mx-auto mb-4"></div>
            <p className="text-[#5b5f6b]">Loading scheduler...</p>
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

  return (
    <DashboardShell>
      <section className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#2e323d] mb-2">
            Scheduler
          </h2>
          <p className="text-[#5b5f6b] font-medium">
            Plan and manage your content calendar.
          </p>
        </div>
        <Link href="/create">
          <Button variant="primary">
            <Plus className="w-5 h-5 mr-2" />
            New Schedule
          </Button>
        </Link>
      </section>

      <div className="grid grid-cols-12 gap-8">
        <Card className="col-span-8 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold tracking-tight">
              {currentDate.toLocaleString("default", { month: "long", year: "numeric" })}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateMonth("prev")}
                className="p-2 rounded-lg hover:bg-[#f3f3fb] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#f3f3fb] transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => navigateMonth("next")}
                className="p-2 rounded-lg hover:bg-[#f3f3fb] transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekdays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-bold text-[#5b5f6b] uppercase tracking-wider py-2"
              >
                {day}
              </div>
            ))}

            {days.map((day, index) => {
              const isToday =
                day === today.getDate() &&
                currentDate.getMonth() === today.getMonth() &&
                currentDate.getFullYear() === today.getFullYear();

              const dayPosts = day ? getPostsForDay(day) : [];

              return (
                <div
                  key={index}
                  onClick={() => day && setSelectedDate(day)}
                  className={cn(
                    "min-h-[80px] p-2 rounded-lg transition-all cursor-pointer",
                    day === selectedDate
                      ? "bg-[#005cbb] text-white"
                      : "hover:bg-[#f3f3fb]",
                    !day && "bg-[#faf8fe]"
                  )}
                >
                  {day && (
                    <>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isToday && "bg-[#005cbb] text-white rounded-full w-7 h-7 flex items-center justify-center"
                        )}
                      >
                        {day}
                      </span>
                      {dayPosts.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-1 justify-center">
                          {dayPosts.slice(0, 3).map((post, i) => {
                            const platform = post.platforms?.[0] || "linkedin";
                            return (
                              <div
                                key={i}
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: platformColors[platform] || "#005cbb" }}
                              />
                            );
                          })}
                          {dayPosts.length > 3 && (
                            <span className="text-[8px]">+{dayPosts.length - 3}</span>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <div className="col-span-4 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold tracking-tight mb-4">Upcoming Posts</h3>
            {upcomingPosts.length > 0 ? (
              <div className="space-y-4">
                {upcomingPosts.map((post) => {
                  const platform = post.platforms?.[0] || "linkedin";
                  const Icon = platformIcons[platform] || Share;
                  const color = platformColors[platform] || "#005cbb";
                  const scheduledDate = new Date(post.scheduled_at!);
                  
                  return (
                    <div
                      key={post.id}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#f3f3fb] transition-colors group cursor-pointer"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${color}20` }}
                      >
                        <Icon className="w-5 h-5" style={{ color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{post.content.slice(0, 30)}...</p>
                        <div className="flex items-center gap-2 text-xs text-[#5b5f6b]">
                          <Clock className="w-3 h-3" />
                          {scheduledDate.toLocaleDateString()} {scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        <Link href={`/create?edit=${post.id}`}>
                          <button className="p-1.5 rounded-lg hover:bg-white transition-colors">
                            <Edit className="w-4 h-4 text-[#5b5f6b]" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleDeletePost(post.id)}
                          className="p-1.5 rounded-lg hover:bg-white transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-[#9f403d]" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-[#5b5f6b]">No upcoming posts</p>
                <Link href="/create" className="text-xs text-[#005cbb] hover:underline mt-2 inline-block">
                  Create your first scheduled post
                </Link>
              </div>
            )}
          </Card>

          <Card className="p-6 bg-[#d7e2ff]/30 border border-[#005cbb]/5">
            <h3 className="text-sm font-bold text-[#005cbb] mb-2">AI Recommendation</h3>
            <p className="text-xs text-[#0050a3] leading-relaxed">
              Based on your audience activity, posting at <span className="font-bold">6 PM on Thursday</span> could increase engagement by <span className="font-bold">18%</span>.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-bold tracking-tight mb-4">Best Times</h3>
            <div className="space-y-3">
              {[
                { day: "Thursday", time: "6:00 PM", boost: "+18%" },
                { day: "Tuesday", time: "10:00 AM", boost: "+12%" },
                { day: "Saturday", time: "2:00 PM", boost: "+8%" },
              ].map((slot) => (
                <div
                  key={slot.day}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#f3f3fb]"
                >
                  <div>
                    <p className="text-sm font-medium">{slot.day}</p>
                    <p className="text-xs text-[#5b5f6b]">{slot.time}</p>
                  </div>
                  <Badge variant="success">{slot.boost}</Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}