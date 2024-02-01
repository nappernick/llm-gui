import type { Prisma, Thread } from '@prisma/client'

import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.ThreadCreateArgs>({
  thread: {
    one: {
      data: {
        object: 'String',
        createdAt: Number(new Date().toDateString()),
        metadata: { foo: 'bar', createdAt: new Date() },
      },
    },
    two: {
      data: {
        object: 'String',
        createdAt: Number(new Date().toDateString()),
        metadata: { foo: 'bar', createdAt: new Date() },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Thread, 'thread'>
