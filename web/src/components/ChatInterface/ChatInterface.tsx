import gql from 'graphql-tag'

import { useMutation } from '@redwoodjs/web'

import MessageInput from '../MessageInput/MessageInput'
import MessageList from '../MessageList/MessageList'

// Define the GraphQL mutation
const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessageMutation($model: String!, $message: String!) {
    sendMessage(model: $model, message: $message)
  }
`

const ChatInterface = ({ conversation, setConversation, model }) => {
  const [sendMessage, { loading, error }] = useMutation(SEND_MESSAGE_MUTATION)

  const onSendMessage = async (message) => {
    const response = await sendMessage({
      variables: { model, message },
    })
    if (response.data.sendMessage) {
      setConversation([
        ...conversation,
        { role: 'user', content: message },
        { role: 'assistant', content: response.data.sendMessage },
      ])
    }
  }

  return (
    <div>
      <MessageList conversation={conversation} />
      <MessageInput onSendMessage={onSendMessage} />
      {error && <div>Error sending message: {error.message}</div>}
      {loading && <div>Sending message...</div>}
    </div>
  )
}

export default ChatInterface
