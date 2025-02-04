import Link from "next/link";

export default function UILayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-200 p-4">
        <nav>
          <ul>
            <li><Link href="/ui">Dashboard</Link></li>
            <li><Link href="/ui/topics/new">Create Topic</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="w-3/4 p-4">
        {children}
      </main>
    </div>
  );
}
