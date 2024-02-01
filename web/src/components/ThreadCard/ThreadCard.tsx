// src/components/ThreadCard/ThreadCard.tsx

const ThreadCard = ({ thread, onSelect }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px' }}>
      <h3>Thread #{thread.id}</h3>
      <p>Created At: {new Date(thread.created_at * 1000).toLocaleString()}</p>
      <p>Role: {thread.role}</p>
      <p>Content: {thread.content}</p>
      <button onClick={() => onSelect(thread.id)}>Select Thread</button>
    </div>
  )
}

export default ThreadCard
