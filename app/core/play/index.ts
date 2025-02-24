import type { AppContext } from '@core/context/types'
import type { AbstractPlanner } from '@core/abstract/types'

import type { PlayInstance } from './types'

export class Play {
  instance: PlayInstance

  _app: AppContext
  // TODO: Update to the proper type from the plugin?
  _planner: undefined | AbstractPlanner

  constructor(playId: PlayInstance['config']['id'], _app: AppContext) {
    this._app = _app

    this.instance = {
      runtime: undefined,
      config: undefined,
    }

    this._init(playId)
  }

  _init = async (playId: PlayInstance['config']['id']) => {
    try {
      this.instance.runtime = this._setPlayRuntime(playId)
      this.instance.config = await this._getPlayConfig(playId)

      // NOTE: Register plugins.
      this._planner = await this._setPlannerPlugin(
        this.instance.config.planner.provider,
      )
    } catch (error) {
      this._app.utils.logger.send({
        type: 'ERROR',
        origin: {
          type: 'PLAY',
          id: playId,
        },
        data: {
          message: `Error in play initialization`,
          payload: { error },
        },
      })

      return
    }

    try {
      // NOTE: Start the planner loop.
      await this._planner.init()
      this._planner.startPlanner()
    } catch (error) {
      this._app.utils.logger.send({
        type: 'ERROR',
        origin: {
          type: 'PLAY',
          id: this.instance.config.id,
        },
        data: {
          message: `Error in play runner loop`,
          payload: { error },
        },
      })
    }
  }

  _setPlayRuntime = (playId: PlayInstance['config']['id']) => {
    // NOTE: Play runtime scaffold.
    return {
      id: playId,
      //
      planner: undefined,
    } satisfies PlayInstance['runtime']
  }

  _getPlayConfig = async (playId: PlayInstance['config']['id']) => {
    try {
      const playFile = await import(`../../../include/${playId}.js`)
      const config = playFile.default
      // const playFile = await import(`@includes/${playId}.js`)
      // const config = playFile.default

      this._app.utils.logger.send({
        type: 'SUCCESS',
        origin: {
          type: 'PLAY',
          id: playId,
        },
        data: {
          message: `Loaded play config "${config.id}"`,
        },
      })

      return config
    } catch (error) {
      this._app.utils.logger.send({
        type: 'ERROR',
        origin: {
          type: 'PLAY',
          id: playId,
        },
        data: {
          message: `No play config loaded!`,
          payload: { error },
        },
      })

      return undefined
    }
  }

  _setPlannerPlugin = async (plannerProvider: string) => {
    try {
      const planner = new this._app.plugins[plannerProvider].plugin(
        this.instance,
        this._app,
      )

      this._app.utils.logger.send({
        type: 'SUCCESS',
        origin: {
          type: 'PLAY',
          id: this.instance.config.id,
        },
        data: {
          message: `Loaded planner plugin "${plannerProvider}"`,
        },
      })

      return planner
    } catch (error) {
      this._app.utils.logger.send({
        type: 'ERROR',
        origin: {
          type: 'PLAY',
          id: this.instance.config.id,
        },
        data: {
          message: `No planner plugin loaded!`,
          payload: { error },
        },
      })

      return undefined
    }
  }
}
