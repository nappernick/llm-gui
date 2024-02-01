import { OpenAI } from 'openai'

import { db } from 'src/lib/db'

const openai = new OpenAI()

export const createThread = async (): Promise<OpenAI.Beta.Thread> => {
  try {
    const response = await openai.beta.threads.create()
    await db.thread.create({
      data: {
        id: response.id,
        createdAt: response.created_at,
        object: response.object,
        metadata:
          typeof response.metadata === 'object' ? response.metadata : {},
      },
    })
    return response
  } catch (error) {
    console.error('Error creating a new thread:', error)
    throw new Error('Failed to create a new thread')
  }
}
