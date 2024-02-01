// web/src/components/ProcessRepoForm/ProcessRepoForm.tsx
import React, { useState } from 'react'

import styled from 'styled-components'

// Styled components
const FormContainer = styled.div`
  background: #f5f5f5;
  padding: 20px;
  margin: 20px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
  border-radius: 5px;
`

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`

const StyledInput = styled.input`
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
`

const StyledButton = styled.button`
  background: #ff7f50;
  color: white;
  border: none;
  padding: 10px 15px;
  margin: 10px 0;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background: #ff7043;
  }
`

const Message = styled.p`
  color: #ff7f50;
`

// The ProcessRepoForm component
const ProcessRepoForm: React.FC = () => {
  const [modelId, setModelId] = useState('')
  const [repoUrl, setRepoUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)

    // Here you would have the fetch call to your API endpoint
    // After fetch:
    setIsLoading(false)
    setMessage('Repository processed successfully!')
    // In case of errors:
    // setError('Failed to process the repository.');
  }

  return (
    <FormContainer>
      <StyledForm onSubmit={handleSubmit}>
        <StyledInput
          type="text"
          value={modelId}
          onChange={(e) => setModelId(e.target.value)}
          placeholder="Model ID"
        />
        <StyledInput
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="Repository URL"
        />
        <StyledButton type="submit">Run</StyledButton>
        {isLoading && <Message>Loading...</Message>}
        {message && <Message>{message}</Message>}
        {error && <Message>{error}</Message>}
      </StyledForm>
    </FormContainer>
  )
}

export default ProcessRepoForm
