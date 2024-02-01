// src/components/ThreadMessageDisplay/ThreadMessageDisplay.tsx

import { useEffect, useRef } from 'react'

import { List, ListItem, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const useStyles = makeStyles({
  reactMarkdown: {
    maxWidth: '100%',
    wordWrap: 'break-word',
  },
})

const MessageDisplay = styled(List)({
  maxHeight: '500px', // Replace this with the maximum height you want
  overflowX: 'hidden',
  // Your additional styling here...
})

const ThreadMessageDisplay = ({ conversation }) => {
  const bottomListRef = useRef(null)
  const { reactMarkdown } = useStyles()

  useEffect(() => {
    if (bottomListRef.current) {
      const list = bottomListRef.current
      list.scrollTop = list.scrollHeight // Scroll to the bottom
    }
  }, [conversation]) // Triggered whenever the `conversation` prop changes

  return (
    <MessageDisplay ref={bottomListRef}>
      {conversation.map((message, index) => (
        <ListItem
          key={index}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            wordWrap: 'break-word',
          }}
        >
          <Typography variant="body1" color="textPrimary">
            {message.role === 'assistant' ? 'Assistant' : 'You'}
          </Typography>
          <div style={{ maxWidth: '100%', wordWrap: 'break-word' }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              className={reactMarkdown}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </ListItem>
      ))}
    </MessageDisplay>
  )
}

export default ThreadMessageDisplay
