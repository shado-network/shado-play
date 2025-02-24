import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

import { _app } from '@core/context/index.js'

export function parseArgs(): {
  plays: string
} {
  try {
    const args = yargs(hideBin(process.argv))
      .option('plays', {
        type: 'string',
        description: 'A comma separated list of Play IDs.',
      })
      .parseSync()

    return args
  } catch (error) {
    _app.utils.logger.send({
      type: 'ERROR',
      origin: {
        type: 'SERVER',
      },
      data: {
        message: `Error parsing CLI arguments`,
        payload: { error },
      },
    })

    return { plays: undefined }
  }
}
