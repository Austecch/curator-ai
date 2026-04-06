"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/database";
import type { Post } from "@/types";

export function usePosts(userId: string | null) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPosts = useCallback(async () => {
    if (!userId) {
      setPosts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data as Post[] || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createPost = async (post: Partial<Post>) => {
    if (!userId) return { error: new Error("Not authenticated") };

    const { data, error } = await supabase
      .from("posts")
      .insert({
        user_id: userId,
        content: post.content,
        media_urls: post.media_urls || [],
        platforms: post.platforms || [],
        status: post.status || "draft",
        scheduled_at: post.scheduled_at || null,
      })
      .select()
      .single();

    if (!error && data) {
      setPosts((prev) => [data as Post, ...prev]);
    }

    return { data: data as Post | null, error };
  };

  const updatePost = async (postId: string, updates: Partial<Post>) => {
    const { data, error } = await supabase
      .from("posts")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", postId)
      .select()
      .single();

    if (!error && data) {
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? (data as Post) : p))
      );
    }

    return { data: data as Post | null, error };
  };

  const deletePost = async (postId: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (!error) {
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    }

    return { error };
  };

  return {
    posts,
    loading,
    error,
    createPost,
    updatePost,
    deletePost,
    refetch: fetchPosts,
  };
}
