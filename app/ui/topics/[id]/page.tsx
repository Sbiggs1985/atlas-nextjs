import { fetchQuestions, fetchTopic } from "@/lib/data";
import { HashtagIcon } from "@heroicons/react/24/outline";

interface TopicPageProps {
  params: { id: string };
}

export default async function Page({ params }: TopicPageProps) {
  console.log("Fetching topic:", params.id);

  async function fetchWithTimeout<T>(fn: () => Promise<T>, timeout = 5000): Promise<T | null> {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        console.error("API request timed out:", fn);
        resolve(null);
      }, timeout);
      fn().then((result) => {
        clearTimeout(timer);
        resolve(result);
      });
    });
  }

  const topic = await fetchWithTimeout(() => fetchTopic(params.id));
  const questions = await fetchWithTimeout(() => fetchQuestions(params.id));

  if (!topic) {
    console.error("Topic not found:", params.id);
    return <div>Topic not found</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-black flex items-center">
        <HashtagIcon className="h-6 w-6 mr-2" /> {topic.title}
      </h1>
      <p>Here are all the questions related to {decodeURIComponent(params.id)}.</p>
    </div>
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