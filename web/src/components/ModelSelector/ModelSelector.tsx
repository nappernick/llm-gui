// web/src/components/ModelSelector/ModelSelector.tsx

import { useEffect, useMemo, useState } from 'react'

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

import { useQuery } from '@redwoodjs/web'

const RETRIEVE_MODEL_QUERY = gql`
  query RetrieveModelQuery($modelId: String!) {
    retrieveModel(modelId: $modelId) {
      id
      object
      owned_by
    }
  }
`

const MODEL_LIST_QUERY = gql`
  query ListModelsQuery {
    listModels {
      id
      object
      owned_by
    }
  }
`

const ModelSelector = ({ onModelSelect }) => {
  // Use the new queries alongside the existing ones
  const {
    data: listModelsData,
    loading: listModelsLoading,
    error: listModelsError,
  } = useQuery(MODEL_LIST_QUERY)

  const [selectedModel, setSelectedModel] = useState('')
  const {
    data: retrieveModelData,
    loading: retrieveModelLoading,
    error: retrieveModelError,
  } = useQuery(RETRIEVE_MODEL_QUERY, {
    variables: { modelId: selectedModel },
    skip: !selectedModel,
  })

  // Combine loading and error states
  const isLoading = useMemo(
    () => listModelsLoading || retrieveModelLoading,
    [listModelsLoading, retrieveModelLoading]
  )

  const isError = useMemo(
    () => listModelsError || retrieveModelError,
    [listModelsError, retrieveModelError]
  )

  const modelName = (modelName) => {
    if (modelName === 'ft:gpt-3.5-turbo-1106:napperindustries::8m6J8w1K') {
      modelName = 'gpt-3.5-nestjs'
    }
    if (modelName === 'ft:gpt-3.5-turbo-1106:napperindustries::8mHyOalx') {
      modelName = 'gpt-3.5-serverless'
    }
    return modelName
  }

  // Handle changes for both models and assistants
  const handleChange = (event) => {
    console.log('event.target.name', event.target)
    const value = event.target.value
    if (event.target.name === 'modelSelector') {
      setSelectedModel(value)
      onModelSelect(value, 'model')
    }
  }

  // Trigger callbacks when data is retrieved
  useEffect(() => {
    if (retrieveModelData && retrieveModelData.retrieveModel) {
      onModelSelect(retrieveModelData.retrieveModel.id, 'model')
    }
  }, [retrieveModelData, onModelSelect])

  if (isLoading) return 'Loading...'
  if (isError) return `Error: ${isError.message}`

  return (
    <FormControl fullWidth>
      <InputLabel id="assistant-selector-label">Select Model</InputLabel>
      <Select
        name="modelSelector"
        value={selectedModel}
        onChange={handleChange}
        label="Select Model"
      >
        {listModelsData?.listModels.map((model) => {
          return (
            <MenuItem key={model.id} value={model.id}>
              {modelName(model.id)}{' '}
              {/* Display model ID or any other identifier */}
            </MenuItem>
          )
        })}
      </Select>
    </FormControl>
  )
}

export default ModelSelector
