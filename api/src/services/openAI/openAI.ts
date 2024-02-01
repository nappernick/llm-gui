// api/src/services/openAI/openAI.ts

import { PrismaClient } from '@prisma/client'
import OpenAI from 'openai'

import { extractKeywords } from 'src/lib/utils'

import {
  createOpenAIEmbedding,
  mongoDbFindSimilar,
} from '../embeddings/embeddings'

const db = new PrismaClient()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

type SendMessageArgs = {
  model: string
  messages: Array<OpenAI.ChatCompletionMessageParam>
}

type InteractThreadArgs = {
  threadId: string
  message: OpenAI.Beta.Threads.MessageCreateParams
}

export const sendMessage = async (
  args: SendMessageArgs
): Promise<OpenAI.ChatCompletionMessage> => {
  const { model, messages } = args
  let max_tokens = 3500
  if (model.includes('-16k-')) {
    max_tokens = 6000
  }

  // Extract keywords from user messages
  const userKeywords = messages.reduce((keywords, message) => {
    if (message.role === 'user') {
      const messageKeywords = extractKeywords(message.content)
      return [...keywords, ...messageKeywords]
    }
    return keywords
  }, [])

  // Find the last user message
  const lastUserMessageIndex = messages
    .map((message, index) => ({ role: message.role, index }))
    .filter(({ role }) => role === 'user')
    .pop().index

  // Append the extracted keywords to the last user message content
  messages[lastUserMessageIndex].content += ` ${userKeywords.join(' ')}`

  try {
    const response = await openai.chat.completions.create({
      model,
      messages,
      max_tokens,
      // Include additional parameters as needed.
    })

    if (response.choices && response.choices.length > 0) {
      console.dir('response', response)
      // Assuming you want the first choice's message.
      return response.choices[0].message
    } else {
      throw new Error('No choices returned from OpenAI')
    }
  } catch (error) {
    // Log the full error to provide more insight
    console.error('Error while sending message to OpenAI:', error)
    if (error instanceof Error) {
      // If it's an instance of `Error`, it will have the `message` property.
      throw new Error(`Failed to send message to OpenAI: ${error.message}`)
    } else {
      // For non-`Error` types, we stringify the complete error.
      throw new Error(
        `Failed to send message to OpenAI: ${JSON.stringify(error)}`
      )
    }
  }
}

export const listModels = async (): Promise<OpenAI.Model[]> => {
  const response = await openai.models.list()
  return response.data
}

export const retrieveModel = async ({ modelId }) => {
  {
    const model = await openai.models.retrieve(modelId)
    return model
  }
}

export const listAssistants = async (): Promise<OpenAI.Beta.Assistant[]> => {
  const response = await openai.beta.assistants.list()
  return response.data
}

export const retrieveAssistant = async ({
  assistantId,
}): Promise<OpenAI.Beta.Assistant> => {
  const response = await openai.beta.assistants.retrieve(assistantId)
  return response
}

export const interactWithThread = async (
  args: InteractThreadArgs
): Promise<OpenAI.Beta.Threads.Messages.ThreadMessage> => {
  const { threadId, message } = args
  try {
    const response = await openai.beta.threads.messages.create(
      threadId,
      message
    )
    return response
  } catch (error) {
    console.error('Error interacting with thread:', error)
    throw new Error('Failed to interact with thread')
  }
}

export const listThreadRuns = async ({
  threadId,
}): Promise<OpenAI.Beta.Threads.Run[]> => {
  const response = await openai.beta.threads.runs.list(threadId)
  return response.data
}

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

export const sendMessageToAssistant = async ({
  threadId,
  messageContent,
  assistantId,
}): Promise<string> => {
  // Convert messageContent to an embedding vector for similarity search
  const queryVector = await createOpenAIEmbedding(messageContent)

  // Find similar documents based on the query vector
  const similarDocs = await mongoDbFindSimilar(queryVector)

  // Enhance messageContent based on similarDocs
  let enhancedContent = messageContent
  if (similarDocs.length > 0) {
    // Example: Append a note about similar topics found
    const similarTopics = similarDocs
      .map((doc) => doc.title) // Assuming each doc has a 'title'
      .join(', ')

    enhancedContent += `\n\nSimilar topics found: ${similarTopics}.`
  }

  // Step 2: Add the enhanced message to a thread
  await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: enhancedContent,
  })
  // Step 2: Add a Message to a Thread
  await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: messageContent,
  })

  // Step 3: Run the Assistant
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId,
    instructions: messageContent,
  })

  // Step 4: Check the Run status
  let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id)

  // Wait for the run to complete and then retrieve the response
  while (runStatus.status !== 'completed') {
    runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id)
  }

  // Step 5: Display the Assistant's Response
  const messages = await openai.beta.threads.messages.list(threadId)

  // Extract the assistant's response
  const assistantMessages = messages.data.filter((message) => {
    if (message.role === 'assistant' && message.content[0].type === 'text')
      return message
  })

  if (
    assistantMessages.length > 0 &&
    assistantMessages[0].content[0].type === 'text'
  ) {
    // Assuming you want the first assistant's message content.
    return assistantMessages[0].content[0].text.value
  }
  return ''
}

export const askAssistant = async (args) => sendMessageToAssistant(args)

export const saveImageInfo = async ({ title, url, textContent }) => {
  try {
    // Generate prompt for OpenAI to extract keywords
    const promptForKeywords = `Summarize the main topics or keywords from the following text: ${textContent}. Make your response only a list of comma seperated values and nothing else.`
    const openaiResponse = await openai.chat.completions.create({
      messages: [{ role: 'system', content: promptForKeywords }],
      model: 'gpt-3.5-turbo-16k-0613', // Ensure you pass the correct model ID
    })

    // Extract keywords from OpenAI's response
    const extractedKeywords = extractKeywords(
      openaiResponse.choices[0].message.content
    )

    // Save the title, URL, and extracted keywords to the database
    const imageInfo = await db.fileUpload.create({
      data: {
        title,
        url,
        keywords: extractedKeywords, // Assuming the Prisma model is adjusted to accept keywords
      },
    })

    return {
      id: imageInfo.id,
      title: imageInfo.title,
      url: imageInfo.url,
      keywords: imageInfo.keywords,
      createdAt: imageInfo.createdAt,
    }
  } catch (error) {
    console.error('Error saving image info and extracting keywords:', error)
    throw error
  }
}
