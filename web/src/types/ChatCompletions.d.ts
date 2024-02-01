export type ChatMessage = {
  role: 'user' | 'system' | 'assistant'
  content: string
}

export type ChatCompletionChoice = {
  index: number
  message: ChatMessage
  logprobs: unknown // Replace 'any' with the actual type if logprobs are used
  finish_reason: 'stop' | string // Replace 'string' with actual reasons if they are known and finite
}

export type ChatCompletion = {
  id: string
  object: 'chat.completion'
  created: number
  model: string
  system_fingerprint: string
  choices: ChatCompletionChoice[]
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export type ConversationHistory = {
  messages: ChatMessage[]
}
