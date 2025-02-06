import { NextResponse } from "next/server";
import { createTopic, fetchTopics } from "@/lib/data";

export async function GET() {
  try {
    const topics = await fetchTopics();
    return NextResponse.json(topics);
  } catch (error) {
    console.error("❌ Failed to fetch topics:", error);
    return NextResponse.json({ error: "Failed to fetch topics" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title } = await req.json();
    if (!title.trim()) {
      return NextResponse.json({ error: "Invalid topic title" }, { status: 400 });
    }

    const topic = await createTopic(title);
    return NextResponse.json(topic, { status: 201 });
  } catch (error) {
    console.error("❌ Failed to create topic:", error);
    return NextResponse.json({ error: "Failed to create topic" }, { status: 500 });
  }
}
