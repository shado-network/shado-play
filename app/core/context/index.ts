import path from 'path'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import type { AppContext } from './types'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const _app: AppContext = {
  config: {
    pluginsPath: path.join(__dirname, '..', '..', 'plugin'),
  },
  core: {
    plays: [],
  },
  plugins: {},
  utils: {
    logger: undefined,
  },
}
