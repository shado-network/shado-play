import { context } from '../../context.ts'

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
    context.core.logger.stage(
      'INFO',
      this.stageId,
      `Loading stage definition for "${this.stageId}"`,
    )

    const stage = await import(`../../../include/stage/${this.stageId}.ts`)
    const stageDefinition = stage.default

    context.core.logger.stage(
      'SUCCESS',
      this.stageId,
      `${stageDefinition.name} has loaded`,
    )

    return stageDefinition
  }
}
