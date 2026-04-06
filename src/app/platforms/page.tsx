"use client";

import { useState } from "react";
import { DashboardShell } from "@/components/layout";
import { Card, Badge, Button } from "@/components/ui";
import { useAuth } from "@/lib/hooks/useAuth";
import { usePlatforms } from "@/lib/hooks/usePlatforms";
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
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PlatformOption {
  id: string;
  name: string;
  description: string;
  icon: typeof Briefcase;
  color: string;
}

const allPlatformOptions: PlatformOption[] = [
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Connect with professionals and grow your network",
    icon: Briefcase,
    color: "#0077B5",
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Share visual content and stories with your audience",
    icon: Camera,
    color: "#E4405F",
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Reach a broad audience with posts and pages",
    icon: Users,
    color: "#1877F2",
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    description: "Share updates and engage in real-time conversations",
    icon: X,
    color: "#000000",
  },
  {
    id: "youtube",
    name: "YouTube",
    description: "Share videos and grow your subscriber base",
    icon: Play,
    color: "#FF0000",
  },
  {
    id: "tiktok",
    name: "TikTok",
    description: "Create short-form video content for younger audiences",
    icon: Play,
    color: "#000000",
  },
  {
    id: "pinterest",
    name: "Pinterest",
    description: "Share and discover visual inspiration",
    icon: Pin,
    color: "#BD081C",
  },
  {
    id: "reddit",
    name: "Reddit",
    description: "Engage with communities and share content",
    icon: MessageCircle,
    color: "#FF4500",
  },
];

export default function PlatformsPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { platforms, loading: platformsLoading, addPlatform, removePlatform, refreshPlatform } = usePlatforms(user?.id || null);
  
  const [connecting, setConnecting] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  const isPlatformConnected = (platformId: string) => {
    return platforms.some(p => p.platform === platformId && p.is_active);
  };

  const getConnectedPlatform = (platformId: string) => {
    return platforms.find(p => p.platform === platformId);
  };

  const handleConnect = async (platformId: string) => {
    setConnecting(platformId);
    
    try {
      const platform = allPlatformOptions.find(p => p.id === platformId);
      if (!platform) return;

      await addPlatform({
        platform: platformId as "linkedin" | "facebook" | "twitter" | "instagram" | "youtube" | "tiktok" | "pinterest" | "reddit" | "threads",
        platform_name: platform.name,
        access_token: `mock_token_${Date.now()}`,
        is_active: true,
        followers_count: Math.floor(Math.random() * 50000) + 1000,
      });
    } catch (error) {
      console.error("Failed to connect platform:", error);
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (platformId: string) => {
    const connectedPlatform = getConnectedPlatform(platformId);
    if (!connectedPlatform) return;

    if (!confirm(`Are you sure you want to disconnect ${allPlatformOptions.find(p => p.id === platformId)?.name}?`)) {
      return;
    }

    setDisconnecting(platformId);
    try {
      await removePlatform(connectedPlatform.id);
    } catch (error) {
      console.error("Failed to disconnect platform:", error);
    } finally {
      setDisconnecting(null);
    }
  };

  const handleRefresh = async (platformId: string) => {
    const connectedPlatform = getConnectedPlatform(platformId);
    if (!connectedPlatform) return;

    try {
      await refreshPlatform(connectedPlatform.id, {
        followers_count: Math.floor(Math.random() * 50000) + 1000,
      });
    } catch (error) {
      console.error("Failed to refresh platform:", error);
    }
  };

  const connectedCount = platforms.filter(p => p.is_active).length;

  if (authLoading || platformsLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#005cbb] mx-auto mb-4"></div>
            <p className="text-[#5b5f6b]">Loading platforms...</p>
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
            {allPlatformOptions.map((platformOption) => {
              const isConnected = isPlatformConnected(platformOption.id);
              const connectedPlatform = getConnectedPlatform(platformOption.id);
              
              return (
                <Card
                  key={platformOption.id}
                  variant={isConnected ? "interactive" : "default"}
                  className={cn(
                    "p-6 relative overflow-hidden",
                    !isConnected && "opacity-75"
                  )}
                >
                  {isConnected && (
                    <div
                      className="absolute top-0 left-0 w-1 h-full"
                      style={{ backgroundColor: platformOption.color }}
                    />
                  )}

                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${platformOption.color}20` }}
                      >
                        <platformOption.icon
                          className="w-6 h-6"
                          style={{ color: platformOption.color }}
                        />
                      </div>
                      <div>
                        <h3 className="font-bold tracking-tight">{platformOption.name}</h3>
                        {isConnected && connectedPlatform ? (
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="success" size="sm">Connected</Badge>
                            <span className="text-[10px] text-[#5b5f6b]">
                              {connectedPlatform.followers_count 
                                ? connectedPlatform.followers_count >= 1000 
                                  ? `${(connectedPlatform.followers_count / 1000).toFixed(1)}k`
                                  : connectedPlatform.followers_count
                                : 0} followers
                            </span>
                          </div>
                        ) : (
                          <p className="text-xs text-[#5b5f6b] mt-1 max-w-[200px]">
                            {platformOption.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {isConnected && connectedPlatform && (
                    <div className="mt-4 pt-4 border-t border-[#aeb1bf]/15">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-[#5b5f6b]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Since {new Date(connectedPlatform.connected_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Permissions granted
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleRefresh(platformOption.id)}
                            className="p-2 rounded-lg hover:bg-[#f3f3fb] transition-colors"
                          >
                            <RefreshCw className="w-4 h-4 text-[#5b5f6b]" />
                          </button>
                          <button
                            onClick={() => handleDisconnect(platformOption.id)}
                            disabled={disconnecting === platformOption.id}
                            className="p-2 rounded-lg hover:bg-[#fe8983]/20 transition-colors disabled:opacity-50"
                          >
                            {disconnecting === platformOption.id ? (
                              <Loader2 className="w-4 h-4 text-[#9f403d] animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4 text-[#9f403d]" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {!isConnected && (
                    <div className="mt-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full"
                        onClick={() => handleConnect(platformOption.id)}
                        disabled={connecting === platformOption.id}
                        isLoading={connecting === platformOption.id}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
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
                    strokeDasharray={`${(connectedCount / allPlatformOptions.length) * 352} 352`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold">{connectedCount}</span>
                  <span className="text-xs text-[#5b5f6b]">of {allPlatformOptions.length}</span>
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