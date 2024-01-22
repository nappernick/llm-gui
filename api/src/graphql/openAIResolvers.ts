import { listModels, sendMessage } from '../services/openAI/openAI'

export const resolvers = {
  Query: {
    listModels: () => {
      return listModels()
    },
    // ... other resolvers
  },
  Mutation: {
    sendMessage: async (_parent, { model, message }) => {
      return await sendMessage(model, message)
    },
  },
}
