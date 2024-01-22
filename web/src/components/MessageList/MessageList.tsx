const MessageList = ({ conversation }) => {
  return (
    <ul>
      {conversation.map((message, index) => (
        <li key={index}>
          <strong>{message.role}:</strong> {message.content}
        </li>
      ))}
    </ul>
  )
}

export default MessageList
