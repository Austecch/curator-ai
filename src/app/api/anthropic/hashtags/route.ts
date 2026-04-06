import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(request: Request) {
  try {
    const { content, platform, count } = await request.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Anthropic API key not configured" },
        { status: 500 }
      );
    }

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: `Suggest ${count || 8} relevant hashtags for this ${platform || "social media"} post:

"${content}"

Return a JSON array of hashtags only:
["#hashtag1", "#hashtag2", ...]`,
        },
      ],
    });

    const response = message.content[0];
    if (response.type === "text") {
      try {
        const hashtags = JSON.parse(response.text);
        return NextResponse.json({ hashtags });
      } catch {
        return NextResponse.json({ hashtags: [] });
      }
    }

    return NextResponse.json({ hashtags: [] });
  } catch (error) {
    console.error("Hashtag generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate hashtags" },
      { status: 500 }
    );
  }
}
