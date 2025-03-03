import EventEmitter from 'events'

import type { PlayConfig, PlayContext } from '@/types/play'
import type { AbstractPlanner } from '@/types/abstract'

export class ShadoPlay {
  type: string = 'play'
  id: string
  name: string

  config: PlayConfig

  // TODO: Update to the proper type from the plugin?
  planner: undefined | AbstractPlanner
  // TODO: Update to the proper type from the plugin?
  // TODO: AbstractModel?
  // model: undefined | any
  // TODO: Update to the proper type from the plugin?
  // TODO: AbstractPlugin?
  clients: undefined | any
  // TODO: Update to the proper type from the plugin?
  events: undefined | EventEmitter

  memory: any

  _register: {
    planner: any
    // model: any
    clients: any[]
  } = {
    planner: undefined,
    // model: undefined,
    clients: [],
  }

  _context: PlayContext

  constructor(config: PlayConfig, _context: PlayContext) {
    this.id = config.id
    this.name = config.name

    this.config = config
    this._context = _context

    this.planner = undefined
    // this.model = undefined
    this.clients = {}
    this.events = new EventEmitter()

    this.memory = {
      state: {},
      goals: [],
    }
  }

  //

  registerPlanner<PlannerType, PlannerProps extends any[]>(planner: {
    plugin: new (...props: PlannerProps) => PlannerType
    props: PlannerProps
  }): void {
    this._register.planner = planner
  }

  _initPlanner = () => {
    try {
      const plugin = new this._register.planner.plugin(
        ...this._register.planner.props,
      )
      this.planner = plugin

      this._context.utils.logger.send({
        type: 'SUCCESS',
        origin: {
          type: 'PLAY',
          id: this.id,
        },
        data: {
          message: `Loaded planner plugin "${this._register.planner.plugin.metadata.identifier}"`,
        },
      })
    } catch (error) {
      this._context.utils.logger.send({
        type: 'ERROR',
        origin: {
          type: 'PLAY',
          id: this.id,
        },
        data: {
          message: `No planner plugin loaded!`,
          payload: { error },
        },
      })
    }
  }

  registerClient<ClientType, ClientProps extends any[]>(client: {
    plugin: new (...props: ClientProps) => ClientType
    props: ClientProps
  }): void {
    this._register.clients.push(client)
  }

  _initClients = () => {
    this._register.clients.forEach((client) => {
      try {
        const plugin = new client.plugin(...client.props)
        this.clients[client.plugin.metadata.key] = plugin

        this._context.utils.logger.send({
          type: 'SUCCESS',
          origin: {
            type: 'PLAY',
            id: this.id,
          },
          data: {
            message: `Loaded client plugin "${client.plugin.metadata.identifier}"`,
          },
        })
      } catch (error) {
        this._context.utils.logger.send({
          type: 'ERROR',
          origin: {
            type: 'PLAY',
            id: this.id,
          },
          data: {
            message: `Could not load client plugin "${client.plugin.metadata.identifier}"!`,
            payload: { error },
          },
        })
      }
    })
  }

  //

  setup = () => {
    this._context.utils.logger.send({
      type: 'LOG',
      origin: {
        type: 'PLAY',
        id: this.id,
      },
      data: {
        message: 'Initializing...',
      },
    })

    // NOTE: Initialize registered plugins.
    this._initPlanner()
    // this._initModel()
    this._initClients()
  }

  start = async () => {
    this._context.utils.logger.send({
      type: 'LOG',
      origin: {
        type: 'PLAY',
        id: this.id,
      },
      data: {
        message: 'Starting...',
      },
    })

    // NOTE: Start the planner loop.
    try {
      await this.planner.setup()
      this.planner.start()
    } catch (error) {
      this._context.utils.logger.send({
        type: 'ERROR',
        origin: {
          type: 'PLAY',
          id: this.id,
        },
        data: {
          message: `Error in play runner loop`,
          payload: { error },
        },
      })
    }
  }
}

export default ShadoPlay
export type { PlayConfig, PlayContext }
