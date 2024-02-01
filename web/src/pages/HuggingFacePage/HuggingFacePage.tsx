
import { Box } from '@mui/material'
import { styled } from '@mui/system'

import { Metadata } from '@redwoodjs/web'

import HuggingFace from '../../components/HuggingFaceInterface/HuggingFaceInterface'

// Styled components using Material-UI
const PageContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  backgroundColor: '#fff',
})

const ChatContainer = styled(Box)({
  width: '100%', // Adjust the width as necessary
})

const HuggingFacePage = () => {
  return (
    <>
      <Metadata title="HuggingFace" description="HuggingFace page" />

      <PageContainer>
        <ChatContainer>
          <HuggingFace />
        </ChatContainer>
      </PageContainer>
    </>
  )
}

export default HuggingFacePage
