"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout";
import { Card, Badge, Button } from "@/components/ui";
import {
  Plus,
  Check,
  X,
  Link2,
  Briefcase,
  Camera,
  Users,
  Play,
  Pin,
  MessageCircle,
  RefreshCw,
  Trash2,
  ExternalLink,
  Shield,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const allPlatforms = [
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Connect with professionals and grow your network",
    icon: Briefcase,
    color: "#0077B5",
    connected: true,
    followers: "12.4k",
    connectedAt: "2024-08-15",
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Share visual content and stories with your audience",
    icon: Camera,
    color: "#E4405F",
    connected: true,
    followers: "45.2k",
    connectedAt: "2024-08-15",
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Reach a broad audience with posts and pages",
    icon: Users,
    color: "#1877F2",
    connected: true,
    followers: "8.9k",
    connectedAt: "2024-09-01",
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    description: "Share updates and engage in real-time conversations",
    icon: X,
    color: "#000000",
    connected: false,
    followers: null,
    connectedAt: null,
  },
  {
    id: "youtube",
    name: "YouTube",
    description: "Share videos and grow your subscriber base",
    icon: Play,
    color: "#FF0000",
    connected: true,
    followers: "5.2k",
    connectedAt: "2024-09-10",
  },
  {
    id: "tiktok",
    name: "TikTok",
    description: "Create short-form video content for younger audiences",
    icon: Play,
    color: "#000000",
    connected: false,
    followers: null,
    connectedAt: null,
  },
  {
    id: "pinterest",
    name: "Pinterest",
    description: "Share and discover visual inspiration",
    icon: Pin,
    color: "#BD081C",
    connected: true,
    followers: "1.8k",
    connectedAt: "2024-09-15",
  },
  {
    id: "reddit",
    name: "Reddit",
    description: "Engage with communities and share content",
    icon: MessageCircle,
    color: "#FF4500",
    connected: false,
    followers: null,
    connectedAt: null,
  },
];

export default function PlatformsPage() {
  const [platforms, setPlatforms] = useState(allPlatforms);
  const [connecting, setConnecting] = useState<string | null>(null);

  const toggleConnection = async (platformId: string) => {
    setConnecting(platformId);
    
    setTimeout(() => {
      setPlatforms((prev) =>
        prev.map((p) =>
          p.id === platformId
            ? {
                ...p,
                connected: !p.connected,
                followers: !p.connected ? "0" : null,
                connectedAt: !p.connected ? new Date().toISOString().split("T")[0] : null,
              }
            : p
        )
      );
      setConnecting(null);
    }, 1500);
  };

  const connectedCount = platforms.filter((p) => p.connected).length;

  return (
    <DashboardShell>
      <section className="mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-[#2e323d] mb-2">
          Connected Platforms
        </h2>
        <p className="text-[#5b5f6b] font-medium">
          Manage your social media accounts and connections.
        </p>
      </section>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8">
          <div className="grid grid-cols-2 gap-6">
            {platforms.map((platform) => (
              <Card
                key={platform.id}
                variant={platform.connected ? "interactive" : "default"}
                className={cn(
                  "p-6 relative overflow-hidden",
                  !platform.connected && "opacity-75"
                )}
              >
                {platform.connected && (
                  <div
                    className="absolute top-0 left-0 w-1 h-full"
                    style={{ backgroundColor: platform.color }}
                  />
                )}

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${platform.color}20` }}
                    >
                      <platform.icon
                        className="w-6 h-6"
                        style={{ color: platform.color }}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold tracking-tight">{platform.name}</h3>
                      {platform.connected ? (
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="success" size="sm">Connected</Badge>
                          <span className="text-[10px] text-[#5b5f6b]">
                            {platform.followers} followers
                          </span>
                        </div>
                      ) : (
                        <p className="text-xs text-[#5b5f6b] mt-1 max-w-[200px]">
                          {platform.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {platform.connected && (
                  <div className="mt-4 pt-4 border-t border-[#aeb1bf]/15">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-[#5b5f6b]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Since {platform.connectedAt}
                        </span>
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Permissions granted
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-[#f3f3fb] transition-colors">
                          <RefreshCw className="w-4 h-4 text-[#5b5f6b]" />
                        </button>
                        <button
                          onClick={() => toggleConnection(platform.id)}
                          className="p-2 rounded-lg hover:bg-[#fe8983]/20 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-[#9f403d]" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {!platform.connected && (
                  <div className="mt-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="w-full"
                      onClick={() => toggleConnection(platform.id)}
                      isLoading={connecting === platform.id}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        <div className="col-span-4 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-bold tracking-tight mb-4">Connection Status</h3>
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="#f3f3fb"
                    strokeWidth="12"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    fill="none"
                    stroke="#005cbb"
                    strokeWidth="12"
                    strokeDasharray={`${(connectedCount / allPlatforms.length) * 352} 352`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold">{connectedCount}</span>
                  <span className="text-xs text-[#5b5f6b]">of {allPlatforms.length}</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-[#5b5f6b]">
                You have connected <span className="font-bold text-[#2e323d]">{connectedCount}</span> platform
                {connectedCount !== 1 ? "s" : ""}.
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-[#d7e2ff]/30 border border-[#005cbb]/5">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-[#005cbb]" />
              <h3 className="text-sm font-bold text-[#005cbb]">Secure Connections</h3>
            </div>
            <p className="text-xs text-[#0050a3] leading-relaxed">
              All connections use OAuth 2.0 for secure authentication. We never store your passwords.
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-bold tracking-tight mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#f3f3fb] hover:bg-[#e6e7f4] transition-colors text-left">
                <Link2 className="w-5 h-5 text-[#005cbb]" />
                <div>
                  <p className="text-sm font-medium">Reconnect All</p>
                  <p className="text-[10px] text-[#5b5f6b]">Refresh expired connections</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#f3f3fb] hover:bg-[#e6e7f4] transition-colors text-left">
                <ExternalLink className="w-5 h-5 text-[#005cbb]" />
                <div>
                  <p className="text-sm font-medium">Manage Permissions</p>
                  <p className="text-[10px] text-[#5b5f6b]">View platform permissions</p>
                </div>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
