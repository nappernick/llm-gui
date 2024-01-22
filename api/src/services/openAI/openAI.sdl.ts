// api/src/graphql/openAI.sdl.ts

export const schema = gql`
  type Model {
    id: String!
    object: String!
    created_at: Int!
    owned_by: String!
    root: String
    parent: String
    permission: [ModelPermission!]!
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

  type Query {
    listModels: [Model!]!
  }

  type Mutation {
    sendMessage(model: String!, message: String!): String!
  }
`
