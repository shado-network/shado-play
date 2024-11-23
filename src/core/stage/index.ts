export class Stage {
  stageId: string
  stageDefinition: any

  constructor(stageId: string) {
    this.stageId = stageId
    this.init()
  }

  init = async () => {
    try {
      const stage = await this.load()
    } catch (error) {
      console.error(error)
    }
  }

  load = async () => {
    console.log(
      `[ STAGE / ${this.stageId.toUpperCase()} ] Loading stage definition for "${this.stageId}"`,
    )

    const stage = await import(`../../../include/stage/${this.stageId}.ts`)
    const stageDefinition = stage.default

    console.log(
      `[ STAGE / ${stageDefinition.id.toUpperCase()} ] ${stageDefinition.name} has loaded`,
    )

    return stageDefinition
  }
}
