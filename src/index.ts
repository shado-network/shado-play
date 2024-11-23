import { configDotenv } from 'dotenv'

import { Puppet } from './core/puppet/index.ts'
import { Stage } from './core/stage/index.ts'
import { parseArgs } from './core/libs/utils.ts'

configDotenv()

console.clear()

//

console.log('SHADŌ NETWORK')
console.log('shadow-play')
console.log('')

console.log(`[ SERVER ] Started on port ${+process.env.SERVER_PORT || 10101}`)
console.log('')

//

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

const stage = initStage(stageId)

const initPuppets = (puppetIds: string[]) => {
  const puppets = []

  puppetIds.forEach((puppetId) => {
    const puppet = new Puppet(puppetId)
    puppets.push(puppet)
  })

  return puppets
}

const puppets = initPuppets(puppetIds)

setInterval(() => {
  console.log('[ SERVER ] PING!')
}, 1 * 1000)
