import React, { useEffect, useState } from 'react'

import { Alert, Grid, Paper, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import gql from 'graphql-tag'

import { useMutation } from '@redwoodjs/web'

import { ChatMessage, ConversationHistory } from '../../types/ChatCompletions'
import MessageInput from '../MessageInput/MessageInput'
import MessageList from '../MessageList/MessageList'
import ModelSelector from '../ModelSelector/ModelSelector'

// Adjust the StyledPaper to fill the height of its parent
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: `0px ${theme.spacing(2)}`,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
  minHeight: '100%',
  justifyContent: 'space-between',
  maxWidth: 'calc(100% - 50px)',
}))

const StyledGrid = styled(Grid)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  height: '100%', // This will ensure it takes up all available space
}))

const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  textAlign: 'start',
  justifySelf: 'flex-start',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}))
// Define the GraphQL mutation
const SEND_MESSAGE_MUTATION = gql`
  mutation SendMessageMutation(
    $model: String!
    $messages: [ChatMessageInput!]!
  ) {
    sendMessage(model: $model, messages: $messages) {
      role
      content
    }
  }
`

interface ChatInterfaceProps {
  conversation: ConversationHistory
  handleModelSelect: (model: string) => void
  setConversation: React.Dispatch<React.SetStateAction<ConversationHistory>>
  model: string
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  conversation,
  setConversation,
  model,
  handleModelSelect,
}) => {
  const [sendMessage, { loading, error }] = useMutation<{
    sendMessage: ChatMessage
  }>(SEND_MESSAGE_MUTATION)
  const [errors, setErrors] = useState<string[]>([])

  useEffect(() => {
    if (error) {
      setErrors((prevErrors) => [...prevErrors, error.message])
    }
    if (errors.length) {
      setTimeout(() => {
        setErrors([])
      }, 15000)
    }
  }, [error, errors])

  const handleSendMessage = async (newMessage: string) => {
    const messages = conversation.messages.map((conv) => ({
      role: 'system',
      content: conv.content,
    }))

    setConversation((prevConversation) => ({
      messages: [
        ...prevConversation.messages,
        { role: 'user', content: newMessage },
      ],
    }))

    // Add the new message to the conversation array -- this is fine
    messages.push({ role: 'user', content: newMessage })
    const recentMessages = messages.slice(-5)

    const response = await sendMessage({
      variables: {
        model,
        messages: recentMessages, // This now correctly contains up to 5 most recent messages
      },
    })

    if (response.data?.sendMessage) {
      setConversation((prevConversation) => ({
        messages: [...prevConversation.messages, response.data.sendMessage],
      }))
    }
  }

  return (
    <StyledPaper>
      <Grid item xs={12}>
        {model && (
          <StyledTypography variant="h4" align="center">
            {model}
          </StyledTypography>
        )}
        <ModelSelector onModelSelect={handleModelSelect} />
      </Grid>
      <StyledGrid item xs={12} style={{ display: 'flex', minHeight: '100%' }}>
        <MessageList conversation={conversation.messages} />
      </StyledGrid>
      <Grid item xs={12} minWidth={'100%'} style={{ display: 'flex' }}>
        <MessageInput
          onSendMessage={handleSendMessage}
          loading={loading}
          setErrors={setErrors}
          errors={errors}
        />
      </Grid>
      {errors.map((errorMsg, index) => (
        <Alert severity="error" style={{ width: '100%' }} key={index}>
          Error sending message: {errorMsg}
        </Alert>
      ))}
    </StyledPaper>
  )
}

export default ChatInterface
