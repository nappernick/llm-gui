// web/src/pages/OpenAIAssistantPage/OpenAIAssistantPage.tsx

import { useState } from 'react'

import ChatInterface from '../../components/ChatInterface/ChatInterface'
import ModelSelector from '../../components/ModelSelector/ModelSelector'

const OpenAIAssistantPage = () => {
  {
    const [conversation, setConversation] = useState([])
    const [model, setModel] = useState('text-davinci-003') // Default model

    const handleModelSelect = (model) => {
      setModel(model)
    }

    return (
      <div>
        <h1>OpenAI Assistant</h1>
        <ModelSelector onModelSelect={handleModelSelect} />
        <ChatInterface
          conversation={conversation}
          setConversation={setConversation}
          model={model}
        />
      </div>
    )
  }
}

export default OpenAIAssistantPage
