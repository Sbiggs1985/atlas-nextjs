interface TopicProps {
  params: { id: string }; // Get the dynamic ID from the URL
}

export default function TopicPage({ params }: { params: { id: string } }) {
  return (
    <main>
      <h1>Topic: {decodeURIComponent(params.id)}</h1>
      <p>Here are all the questions related to {decodeURIComponent(params.id)}.</p>
    </main>
  );
}

  