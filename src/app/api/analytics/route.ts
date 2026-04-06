import { NextResponse } from "next/server";

export async function GET() {
  const analytics = {
    total_reach: 1200000,
    reach_change: 12.4,
    total_engagements: 89500,
    engagement_change: 8.2,
    total_posts: 47,
    posts_this_month: 24,
    upcoming_posts: 4,
    connected_platforms: 8,
    weekly_data: [
      { day: "Mon", reach: 42000, engagement: 3200 },
      { day: "Tue", reach: 58000, engagement: 4100 },
      { day: "Wed", reach: 52000, engagement: 3800 },
      { day: "Thu", reach: 89000, engagement: 6200 },
      { day: "Fri", reach: 71000, engagement: 5100 },
      { day: "Sat", reach: 104000, engagement: 7800 },
      { day: "Sun", reach: 78000, engagement: 5600 },
    ],
    platform_breakdown: [
      { platform: "Instagram", followers: 45200, reach: 124000, engagement: 5.8 },
      { platform: "LinkedIn", followers: 12400, reach: 45000, engagement: 4.2 },
      { platform: "Facebook", followers: 8900, reach: 32000, engagement: 3.9 },
      { platform: "X (Twitter)", followers: 32100, reach: 28000, engagement: 2.1 },
      { platform: "TikTok", followers: 108000, reach: 456000, engagement: 8.2 },
    ],
  };

  return NextResponse.json(analytics);
}
