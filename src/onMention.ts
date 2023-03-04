import { Middleware, SlackEventMiddlewareArgs } from '@slack/bolt'

import { createChatCompletion, Message } from './createChatCompletion'


type OnMention = Middleware<SlackEventMiddlewareArgs<'app_mention'>>

export function onMention(
  systemPrompt: string,
  waitMessage: string,
  errorMessage: string
): OnMention {
  return async function({ event, context, client, say }) {
    // NOTE: 再送を無視する
    if (context.retryNum !== undefined) {
      return
    }

    // NOTE: スレッド中のメンションを無視する
    if (event.thread_ts !== undefined) {
      return
    }

    const reply = await say({
      text: waitMessage,
      thread_ts: event.ts
    })

    const messages: Message[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: event.text }
    ]

    const text = await createChatCompletion(messages)
      .catch(() => errorMessage)

    await client.chat.update({
      channel: event.channel,
      ts: reply.ts as string,
      text
    })
  }
}
