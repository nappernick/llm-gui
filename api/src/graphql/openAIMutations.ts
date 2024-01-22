import { sendMessage } from '../services/openAI/openAI'

export const openAIMutations = {
  sendMessage: ({ model, message }) => {
    return sendMessage(model, message)
  },
}
