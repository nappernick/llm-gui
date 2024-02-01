
import { createThread } from './threads'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('threads', () => {
  scenario('creates a thread', async () => {
    const result = await createThread()

    expect(result.object).toEqual('String')
    expect(result.metadata).toEqual({ foo: 'bar' })
  })
})
