// src/components/AssistantSelector/AssistantSelector.tsx
import React, { useState } from 'react'

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import gql from 'graphql-tag'
import OpenAI from 'openai'

import { useMutation, useQuery } from '@redwoodjs/web'

const LIST_ASSISTANTS_QUERY = gql`
  query ListAssistantsQuery {
    listAssistants {
      id
      object
      created_at
      description
      name
      metadata
      model
      instructions
      file_ids
    }
  }
`
const CREATE_THREAD_MUTATION = gql`
  mutation CreateThreadMutation {
    createThread {
      id
    }
  }
`

interface AssistantSelectorProps {
  onAssistantSelect: (assistant: OpenAI.Beta.Assistant) => void
  handleThreadSelect: (threadId: string) => void
}

const AssistantSelector: React.FC<AssistantSelectorProps> = ({
  onAssistantSelect,
  handleThreadSelect,
}) => {
  const [selectedAssistant, setSelectedAssistant] = useState('')
  const [createThread] = useMutation(CREATE_THREAD_MUTATION)
  const { data, loading, error } = useQuery(LIST_ASSISTANTS_QUERY)

  const handleChange = async (event: SelectChangeEvent<string>) => {
    const assistantId = event.target.value as string
    setSelectedAssistant(assistantId)
    const assistant = data.listAssistants.find(
      (a: OpenAI.Beta.Assistant) => a.id === assistantId
    )
    if (assistant) {
      onAssistantSelect(assistant)
    }
    // Create a thread when an assistant is selected
    const response = await createThread()
    const threadId = response.data.createThread.id
    handleThreadSelect(threadId)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <FormControl fullWidth>
      <InputLabel id="assistant-selector-label">Select Assistant</InputLabel>
      <Select
        labelId="assistant-selector-label"
        value={selectedAssistant}
        onChange={(e) => handleChange(e)}
        label="Select Assistant"
      >
        {data.listAssistants.map((assistant: OpenAI.Beta.Assistant) => (
          <MenuItem key={assistant.id} value={assistant.id}>
            {assistant.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default AssistantSelector
