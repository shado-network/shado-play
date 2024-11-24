import { context } from '../../context.ts'

export class Puppet {
  puppetId: string
  puppetDefinition: any

  constructor(puppetId: string) {
    this.puppetId = puppetId
    this.init()
  }

  init = async () => {
    try {
      const puppet = await this.load()
    } catch (error) {
      console.error(error)
    }
  }

  load = async () => {
    context.core.logger.puppet?.(
      'INFO',
      this.puppetId,
      `Loading puppet definition for "${this.puppetId}"`,
    )

    const puppet = await import(`../../../include/puppet/${this.puppetId}.ts`)
    const puppetDefinition = puppet.default

    context.core.logger.puppet?.(
      'SUCCESS',
      this.puppetId,
      `${puppetDefinition.name} has loaded`,
    )

    return puppetDefinition
  }
}
