import { useState } from 'react'

import AttachFileIcon from '@mui/icons-material/AttachFile'
import {
  Box,
  Button,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'
import gql from 'graphql-tag'

import { useMutation } from '@redwoodjs/web'

const Container = styled(Box)(({ theme }) => ({
  height: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(3),
  boxSizing: 'border-box',
}))

const Title = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 600, // A bit bolder than 'bold'
  marginBottom: '1rem', // Example spacing, adjust to match the screenshot
})

const StyledTextField = styled(TextField)({
  flexGrow: 1,
  margin: '0.5rem 0', // Example spacing, adjust to match the screenshot
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#e0e0e0', // Example border color, adjust to match the screenshot
    },
    '&:hover fieldset': {
      borderColor: '#bdbdbd', // Example hover border color, adjust to match the screenshot
    },
    '&.Mui-focused fieldset': {
      borderColor: 'orange', // Example focus border color
    },
  },
})

const OutputArea = styled(Paper)({
  flexGrow: 9, // Example shadow, adjust to match screenshot
  display: 'flex',
  flexDirection: 'column-reverse', // Newest content at the bottom
  overflow: 'auto',
  background: '#f5f5f5', // Example background, adjust to match the screenshot
  padding: '0.5rem', // Example padding, adjust to match the screenshot
  marginTop: '0.5rem', // Example margin, adjust to match the screenshot
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Example shadow, adjust to match the screenshot
})

const SendButton = styled(Button)({
  background: 'orange',
  '&:hover': {
    background: 'darkorange',
  },
  margin: '0.5rem 0', // Example spacing, adjust to match the screenshot
})

const PaperClipButton = styled(IconButton)({
  color: 'gray', // Example color, adjust to match the screenshot
})

// Correct mutation definition
const GENERATE_TEXT = gql`
  mutation generate_text(
    $modelId: String!
    $inputs: String!
    $parameters: JSON
  ) {
    generate_text(modelId: $modelId, inputs: $inputs, parameters: $parameters) {
      generated_text
    }
  }
`

const HuggingFace = () => {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState([])
  // Destructured mutation function with appropriate variables and types
  const [generate_text, { data, loading, error }] = useMutation(GENERATE_TEXT)

  const handleInputChange = (event) => {
    setInput(event.target.value)
  }

  const handleSend = async () => {
    setInput('')
    setOutput([{ input }, ...output])
    try {
      await generate_text({
        variables: {
          modelId: 'your-model-id', // Make sure to have the right model ID here
          inputs: input,
          parameters: {
            trust_remote_code: 'True',
            max_length: 4000, // Limit to 100 tokens.
            return_full_text: false, // Only return the newly generated text.
            temperature: 0.7, // Randomness in generation.
            top_p: 0.9, // Nucleus sampling.
            top_k: 40, // Limit the token set considered at each step.
            max_new_tokens: 1000, // Limit the number of tokens generated.
            // Your parameters here...
          },
        },
      })
      // Check if the mutation succeeded and update the state accordingly
      if (data && data.generate_text) {
        console.log('data', data)
        setOutput([{ response: data.generate_text.generated_text }, ...output])
      }
    } catch (err) {
      console.error('Error while calling the Hugging Face API', err)
      // Don't clear the input in case of error
    }
  }

  return (
    <Container>
      <Title variant="h4">HUGGING FACE</Title>
      <PaperClipButton size="large">
        <AttachFileIcon />
      </PaperClipButton>
      {error && (
        <Typography color="error">
          An error occurred: {error.message}
        </Typography>
      )}
      <OutputArea elevation={3}>
        {output.map((item, index) => (
          <Box key={index}>
            <Typography color="textPrimary">User: {item.input}</Typography>
            {item.response && (
              <Typography color="textSecondary">AI: {item.response}</Typography>
            )}
          </Box>
        ))}
      </OutputArea>
      <StyledTextField
        multiline
        maxRows={4}
        value={input}
        onChange={handleInputChange}
        placeholder="Enter your message..."
      />
      <SendButton onClick={handleSend} disabled={loading}>
        {loading ? 'Sending...' : 'Send'}
      </SendButton>
    </Container>
  )
}

export default HuggingFace
