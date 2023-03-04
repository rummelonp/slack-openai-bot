import {
  OpenAIApi,
  Configuration,
  ChatCompletionRequestMessage
} from 'openai'


export type Message = ChatCompletionRequestMessage

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY as string
})

const openai = new OpenAIApi(configuration)

export async function createChatCompletion(
  messages: Message[]
): Promise<string> {
  return openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages
  }).then(response => {
    const text = response.data.choices[0].message?.content
    if (!text) throw new Error('Message is empty')
    return text
  }).catch(e => {
    console.error(e)
    throw e
  })
}
