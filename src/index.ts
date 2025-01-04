import dotenv from 'dotenv'

import { context } from './context.ts'
import { CoreLogger } from './plugin/core-logger/index.ts'
import { Play } from './core/play/index.ts'
import { parseArgs } from './core/libs/utils.ts'

dotenv.config()

console.clear()

//

console.log('SHADŌ NETWORK')
console.log('shadow-play')
console.log('')

console.log(`Started on port ${+process.env.SERVER_PORT || 10101}`)
console.log(`http://localhost:${+process.env.SERVER_PORT || 10101}`)
console.log('')

//

context.core._logger = new CoreLogger(['console'])

const args = parseArgs()

const playId = args.play?.trim()

//

const initPlay = (playId: string) => {
  if (!playId) {
    context.core._logger.send({
      type: 'WARNING',
      source: 'SERVER',
      message: 'No playId has been set!',
    })

    return
  }

  const play = new Play(playId, context.core._logger)

  if (!play) {
    context.core._logger.send({
      type: 'ERROR',
      source: 'SERVER',
      message: `Error loading play "${playId}"`,
    })

    return
  }

  return play
}

context.core.play = initPlay(playId)

setInterval(() => {
  // context.core._logger.send({ type: 'INFO', source: 'SERVER', message: 'PING!' })
}, 1 * 1000)
