import { Middleware, SlackEventMiddlewareArgs } from '@slack/bolt'

import { createChatCompletion, Message } from './createChatCompletion'


type OnMessage = Middleware<SlackEventMiddlewareArgs<'message'>>

export function onMessage(
  systemPrompt: string,
  waitMessage: string,
  errorMessage: string
): OnMessage {
  return async function({ event, context, client, say }) {
    // NOTE: 再送を無視する
    if (context.retryNum !== undefined) {
      return
    }

    // @ts-ignore
    // NOTE: 自分のメッセージを無視する
    if (event.user === context.botUserId) {
      return
    }

    // @ts-ignore
    const thread_ts = event.thread_ts || undefined
    if (!thread_ts) {
      return
    }

    const replies = await client.conversations.replies({
      channel: event.channel,
      ts: thread_ts,
      limit: 100
    })
    if (!replies.messages || replies.messages.length === 0) {
      return
    }
    if (replies.messages[replies.messages.length - 1].bot_id === context.botId) {
      return
    }

    const reply = await say({
      text: waitMessage,
      thread_ts: event.ts
    })

    const messages: Message[] = replies.messages.map(message => {
      const role = message.bot_id === context.botId ? 'assistant' : 'user'
      return { role, content: message.text as string }
    })

    const text = await createChatCompletion([
      { role: 'system', content: systemPrompt },
      ...messages
    ]).catch(() => errorMessage)

    await client.chat.update({
      channel: event.channel,
      ts: reply.ts as string,
      text
    })
  }
}
