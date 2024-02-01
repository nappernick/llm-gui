import type { Embedding, Prisma } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.EmbeddingCreateArgs>({
  queryEmbedding: {
    one: { data: { text: 'String', vector: 'String' } },
    two: { data: { text: 'String', vector: 'String' } },
  },
})

export type StandardScenario = ScenarioData<Embedding, 'queryEmbedding'>
