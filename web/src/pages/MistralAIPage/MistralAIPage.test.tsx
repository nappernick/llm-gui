import { render } from '@redwoodjs/testing/web'

import MistralAiPage from './MistralAiPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('MistralAiPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<MistralAiPage />)
    }).not.toThrow()
  })
})
