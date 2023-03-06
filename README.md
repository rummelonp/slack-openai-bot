#  slack-openai-bot
Slack Bot powered by OpenAI Chat Completion API

## Overview
This is a Slack Bot project that utilizes the OpenAI Chat Completion API.  
It is written in TypeScript, and uses the Slack Bolt Framework with the Slack Events API.  
For configuration management, we employed the Serverless Framework, and deploy the code to AWS Lambda.

## Prerequisites
- OpenAI API Key
- Slack App
- AWS Account

## Installation
1. Clone the repository:
```
git clone git@github.com:rummelonp/slack-openai-bot.git
```
   
2. Install dependencies:
```
npm install
```
   
3. Set environment variables:
```
export SLACK_SIGNING_SECRET=<your-slack-signing-secret>
export SLACK_BOT_TOKEN=<your-slack-bot-token>
export OPENAI_API_KEY=<your-openai-key>
```
   
4. Deploy to AWS Lambda with Serverless:
```
serverless deploy --aws-profile=<your-aws-profile>
```
   
## Usage
Once the Slack bot is installed and running, you can send mention to get responses from the OpenAI Chat Completion API.

## License
[MIT](https://choosealicense.com/licenses/mit/) 
