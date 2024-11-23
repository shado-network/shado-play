import { configDotenv } from 'dotenv'

import { Puppet } from './core/puppet/index.ts'
import { Stage } from './core/stage/index.ts'

configDotenv()

console.clear()

console.log('SHADŌ NETWORK')
console.log('shadow-play')

console.log(
  `Server started on http://localhost:${+process.env.SERVER_PORT || 10101}`,
)

const puppets = [new Puppet()]
const stage = new Stage()
