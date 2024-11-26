import type { MessageParam } from '@anthropic-ai/sdk/resources/messages.mjs'

import { context } from '../../../context.ts'

import type { PuppetDefinition } from '../../../core/types/puppet.ts'
import type { AnthropicClientPlugin } from '../../client-anthropic/index.ts'
import type { TwitterClientPlugin } from '../../client-twitter/index.ts'

const shadoActions = {}

const modelActions = {
  generateResponse: async (
    agentDefinition: PuppetDefinition,
    messages: MessageParam[],
    agent: AnthropicClientPlugin,
  ) => {
    const response = await agent.getMessagesResponse(
      messages,
      agentDefinition.bio.at(0),
    )

    messages.push({
      role: 'assistant',
      content: response,
    })

    context.core.logger.agent('LOG', agentDefinition.id, 'Wrote a message:', {
      message: response,
    })
  },
}

const twitterActions = {
  login: async (
    agentDefinition: PuppetDefinition,
    twitterClient: TwitterClientPlugin,
  ) => {
    await twitterClient.login(agentDefinition)
  },
  readMessage: async (
    agentDefinition: PuppetDefinition,
    messages: MessageParam[],
    twitterClient: TwitterClientPlugin,
  ) => {
    return await twitterClient.readMessage(agentDefinition, messages)
  },
}

export const actions = {
  shado: shadoActions,
  model: modelActions,
  twitter: twitterActions,
}
