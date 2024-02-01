// Configuration object that stores the Hugging Face API endpoint and token
const HUGGINGFACE_CONFIG = {
  endpoint:
    'https://ajxwsl2xf1qhdry9.us-east-1.aws.endpoints.huggingface.cloud',
  token: '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',
}

export function getEndpointUrl(modelId: string): string {
  return `${HUGGINGFACE_CONFIG.endpoint}/models/${modelId}`
}

// Send input to the Hugging Face API and receive a response
export const generate_text = async ({ inputs, parameters }): Promise<any> => {
  // Construct the body of the request, including custom parameters if they are provided
  const body = parameters ? { inputs, parameters } : { inputs }

  try {
    const response = await fetch(HUGGINGFACE_CONFIG.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${HUGGINGFACE_CONFIG.token}`,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(
        `Error from Hugging Face API: ${response.status} ${response.statusText}`
      )
    }

    const result = await response.json()
    console.log('\n\n\n\n\n\n\n\n\nRESPONSE', result[0])
    return result[0]
  } catch (error) {
    console.error('Hugging Face Service Error:', error)
    throw error
  }
}
