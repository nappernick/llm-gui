// api/src/lib/utils.js

import { promises as fs } from 'fs'

import { dot, norm } from 'mathjs'

/**
 * Asynchronously reads the content of a .txt file given its path, using ES6 syntax.
 *
 * @param {string} filePath The path to the .txt file.
 * @returns {Promise<string>} A promise that resolves with the content of the file as a string.
 */
export const parseFile = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf8')
    return content
  } catch (error) {
    console.error('Failed to read file:', error)
    throw error
  }
}
// Convert an array of numbers into a comma-separated string
export const vectorToString = (vector) => {
  return vector.join(',')
}

// Convert a comma-separated string back into an array of numbers
export const stringToVector = (vectorString: string) => {
  return vectorString.split(',').map(Number)
}

// Calculate cosine similarity between two vectors
export const cosineSimilarity = (vecA, vecB) => {
  // Ensure vecA and vecB are arrays of numbers
  vecA = Array.isArray(vecA) ? vecA : stringToVector(vecA)
  vecB = Array.isArray(vecB) ? vecB : stringToVector(vecB)

  // Use mathjs functions for vector operations
  const dotProduct = dot(vecA, vecB)
  const magnitudeA = norm(vecA) as number
  const magnitudeB = norm(vecB) as number
  return dotProduct / (magnitudeA * magnitudeB)
}

/**
 * Extracts keywords from a given string, assuming a specific format.
 * This function is an example and might need adjustments based on the actual response format.
 *
 * @param {string} content The content string from which to extract keywords.
 * @returns {string[]} An array of extracted keywords.
 */
export const extractKeywords = (content) => {
  // Original regex pattern to match keywords at the start of the message, separated by commas
  const keywordPattern = /^([^\.\n]+)/
  const match = content.match(keywordPattern)

  if (content.includes(' - ')) {
    if (content.includes('\n') && content.includes(' - ')) {
      // If the original pattern doesn't match, handle the list format.
      // Extract lines that start with " - " indicating each keyword/phrase
      const lines = content.split('\n').filter((line) => line.startsWith(' - ')) // Split by newline and filter lines that start with " - "

      // Map through each line, removing " - " prefix and trimming whitespace for each keyword/phrase
      const keywords = lines.map((line) => line.replace(' - ', '').trim())

      return keywords // Return the array of keywords/phrases if the list format is detected
    }

    return content.split(' - ')
  } else if (match && match[1]) {
    // Assuming keywords are comma-separated
    const keywords = match[1].split(',').map((keyword) => keyword.trim())
    return keywords.filter((keyword) => keyword) // Filter out empty strings
  } else {
    // Return an empty array if no patterns are matched
    return []
  }
}
