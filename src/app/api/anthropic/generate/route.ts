import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: Request) {
  try {
    const { topic, platforms, tone, includeHashtags } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "Anthropic API key not configured" },
        { status: 500 }
      );
    }

    const anthropic = new Anthropic({ apiKey });

    const platformContext = platforms.length > 1
      ? `Adapt the content for each platform: ${platforms.join(", ")}.`
      : `Optimize for ${platforms[0]} specifically.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Create engaging social media content about: ${topic}.

Tone: ${tone || "professional"}
${platformContext}
${includeHashtags ? "Include relevant hashtags." : ""}

Return a JSON response with this structure:
{
  "main": "The main content",
  "variations": [
    { "platform": "platform_name", "content": "platform-specific version" }
  ],
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
}`,
        },
      ],
    });

    const response = message.content[0];
    if (response.type === "text") {
      try {
        const parsed = JSON.parse(response.text);
        return NextResponse.json(parsed);
      } catch {
        return NextResponse.json({ main: response.text, variations: [], hashtags: [] });
      }
    }

    return NextResponse.json({ main: "", variations: [], hashtags: [] });
  } catch (error) {
    console.error("Anthropic API error:", error);
    return NextResponse.json(
      { error: "Failed to generate content. Please try again." },
      { status: 500 }
    );
  }
}
