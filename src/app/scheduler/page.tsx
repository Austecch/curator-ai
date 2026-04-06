"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout";
import { Card, Badge, Button } from "@/components/ui";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const scheduledPosts = [
  { id: "1", title: "Q3 Strategy Update", time: "14:45", platform: "linkedin", icon: Share, color: "#0077B5" },
  { id: "2", title: "New Collection Reel", time: "10:00", platform: "instagram", icon: Camera, color: "#E4405F" },
  { id: "3", title: "Community Poll: AI Future", time: "16:15", platform: "twitter", icon: MessageCircle, color: "#000000" },
  { id: "4", title: "Product Launch Teaser", time: "09:00", platform: "facebook", icon: Share, color: "#1877F2" },
];

export default function SchedulerPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);

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
        <Button variant="primary">
          <Plus className="w-5 h-5 mr-2" />
          New Schedule
        </Button>
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
                      {day === 25 && (
                        <div className="mt-1">
                          <div className="w-2 h-2 rounded-full bg-[#E4405F] mx-auto" />
                        </div>
                      )}
                      {day === 26 && (
                        <div className="mt-1">
                          <div className="w-2 h-2 rounded-full bg-[#0077B5] mx-auto" />
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
            <div className="space-y-4">
              {scheduledPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#f3f3fb] transition-colors group cursor-pointer"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${post.color}20` }}
                  >
                    <post.icon className="w-5 h-5" style={{ color: post.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{post.title}</p>
                    <div className="flex items-center gap-2 text-xs text-[#5b5f6b]">
                      <Clock className="w-3 h-3" />
                      {post.time}
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-white transition-colors">
                      <Edit className="w-4 h-4 text-[#5b5f6b]" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-white transition-colors">
                      <Trash2 className="w-4 h-4 text-[#9f403d]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
