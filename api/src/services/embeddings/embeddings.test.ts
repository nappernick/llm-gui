import type { Embedding } from '@prisma/client'

import {
  embeddings,
  embedding,
  createEmbedding,
  updateEmbedding,
  deleteEmbedding,
} from './embeddings'
import type { StandardScenario } from './embeddings.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('embeddings', () => {
  scenario('returns all embeddings', async (scenario: StandardScenario) => {
    const result = await embeddings()

    expect(result.length).toEqual(Object.keys(scenario.embedding).length)
  })

  scenario('returns a single embedding', async (scenario: StandardScenario) => {
    const result = await embedding({ id: scenario.embedding.one.id })

    expect(result).toEqual(scenario.embedding.one)
  })

  scenario('creates a embedding', async () => {
    const result = await createEmbedding({
      input: { text: 'String', vector: 'String' },
    })

    expect(result.text).toEqual('String')
    expect(result.vector).toEqual('String')
  })

  scenario('updates a embedding', async (scenario: StandardScenario) => {
    const original = (await embedding({
      id: scenario.embedding.one.id,
    })) as Embedding
    const result = await updateEmbedding({
      id: original.id,
      input: { text: 'String2' },
    })

    expect(result.text).toEqual('String2')
  })

  scenario('deletes a embedding', async (scenario: StandardScenario) => {
    const original = (await deleteEmbedding({
      id: scenario.embedding.one.id,
    })) as Embedding
    const result = await embedding({ id: original.id })

    expect(result).toEqual(null)
  })
})
