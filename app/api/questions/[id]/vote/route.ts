import { NextResponse } from "next/server";
import { voteUpQuestion } from "@/lib/data";

/**
 * POST: Upvote a question
 */
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    if (!params?.id) {
      return NextResponse.json({ error: "Invalid question ID" }, { status: 400 });
    }

    console.log(`🔼 Voting for question ID: ${params.id}`);

    const updatedQuestion = await voteUpQuestion(params.id);

    if (!updatedQuestion) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    return NextResponse.json(updatedQuestion, { status: 200 });
  } catch (error) {
    console.error("❌ Failed to upvote question:", error);
    return NextResponse.json({ error: "Failed to upvote question" }, { status: 500 });
  }
}
