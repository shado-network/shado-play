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
    console.log(
      `[ PUPPET / ${this.puppetId.toUpperCase()} ] Loading puppet definition for "${this.puppetId}"`,
    )

    const puppet = await import(`../../../include/puppet/${this.puppetId}.ts`)
    const puppetDefinition = puppet.default

    console.log(
      `[ PUPPET / ${puppetDefinition.id.toUpperCase()} ] ${puppetDefinition.name} has loaded`,
    )

    return puppetDefinition
  }
}
