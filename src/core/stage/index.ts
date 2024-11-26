import { context } from '../../context.ts'
import type { StageDefinition } from '../types/stage.ts'

export class Stage {
  stageId: string
  stageDefinition: StageDefinition

  constructor(stageId: string) {
    this.stageId = stageId
    this._init()
  }

  _init = async () => {
    try {
      this.stageDefinition = await this._loadStageDefinition()
    } catch (error) {
      console.error(error)
    }
  }

  _loadStageDefinition = async () => {
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
      `Loaded stage definition for "${this.stageId}"`,
    )

    return stageDefinition
  }
}
