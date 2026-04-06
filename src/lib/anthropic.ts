import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function generateContent(params: {
  topic: string;
  platforms: string[];
  tone?: "professional" | "casual" | "friendly" | "formal";
  includeHashtags?: boolean;
  includeEmoji?: boolean;
  existingContent?: string;
  platformOptimized?: boolean;
}) {
  const {
    topic,
    platforms,
    tone = "professional",
    includeHashtags = true,
    includeEmoji = false,
    existingContent,
    platformOptimized = true,
  } = params;

  const platformContext = platforms.length > 1
    ? `Adapt the content for each platform: ${platforms.join(", ")}. Use platform-appropriate formatting.`
    : `Optimize for ${platforms[0]} platform specifically.`;

  const contentContext = existingContent
    ? `Improve and expand on this existing content: "${existingContent}"`
    : `Create engaging content about: ${topic}`;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `${contentContext}.

Tone: ${tone}
${platformContext}
${includeHashtags ? "Include relevant, trending hashtags." : "Do not include hashtags."}
${includeEmoji ? "Add relevant emojis to enhance engagement." : "No emojis."}
${platformOptimized ? "Make each variation platform-specific with appropriate formatting." : ""}

Generate ${platforms.length > 1 ? `variations for each platform (${platforms.length} versions)` : "optimized content for this platform"}.

Return the response in this JSON format only:
{
  "main": "The primary content",
  "variations": [
    { "platform": "platform_name", "content": "platform-optimized version" }
  ]
}`,
      },
    ],
  });

  const response = message.content[0];
  if (response.type === "text") {
    try {
      return JSON.parse(response.text);
    } catch {
      return { main: response.text, variations: [] };
    }
  }
  return { main: "", variations: [] };
}

export async function suggestHashtags(params: {
  content: string;
  platform: string;
  count?: number;
}) {
  const { content, platform, count = 5 } = params;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: `Analyze this content for ${platform} and suggest ${count} relevant hashtags:

"${content}"

Return as a JSON array of hashtags only:
["#hashtag1", "#hashtag2", ...]`,
      },
    ],
  });

  const response = message.content[0];
  if (response.type === "text") {
    try {
      return JSON.parse(response.text);
    } catch {
      return [];
    }
  }
  return [];
}

export async function optimizePostingTime(params: {
  platform: string;
  content?: string;
}) {
  const { platform, content } = params;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `Analyze the best posting times for ${platform}${content ? ` for this type of content: "${content}"` : ""}.

Consider:
- Platform-specific peak engagement times
- Target audience time zones
- Content type optimal windows

Return as JSON:
{
  "best_times": [
    { "day": "Thursday", "time": "6:00 PM", "engagement_boost": "18%" },
    ...
  ],
  "recommendation": "Why this time works..."
}`,
      },
    ],
  });

  const response = message.content[0];
  if (response.type === "text") {
    try {
      return JSON.parse(response.text);
    } catch {
      return { best_times: [], recommendation: "" };
    }
  }
  return { best_times: [], recommendation: "" };
}

export async function analyzeEngagement(params: {
  content: string;
  platform: string;
}) {
  const { content, platform } = params;

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `Analyze this ${platform} post for potential engagement:

"${content}"

Provide:
1. Engagement score prediction (1-100)
2. Key strengths
3. Areas for improvement
4. Suggested improvements

Return as JSON:
{
  "score": 85,
  "strengths": ["..."],
  "improvements": ["..."],
  "suggestions": "Specific rewrites..."
}`,
      },
    ],
  });

  const response = message.content[0];
  if (response.type === "text") {
    try {
      return JSON.parse(response.text);
    } catch {
      return { score: 50, strengths: [], improvements: [], suggestions: "" };
    }
  }
  return { score: 50, strengths: [], improvements: [], suggestions: "" };
}
