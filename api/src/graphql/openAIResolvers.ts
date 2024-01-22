import {
  listModels,
  sendMessage,
  retrieveModel,
} from '../services/openAI/openAI'

export const resolvers = {
  Query: {
    listModels: () => {
      return listModels()
    },
    retrieveModel: (_parent, { modelId }) => {
      return retrieveModel(modelId)
    },
    // ... other resolvers
  },
  Mutation: {
    sendMessage: async (_parent, { model, message }) => {
      return await sendMessage(model, message)
    },
  },
}
