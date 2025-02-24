import type { PlayInstance } from '@core/play/types'
import type { AbstractLoggerMessage } from '@core/abstract/types'

export type ShadoLoggerConfig = {
  showIcon: boolean
  showUser: boolean
}

export type ShadoLoggerMessage = AbstractLoggerMessage & {
  origin: {
    id?: string | PlayInstance['config']['id']
    name?: string | PlayInstance['config']['name']
  }
}
