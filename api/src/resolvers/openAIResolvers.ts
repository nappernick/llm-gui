// api/src/resolvers/openAIResolvers.ts

import {
  createEmbedding,
  createOpenAIEmbedding,
  findClosestMatch,
} from '../services/embeddings/embeddings'
import { generate_text } from '../services/huggingface/huggingface'
import {
  askAssistant,
  createThread,
  interactWithThread,
  listAssistants,
  listModels,
  retrieveAssistant,
  retrieveModel,
  saveImageInfo,
  sendMessage,
  sendMessageToAssistant,
} from '../services/openAI/openAI'

export const resolvers = {
  Query: {
    listModels: () => {
      return listModels()
    },
    retrieveModel: (_parent, args: { modelId: string }) => {
      return retrieveModel(args)
    },
    listAssistants: async () => {
      return await listAssistants()
    },
    retrieveAssistant: async (_parent, args: { assistantId: string }) => {
      return await retrieveAssistant(args)
    },
  },
  Mutation: {
    findClosestMatch: async (_parent, args) => {
      return findClosestMatch(args)
    },
    createEmbedding: async (_parent, args) => {
      return createEmbedding(args)
    },
    createOpenAIEmbedding: async (_parent, args) => {
      return createOpenAIEmbedding(args)
    },
    askAssistant: async (_parent, args) => {
      return askAssistant(args)
    },
    sendMessage: async (_parent, args) => {
      return await sendMessage(args)
    },
    // Resolver function for sendInput mutation
    generate_text: async (
      _,
      {
        inputs,
        parameters,
      }: { modelId: string; inputs: string; parameters?: any }
    ) => {
      // Call the sendInput method of our service with the given args
      const response = await generate_text({ inputs, parameters })

      // Assuming the result structure matches that of our SDL definition
      return {
        generated_text: response.generated_text,
      }
    },
    interactThread: (threadArgs) => {
      return interactWithThread(threadArgs)
    },
    createThread: () => {
      return createThread()
    },
    sendMessageToAssistant: (args) => {
      return sendMessageToAssistant(args)
    },
    saveImageInfo: (args) => {
      return saveImageInfo(args)
    },
  },
}
