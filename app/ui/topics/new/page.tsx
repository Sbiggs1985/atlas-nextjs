"use client";

import { useState } from "react";
import { addTopic } from "@/app/actions"; // ✅ Import Server Action

export default function NewTopicPage() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", title);

    const res = await addTopic(formData); // ✅ Direct call to Server Action

    setLoading(false);

    if (res.success) {
      setTitle(""); // Clear input after success
      window.location.href = "/ui"; // Redirect to topics list
    } else {
      setError(res.error || "❌ Failed to create topic.");
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Create a New Topic</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full"
          placeholder="Enter topic title"
          required
        />
        <button
          type="submit"
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Topic"}
        </button>
      </form>

      {/* ✅ Show Error Messages */}
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </main>
  );
}
