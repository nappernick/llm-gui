import type { Meta, StoryObj } from '@storybook/react'

import MistralAiPage from './MistralAiPage'

const meta: Meta<typeof MistralAiPage> = {
  component: MistralAiPage,
}

export default meta

type Story = StoryObj<typeof MistralAiPage>

export const Primary: Story = {}
