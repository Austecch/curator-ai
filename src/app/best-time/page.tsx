"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout";
import { Card, Badge, Button } from "@/components/ui";
import {
  Plus,
  ArrowRight,
  Calendar,
  Clock,
  TrendingUp,
  Sparkles,
  Check,
  Briefcase,
  Camera,
  Users,
  X,
  MessageCircle,
} from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

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

interface OptimalTime {
  day: string;
  time: string;
  reach: string;
  engagement: string;
  platforms: string[];
}

const optimalTimes: OptimalTime[] = [
  {
    day: "Thursday",
    time: "6:00 PM",
    reach: "High",
    engagement: "+18%",
    platforms: ["linkedin", "instagram"],
  },
  {
    day: "Tuesday",
    time: "10:00 AM",
    reach: "Medium",
    engagement: "+12%",
    platforms: ["linkedin", "facebook"],
  },
  {
    day: "Saturday",
    time: "2:00 PM",
    reach: "High",
    engagement: "+15%",
    platforms: ["instagram", "facebook"],
  },
  {
    day: "Wednesday",
    time: "12:00 PM",
    reach: "Medium",
    engagement: "+8%",
    platforms: ["twitter", "linkedin"],
  },
  {
    day: "Monday",
    time: "9:00 AM",
    reach: "Low",
    engagement: "+5%",
    platforms: ["linkedin"],
  },
];

const weeklyHeatmap = [
  { day: "Mon", hours: [2, 1, 0, 0, 1, 2, 3, 4, 5, 4, 3, 2, 3, 4, 5, 4, 3, 4, 5, 4, 3, 2, 1, 1] },
  { day: "Tue", hours: [1, 1, 0, 0, 1, 3, 4, 5, 5, 4, 3, 2, 3, 4, 5, 5, 4, 5, 6, 5, 4, 3, 2, 1] },
  { day: "Wed", hours: [2, 1, 0, 0, 1, 2, 4, 5, 5, 4, 3, 3, 4, 5, 5, 4, 4, 5, 6, 5, 4, 3, 2, 1] },
  { day: "Thu", hours: [1, 1, 0, 0, 1, 3, 5, 6, 6, 5, 4, 3, 4, 5, 6, 6, 5, 6, 7, 6, 5, 4, 3, 2] },
  { day: "Fri", hours: [1, 1, 0, 0, 1, 2, 4, 5, 5, 4, 4, 3, 4, 5, 5, 4, 4, 5, 6, 5, 4, 3, 2, 1] },
  { day: "Sat", hours: [1, 1, 0, 0, 0, 1, 2, 3, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 4, 3, 2, 1, 1] },
  { day: "Sun", hours: [1, 1, 0, 0, 0, 1, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3, 2, 2, 1, 1] },
];

const maxEngagement = 7;

const audienceTimezones = [
  { name: "Eastern Time (ET)", percentage: 35 },
  { name: "Pacific Time (PT)", percentage: 22 },
  { name: "Central European Time (CET)", percentage: 18 },
  { name: "Other", percentage: 25 },
];

