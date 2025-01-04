import type { CoreLogger } from './plugin/core-logger'
import type { Play } from './core/play'

type Context = {
  config: unknown
  core: {
    _logger: null | CoreLogger
    play: null | Play
  }
}

export const context: Context = {
  config: {},
  core: {
    _logger: null,
    play: null,
  },
}
