// api/src/graphql/openAI.sdl.ts

export const schema = gql`
  type Mutation {
    saveImageInfo(
      title: String!
      url: String!
      textContent: String!
    ): FileUpload! @skipAuth
    createEmbedding(input: String!): [OpenAIEmbedding!]! @skipAuth
    createOpenAIEmbedding(input: String!): OpenAIEmbedding! @skipAuth

    findClosestMatch(queryEmbeddings: [[Int!]!], prompt: String!): MatchResult!
      @skipAuth

    askAssistant(
      threadId: String!
      messageContent: String!
      assistantId: String!
    ): String! @skipAuth

    interactWithThread(threadId: String!, message: MessageInput!): Message!
      @skipAuth

    createThread: Thread! @skipAuth

    sendMessageToAssistant(
      threadId: String!
      messageContent: String!
      assistantId: String!
    ): String! @skipAuth

    sendMessage(
      model: String!
      messages: [ChatMessageInput!]!
    ): ChatCompletionMessage! @skipAuth
  }

  type FileUpload {
    id: String!
    title: String!
    url: String!
    createdAt: DateTime!
    keywords: [String!]!
  }

  scalar DateTime

  type OpenAIEmbedding {
    index: Int
    object: String!
    embedding: [Int!]!
  }

  type MatchResult {
    promptText: String!
    similarity: Int!
  }

  type Model {
    id: String!
    object: String!
    created: Int!
    owned_by: String!
  }

  type Assistant {
    id: String!
    created_at: Int!
    description: String
    file_ids: [String!]!
    instructions: String
    metadata: JSON
    model: String!
    name: String
    object: String!
  }

  type Query {
    listModels: [Model!]! @skipAuth
    retrieveModel(modelId: String!): Model! @skipAuth
    listAssistants: [Assistant!]! @skipAuth
    retrieveAssistant(assistantId: String!): Assistant! @skipAuth
    listThreadRuns(threadId: String!): [Thread!]! @skipAuth
  }

  type ModelPermission {
    id: String!
    object: String!
    created: Int!
    allow_create_engine: Boolean!
    allow_sampling: Boolean!
    allow_logprobs: Boolean!
    allow_search_indices: Boolean!
    allow_view: Boolean!
    allow_fine_tuning: Boolean!
    organization: String!
    group: String
    is_blocking: Boolean!
  }
  type ChatMessage {
    role: String!
    content: String!
  }

  input ChatMessageInput {
    role: String!
    content: String!
  }

  type ChatCompletionMessage {
    role: String!
    content: String!
  }

  type ChatCompletionMessage {
    role: String!
    content: String!
  }

  type Thread {
    id: String!
    object: String!
    created_at: Int!
    metadata: JSON
  }

  type Message {
    id: String!
    object: String!
    created_at: Int!
    thread_id: String!
    role: String!
    content: String!
    file_ids: [String!]!
    metadata: JSON
  }

  input MessageInput {
    role: String!
    content: String!
    file_ids: [String!]
    metadata: JSON
  }
`
