import type { CoreLogger } from '../../plugin/core-logger/index.ts'
import type { PlayDefinition } from '../types/play.ts'

export class Play {
  playId: string
  playDefinition: PlayDefinition

  _logger: CoreLogger

  constructor(playId: string, _logger: CoreLogger) {
    this._logger = _logger

    this.playId = playId
    this._init()
  }

  _init = async () => {
    try {
      this.playDefinition = await this._loadPlayDefinition()
    } catch (error) {
      this._logger.send({
        type: 'ERROR',
        source: 'PLAY',
        playId: this.playId,
        message: `Error in play initialization`,
        payload: { error },
      })
    }
  }

  _loadPlayDefinition = async () => {
    this._logger.send({
      type: 'INFO',
      source: 'PLAY',
      playId: this.playId,
      message: `Loading play definition for "${this.playId}"`,
    })

    const play = await import(`../../../include/play/${this.playId}.ts`)
    const playDefinition = play.default

    this._logger.send({
      type: 'SUCCESS',
      source: 'PLAY',
      playId: this.playId,
      message: `Loaded play definition for "${this.playId}"`,
    })

    return playDefinition
  }
}
