// api/src/services/openAI/openAI.ts

import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const sendMessage = async (
  model: string,
  message: string
): Promise<string> => {
  const response = await openai.completions.create({
    model: model,
    prompt: message,
    max_tokens: 150,
  })
  return response.choices[0].text
}

export const listModels = async (): Promise<OpenAI.Model[]> => {
  const response = await openai.models.list()
  return response.data
}

export const retrieveModel = async (modelId: string) => {
  {
    const model = await openai.models.retrieve(modelId)
    return model
  }
}
