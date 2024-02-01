import { useCallback, useState } from 'react'

import { Button, CircularProgress } from '@material-ui/core'
import { useDropzone } from 'react-dropzone'
import styled from 'styled-components'

import { compressAndCleanText } from '../../../../scripts/compress-text'

const Container = styled.div`
  border: 2px dashed #cccccc;
  border-radius: 5px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
`

const StyledLink = styled.a`
  margin-top: 10px;
  display: block;
`

const CompressFileComponent = () => {
  const [loading, setLoading] = useState(false)
  const [fileLink, setFileLink] = useState('')
  const [fileName, setFileName] = useState('')

  const onDrop = useCallback((acceptedFiles) => {
    // Do something with the files
    const file = acceptedFiles[0]
    setFileName(file.path)
    setLoading(true)

    // Here we simulate file reading and compression
    const reader = new FileReader()
    reader.onabort = () => console.log('file reading was aborted')
    reader.onerror = () => console.log('file reading has failed')

    reader.onload = () => {
      // Here, we directly invoke compressAndCleanText with the file text
      const text = reader.result as string
      const compressedText = compressAndCleanText(text)
      const blob = new Blob([compressedText], { type: 'text/plain' })
      console.log(compressedText)
      const compressedFileLink = window.URL.createObjectURL(blob)
      setFileLink(compressedFileLink)
      setLoading(false)
    }
    reader.readAsText(file)
  }, [])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Container>
        {loading ? (
          <CircularProgress />
        ) : (
          "Drag 'n' drop some files here, or click to select files"
        )}
      </Container>
      <Button
        variant="contained"
        color="primary"
        disabled={loading || !fileLink}
      >
        Compress
      </Button>
      {fileLink && (
        <StyledLink
          href={fileLink}
          download={`${fileName.split('.')[0]}-compressed.txt`}
        >
          Download Compressed File
        </StyledLink>
      )}
    </div>
  )
}

export default CompressFileComponent
