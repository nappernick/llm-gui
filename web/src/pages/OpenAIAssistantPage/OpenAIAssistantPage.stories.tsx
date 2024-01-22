import type { Meta, StoryObj } from '@storybook/react'

import OpenAiAssistantPage from './OpenAiAssistantPage'

const meta: Meta<typeof OpenAiAssistantPage> = {
  component: OpenAiAssistantPage,
}

export default meta

type Story = StoryObj<typeof OpenAiAssistantPage>

export const Primary: Story = {}
