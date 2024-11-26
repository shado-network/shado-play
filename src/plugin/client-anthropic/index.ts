import dotenv from 'dotenv'
import Anthropic from '@anthropic-ai/sdk'
import type { ClientOptions } from '@anthropic-ai/sdk'
import type {
  TextBlock,
  MessageParam,
} from '@anthropic-ai/sdk/resources/messages.mjs'

dotenv.config()

export class AnthropicClientPlugin {
  config = {
    MAX_MESSAGES: 100,
  }

  //

  clientOptions: ClientOptions = {
    apiKey: process.env.ANTHROPIC_API_KEY,
  }

  clientConfig = {
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 256,
    temperature: 1,
  }

  client: Anthropic

  constructor() {
    this.client = new Anthropic(this.clientOptions)
  }

  //

  getMessagesResponse = async (messages: MessageParam[], persona: string) => {
    const response = await this.client.messages.create({
      model: this.clientConfig.model,
      max_tokens: this.clientConfig.max_tokens,
      temperature: this.clientConfig.temperature,
      //
      system: persona,
      //
      messages: messages.slice(-1 * this.config.MAX_MESSAGES),
    })

    // TODO: What's this array exactly?
    // TODO: Filter this on TextBlocks?
    const responseText = (response?.content[0] as TextBlock)?.text || null

    if (responseText === null) {
      console.warn(response.content)
    }

    return responseText
  }
}
