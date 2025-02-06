"use client";

import { useState } from "react";

export default function NewTopicPage() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    
    setLoading(true);
    
    const res = await fetch("/api/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    setLoading(false);

    if (res.ok) {
      setTitle(""); // Clear input after successful submission
      window.location.href = "/ui"; // Redirect to topics list
    } else {
      console.error("❌ Failed to create topic.");
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
        />
        <button
          type="submit"
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Topic"}
        </button>
      </form>
    </main>
  );
}