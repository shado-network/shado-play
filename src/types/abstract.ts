export type AbstractLogger = {
  send: (loggerMessage: AbstractLoggerMessage) => void
}

export type AbstractLoggerMessage = {
  type: 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO' | 'LOG' | 'SANDBOX'
  origin: {
    type: 'PLAY' | 'PUPPET' | 'AGENT' | 'USER' | 'PLUGIN'
    id?: string
    name?: string
  }
  data: {
    message: string
    payload?: undefined | unknown
  }
}

export type AbstractPlanner = {
  setup: () => Promise<void>
  start: () => void
}
