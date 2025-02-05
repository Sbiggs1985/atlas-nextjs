import { sql } from "@vercel/postgres";
import { Question, Topic, User } from "./definitions";

/**
 * Utility function to add a timeout to async operations (default: 5 seconds)
 */
async function withTimeout<T>(fn: () => Promise<T>, timeout = 5000): Promise<T | null> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      console.error("Database request timed out");
      resolve(null);
    }, timeout);
    fn().then((result) => {
      clearTimeout(timer);
      resolve(result);
    }).catch((error) => {
      console.error("Database request failed:", error);
      resolve(null);
    });
  });
}

/**
 * Fetch user by email
 */
export async function fetchUser(email: string): Promise<User | null> {
  if (!email) {
    console.error("Invalid email provided:", email);
    return null;
  }

  const result = await withTimeout(async () => {
    try {
      const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
      return user.rows.length > 0 ? user.rows[0] : null;
    } catch (error) {
      console.error("Failed to fetch user:", error);
      return null;
    }
  });

  return result;
}

/**
 * Fetch all topics
 */
export async function fetchTopics(): Promise<Topic[]> {
  const result = await withTimeout(async () => {
    try {
      const data = await sql<Topic>`SELECT * FROM topics`;
      return data.rows;
    } catch (error) {
      console.error("Failed to fetch topics:", error);
      return [];
    }
  });

  return result ?? []; // ✅ Ensures the function always returns an array
}

/**
 * Fetch a single topic by ID
 */
export async function fetchTopic(id: string): Promise<Topic | null> {
  if (!id) {
    console.error("Invalid topic ID:", id);
    return null;
  }

  const result = await withTimeout(async () => {
    try {
      const data = await sql<Topic>`SELECT * FROM topics WHERE id = ${id}`;
      return data.rows.length > 0 ? data.rows[0] : null;
    } catch (error) {
      console.error("Failed to fetch topic:", error);
      return null;
    }
  });

  return result;
}

/**
 * Fetch all questions related to a topic ID
 */
export async function fetchQuestions(id: string): Promise<Question[]> {
  if (!id) {
    console.error("Invalid topic ID for fetching questions:", id);
    return [];
  }

  const result = await withTimeout(async () => {
    try {
      const data = await sql<Question>`SELECT * FROM questions WHERE topic_id = ${id} ORDER BY votes DESC`;
      return data.rows;
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      return [];
    }
  });

  return result ?? []; // ✅ Ensures the function always returns an array
}

/**
 * Insert a new question into the database
 */
export async function insertQuestion(question: Pick<Question, "title" | "topic_id" | "votes">) {
  if (!question.title || !question.topic_id) {
    console.error("Invalid question data:", question);
    return null;
  }

  const result = await withTimeout(async () => {
    try {
      const data = await sql<Question>`
        INSERT INTO questions (title, topic_id, votes) 
        VALUES (${question.title}, ${question.topic_id}, ${question.votes}) RETURNING *`;
      return data.rows.length > 0 ? data.rows[0] : null;
    } catch (error) {
      console.error("Failed to add question:", error);
      return null;
    }
  });

  return result;
}

/**
 * Insert a new topic into the database
 */
export async function insertTopic(topic: Pick<Topic, "title">) {
  if (!topic.title) {
    console.error("Invalid topic data:", topic);
    return null;
  }

  const result = await withTimeout(async () => {
    try {
      const data = await sql<Topic>`INSERT INTO topics (title) VALUES (${topic.title}) RETURNING id;`;
      return data.rows.length > 0 ? data.rows[0] : null;
    } catch (error) {
      console.error("Failed to add topic:", error);
      return null;
    }
  });

  return result;
}

/**
 * Increment votes for a question
 */
export async function incrementVotes(id: string) {
  if (!id) {
    console.error("Invalid question ID for vote increment:", id);
    return null;
  }

  const result = await withTimeout(async () => {
    try {
      const data = await sql<Question>`UPDATE questions SET votes = votes + 1 WHERE id = ${id} RETURNING *`;
      return data.rows.length > 0 ? data.rows[0] : null;
    } catch (error) {
      console.error("Failed to increment votes:", error);
      return null;
    }
  });

  return result;
}



/*
import { sql } from "@vercel/postgres";
import { Question, Topic, User } from "./definitions";

export async function fetchUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user.");
  }
}

export async function fetchTopics() {
  try {
    const data = await sql<Topic>`SELECT * FROM topics`;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch topics.");
  }
}

export async function fetchTopic(id: string) {
  try {
    const data = await sql<Topic>`SELECT * FROM topics WHERE id = ${id}`;
    return data.rows && data.rows.length > 0 ? data.rows[0] : null;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch topics.");
  }
}

export async function fetchQuestions(id: string) {
  try {
    const data =
      await sql<Question>`SELECT * FROM questions WHERE topic_id = ${id} ORDER BY votes DESC`;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch questions.");
  }
}

export async function insertQuestion(
  question: Pick<Question, "title" | "topic_id" | "votes">
) {
  try {
    const data =
      await sql<Question>`INSERT INTO questions (title, topic_id, votes) VALUES (${question.title}, ${question.topic_id}, ${question.votes})`;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add question.");
  }
}

export async function insertTopic(topic: Pick<Topic, "title">) {
  try {
    const data =
      await sql<Topic>`INSERT INTO topics (title) VALUES (${topic.title}) RETURNING id;`;
    console.log(data.rows[0]);
    return data.rows[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to add topic.");
  }
}

export async function incrementVotes(id: string) {
  try {
    const data =
      await sql<Question>`UPDATE questions SET votes = votes + 1 WHERE id = ${id}`;
    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to increment votes.");
  }
}
*/
