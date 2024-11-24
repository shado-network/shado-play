import { configDotenv } from 'dotenv'

import { context } from './context.ts'
import { Logger } from './core/logger/index.ts'
import { Puppet } from './core/puppet/index.ts'
import { Stage } from './core/stage/index.ts'
import { parseArgs } from './core/libs/utils.ts'

configDotenv()

console.clear()

//

console.log('SHADŌ NETWORK')
console.log('shadow-play')
console.log('')

console.log(`Started on port ${+process.env.SERVER_PORT || 10101}`)
console.log(`http://localhost:${+process.env.SERVER_PORT || 10101}`)
console.log('')

//

context.core.logger = new Logger(['terminal'])

const args = parseArgs()

const stageId = args.stage.trim()
const puppetIds = args.puppets
  .replaceAll(' ', '')
  .split(',')
  .map((puppetId) => puppetId.trim())

//

const initStage = (stageId: string) => {
  const stage = new Stage(stageId)
  return stage
}

context.core.stage = initStage(stageId)

const initPuppets = (puppetIds: string[]) => {
  const puppets = []

  puppetIds.forEach((puppetId) => {
    const puppet = new Puppet(puppetId)
    puppets.push(puppet)
  })

  return puppets
}

context.core.puppets = initPuppets(puppetIds)

setInterval(() => {
  // context.core.logger.server?.('INFO', 'PING!')
}, 1 * 1000)
