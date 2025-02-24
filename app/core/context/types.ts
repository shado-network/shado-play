import type { Play } from '@core/play'
import type { AbstractPlugin, AbstractLogger } from '@core/abstract/types'

export type AppContext = {
  config: {
    pluginsPath: string
  }
  core: {
    plays: Play[]
  }
  plugins: {
    [key: string]: AbstractPlugin
  }
  utils: {
    // TODO: Update to the proper type from the plugin?
    logger: undefined | AbstractLogger
  }
}
