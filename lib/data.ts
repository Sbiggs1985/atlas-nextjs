import { createClient } from "@vercel/postgres";
import { Question, Topic, User } from "./definitions";

if (!process.env.POSTGRES_URL) {
  throw new Error("❌ Missing POSTGRES_URL environment variable.");
}

const pool = createClient({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export async function fetchTopics(): Promise<Topic[]> {
  try {
    const { rows } = await pool.sql<Topic>`SELECT * FROM topics ORDER BY title ASC`;
    return rows;
  } catch (error) {
    console.error("❌ Failed to fetch topics:", error);
    return [];
  }
}
