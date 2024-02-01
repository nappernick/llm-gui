// web/src/components/ThreadsInterface/ThreadsInterface.tsx

import React, { useEffect, useState } from 'react'

import { Alert, Grid, Paper, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import OpenAI from 'openai'

import { useMutation } from '@redwoodjs/web'

import { ChatMessage } from '../../types/ChatCompletions'
import AssistantSelector from '../AssistantSelector/AssistantSelector'
import MessageInput from '../MessageInput/MessageInput'
import ThreadMessageDisplay from '../ThreadMessageDisplay/ThreadMessageDisplay'

// Adjust the StyledPaper to fill the height of its parent
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: `0px ${theme.spacing(2)}`,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
  minHeight: '100%',
  justifyContent: 'space-between',
  maxHeight: '100vh',
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
}))

// Define the GraphQL mutation
const SEND_ASSISTANT_THREAD_MESSAGE = gql`
  mutation SendMessageToAssistant(
    $threadId: String!
    $messageContent: String!
    $assistantId: String!
  ) {
    sendMessageToAssistant(
      threadId: $threadId
      messageContent: $messageContent
      assistantId: $assistantId
    )
  }
`

interface ThreadsInterfaceProps {
  assistant: OpenAI.Beta.Assistant
  onAssistantSelect: (assistant: OpenAI.Beta.Assistant) => void
  setSelectedThreadId: React.Dispatch<React.SetStateAction<string>>
  selectedThreadId: string
}

const ThreadsInterface: React.FC<ThreadsInterfaceProps> = ({
  assistant,
  onAssistantSelect,
  setSelectedThreadId,
  selectedThreadId,
}) => {
  const [conversation, setConversation] = useState<ChatMessage[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const [sendMessageToAssistant, { loading, error }] = useMutation(
    SEND_ASSISTANT_THREAD_MESSAGE
  )

  useEffect(() => {
    if (error) {
      setErrors((prevErrors) => [...prevErrors, error.message])
    }
    if (errors.length) {
      setTimeout(() => {
        setErrors((prevErrors) => prevErrors.filter((e) => e !== error.message))
      }, 15000)
    }
  }, [error, errors])

  const handleThreadSelect = (threadId: string) => {
    setSelectedThreadId(threadId)
    // Additional actions such as retrieving thread messages can be performed here
  }

  const handleThreadInteraction = async (message: string) => {
    if (!selectedThreadId) return

    setConversation((prev) => [...prev, { role: 'user', content: message }])
    try {
      const response = await sendMessageToAssistant({
        variables: {
          threadId: selectedThreadId,
          messageContent: message,
          assistantId: assistant.id,
        },
      })
      console.log('RESPONSE', response)
      setConversation((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.data.sendMessageToAssistant,
        },
      ])
    } catch (e) {
      console.error('Error interacting with thread:', e)
    }
  }

  return (
    <StyledPaper>
      <StyledTypography variant="h4" align="center">
        {assistant?.name}
      </StyledTypography>
      <Grid
        container
        spacing={2}
        style={{
          display: 'flex',
          height: '100%',
          maxHeight: 'calc(100% - 281px)',
        }}
      >
        <Grid item xs={12}>
          <AssistantSelector
            onAssistantSelect={onAssistantSelect}
            handleThreadSelect={handleThreadSelect}
          />
        </Grid>
        <StyledGrid item xs={12}>
          <ThreadMessageDisplay conversation={conversation} />
        </StyledGrid>
      </Grid>
      <Grid item xs={4} minWidth={'100%'} style={{ display: 'flex' }}>
        <MessageInput
          onSendMessage={handleThreadInteraction}
          loading={loading}
          setErrors={setErrors}
          errors={errors}
        />
      </Grid>
      {error && (
        <Alert severity="error">Error sending message: {error.message}</Alert>
      )}
    </StyledPaper>
  )
}

export default ThreadsInterface
