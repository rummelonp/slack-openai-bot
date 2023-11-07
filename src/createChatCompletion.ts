import { OpenAI } from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources'


export type Message = ChatCompletionMessageParam

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function createChatCompletion(
  messages: Message[]
): Promise<string> {
  return openai.chat.completions.create({
    model: 'gpt-4-1106-preview',
    messages
  }).then(response => {
    const text = response.choices[0].message?.content
    if (!text) throw new Error('Message is empty')
    return text
  }).catch(e => {
    console.error(e)
    throw e
  })
}
