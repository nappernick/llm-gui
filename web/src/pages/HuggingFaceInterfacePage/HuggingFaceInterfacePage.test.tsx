import { render } from '@redwoodjs/testing/web'

import HuggingFaceInterfacePage from './HuggingFaceInterfacePage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('HuggingFaceInterfacePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<HuggingFaceInterfacePage />)
    }).not.toThrow()
  })
})
