interface TopicProps {
    params: { id: string };
  }
  
  export default function TopicPage({ params }: TopicProps) {
    return (
      <main>
        <h1>Topic: {params.id}</h1>
        <p>Here are all the questions related to this topic.</p>
      </main>
    );
  }
  