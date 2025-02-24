import type { PlayConfig } from '@core/play/types'

import dotenv from 'dotenv'
dotenv.config({ path: '.env.bardo' })

const playConfig: PlayConfig = {
  id: 'bardo',
  name: 'Bardō',
  //
  planner: {
    provider: 'shado-planner-htn',
    config: {
      goals: [],
    },
  },
}

export default playConfig
