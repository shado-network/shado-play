import { context } from '../../context.ts'
import { CoreAgentPlugin } from '../../plugin/core-agent/index.ts'
import type { PuppetDefinition } from '../types/puppet.ts'

export class Puppet {
  puppetId: string
  puppetDefinition: PuppetDefinition
  agent: any

  constructor(puppetId: string) {
    this.puppetId = puppetId
    this._init()
  }

  _init = async () => {
    try {
      this.puppetDefinition = await this._loadPuppetDefinition()
      this._setPuppetPlugin()

      // await this._debug()
    } catch (error) {
      console.error(error)
    }
  }

  _loadPuppetDefinition = async () => {
    context.core.logger.puppet(
      'INFO',
      this.puppetId,
      `Loading puppet definition for "${this.puppetId}"`,
    )

    const puppet = await import(`../../../include/puppet/${this.puppetId}.ts`)
    const puppetDefinition = puppet.default

    context.core.logger.puppet(
      'SUCCESS',
      this.puppetId,
      `Loaded "${puppetDefinition.name}"'s definition`,
    )

    return puppetDefinition
  }

  _setPuppetPlugin = async () => {
    switch (this.puppetDefinition.agentProvider) {
      case 'shado':
        this.agent = new CoreAgentPlugin(this.puppetDefinition)

        context.core.logger.puppet(
          'INFO',
          this.puppetId,
          `Loaded puppet definition for "${this.puppetId}"`,
        )
        break
      case 'eliza':
        context.core.logger.error(
          'DANGER',
          'Puppet plugin for Eliza not yet implemented.',
        )
        break
      default:
        break
    }
  }

  _debug = async () => {}
}
