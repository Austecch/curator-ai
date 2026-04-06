import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/database";

interface BlotatoPlatformConfig {
  [platform: string]: {
    targetType: string;
    requiredFields: string[];
    optionalFields: string[];
  };
}

const PLATFORM_CONFIGS: BlotatoPlatformConfig = {
  twitter: {
    targetType: "twitter",
    requiredFields: [],
    optionalFields: [],
  },
  linkedin: {
    targetType: "linkedin",
    requiredFields: [],
    optionalFields: ["pageId"],
  },
  facebook: {
    targetType: "facebook",
    requiredFields: ["pageId"],
    optionalFields: ["mediaType", "link"],
  },
  instagram: {
    targetType: "instagram",
    requiredFields: [],
    optionalFields: ["mediaType", "altText", "collaborators", "coverImageUrl", "shareToFeed", "audioName"],
  },
  tiktok: {
    targetType: "tiktok",
    requiredFields: ["privacyLevel", "disabledComments", "disabledDuet", "disabledStitch", "isBrandedContent", "isYourBrand", "isAiGenerated"],
    optionalFields: ["title", "autoAddMusic", "isDraft", "imageCoverIndex", "videoCoverTimestamp"],
  },
  pinterest: {
    targetType: "pinterest",
    requiredFields: ["boardId"],
    optionalFields: ["title", "altText", "link"],
  },
  threads: {
    targetType: "threads",
    requiredFields: [],
    optionalFields: ["replyControl"],
  },
  bluesky: {
    targetType: "bluesky",
    requiredFields: [],
    optionalFields: [],
  },
  youtube: {
    targetType: "youtube",
    requiredFields: ["title", "privacyStatus", "shouldNotifySubscribers"],
    optionalFields: ["isMadeForKids", "containsSyntheticMedia"],
  },
};

interface PostOptions {
  scheduledTime?: string;
  useNextFreeSlot?: boolean;
}

interface PlatformOptions {
  [key: string]: any;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      user_id,
      content,
      platforms,
      scheduled_at,
      media_urls,
      aggregator_settings,
      account_ids,
      post_options,
      platform_options,
      thread_content,
    } = body;

    if (!user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServerClient();

    if (!aggregator_settings?.api_key || !aggregator_settings?.api_url) {
      return NextResponse.json({ error: "Aggregator not configured" }, { status: 400 });
    }

    const { api_key, api_url } = aggregator_settings;
    const isBlotato = api_url.includes("blotato");

    const publishResults = [];
    const errors = [];

    const options: PostOptions = {};
    if (scheduled_at) {
      options.scheduledTime = scheduled_at.includes("Z") ? scheduled_at : scheduled_at + "Z";
    } else if (post_options?.useNextFreeSlot) {
      options.useNextFreeSlot = true;
    }

    if (isBlotato && account_ids && account_ids.length > 0) {
      for (const account of account_ids) {
        const accountId = typeof account === "string" ? account : account.id;
        const platform = typeof account === "string" ? account : account.platform;
        const platformConfig = PLATFORM_CONFIGS[platform];

        if (!platformConfig) {
          errors.push({ platform, error: "Unsupported platform" });
          continue;
        }

        try {
          const target: any = {
            targetType: platformConfig.targetType,
          };

          const pOptions = platform_options?.[platform] || {};

          for (const field of platformConfig.requiredFields) {
            if (!pOptions[field]) {
              errors.push({ platform, error: `Missing required field: ${field}` });
              continue;
            }
            target[field] = pOptions[field];
          }

          for (const field of platformConfig.optionalFields) {
            if (pOptions[field] !== undefined) {
              target[field] = pOptions[field];
            }
          }

          const contentObj: any = {
            text: content,
            mediaUrls: media_urls || [],
            platform: platform,
          };

          if (thread_content && thread_content.length > 0) {
            contentObj.additionalPosts = thread_content.map((t: string) => ({
              text: t,
              mediaUrls: [],
            }));
          }

          const postData: any = {
            post: {
              accountId,
              content: contentObj,
              target,
            },
            ...options,
          };

          const response = await fetch(`${api_url}/posts`, {
            method: "POST",
            headers: {
              "blotato-api-key": api_key,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
          });

          const result = await response.json();

          if (response.ok) {
            publishResults.push({
              platform,
              accountId,
              success: true,
              postSubmissionId: result.postSubmissionId,
            });
          } else {
            errors.push({
              platform,
              error: result.message || result.error || "Failed to publish",
            });
          }
        } catch (platformError: any) {
          errors.push({
            platform,
            error: platformError.message,
          });
        }
      }
    } else if (isBlotato && !account_ids) {
      errors.push({
        platform: "all",
        error: "No account IDs provided. Please connect your social accounts in AI Settings.",
      });
    } else {
      for (const platform of platforms) {
        try {
          const response = await fetch(`${api_url}/posts`, {
            method: "POST",
            headers: {
              "blotato-api-key": api_key,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              post: {
                content: {
                  text: content,
                  mediaUrls: media_urls || [],
                  platform,
                },
                target: {
                  targetType: platform,
                },
              },
              ...options,
            }),
          });

          const result = await response.json();

          if (response.ok) {
            publishResults.push({
              platform,
              success: true,
              postSubmissionId: result.postSubmissionId,
            });
          } else {
            errors.push({
              platform,
              error: result.error || "Failed to publish",
            });
          }
        } catch (platformError: any) {
          errors.push({
            platform,
            error: platformError.message,
          });
        }
      }
    }

    const postStatus = scheduled_at || post_options?.useNextFreeSlot ? "scheduled" : "published";
    const { data: post, error: postError } = await supabase
      .from("posts")
      .insert({
        user_id,
        content,
        platforms,
        media_urls: media_urls || [],
        status: postStatus,
        scheduled_at: scheduled_at || null,
        published_at: postStatus === "published" ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (postError) {
      return NextResponse.json({ error: postError.message }, { status: 500 });
    }

    return NextResponse.json({
      post,
      published: publishResults,
      errors: errors.length > 0 ? errors : undefined,
      scheduled: scheduled_at || post_options?.useNextFreeSlot ? true : false,
    });
  } catch (error: any) {
    console.error("Publishing error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to publish post" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServerClient();

  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "scheduled")
    .lte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ posts: posts || [] });
}
