export const schema = gql`
  type Mutation {
    generate_text(
      modelId: String!
      inputs: String!
      parameters: JSON
    ): Response! @skipAuth
  }

  type Response {
    generated_text: String!
  }
`
