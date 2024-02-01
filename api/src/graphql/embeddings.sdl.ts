// api/src/graphql/embeddings.sdl.ts

export const schema = gql`
  type Embedding {
    id: Int!
    text: String!
    vector: String!
  }

  type Mutation {
    dbAddEmbedding(text: String!, vector: [Int!]!): Embedding! @skipAuth
  }
`
