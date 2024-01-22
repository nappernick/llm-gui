// web/src/components/ModelSelector/ModelSelector.tsx

import { useEffect, useMemo, useState } from 'react'

import { useQuery } from '@redwoodjs/web'

const RETRIEVE_MODEL_QUERY = gql`
  query RetrieveModelQuery($modelId: String!) {
    retrieveModel(modelId: $modelId) {
      id
      object
      created
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
  const { data, loading, error } = useQuery(MODEL_LIST_QUERY)

  const [selectedModel, setSelectedModel] = useState('')
  const {
    data: retrieveData,
    loading: retrieveLoading,
    error: retrieveError,
  } = useQuery(RETRIEVE_MODEL_QUERY, {
    variables: { modelId: selectedModel },
    skip: !selectedModel,
  })

  const isLoading = useMemo(
    () => loading || retrieveLoading,
    [loading, retrieveLoading]
  )

  const isError = useMemo(() => error || retrieveError, [error, retrieveError])

  const handleChange = (event) => {
    const model = event.target.value
    setSelectedModel(model)
    onModelSelect(model)
  }

  useEffect(() => {
    if (retrieveData && retrieveData.retrieveModel) {
      onModelSelect(retrieveData.retrieveModel)
    }
  }, [retrieveData, onModelSelect])

  if (isLoading) return 'Loading...'
  if (isError) return `Error: ${error.message}`

  return (
    <select value={selectedModel} onChange={handleChange}>
      {data.listModels.map((model) => (
        <option key={model.id} value={model.id}>
          {model.id} {/* Display model ID or any other identifier */}
        </option>
      ))}
    </select>
  )
}

export default ModelSelector
