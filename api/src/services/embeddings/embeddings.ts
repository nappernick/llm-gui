// api/src/services/embeddings/embeddings.ts
import { PrismaClient } from '@prisma/client'
import { MongoClient, ServerApiVersion } from 'mongodb'
import { OpenAI } from 'openai'
import type { MutationResolvers, OpenAIEmbedding } from 'types/graphql'
const username = encodeURIComponent('testuser')
const password = encodeURIComponent('ngvp123456')
// MongoDB connection URI and database/collection names
const uri = `mongodb+srv://${username}:${password}@vector.c7kqfbv.mongodb.net/?retryWrites=true&w=majority`

const DB_NAME = 'embeddings'
const COLLECTION_NAME = 'vectors'

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

const RELEVANCE_THRESHOLD = 0.5 // for example, only consider matches above a 0.5 cosine similarity
const MAX_EMBEDDINGS_RETURNED = 5 // for example, return the top 5 closest embeddings

import { cosineSimilarity, stringToVector } from '../../lib/utils'

const db = new PrismaClient()
const configuration = {
  apiKey: process.env.OPENAI_API_KEY,
}
const openai = new OpenAI(configuration)

const extractKeywords = async (textContent) => {
  const promptForKeywords = `Summarize the main topics or keywords from the following text: ${textContent}. Make your response only a list of comma-separated values and nothing else. Be exhuastive, including all reasonable key words.`
  const openaiResponse = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k-0613',
    messages: [{ role: 'system', content: promptForKeywords }],
  })

  // Assuming the response format is a single message with comma-separated keywords
  const keywords = openaiResponse.choices[0].message.content
    .split(',')
    .map((keyword) => keyword.trim())

  return keywords
}

const segmentContent = async (textContent) => {
  const promptForSegmentation = `Divide the following text into logical segments. Prefix each segment with "Segment:" and ensure each segment is a coherent unit of text.\n\n${textContent}`

  const openaiResponse = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo-16k-0613',
    messages: [{ role: 'system', content: promptForSegmentation }],
  })

  // Parse the response to extract segments
  const segmentsText = openaiResponse.choices[0].message.content
  const segments = segmentsText
    .split('Segment:')
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0)

  return segments
}

const mongoDbInsertDocument = async (title, chunks, metadata) => {
  try {
    await client.connect()
    console.log('DB connected')
    const db = client.db(DB_NAME)
    console.log('DB connected', db)
    const collection = db.collection(COLLECTION_NAME)
    console.log('collection connected', collection)
    const result = await collection.insertOne({
      title,
      chunks,
      metadata,
    })
    console.log(`A document was inserted with the _id: ${result.insertedId}`)
  } finally {
    await client.close()
  }
}

export const createAndStoreDocument = async ({
  content,
}): Promise<OpenAIEmbedding[]> => {
  try {
    const tags = await extractKeywords(content)
    const segments = await segmentContent(content)

    const chunks: OpenAIEmbedding[] = await Promise.all(
      segments.map(async (segment, index) => {
        const embeddingVector = await createOpenAIEmbedding(segment)
        // Store each chunk's embedding in MongoDB directly
        await mongoDbInsertDocument(
          segment,
          [{ text: segment, embedding: embeddingVector }],
          { tags }
        )

        const embedding = await db.embedding.create({
          data: {
            text: content,
            vector: embeddingVector.embedding.join(','),
          },
        })
        const openAIEmbedding: OpenAIEmbedding = {
          index: index + 1,
          object: segment,
          embedding: embedding.vector.split(',').map(Number),
        }
        return openAIEmbedding
      })
    )

    console.log(
      'Document with chunks, embeddings, and tags saved successfully.'
    )
    return chunks
  } catch (error) {
    console.error('Error in document processing:', error)
    throw new Error('Failed to process and save document in MongoDB')
  }
}

// Function that takes large text, splits into chunks, and returns an array of embedding vectors
export const createEmbedding: MutationResolvers['createEmbedding'] = async ({
  input,
}): Promise<OpenAIEmbedding[]> => {
  const embeddings = await createAndStoreDocument({ content: input })

  // Wrap the 1D array 'embeddings' in another array to make it a 2D array
  return embeddings // Now it returns a 2D array as expected by the GraphQL schema
}

export const createOpenAIEmbedding = async (
  text: string
): Promise<OpenAI.Embeddings.Embedding> => {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-large', // Replace with your chosen model - text-embedding-ada-002, text-embedding-3-large, text-embedding-3-small
    input: text,
  })

  if (response.data[0].embedding) {
    console.log('Embedding creation successful.', response.data[0])
    return response.data[0]
  } else {
    console.warn('Embedding creation failed.', response)
    throw new Error('Embedding creation failed.')
  }
}

