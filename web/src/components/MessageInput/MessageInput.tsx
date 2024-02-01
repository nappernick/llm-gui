import { useState } from 'react'

import { Button, TextField } from '@mui/material'
import { styled } from '@mui/material/styles'

import FileUpload from '../FileUpload/FileUpload'

const InputContainer = styled('div')({
  width: '100%',
  display: 'flex',
  flexDirection: 'column', // Stack elements vertically.
  justifyContent: 'flex-end', // Push content to the bottom.
  height: '100%',
  overflow: 'auto',
})

const StyledForm = styled('form')({
  display: 'flex', // Place TextField and Button in a row.
  width: '100%', // Full width of the container.
  alignItems: 'center', // Center items vertically.
  margin: '8px 0px', // Add some spacing around the container.
})

const StyledTextField = styled(TextField)({
  flex: 1, // Grow to use available space.
  marginRight: '8px', // Add some spacing between TextArea and Button.
})

const StyledButton = styled(Button)({
  whiteSpace: 'nowrap', // Prevent button text wrapping.
  alignSelf: 'flex-end',
  marginBottom: '8px',
})

const MessageInput = ({ onSendMessage, loading, setErrors, errors }) => {
  const [message, setMessage] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onSendMessage(message)
    setMessage('')
  }

  return (
    <InputContainer>
      <StyledForm onSubmit={handleSubmit}>
        <FileUpload setErrors={setErrors} />
        <StyledTextField
          multiline // Allow for multiline input.
          minRows={2} // Minimum number of rows to show by default.
          maxRows={2} // Maximum number of rows to expand to.
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          variant="outlined" // A variant that allows styling the border.
        />
        <StyledButton type="submit" variant="contained" color="primary">
          {loading ? 'Sending...' : 'Send'}
        </StyledButton>
      </StyledForm>
    </InputContainer>
  )
}

export default MessageInput
