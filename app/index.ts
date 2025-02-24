import { _app } from '@core/context/index.js'

import { importPlugins } from '@core/libs/utils.plugins.js'

import { Play } from '@core/play/index.js'
import { parseArgs } from '@core/libs/utils.js'
import { SEC_IN_MSEC } from '@core/libs/constants.js'

import dotenv from 'dotenv'
dotenv.config()

console.clear()

//

console.log('SHADŌ NETWORK')
console.log('shado-play')
console.log('')

//

const registerPlugins = async (pluginsPath: string) => {
  const plugins = {}

  const imports = await importPlugins(pluginsPath)

  imports.forEach((importedPlugin) => {
    if (!importedPlugin) {
      return
    }

    plugins[importedPlugin.identifier] = importedPlugin
  })

  return plugins
}

_app.plugins = await registerPlugins(_app.config.pluginsPath)

//

// TODO: Update to the proper type from the plugin?
_app.utils.logger = new _app.plugins['shado-logger'].plugin([
  'shado-screen',
  'node-console',
])

//

const args = parseArgs()

const playIds = args.plays
  ?.replaceAll(' ', '')
  .split(',')
  .map((playId) => playId.trim())

//

const initPlays = (playIds: string[]) => {
  if (!playIds || playIds.length === 0) {
    _app.utils.logger.send({
      type: 'WARNING',
      origin: {
        type: 'SERVER',
      },
      data: {
        message: 'No playIds have been set!',
      },
    })

    return
  }

  const plays = []

  playIds.forEach((playId) => {
    const play = new Play(playId, _app)

    if (!play) {
      _app.utils.logger.send({
        type: 'ERROR',
        origin: {
          type: 'SERVER',
        },
        data: {
          message: `Error loading play "${playId}"`,
        },
      })

      return
    }

    plays.push(play)
  })

  return plays
}

_app.core.plays = initPlays(playIds)

setInterval(() => {
  // _app.utils.logger.send({
  //   type: 'INFO',
  //   origin: {
  //     type: 'SERVER',
  //   },
  //   data: {
  //     message: 'PING!',
  //   },
  // })
}, 1 * SEC_IN_MSEC)
