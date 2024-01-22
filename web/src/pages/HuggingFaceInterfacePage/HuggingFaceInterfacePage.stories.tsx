import type { Meta, StoryObj } from '@storybook/react'

import HuggingFaceInterfacePage from './HuggingFaceInterfacePage'

const meta: Meta<typeof HuggingFaceInterfacePage> = {
  component: HuggingFaceInterfacePage,
}

export default meta

type Story = StoryObj<typeof HuggingFaceInterfacePage>

export const Primary: Story = {}
