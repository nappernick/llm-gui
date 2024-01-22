import { render } from '@redwoodjs/testing/web'

import OpenAiAssistantPage from './OpenAiAssistantPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('OpenAiAssistantPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<OpenAiAssistantPage />)
    }).not.toThrow()
  })
})