export default function BestTimePage() {
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedTime, setSelectedTime] = useState<OptimalTime | null>(null);

  const platforms = [
    { id: "all", name: "All Platforms" },
    { id: "linkedin", name: "LinkedIn" },
    { id: "instagram", name: "Instagram" },
    { id: "facebook", name: "Facebook" },
    { id: "twitter", name: "X (Twitter)" },
  ];

  const filteredTimes = optimalTimes.filter((t) =>
    selectedPlatform === "all" || t.platforms.includes(selectedPlatform)
  );

  const filteredHeatmap = weeklyHeatmap;

  const handleScheduleNow = (time: OptimalTime) => {
    setSelectedTime(time);
    setShowScheduler(true);
  };

  return (
    <DashboardShell>
      <section className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#2e323d] mb-2">
          Best Time to Post
        </h2>
        <p className="text-[#5b5f6b] font-medium">
          AI-powered optimal posting times based on your audience activity.
        </p>
      </section>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold tracking-tight">Optimal Posting Times</h3>
              <div className="flex gap-2">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform.id)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                      selectedPlatform === platform.id
                        ? "bg-[#005cbb] text-white"
                        : "bg-[#f3f3fb] text-[#5b5f6b] hover:bg-[#e6e7f4]"
                    )}
                  >
                    {platform.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredTimes.map((time, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#f3f3fb] hover:bg-[#e6e7f4] transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-[#005cbb]" />
                    </div>
                    <div>
                      <p className="font-bold">{time.day}</p>
                      <div className="flex items-center gap-2 text-sm text-[#5b5f6b]">
                        <Clock className="w-4 h-4" />
                        {time.time}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      {time.platforms.map((platform) => {
                        const Icon = platformIcons[platform] || Briefcase;
                        return (
                          <div
                            key={platform}
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${platformColors[platform]}20` }}
                          >
                            <Icon
                              className="w-4 h-4"
                              style={{ color: platformColors[platform] }}
                            />
                          </div>
                        );
                      })}
                    </div>

                    <Badge
                      variant={time.reach === "High" ? "success" : time.reach === "Medium" ? "warning" : "neutral"}
                    >
                      {time.reach} Reach
                    </Badge>

                    <div className="flex items-center gap-1 text-emerald-600 font-bold">
                      <TrendingUp className="w-4 h-4" />
                      {time.engagement}
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleScheduleNow(time)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Schedule
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold tracking-tight mb-4">Weekly Activity Heatmap</h3>
            <p className="text-sm text-[#5b5f6b] mb-6">Your audience's engagement patterns throughout the week</p>

            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="flex mb-2">
                  <div className="w-12" />
                  {Array.from({ length: 24 }, (_, i) => (
                    <div key={i} className="flex-1 text-center text-[10px] text-[#5b5f6b]">
                      {i % 4 === 0 ? `${i}:00` : ""}
                    </div>
                  ))}
                </div>

                {filteredHeatmap.map((row) => (
                  <div key={row.day} className="flex items-center mb-1">
                    <div className="w-12 text-sm font-medium text-[#5b5f6b]">{row.day}</div>
                    <div className="flex-1 flex gap-0.5">
                      {row.hours.map((value, hour) => (
                        <div
                          key={hour}
                          className={cn(
                            "flex-1 h-8 rounded-sm transition-all cursor-pointer hover:ring-2 hover:ring-[#005cbb]",
                            value === 0 && "bg-[#f3f3fb]",
                            value === 1 && "bg-[#d7e2ff]",
                            value === 2 && "bg-[#a8c7fa]",
                            value === 3 && "bg-[#7eb8ff]",
                            value === 4 && "bg-[#4a9eff]",
                            value === 5 && "bg-[#1a85ff]",
                            value === 6 && "bg-[#0066ff]",
                            value === 7 && "bg-[#005cbb]"
                          )}
                          title={`${row.day} ${hour}:00 - Engagement: ${value}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-end mt-4 gap-2">
                  <span className="text-xs text-[#5b5f6b]">Low</span>
                  <div className="w-4 h-4 rounded-sm bg-[#f3f3fb]" />
                  <div className="w-4 h-4 rounded-sm bg-[#d7e2ff]" />
                  <div className="w-4 h-4 rounded-sm bg-[#7eb8ff]" />
                  <div className="w-4 h-4 rounded-sm bg-[#4a9eff]" />
                  <div className="w-4 h-4 rounded-sm bg-[#1a85ff]" />
                  <div className="w-4 h-4 rounded-sm bg-[#005cbb]" />
                  <span className="text-xs text-[#5b5f6b]">High</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-span-4 space-y-6">
          <Card className="p-6 bg-gradient-to-br from-[#005cbb] to-[#003e81] text-white">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6" />
              <h3 className="text-lg font-bold">AI Insight</h3>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              Based on your audience in <span className="font-bold">4 time zones</span>, 
              posting between <span className="font-bold">6-8 PM</span> on weekdays captures 
              the <span className="font-bold">peak engagement window</span> across all platforms.
            </p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-xs opacity-80">
                Updated daily using machine learning
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-bold tracking-tight mb-4">Audience Time Zones</h3>
            <div className="space-y-4">
              {audienceTimezones.map((tz) => (
                <div key={tz.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">{tz.name}</span>
                    <span className="text-sm font-bold">{tz.percentage}%</span>
                  </div>
                  <div className="h-2 bg-[#f3f3fb] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#005cbb] rounded-full transition-all"
                      style={{ width: `${tz.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-bold tracking-tight mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full justify-start">
                <Calendar className="w-4 h-4 mr-2" />
                View Full Calendar
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-2" />
                Set Reminders
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <TrendingUp className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {showScheduler && selectedTime && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-md p-6 m-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Schedule Post</h3>
              <button
                onClick={() => setShowScheduler(false)}
                className="p-2 rounded-lg hover:bg-[#f3f3fb] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#d7e2ff]/30 rounded-xl mb-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-[#005cbb]" />
                <div>
                  <p className="font-bold">{selectedTime.day} at {selectedTime.time}</p>
                  <p className="text-sm text-[#5b5f6b]">
                    Expected engagement: <span className="text-emerald-600 font-bold">{selectedTime.engagement}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#5b5f6b] uppercase tracking-wider mb-2">
                  Post Content
                </label>
                <textarea
                  placeholder="What's on your mind?"
                  className="w-full bg-[#f3f3fb] border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-[#005cbb]/20 outline-none h-32 resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                {selectedTime.platforms.map((platform) => {
                  const Icon = platformIcons[platform] || Briefcase;
                  return (
                    <div
                      key={platform}
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${platformColors[platform]}20` }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{ color: platformColors[platform] }}
                      />
                    </div>
                  );
                })}
              </div>

              <Button variant="primary" className="w-full">
                <Check className="w-4 h-4 mr-2" />
                Schedule for {selectedTime.day} {selectedTime.time}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </DashboardShell>
  );
}
