import { fetchQuestions, fetchTopic } from "@/lib/data";
import { HashtagIcon } from "@heroicons/react/24/outline";

interface TopicPageProps {
  params: { id: string };
}

export default async function TopicPage({ params }: TopicPageProps) {
  console.log("Fetching topic and questions for:", params.id);

  // Fetch topic and questions
  const topic = await fetchTopic(params.id);
  const questions = await fetchQuestions(params.id);

  // Handle missing topic
  if (!topic) {
    console.error("Topic not found:", params.id);
    return <div className="p-6 text-red-600">Topic not found</div>;
  }

  return (
    <main className="p-6">
      <h1 className="text-3xl font-black flex items-center">
        <HashtagIcon className="h-6 w-6 mr-2" /> {topic.title}
      </h1>
      <h2 className="text-lg font-semibold mt-4">Questions:</h2>

      {questions.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {questions.map((question) => (
            <li key={question.id} className="border p-3 rounded-lg shadow">
              <span className="font-semibold">{question.title}</span>
              <span className="ml-2 text-gray-500">({question.votes} votes)</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-4">No questions available for this topic.</p>
      )}
    </main>
  );
}

/* interface TopicPageProps {
  params: { id: string };
}

export default function Page({ params }: TopicPageProps) {
  console.log("Params:", params);

  return (
    <div>
      <h1>Topic: {decodeURIComponent(params.id)}</h1>
      <p>Here are all the questions related to {decodeURIComponent(params.id)}.</p>
    </div>
  );
}
  */