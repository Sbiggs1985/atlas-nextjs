"use client";

import { useState, useEffect } from "react";
import { HashtagIcon } from "@heroicons/react/24/outline";

interface TopicPageProps {
  params: { id: string };
}

export default function TopicPage({ params }: TopicPageProps) {
  const [topic, setTopic] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionText, setQuestionText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const topicRes = await fetch(`/api/topics/${params.id}`);
        const questionsRes = await fetch(`/api/questions?topicId=${params.id}`);

        if (topicRes.ok && questionsRes.ok) {
          setTopic(await topicRes.json());
          setQuestions(await questionsRes.json());
        } else {
          console.error("Error fetching topic or questions.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    }

    fetchData();
  }, [params.id]);

  async function handleAskQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!questionText.trim()) return;

    const res = await fetch(`/api/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topicId: params.id, title: questionText }),
    });

    if (res.ok) {
      setQuestionText("");
      const newQuestion = await res.json();
      setQuestions([...questions, newQuestion]); // Update UI dynamically
    } else {
      console.error("❌ Failed to add question.");
    }
  }

  async function handleVote(questionId: string) {
    const res = await fetch(`/api/questions/${questionId}/vote`, { method: "POST" });

    if (res.ok) {
      const updatedQuestion = await res.json();
      setQuestions(
        questions.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q))
      );
    } else {
      console.error("❌ Failed to upvote.");
    }
  }

  if (loading) return <div className="p-6">Loading...</div>;
  if (!topic) return <div className="p-6 text-red-600">Topic not found</div>;

  return (
    <main className="p-6">
      <h1 className="text-3xl font-black flex items-center">
        <HashtagIcon className="h-6 w-6 mr-2" /> {topic.title}
      </h1>

      {/* Ask a Question Form */}
      <form onSubmit={handleAskQuestion} className="mt-4">
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="border p-2 w-full"
          placeholder="Ask a question..."
        />
        <button
          type="submit"
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
        >
          Ask
        </button>
      </form>

      {/* List of Questions */}
      <h2 className="text-lg font-semibold mt-6">Questions:</h2>
      <ul className="mt-4 space-y-2">
        {questions.length > 0 ? (
          questions.map((question) => (
            <li key={question.id} className="border p-3 rounded-lg shadow flex justify-between">
              <span>{question.title}</span>
              <button
                onClick={() => handleVote(question.id)}
                className="bg-gray-200 px-2 py-1 rounded"
              >
                👍 {question.votes}
              </button>
            </li>
          ))
        ) : (
          <p className="text-gray-500 mt-4">No questions available for this topic.</p>
        )}
      </ul>
    </main>
  );
}
