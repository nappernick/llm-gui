import type { Meta, StoryObj } from '@storybook/react'

import HuggingFacePage from './HuggingFacePage'

const meta: Meta<typeof HuggingFacePage> = {
  component: HuggingFacePage,
}

export default meta

type Story = StoryObj<typeof HuggingFacePage>

export const Primary: Story = {}
