"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/database";
import type { Platform } from "@/types";

export function usePlatforms(userId: string | null) {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPlatforms = useCallback(async () => {
    if (!userId) {
      setPlatforms([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("platforms")
        .select("*")
        .eq("user_id", userId)
        .order("connected_at", { ascending: false });

      if (error) throw error;
      setPlatforms(data as Platform[] || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPlatforms();
  }, [fetchPlatforms]);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("platforms-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "platforms",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          fetchPlatforms();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchPlatforms]);

  const connectPlatform = async (platformData: Omit<Platform, "id" | "user_id" | "connected_at">) => {
    if (!userId) return { error: new Error("Not authenticated") };

    const { data, error } = await supabase
      .from("platforms")
      .insert({
        user_id: userId,
        platform: platformData.platform,
        platform_name: platformData.platform_name,
        platform_icon: platformData.platform_icon,
        access_token: platformData.access_token,
        refresh_token: platformData.refresh_token,
        is_active: true,
      })
      .select()
      .single();

    if (!error && data) {
      setPlatforms((prev) => [data as Platform, ...prev]);
    }

    return { data: data as Platform | null, error };
  };

  const disconnectPlatform = async (platformId: string) => {
    const { error } = await supabase.from("platforms").delete().eq("id", platformId);

    if (!error) {
      setPlatforms((prev) => prev.filter((p) => p.id !== platformId));
    }

    return { error };
  };

  const togglePlatformStatus = async (platformId: string, isActive: boolean) => {
    const { data, error } = await supabase
      .from("platforms")
      .update({ is_active: isActive })
      .eq("id", platformId)
      .select()
      .single();

    if (!error && data) {
      setPlatforms((prev) =>
        prev.map((p) => (p.id === platformId ? { ...p, is_active: isActive } : p))
      );
    }

    return { data: data as Platform | null, error };
  };

  const connectedPlatforms = platforms.filter((p) => p.is_active);
  const activePlatformsCount = connectedPlatforms.length;

  return {
    platforms,
    connectedPlatforms,
    activePlatformsCount,
    loading,
    error,
    connectPlatform,
    disconnectPlatform,
    togglePlatformStatus,
    refetch: fetchPlatforms,
  };
}
