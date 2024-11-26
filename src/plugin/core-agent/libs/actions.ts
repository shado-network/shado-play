import type { MessageParam } from '@anthropic-ai/sdk/resources/messages.mjs'

import type { CoreLogger } from '../../core-logger/index.ts'
import type { PuppetDefinition } from '../../../core/types/puppet.ts'
import type { AnthropicClientPlugin } from '../../client-anthropic/index.ts'
import type { TwitterClientPlugin } from '../../client-twitter/index.ts'

const shadoActions = {}

const modelActions = {
  generateResponse: async (
    agentDefinition: PuppetDefinition,
    messages: MessageParam[],
    agent: AnthropicClientPlugin,
    _logger: CoreLogger,
  ) => {
    const response = await agent.getMessagesResponse(
      messages,
      agentDefinition.bio.at(0),
    )

    messages.push({
      role: 'assistant',
      content: response,
    })

    _logger.send({
      type: 'LOG',
      source: 'AGENT',
      puppetId: agentDefinition.id,
      message: 'Wrote a message:',
      payload: {
        message: response,
      },
    })
  },
}

const twitterActions = {
  login: async (
    agentDefinition: PuppetDefinition,
    twitterClient: TwitterClientPlugin,
    _logger: CoreLogger,
  ) => {
    await twitterClient.login(agentDefinition)
  },
  readMessage: async (
    agentDefinition: PuppetDefinition,
    messages: MessageParam[],
    twitterClient: TwitterClientPlugin,
    _logger: CoreLogger,
  ) => {
    return await twitterClient.readMessage(agentDefinition, messages)
  },
}

export const actions = {
  shado: shadoActions,
  model: modelActions,
  twitter: twitterActions,
}
