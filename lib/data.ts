import { createPool } from "@vercel/postgres";
import { Question, Topic, User } from "./definitions";

// ✅ Use connection pooling for better efficiency
if (!process.env.POSTGRES_URL) {
  throw new Error("❌ Missing POSTGRES_URL environment variable.");
}

const pool = createPool({
  connectionString: process.env.POSTGRES_URL,
});

/**
 * Fetch a user by email
 */
export async function fetchUser(email: string): Promise<User | null> {
  if (!email) {
    console.error("❌ Invalid email provided:", email);
    return null;
  }

  try {
    const user = await pool.sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows.length > 0 ? user.rows[0] : null;
  } catch (error) {
    console.error("❌ Failed to fetch user:", error);
    return null;
  }
}

/**
 * Fetch all topics (sorted alphabetically)
 */
export async function fetchTopics(): Promise<Topic[]> {
  try {
    const data = await pool.sql<Topic>`SELECT * FROM topics ORDER BY title ASC`;
    return data.rows;
  } catch (error) {
    console.error("❌ Failed to fetch topics:", error);
    return [];
  }
}

/**
 * Fetch a specific topic by ID
 */
export async function fetchTopic(id: string): Promise<Topic | null> {
  if (!id) {
    console.error("❌ Invalid topic ID:", id);
    return null;
  }

  try {
    const data = await pool.sql<Topic>`SELECT * FROM topics WHERE id = ${id}`;
    return data.rows.length > 0 ? data.rows[0] : null;
  } catch (error) {
    console.error("❌ Failed to fetch topic:", error);
    return null;
  }
}

/**
 * Fetch all questions for a topic (sorted by votes)
 */
export async function fetchQuestions(id: string): Promise<Question[]> {
  if (!id) {
    console.error("❌ Invalid topic ID for fetching questions:", id);
    return [];
  }

  try {
    const data = await pool.sql<Question>`
      SELECT * FROM questions WHERE topic_id = ${id} ORDER BY votes DESC
    `;
    return data.rows;
  } catch (error) {
    console.error("❌ Failed to fetch questions:", error);
    return [];
  }
}

/**
 * Create a new topic
 */
export async function createTopic(title: string): Promise<Topic | null> {
  if (!title.trim()) {
    console.error("❌ Invalid topic title:", title);
    return null;
  }

  try {
    const data = await pool.sql<Topic>`INSERT INTO topics (title) VALUES (${title}) RETURNING *`;
    return data.rows.length > 0 ? data.rows[0] : null;
  } catch (error) {
    console.error("❌ Failed to create topic:", error);
    return null;
  }
}

/**
 * Create a new question under a topic
 */
export async function createQuestion(topicId: string, title: string): Promise<Question | null> {
  if (!title.trim() || !topicId) {
    console.error("❌ Invalid question data:", title, topicId);
    return null;
  }

  try {
    const data = await pool.sql<Question>`
      INSERT INTO questions (title, topic_id, votes) 
      VALUES (${title}, ${topicId}, 0) RETURNING *`;
    return data.rows.length > 0 ? data.rows[0] : null;
  } catch (error) {
    console.error("❌ Failed to add question:", error);
    return null;
  }
}

/**
 * Increment votes for a question
 */
export async function voteUpQuestion(id: string): Promise<Question | null> {
  if (!id) {
    console.error("❌ Invalid question ID for vote increment:", id);
    return null;
  }

  try {
    const data = await pool.sql<Question>`
      UPDATE questions SET votes = votes + 1 WHERE id = ${id} RETURNING *
    `;
    return data.rows.length > 0 ? data.rows[0] : null;
  } catch (error) {
    console.error("❌ Failed to increment votes:", error);
    return null;
  }
}

/*
import { createPool } from "@vercel/postgres";
import { Question, Topic, User } from "./definitions";

// ✅ Use connection pooling for better efficiency
const pool = createPool({
  connectionString: process.env.POSTGRES_URL,
});

export async function fetchUser(email: string): Promise<User | null> {
  if (!email) {
    console.error("Invalid email provided:", email);
    return null;
  }

  try {
    const user = await pool.sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows.length > 0 ? user.rows[0] : null;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
}

export async function fetchTopics(): Promise<Topic[]> {
  try {
    const data = await pool.sql<Topic>`SELECT * FROM topics ORDER BY title ASC`;
    return data.rows;
  } catch (error) {
    console.error("Failed to fetch topics:", error);
    return [];
  }
}

export async function fetchTopic(id: string): Promise<Topic | null> {
  if (!id) {
    console.error("Invalid topic ID:", id);
    return null;
  }

  try {
    const data = await pool.sql<Topic>`SELECT * FROM topics WHERE id = ${id}`;
    return data.rows.length > 0 ? data.rows[0] : null;
  } catch (error) {
    console.error("Failed to fetch topic:", error);
    return null;
  }
}

export async function fetchQuestions(id: string): Promise<Question[]> {
  if (!id) {
    console.error("Invalid topic ID for fetching questions:", id);
    return [];
  }

  try {
    const data = await pool.sql<Question>`
      SELECT * FROM questions WHERE topic_id = ${id} ORDER BY votes DESC
    `;
    return data.rows;
  } catch (error) {
    console.error("Failed to fetch questions:", error);
    return [];
  }
}

export async function insertQuestion(question: Pick<Question, "title" | "topic_id" | "votes">): Promise<Question | null> {
  if (!question.title || !question.topic_id) {
    console.error("Invalid question data:", question);
    return null;
  }

  try {
    const data = await pool.sql<Question>`
      INSERT INTO questions (title, topic_id, votes) 
      VALUES (${question.title}, ${question.topic_id}, ${question.votes}) 
      RETURNING *
    `;
    return data.rows.length > 0 ? data.rows[0] : null;
  } catch (error) {
    console.error("Failed to add question:", error);
    return null;
  }
}

export async function insertTopic(topic: Pick<Topic, "title">): Promise<Topic | null> {
  if (!topic.title) {
    console.error("Invalid topic data:", topic);
    return null;
  }

  try {
    const data = await pool.sql<Topic>`INSERT INTO topics (title) VALUES (${topic.title}) RETURNING *`;
    return data.rows.length > 0 ? data.rows[0] : null;
  } catch (error) {
    console.error("Failed to add topic:", error);
    return null;
  }
}

export async function incrementVotes(id: string): Promise<Question | null> {
  if (!id) {
    console.error("Invalid question ID for vote increment:", id);
    return null;
  }

  try {
    const data = await pool.sql<Question>`
      UPDATE questions SET votes = votes + 1 WHERE id = ${id} RETURNING *
    `;
    return data.rows.length > 0 ? data.rows[0] : null;
  } catch (error) {
    console.error("Failed to increment votes:", error);
    return null;
  }
}
*/