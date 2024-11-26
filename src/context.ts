import type { Logger } from './core/logger'
import type { Stage } from './core/stage'
import type { Puppet } from './core/puppet'

type Context = {
  config: unknown
  core: {
    logger: null | Logger
    stage: null | Stage
    puppets: Puppet[]
  }
}

export const context: Context = {
  config: {},
  core: {
    logger: null,
    stage: null,
    puppets: [],
  },
}
