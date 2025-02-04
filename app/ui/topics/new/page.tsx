export default function NewTopic() {
    return (
      <main>
        <h1>Create a New Topic</h1>
        <form>
          <input type="text" placeholder="Topic Name" required />
          <button type="submit">Create</button>
        </form>
      </main>
    );
  }
  