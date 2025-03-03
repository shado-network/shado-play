import type { AbstractLogger } from '@/types/abstract'

export type PlayConfig = {
  id: string
  name: string
}

export type PlayContext = {
  config: {
    [key: string]: any
  }
  utils: {
    logger?: undefined | AbstractLogger
  }
}
