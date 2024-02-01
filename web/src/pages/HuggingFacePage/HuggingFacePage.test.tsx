import { render } from '@redwoodjs/testing/web'

import HuggingFacePage from './HuggingFacePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('HuggingFacePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<HuggingFacePage />)
    }).not.toThrow()
  })
})
