import type { MessageParam } from '@anthropic-ai/sdk/resources/messages.mjs'

import { context } from '../../context.ts'
import { AnthropicClientPlugin } from '../client-anthropic/index.ts'
import { TwitterClientPlugin } from '../client-twitter/index.ts'
import type { PuppetDefinition } from '../../core/types/puppet'

import { actions } from './libs/actions.ts'

export class CoreAgentPlugin {
  agentDefinition: PuppetDefinition
  agent: AnthropicClientPlugin
  twitterClient: TwitterClientPlugin

  messages: MessageParam[] = []

  constructor(puppetDefinition: PuppetDefinition) {
    this.agentDefinition = puppetDefinition
    this._init()
  }

  _init = async () => {
    try {
      this._setModelPlugin()
      this.twitterClient = new TwitterClientPlugin()

      await this._debug()
    } catch (error) {
      console.error(error)
    }
  }

  _setModelPlugin = async () => {
    switch (this.agentDefinition.modelProvider) {
      case 'openai':
        context.core.logger.error(
          'DANGER',
          'Model plugin for OpenAI not yet implemented.',
        )
        break
      case 'anthropic':
        this.agent = new AnthropicClientPlugin()
        break
      default:
        break
    }
  }

  _debug = async () => {
    this.messages.push({
      role: 'user',
      content: `Hey, ${this.agentDefinition.name}! What are you thinking about today?`,
    })

    context.core.logger.user('LOG', 'user', 'Wrote a message:', {
      message: `Hey, ${this.agentDefinition.name}! What are you thinking about today?`,
    })

    // const interval = setInterval(
    // async () => {
    try {
      if (!this.twitterClient) {
        return
      }
      // MARK: Login
      await actions.twitter.login(this.agentDefinition, this.twitterClient)

      // MARK: Read
      const readMessage = await actions.twitter.readMessage(
        this.agentDefinition,
        this.messages,
        this.twitterClient,
      )

      if (readMessage.shouldReply) {
        // MARK: Write
        // await actions.model.generateResponse(
        //   this.agentDefinition,
        //   this.messages,
        //   this.agent,
        // )
      } else {
        context.core.logger.agent(
          'LOG',
          this.agentDefinition.id,
          "Won't reply to the message:",
          {
            message: readMessage.message,
          },
        )
      }

      // MARK: Post
      // TODO: Tweet
    } catch (error) {
      console.error(error)
    }
    // },
    // 5 * 60 * 1000,
    // )
  }
}
