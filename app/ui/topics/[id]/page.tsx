interface TopicPageProps {
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