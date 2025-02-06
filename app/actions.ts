"use server";
import { revalidatePath } from "next/cache";
import { createTopic, createQuestion, voteUpQuestion } from "@/lib/data";

/**
 * ✅ Server Action to Create a New Topic
 */
export async function addTopic(formData: FormData) {
  const title = formData.get("title") as string;
  if (!title.trim()) return { error: "Topic title cannot be empty." };

  const newTopic = await createTopic(title);
  if (!newTopic) return { error: "Failed to create topic." };

  revalidatePath("/ui"); // Refreshes topic list in /ui page
  return { success: "Topic created successfully!" };
}

/**
 * ✅ Server Action to Create a New Question
 */
export async function askQuestion(formData: FormData) {
  const topicId = formData.get("topicId") as string;
  const title = formData.get("title") as string;
  if (!title.trim() || !topicId) return { error: "Invalid question data." };

  const newQuestion = await createQuestion(topicId, title);
  if (!newQuestion) return { error: "Failed to add question." };

  revalidatePath(`/ui/topics/${topicId}`); // Refresh question list for the topic
  return { success: "Question added successfully!" };
}

/**
 * ✅ Server Action to Upvote a Question
 */
export async function upvoteQuestion(formData: FormData) {
  const id = formData.get("questionId") as string;
  if (!id) return { error: "Invalid question ID." };

  const updatedQuestion = await voteUpQuestion(id);
  if (!updatedQuestion) return { error: "Failed to upvote question." };

  revalidatePath(`/ui/topics/${updatedQuestion.topic_id}`); // Refresh question votes
  return { success: "Vote added!" };
}
