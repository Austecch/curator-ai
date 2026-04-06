export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  plan: "free" | "premium" | "enterprise";
  created_at: string;
}

export interface Platform {
  id: string;
  user_id: string;
  platform: "linkedin" | "facebook" | "twitter" | "instagram" | "youtube" | "tiktok" | "pinterest" | "reddit" | "threads";
  platform_name: string;
  platform_icon: string;
  access_token: string;
  refresh_token?: string;
  is_active: boolean;
  followers_count?: number;
  connected_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  media_urls: string[];
  platforms: string[];
  status: "draft" | "scheduled" | "published" | "failed";
  scheduled_at?: string;
  published_at?: string;
  analytics?: PostAnalytics;
  created_at: string;
  updated_at: string;
}

export interface PostAnalytics {
  reach: number;
  impressions: number;
  engagements: number;
  clicks: number;
  likes: number;
  comments: number;
  shares: number;
}

export interface ScheduledPost {
  id: string;
  post_id: string;
  platform: string;
  scheduled_at: string;
  status: "pending" | "published" | "failed";
  published_at?: string;
  error_message?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  is_read: boolean;
  created_at: string;
}

export interface AISettings {
  id: string;
  user_id: string;
  model: "claude-3-5-sonnet" | "claude-3-opus" | "claude-3-haiku";
  tone: "professional" | "casual" | "friendly" | "formal";
  max_tokens: number;
  temperature: number;
  content_style: string;
  banned_words: string[];
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_reach: number;
  reach_change: number;
  total_engagements: number;
  engagement_change: number;
  total_posts: number;
  posts_this_month: number;
  upcoming_posts: number;
  connected_platforms: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  date?: string;
}

export type PlatformType = Platform["platform"];

export interface CreatePostInput {
  content: string;
  media_urls?: string[];
  platforms: PlatformType[];
  scheduled_at?: string;
}

export interface GenerateContentInput {
  topic: string;
  platforms: PlatformType[];
  tone?: "professional" | "casual" | "friendly" | "formal";
  include_hashtags?: boolean;
  include_emoji?: boolean;
}
