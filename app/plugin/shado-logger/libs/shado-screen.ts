import type { ShadoLoggerConfig, ShadoLoggerMessage } from '../types'

export class ShadoLoggerShadoScreenClient {
  config: ShadoLoggerConfig
  clients: any

  constructor(config: ShadoLoggerConfig) {
    this.config = config
  }
}
