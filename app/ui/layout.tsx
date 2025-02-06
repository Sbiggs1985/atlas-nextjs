import Link from "next/link";
import { fetchTopics } from "@/lib/data";

export default async function UILayout({ children }: { children: React.ReactNode }) {
  const topics = await fetchTopics();

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
      </aside>

      {/* Main Content */}
      <main className="w-3/4 p-6">{children}</main>
    </div>
  );
}

  