// Function to find the closest match in the database to a query embedding
export const findClosestMatch = async (userQueryEmbedding) => {
  const embeddings = await db.embedding.findMany()

  // Placeholder for accumulating relevant embeddings
  let relevantEmbeddings = []

  // Iterate over the embeddings in the database to find matches.
  for (const dbEmbedding of embeddings) {
    const currentSimilarity = cosineSimilarity(
      stringToVector(userQueryEmbedding),
      dbEmbedding.vector
    )

    // Option: Define a threshold for similarity to consider an embedding relevant
    if (currentSimilarity > RELEVANCE_THRESHOLD) {
      relevantEmbeddings.push({
        queryEmbedding: dbEmbedding.text, // assuming dbEmbedding.text holds the queryEmbedding text
        similarity: currentSimilarity,
      })
    }
  }

  // Sort the relevant embeddings by similarity in descending order
  relevantEmbeddings.sort((a, b) => b.similarity - a.similarity)

  // Optionally, limit the number of embeddings returned based on your application's needs
  if (relevantEmbeddings.length > MAX_EMBEDDINGS_RETURNED) {
    relevantEmbeddings = relevantEmbeddings.slice(0, MAX_EMBEDDINGS_RETURNED)
  }

  // If there are no relevant embeddings found, handle it accordingly.
  if (relevantEmbeddings.length === 0) {
    throw new Error('No relevant matches found.')
  }

  return relevantEmbeddings
}

export const mongoDbFindSimilar = async (queryVector) => {
  try {
    await client.connect()
    const db = client.db(DB_NAME)
    const collection = db.collection(COLLECTION_NAME)

    const pipeline = [
      // Step 1: Deconstruct the 'chunks' array field from each document
      // This will create a new document for each chunk in the array for further processing
      { $unwind: '$chunks' },

      // Step 2: Add a new field 'chunks.similarity' to each chunk-document
      // This field will store the calculated cosine similarity between the chunk's embedding and the query vector
      {
        $addFields: {
          'chunks.similarity': {
            $let: {
              vars: {
                // Calculate the dot product of the chunk embedding and the query vector
                dotProduct: {
                  $sum: {
                    $map: {
                      input: queryVector,
                      as: 'qe',
                      in: {
                        $multiply: [
                          '$$qe', // Element from the query vector
                          {
                            // Corresponding element from the chunk embedding
                            $arrayElemAt: [
                              '$chunks.embedding',
                              { $indexOfArray: [queryVector, '$$qe'] },
                            ],
                          },
                        ],
                      },
                    },
                  },
                },
                // Calculate the magnitude of the query vector
                magnitudeA: {
                  $sqrt: {
                    $sum: {
                      $map: {
                        input: queryVector,
                        as: 'qe',
                        in: { $multiply: ['$$qe', '$$qe'] },
                      },
                    },
                  },
                },
                // Calculate the magnitude of the chunk embedding
                magnitudeB: {
                  $sqrt: {
                    $sum: {
                      $map: {
                        input: '$chunks.embedding',
                        as: 'e',
                        in: { $multiply: ['$$e', '$$e'] },
                      },
                    },
                  },
                },
              },
              // Compute the cosine similarity by dividing the dot product by the product of the magnitudes
              in: {
                $divide: [
                  '$$dotProduct',
                  { $multiply: ['$$magnitudeA', '$$magnitudeB'] },
                ],
              },
            },
          },
        },
      },

      // Step 3: Group the documents back by their original ID (before the unwind operation)
      // Calculate the average similarity across all chunks of the same document
      {
        $group: {
          _id: '$_id',
          title: { $first: '$title' }, // Retain the title of the document
          avgSimilarity: { $avg: '$chunks.similarity' }, // Average similarity of all chunks
          content: { $push: '$chunks.text' }, // Collect all chunk texts for reference
        },
      },

      // Step 4: Filter the grouped results to only include documents with an average similarity above a threshold
      { $match: { avgSimilarity: { $gt: 0.75 } } },

      // Step 5: Sort the resulting documents by their average similarity in descending order
      { $sort: { avgSimilarity: -1 } },

      // Step 6: Limit the results to the top 10 most similar documents
      { $limit: 10 },
    ]

    const similarDocs = await collection.aggregate(pipeline).toArray()

    // Transform the results to a more convenient format
    return similarDocs.map((doc) => ({
      id: doc._id,
      title: doc.title,
      avgSimilarity: doc.avgSimilarity,
      content: doc.content.join(' '), // Combine all chunk texts into a single string
    }))
  } finally {
    await client.close()
  }
}
