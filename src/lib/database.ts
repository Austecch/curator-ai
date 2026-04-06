import { createClient } from "@supabase/supabase-js";
import type { Post, Platform, Notification, User, AISettings, ScheduledPost } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Auth Helpers
export async function signUp(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  return { data, user: data.user, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, session: data.session, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { error };
}

// Profile Helpers
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  return { data, error };
}

export async function updateProfile(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();
  return { data, error };
}

// Posts Helpers
export async function getPosts(userId: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return { data: data as Post[] | null, error };
}

export async function getPost(postId: string) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", postId)
    .single();
  return { data: data as Post | null, error };
}

export async function createPost(userId: string, post: Partial<Post>) {
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
  return { data: data as Post | null, error };
}

export async function updatePost(postId: string, updates: Partial<Post>) {
  const { data, error } = await supabase
    .from("posts")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", postId)
    .select()
    .single();
  return { data: data as Post | null, error };
}

export async function deletePost(postId: string) {
  const { error } = await supabase.from("posts").delete().eq("id", postId);
  return { error };
}

export async function publishPost(postId: string) {
  return updatePost(postId, {
    status: "published",
    published_at: new Date().toISOString(),
  });
}

// Scheduled Posts Helpers
export async function getScheduledPosts(userId: string) {
  const { data, error } = await supabase
    .from("scheduled_posts")
    .select(`
      *,
      post:posts(*)
    `)
    .eq("post.user_id", userId)
    .order("scheduled_at", { ascending: true });
  return { data: data as (ScheduledPost & { post: Post })[] | null, error };
}

export async function schedulePost(postId: string, platform: string, scheduledAt: string) {
  const { data, error } = await supabase
    .from("scheduled_posts")
    .insert({
      post_id: postId,
      platform,
      scheduled_at: scheduledAt,
      status: "pending",
    })
    .select()
    .single();
  return { data: data as ScheduledPost | null, error };
}

// Platforms Helpers
export async function getPlatforms(userId: string) {
  const { data, error } = await supabase
    .from("platforms")
    .select("*")
    .eq("user_id", userId)
    .order("connected_at", { ascending: false });
  return { data: data as Platform[] | null, error };
}

export async function connectPlatform(userId: string, platform: Omit<Platform, "id" | "user_id" | "connected_at">) {
  const { data, error } = await supabase
    .from("platforms")
    .insert({
      user_id: userId,
      platform: platform.platform,
      platform_name: platform.platform_name,
      platform_icon: platform.platform_icon,
      access_token: platform.access_token,
      refresh_token: platform.refresh_token,
      is_active: true,
    })
    .select()
    .single();
  return { data: data as Platform | null, error };
}

export async function disconnectPlatform(platformId: string) {
  const { error } = await supabase.from("platforms").delete().eq("id", platformId);
  return { error };
}

export async function togglePlatformStatus(platformId: string, isActive: boolean) {
  const { data, error } = await supabase
    .from("platforms")
    .update({ is_active: isActive })
    .eq("id", platformId)
    .select()
    .single();
  return { data: data as Platform | null, error };
}

// Notifications Helpers
export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return { data: data as Notification[] | null, error };
}

export async function markNotificationRead(notificationId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .select()
    .single();
  return { data: data as Notification | null, error };
}

export async function markAllNotificationsRead(userId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId);
  return { error };
}

export async function deleteNotification(notificationId: string) {
  const { error } = await supabase
    .from("notifications")
    .delete()
    .eq("id", notificationId);
  return { error };
}

// AI Settings Helpers
export async function getAISettings(userId: string) {
  const { data, error } = await supabase
    .from("ai_settings")
    .select("*")
    .eq("user_id", userId)
    .single();
  return { data: data as AISettings | null, error };
}

export async function updateAISettings(userId: string, updates: Partial<AISettings>) {
  const { data, error } = await supabase
    .from("ai_settings")
    .upsert({
      user_id: userId,
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  return { data: data as AISettings | null, error };
}

// Real-time subscriptions
export function subscribeToPosts(userId: string, callback: (posts: Post[]) => void) {
  return supabase
    .channel("posts")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "posts",
        filter: `user_id=eq.${userId}`,
      },
      () => {
        getPosts(userId).then(({ data }) => data && callback(data));
      }
    )
    .subscribe();
}

export function subscribeToNotifications(userId: string, callback: (notifications: Notification[]) => void) {
  return supabase
    .channel("notifications")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${userId}`,
      },
      () => {
        getNotifications(userId).then(({ data }) => data && callback(data));
      }
    )
    .subscribe();
}
