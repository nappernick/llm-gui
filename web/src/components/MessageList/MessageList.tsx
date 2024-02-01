// src/components/MessageDisplay/MessageDisplay.tsx
import { useEffect, useRef } from 'react'

import { List, ListItem, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const MessageDisplay = styled(List)({
  maxHeight: '500px',
  overflow: 'auto', // Add additional styling...
})

const MessageList = ({ conversation }) => {
  const bottomListRef = useRef(null)

  useEffect(() => {
    if (bottomListRef.current) {
      const list = bottomListRef.current
      list.scrollTop = list.scrollHeight // Scroll to the bottom
    }
  }, [conversation])
  return (
    <MessageDisplay ref={bottomListRef}>
      {conversation.map((message, index) => (
        <ListItem
          key={index}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            overflow: 'wrap',
          }}
        >
          {' '}
          <Typography variant="body1" color="textPrimary">
            {' '}
            {message.role === 'system' ? 'Model' : 'You'}{' '}
          </Typography>{' '}
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>{' '}
        </ListItem>
      ))}{' '}
    </MessageDisplay>
  )
}
export default MessageList
