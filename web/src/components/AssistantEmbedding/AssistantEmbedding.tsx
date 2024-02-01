import { useMemo, useState } from 'react'

import AttachFileIcon from '@mui/icons-material/AttachFile'
import {
  Alert,
  Button,
  CircularProgress,
  Paper,
  Snackbar,
  TextField,
} from '@mui/material'
import { useDropzone } from 'react-dropzone'

import { useMutation } from '@redwoodjs/web'

const FILE_UPLOAD_MUTATION = gql`
  mutation CreateEmbedding($input: String!) {
    createEmbedding(input: $input) {
      index
      object
      embedding
    }
  }
`

const ASK_ASSISTANT_MUTATION = gql`
  mutation AskAssistantMutation(
    $messageContent: String!
    $threadId: String!
    $assistantId: String!
  ) {
    askAssistant(
      messageContent: $messageContent
      threadId: $threadId
      assistantId: $assistantId
    )
  }
`

const FileUploadAndQueryComponent = ({ assistant, threadId }) => {
  const [askAssistant, { error: askAssistantError }] = useMutation(
    ASK_ASSISTANT_MUTATION
  )
  const [
    createEmbedding,
    { error: createEmbeddingError, loading: createEmbeddingLoading },
  ] = useMutation(FILE_UPLOAD_MUTATION)
  const [uploading, setUploading] = useState(false)
  const [query, setQuery] = useState('')
  const [response, setResponse] = useState('')
  const error = useMemo(() => {
    return askAssistantError || createEmbeddingError
  }, [askAssistantError, createEmbeddingError])
  const onDrop = async (acceptedFiles) => {
    setUploading(true)
    // Assuming using FileReader to read the file, here's a simplified example
    const reader = new FileReader()
    reader.onload = async (event) => {
      const text = event.target.result
      await createEmbedding({
        variables: { input: text },
      })
    }
    reader.readAsText(acceptedFiles[0])
    setUploading(false)
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  const handleQuerySubmit = async () => {
    console.log('QUERY', query)
    try {
      const response = await askAssistant({
        variables: {
          threadId,
          messageContent: query,
          assistantId: assistant.id,
        },
      })
      setResponse(response.data.askAssistant)
      setQuery('')
    } catch (err) {
      console.warn(err.message)
    }
  }

  return (
    <div
      style={{
        margin: '20px 0px',
      }}
    >
      <Paper
        {...getRootProps()}
        elevation={3}
        style={{
          padding: '20px',
          margin: '20px',
        }}
      >
        <input {...getInputProps()} />
        <Button variant="contained" component="span" fullWidth>
          <AttachFileIcon />
          Upload Document
        </Button>
      </Paper>
      {uploading && <CircularProgress />}
      <TextField
        label="Enter your query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleQuerySubmit}>
        Ask Assistant
      </Button>
      {response && <div>{response}</div>}
      <Snackbar
        open={createEmbeddingLoading}
        autoHideDuration={6000}
        message="Processing..."
      />
      {error && (
        <Snackbar open={true} autoHideDuration={6000}>
          <Alert severity="error">{error.message}</Alert>
        </Snackbar>
      )}
    </div>
  )
}

export default FileUploadAndQueryComponent
