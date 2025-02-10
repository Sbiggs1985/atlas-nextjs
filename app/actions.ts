"use server";
import { revalidatePath } from "next/cache";
import { createTopic, createQuestion, voteUpQuestion } from "@/lib/data";

/**
 * ✅ Server Action to Create a New Topic
 */
export async function addTopic(formData: FormData) {
  const title = formData.get("title") as string;
  if (!title || !title.trim()) return { error: "❌ Topic title cannot be empty." };

  console.log("📌 Creating topic:", title);
  const newTopic = await createTopic(title);
  
  if (!newTopic) {
    console.error("❌ Failed to create topic:", title);
    return { error: "❌ Database error. Failed to create topic." };
  }

  revalidatePath("/ui"); // Refreshes topic list in /ui page
  console.log("✅ Topic created:", newTopic);
  return { success: true, data: newTopic }; // ✅ Return created topic
}

/**
 * ✅ Server Action to Create a New Question
 */
export async function askQuestion(formData: FormData) {
  const topicId = formData.get("topicId") as string;
  const title = formData.get("title") as string;
  
  if (!title || !title.trim() || !topicId) return { error: "❌ Invalid question data." };

  console.log(`📌 Adding question: "${title}" to topic ID: ${topicId}`);
  const newQuestion = await createQuestion(topicId, title);

  if (!newQuestion) {
    console.error("❌ Failed to add question:", title);
    return { error: "❌ Database error. Failed to add question." };
  }

  revalidatePath(`/ui/topics/${topicId}`); // Refresh question list for the topic
  console.log("✅ Question added:", newQuestion);
  return { success: true, data: newQuestion }; // ✅ Return created question
}

/**
 * ✅ Server Action to Upvote a Question
 */
export async function upvoteQuestion(formData: FormData) {
  const id = formData.get("questionId") as string;
  if (!id) return { error: "❌ Invalid question ID." };

  console.log("📌 Upvoting question ID:", id);
  const updatedQuestion = await voteUpQuestion(id);

  if (!updatedQuestion) {
    console.error("❌ Failed to upvote question ID:", id);
    return { error: "❌ Database error. Failed to upvote question." };
  }

  revalidatePath(`/ui/topics/${updatedQuestion.topic_id}`); // Refresh question votes
  console.log("✅ Vote added:", updatedQuestion);
  return { success: true, data: updatedQuestion }; // ✅ Return updated question
}
