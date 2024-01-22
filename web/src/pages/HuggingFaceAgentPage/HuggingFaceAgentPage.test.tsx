import { render } from '@redwoodjs/testing/web'

import HuggingFaceAgentPage from './HuggingFaceAgentPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('HuggingFaceAgentPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<HuggingFaceAgentPage />)
    }).not.toThrow()
  })
})
