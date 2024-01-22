import type { Meta, StoryObj } from '@storybook/react'

import HuggingFaceAgentPage from './HuggingFaceAgentPage'

const meta: Meta<typeof HuggingFaceAgentPage> = {
  component: HuggingFaceAgentPage,
}

export default meta

type Story = StoryObj<typeof HuggingFaceAgentPage>

export const Primary: Story = {}
