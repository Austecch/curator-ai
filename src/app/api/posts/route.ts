import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { content, platforms, scheduled_at } = await request.json();

    const post = {
      id: crypto.randomUUID(),
      content,
      platforms,
      status: scheduled_at ? "scheduled" : "draft",
      scheduled_at,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create post" },
      { status: 500 }
    );
  }
}

export async function GET() {
  const posts = [
    {
      id: "1",
      content: "Sample post content",
      platforms: ["linkedin", "twitter"],
      status: "published",
      created_at: new Date().toISOString(),
    },
  ];

  return NextResponse.json(posts);
}
