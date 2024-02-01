import { generate_text } from '../services/huggingface/huggingface';

// Resolver map
const resolvers = {
  Mutation: {
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
  },
}

export default resolvers
