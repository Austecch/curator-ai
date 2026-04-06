"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout";
import { Card, Button, Badge } from "@/components/ui";
import {
  Smartphone,
  Monitor,
  Tablet,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Download,
  RefreshCw,
  Maximize2,
  X,
  Play,
} from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

const platforms = [
  { id: "linkedin", name: "LinkedIn", icon: Monitor, color: "#0077B5" },
  { id: "instagram", name: "Instagram", icon: Smartphone, color: "#E4405F" },
  { id: "facebook", name: "Facebook", icon: Tablet, color: "#1877F2" },
  { id: "twitter", name: "X (Twitter)", icon: Monitor, color: "#000000" },
];

export default function PreviewPage() {
  const [selectedPlatform, setSelectedPlatform] = useState("instagram");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showEngagement, setShowEngagement] = useState(false);

  const currentPlatform = platforms.find((p) => p.id === selectedPlatform) || platforms[0];
  const Icon = currentPlatform.icon;

  const engagementData = {
    views: 12400,
    likes: 890,
    comments: 124,
    shares: 45,
  };

  return (
    <DashboardShell>
      <section className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#2e323d] mb-2">
            Mobile Preview
          </h2>
          <p className="text-[#5b5f6b] font-medium">
            Preview how your post will look on different platforms.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={() => setIsFullscreen(true)}>
            <Maximize2 className="w-4 h-4 mr-2" />
            Fullscreen
          </Button>
        </div>
      </section>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-3">
          <Card className="p-4">
            <h3 className="font-bold mb-4">Platforms</h3>
            <div className="space-y-2">
              {platforms.map((platform) => {
                const PIcon = platform.icon;
                return (
                  <button
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform.id)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl transition-all",
                      selectedPlatform === platform.id
                        ? "bg-[#d7e2ff] border-2 border-[#005cbb]"
                        : "bg-[#f3f3fb] hover:bg-[#e6e7f4]"
                    )}
                  >
                    <PIcon className="w-5 h-5" style={{ color: platform.color }} />
                    <span className="font-medium">{platform.name}</span>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-4 mt-4">
            <h3 className="font-bold mb-4">Preview Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#5b5f6b]" />
                  <span className="text-sm">Views</span>
                </div>
                <span className="font-bold">{formatNumber(engagementData.views)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-[#5b5f6b]" />
                  <span className="text-sm">Likes</span>
                </div>
                <span className="font-bold">{formatNumber(engagementData.likes)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#5b5f6b]" />
                  <span className="text-sm">Comments</span>
                </div>
                <span className="font-bold">{formatNumber(engagementData.comments)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-[#5b5f6b]" />
                  <span className="text-sm">Shares</span>
                </div>
                <span className="font-bold">{formatNumber(engagementData.shares)}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-span-9">
          <div className="flex justify-center">
            {selectedPlatform === "instagram" && (
              <div className="w-[375px] bg-white rounded-[40px] border-8 border-black overflow-hidden shadow-2xl">
                <div className="p-4 flex items-center gap-3 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from purple-400 via-pink-500 to-orange-400 p-[2px]">
                    <div className="w-full h-full rounded-full bg-white p-[2px]">
                      <div className="w-full h-full rounded-full bg-[#E4405F] flex items-center justify-center text-white font-bold text-sm">
                        AR
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm">alex.rivers</p>
                    <p className="text-xs text-[#5b5f6b]">Sponsored</p>
                  </div>
                  <button className="text-[#5b5f6b]">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="6" r="2" />
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="12" cy="18" r="2" />
                    </svg>
                  </button>
                </div>

                <div className="aspect-square bg-gradient-to-br from-[#f3f3fb] to-[#e6e7f4] flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 rounded-full bg-[#d7e2ff] mx-auto mb-4 flex items-center justify-center">
                      <Smartphone className="w-12 h-12 text-[#005cbb]" />
                    </div>
                    <p className="text-sm text-[#5b5f6b]">Your image/video will appear here</p>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <Heart className="w-6 h-6" />
                    <MessageCircle className="w-6 h-6" />
                    <Share2 className="w-6 h-6" />
                    <Share2 className="w-6 h-6 ml-auto rotate-180" />
                  </div>
                  <p className="font-bold text-sm mb-2">{formatNumber(engagementData.likes)} likes</p>
                  <p className="text-sm">
                    <span className="font-bold">alex.rivers</span>{" "}
                    <span className="text-sm text-[#2e323d]">
                      Excited to announce our new product launch! 🚀 Check out the link in bio for more details.
                      #NewProduct #Innovation #Tech
                    </span>
                  </p>
                  <p className="text-xs text-[#5b5f6b] mt-2">2 hours ago</p>
                </div>

                <div className="p-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#f3f3fb]" />
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="flex-1 text-sm bg-transparent outline-none"
                    />
                    <button className="text-[#005cbb] font-bold text-sm">Post</button>
                  </div>
                </div>
              </div>
            )}

            {selectedPlatform === "linkedin" && (
              <div className="w-[550px] bg-white rounded-lg border border-[#aeb1bf]/30 overflow-hidden shadow-2xl">
                <div className="p-4 flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#0077B5] flex items-center justify-center text-white font-bold">
                    AR
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">Alex Rivers</p>
                    <p className="text-xs text-[#5b5f6b]">Product Manager at Company</p>
                    <p className="text-xs text-[#5b5f6b]">1h</p>
                  </div>
                </div>

                <div className="px-4 pb-4">
                  <p className="text-sm leading-relaxed">
                    Excited to announce our new product launch! 🚀
                    <br /><br />
                    After months of hard work, we're thrilled to share what our team has been building.
                    <br /><br />
                    #NewProduct #Innovation #Leadership
                  </p>
                </div>

                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-[#5b5f6b]">
                    <div className="w-5 h-5 rounded-full bg-[#0077B5] -ml-1" />
                    <div className="w-5 h-5 rounded-full bg-[#E4405F] -ml-2 border-2 border-white" />
                    <span>1,234 reactions</span>
                  </div>
                  <div className="text-xs text-[#5b5f6b]">234 comments • 56 shares</div>
                </div>

                <div className="px-4 py-2 border-t border-gray-100 flex justify-around">
                  {["Like", "Comment", "Share", "Send"].map((action) => (
                    <button key={action} className="flex items-center gap-1 text-sm text-[#5b5f6b] py-2 px-4 rounded-lg hover:bg-[#f3f3fb]">
                      {action === "Like" && <Heart className="w-4 h-4" />}
                      {action === "Comment" && <MessageCircle className="w-4 h-4" />}
                      {action === "Share" && <Share2 className="w-4 h-4" />}
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedPlatform === "facebook" && (
              <div className="w-[500px] bg-white rounded-lg border border-[#aeb1bf]/30 overflow-hidden shadow-2xl">
                <div className="p-4 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#1877F2] flex items-center justify-center text-white font-bold">
                    AR
                  </div>
                  <div className="flex-1">
                    <p className="font-bold">Alex Rivers</p>
                    <p className="text-xs text-[#5b5f6b]">2h • 🌴</p>
                  </div>
                  <button className="text-[#5b5f6b]">...</button>
                </div>

                <div className="px-4 pb-4">
                  <p className="text-sm leading-relaxed">
                    Excited to announce our new product launch! 🚀 Check it out!
                  </p>
                </div>

                <div className="aspect-video bg-gradient-to-br from-[#f3f3fb] to-[#e6e7f4] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-[#1877F2]/20 mx-auto mb-3 flex items-center justify-center">
                      <Play className="w-8 h-8 text-[#1877F2] ml-1" />
                    </div>
                    <p className="text-sm text-[#5b5f6b]">Video thumbnail</p>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between text-sm text-[#5b5f6b]">
                  <div className="flex items-center gap-1">
                    <div className="w-5 h-5 rounded-full bg-[#1877F2] flex items-center justify-center">
                      <Heart className="w-3 h-3 text-white" />
                    </div>
                    <span>2.5k</span>
                  </div>
                  <div>324 comments • 89 shares</div>
                </div>

                <div className="px-4 py-2 border-t border-gray-200 flex justify-around">
                  {["Like", "Comment", "Share"].map((action) => (
                    <button key={action} className="flex items-center gap-1 text-sm text-[#5b5f6b] py-2 px-8 rounded-lg hover:bg-[#f3f3fb]">
                      {action === "Like" && <Heart className="w-4 h-4" />}
                      {action === "Comment" && <MessageCircle className="w-4 h-4" />}
                      {action === "Share" && <Share2 className="w-4 h-4" />}
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="transform scale-150">
            {selectedPlatform === "instagram" && (
              <div className="w-[375px] bg-white rounded-[40px] border-8 border-white overflow-hidden">
                <div className="p-4 flex items-center gap-3 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-[#E4405F] flex items-center justify-center text-white font-bold text-sm">AR</div>
                  <div className="flex-1"><p className="font-bold text-sm">alex.rivers</p></div>
                </div>
                <div className="aspect-square bg-gradient-to-br from-[#f3f3fb] to-[#e6e7f4]" />
                <div className="p-4"><Heart className="w-6 h-6" /></div>
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardShell>
  );
}
