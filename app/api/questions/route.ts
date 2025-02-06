import { NextResponse } from "next/server";
import { createQuestion, fetchQuestions } from "@/lib/data";

/**
 * GET: Fetch questions for a topic
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const topicId = searchParams.get("topicId");

    if (!topicId) {
      return NextResponse.json({ error: "Topic ID is required" }, { status: 400 });
    }

    const questions = await fetchQuestions(topicId);
    return NextResponse.json(questions);
  } catch (error) {
    console.error("❌ Failed to fetch questions:", error);
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }
}

/**
 * POST: Ask a new question
 */
export async function POST(req: Request) {
  try {
    const { topicId, title } = await req.json();
    if (!title.trim() || !topicId) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const question = await createQuestion(topicId, title);
    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error("❌ Failed to add question:", error);
    return NextResponse.json({ error: "Failed to add question" }, { status: 500 });
  }
}
