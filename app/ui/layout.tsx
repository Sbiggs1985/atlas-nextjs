"use client";

import Link from "next/link";
import { fetchTopics } from "@/lib/data";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UILayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [topics, setTopics] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login"); // ✅ Redirect if not logged in
    }

    async function loadTopics() {
      const data = await fetchTopics();
      setTopics(data);
    }
    loadTopics();
  }, [status]);

  if (status === "loading") return <div className="p-6">Loading...</div>;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-100 p-4 border-r border-gray-300">
        <h2 className="text-lg font-bold mb-4">Topics</h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link href="/ui" className="text-blue-600 hover:underline">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/ui/topics/new" className="text-blue-600 hover:underline">
                Create Topic
              </Link>
            </li>
          </ul>
        </nav>

        {/* Dynamic Topics List */}
        <h3 className="text-md font-semibold mt-6">Browse Topics</h3>
        <ul className="mt-2 space-y-2">
          {topics.length > 0 ? (
            topics.map((topic) => (
              <li key={topic.id}>
                <Link href={`/ui/topics/${topic.id}`} className="text-blue-600 hover:underline">
                  {topic.title}
                </Link>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No topics available.</li>
          )}
        </ul>

        {/* Sign Out Button */}
        {session && (
          <button
            className="mt-6 bg-red-600 text-white p-2 rounded w-full"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Sign Out
          </button>
        )}
      </aside>

      {/* Main Content */}
      <main className="w-3/4 p-6">{children}</main>
    </div>
  );
}
