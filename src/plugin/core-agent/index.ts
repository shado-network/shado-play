import type { MessageParam } from '@anthropic-ai/sdk/resources/messages.mjs'

import { AnthropicClientPlugin } from '../client-anthropic/index.ts'
import { TwitterClientPlugin } from '../client-twitter/index.ts'
import type { CoreLogger } from '../core-logger/index.ts'
import type { PuppetDefinition } from '../../core/types/puppet'

import { actions } from './libs/actions.ts'

export class CoreAgentPlugin {
  agentDefinition: PuppetDefinition
  agent: AnthropicClientPlugin
  twitterClient: TwitterClientPlugin

  messages: MessageParam[] = []

  _logger: CoreLogger

  constructor(puppetDefinition: PuppetDefinition, _logger: CoreLogger) {
    this._logger = _logger
    this.agentDefinition = puppetDefinition
    this._init()
  }

  _init = async () => {
    try {
      this._setModelPlugin()
      this.twitterClient = new TwitterClientPlugin(this._logger)

      await this._debug()
    } catch (error) {
      this._logger.send({
        type: 'ERROR',
        source: 'PUPPET',
        puppetId: this.agentDefinition.id,
        message: `Error in agent initialization`,
        payload: { error },
      })
    }
  }

  _setModelPlugin = async () => {
    switch (this.agentDefinition.modelProvider) {
      case 'openai':
        this._logger.send({
          type: 'ERROR',
          source: 'PUPPET',
          message: 'Puppet model plugin for OpenAI not yet implemented.',
        })
        break
      case 'anthropic':
        this.agent = new AnthropicClientPlugin(this._logger)
        this._logger.send({
          type: 'INFO',
          source: 'PUPPET',
          puppetId: this.agentDefinition.id,
          message: `Loaded puppet model plugin "${this.agentDefinition.modelProvider}"`,
        })
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

    this._logger.send({
      type: 'LOG',
      source: 'USER',
      userId: 'user',
      message: 'Wrote a message:',
      payload: {
        message: `Hey, ${this.agentDefinition.name}! What are you thinking about today?`,
      },
    })

    // const interval = setInterval(
    // async () => {
    try {
      if (!this.twitterClient) {
        return
      }
      // MARK: Login
      await actions.twitter.login(
        this.agentDefinition,
        this.twitterClient,
        this._logger,
      )

      // MARK: Read
      const readMessage = await actions.twitter.readMessage(
        this.agentDefinition,
        this.messages,
        this.twitterClient,
        this._logger,
      )

      if (readMessage.shouldReply) {
        // MARK: Write
        // await actions.model.generateResponse(
        //   this.agentDefinition,
        //   this.messages,
        //   this.agent,
        //   this._logger,
        // )
      } else {
        this._logger.send({
          type: 'LOG',
          source: 'AGENT',
          puppetId: this.agentDefinition.id,
          message: "Won't reply to the message:",
          payload: {
            message: readMessage.message,
          },
        })
      }

      // MARK: Post
      // TODO: Tweet
    } catch (error) {
      this._logger.send({
        type: 'ERROR',
        source: 'PUPPET',
        puppetId: this.agentDefinition.id,
        message: `Error in agent runtime`,
        payload: { error },
      })
    }
    // },
    // 5 * 60 * 1000,
    // )
  }
}
