import { useEffect, useState } from 'react'

import { Alert, CircularProgress } from '@mui/material'
import { PickerInline } from 'filestack-react'

import { useMutation } from '@redwoodjs/web'

const SAVE_IMAGE_INFO_MUTATION = gql`
  mutation SaveImageInfo(
    $title: String!
    $url: String!
    $textContent: String!
  ) {
    saveImageInfo(title: $title, url: $url, textContent: $textContent) {
      id
    }
  }
`

const FileUpload = ({ setErrors }) => {
  const [saveImageInfo] = useMutation(SAVE_IMAGE_INFO_MUTATION)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [overlay, setOverlay] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    if (selectedFile) {
      setTimeout(() => {
        setSelectedFile(null)
      }, 5000)
    }
  }, [selectedFile])

  const fetchTextContent = async (fileUrl) => {
    try {
      const response = await fetch(fileUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch file content from ${fileUrl}`)
      }
      const text = await response.text()
      return text
    } catch (e) {
      console.error('Error fetching file content:', e)
      throw e
    }
  }

  const onFileUpload = async (response) => {
    setLoading(true)
    const { filesUploaded } = response
    if (filesUploaded.length > 0) {
      const fileTyped = filesUploaded[0] as unknown as {
        url: string
        filename: string
      }
      try {
        // Fetch the text content from the file URL
        const textContent = await fetchTextContent(fileTyped.url)

        // Save the file info using your GraphQL mutation, including the text content
        const file = await saveImageInfo({
          variables: {
            title: fileTyped.filename,
            url: fileTyped.url,
            textContent: textContent,
          },
        })
        console.info('File processed successfully.')
        setSelectedFile(file)
      } catch (e) {
        console.error('Error processing file:', e)
        setError(e)
        setErrors((prevErrors) => [...prevErrors, e.message])
      }
    }
    setLoading(false)
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <PickerInline
        apikey={process.env.REDWOOD_ENV_FILESTACK_API_KEY}
        onSuccess={onFileUpload}
        onError={(e) => setError(e)}
        multiple={true}
        pickerOptions={{
          displayMode: 'dropPane',
          dropPane: {
            onClick: () => setOverlay(true),
            overlay,
            showIcon: false,
            customText: 'Upload',
          },
        }}
      >
        <div style={{ maxHeight: '65px', width: '95px' }}></div>
      </PickerInline>
      {loading && <CircularProgress />}
      {selectedFile && !error && (
        <Alert severity="success" style={{ width: '100%', marginTop: '8px' }}>
          {`${selectedFile.filename} uploaded successfully.`}
        </Alert>
      )}
    </div>
  )
}

export default FileUpload
