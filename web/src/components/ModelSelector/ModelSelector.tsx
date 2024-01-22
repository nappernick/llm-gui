// web/src/components/ModelSelector/ModelSelector.tsx

import { useState } from 'react'

import { useQuery } from '@redwoodjs/web'

const MODEL_LIST_QUERY = gql`
  query ListModelsQuery {
    listModels {
      id
      object
      created_at
      owned_by
      root
      parent
      permission {
        id
        object
        created
        allow_create_engine
        allow_sampling
        allow_logprobs
        allow_search_indices
        allow_view
        allow_fine_tuning
        organization
        group
        is_blocking
      }
    }
  }
`

const ModelSelector = ({ onModelSelect }) => {
  const { data, loading, error } = useQuery(MODEL_LIST_QUERY)
  const [selectedModel, setSelectedModel] = useState('')

  const handleChange = (event) => {
    const model = event.target.value
    setSelectedModel(model)
    onModelSelect(model)
  }

  if (loading) return 'Loading...'
  if (error) return `Error: ${error.message}`

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
