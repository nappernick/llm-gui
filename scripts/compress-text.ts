function splitIntoSentences(text: string): string[] {
  return text.split(/[.!?]\s+/)
}

function removeSpecificCharacters(text: string, characters: string): string {
  return text
    .split('')
    .filter((char) => !characters.includes(char))
    .join('')
}

function replaceSpecificWords(
  text: string,
  words: string[],
  replacement = '_'
): string {
  words.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi')
    text = text.replace(regex, replacement)
  })
  return text
}

function collapseConsecutiveReplacements(
  text: string,
  replacement = '_'
): string {
  const regex = new RegExp(`(${replacement}\\s*)+`, 'g')
  return text.replace(regex, replacement + ' ')
}

export function compressAndCleanText(
  text: string,
  threshold = 5,
  removeChars = ',;:',
  replaceWords: string[] = [
    'and',
    'an',
    'are',
    'to',
    'the',
    'is',
    'in',
    'at',
    'of',
    'on',
    'for',
    'with',
    'a',
    'by',
    'this',
    'that',
    'it',
    'from',
    'as',
    'be',
    'been',
    'was',
    'were',
    'has',
    'have',
    'had',
    'but',
    'or',
    'so',
    'if',
    'out',
    'up',
    'such',
    'like',
    'just',
    'also',
    'then',
    'there',
  ],
  replacement = '_' // Default replacement character added
): string {
  const sentences = splitIntoSentences(text)
  const processedSentences = sentences.map((sentence) => {
    sentence = removeSpecificCharacters(sentence, removeChars)
    sentence = replaceSpecificWords(sentence, replaceWords, replacement)
    sentence = collapseConsecutiveReplacements(sentence, replacement)
    return sentence.split(' ').length >= threshold ? sentence : replacement
  })

  return processedSentences.join(' ')
}
