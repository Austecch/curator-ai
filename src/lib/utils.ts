import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const d = new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function getPercentageChange(current: number, previous: number): number {
  if (previous === 0) return 100;
  return Math.round(((current - previous) / previous) * 100);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    linkedin: "#0077B5",
    facebook: "#1877F2",
    twitter: "#000000",
    instagram: "#E4405F",
    youtube: "#FF0000",
    tiktok: "#000000",
    pinterest: "#BD081C",
    reddit: "#FF4500",
    threads: "#000000",
  };
  return colors[platform.toLowerCase()] || "#777a87";
}

export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    linkedin: "briefcase",
    facebook: "users",
    twitter: "x",
    instagram: "camera",
    youtube: "play",
    tiktok: "music",
    pinterest: "pin",
    reddit: "message-circle",
    threads: "at-sign",
  };
  return icons[platform.toLowerCase()] || "share";
}
