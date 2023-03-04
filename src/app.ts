import { App, AwsLambdaReceiver } from '@slack/bolt'
import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda'

import { onMention } from './onMention'
import { onMessage } from './onMessage'


const systemPrompt = process.env.SYSTEM_PROMPT ?? `
You are an excellent AI assistant Slack Bot.
Please output your response message according to following format.

- bold: "*bold*"
- italic: "_italic_"
- strikethrough: "~strikethrough~"
- code: " \`code\` "
- block quote: "> block quite"
- code block: "\`\`\` code block \`\`\`"
- ordered list: "1. item1"
- bulleted list: "* item1"
- user: "<@user_id>"
- link: "<link url|link text>"

Be sure to include a space before and after the single quote in the sentence.
ex) word\`code\`word -> word \`code\` word

Let's begin.
`
const waitMessage = process.env.WAIT_MESSAGE ??
  'Please wait a little'

const errorMessage = process.env.ERROR_MESSAGE ??
  'Please create new thread'

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET as string
})

const app = new App({
  token: process.env.SLACK_BOT_TOKEN as string,
  receiver: awsLambdaReceiver
})
app.event('app_mention', onMention(systemPrompt, waitMessage, errorMessage))
app.event('message', onMessage(systemPrompt, waitMessage, errorMessage))

export async function handler(
  event: APIGatewayEvent,
  context: Context,
  callback: APIGatewayProxyCallback
) {
  const handler = await awsLambdaReceiver.start()
  return handler(event, context, callback)
}
