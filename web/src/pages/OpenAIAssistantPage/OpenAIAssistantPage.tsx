// web/src/pages/OpenAIAssistantPage/OpenAIAssistantPage.tsx
import { useState } from 'react'

import { Box, Grid, Paper } from '@mui/material'
import OpenAI from 'openai'

import { Metadata } from '@redwoodjs/web'

import ChatInterface from 'src/components/ChatInterface/ChatInterface'
import CompressFileComponent from 'src/components/CompressText/CompressText'
import ThreadInterface from 'src/components/ThreadsInterface/ThreadsInterface'
import { ConversationHistory } from 'src/types/ChatCompletions'

import FileUploadAndQueryComponent from '../../components/AssistantEmbedding/AssistantEmbedding'
import ProcessRepoForm from '../../components/ProcessRepo/ProcessRepo'

const OpenAIAssistantPage = () => {
  const [conversation, setConversation] = useState<ConversationHistory>({
    messages: [],
  })
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [model, setModel] = useState('text-davinci-003') // Default model
  const [assistant, setAssistant] = useState<OpenAI.Beta.Assistant>(null)

  const handleModelSelect = (model: string) => {
    setModel(model)
  }

  const handleAssistantSelect = (assistant: OpenAI.Beta.Assistant) => {
    setAssistant(assistant)
  }

  return (
    <>
      <Metadata title="OpenAI" description="Interface" />
      <Box sx={{ flexGrow: 1, height: '100vh' }}>
        <Grid container spacing={2} style={{ height: '100%', display: 'flex' }}>
          <Grid item xs={2}>
            <Paper sx={{ overflow: 'auto' }}>
              <ProcessRepoForm />
              <CompressFileComponent />
              <FileUploadAndQueryComponent
                assistant={assistant}
                threadId={selectedThreadId}
              />
            </Paper>
          </Grid>
          <Grid item xs={5} style={{ display: 'flex' }}>
            {/* This should take up the maximum available space */}
            <Paper
              sx={{
                height: '100%',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
              }}
            >
              <ThreadInterface
                assistant={assistant}
                onAssistantSelect={handleAssistantSelect}
                selectedThreadId={selectedThreadId}
                setSelectedThreadId={setSelectedThreadId}
              />
            </Paper>
          </Grid>
          <Grid item xs={5}>
            <Paper sx={{ height: '100%', overflow: 'wrap', width: '100%' }}>
              <ChatInterface
                conversation={conversation}
                setConversation={setConversation}
                model={model}
                handleModelSelect={handleModelSelect}
              />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}

export default OpenAIAssistantPage
