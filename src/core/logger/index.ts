type LoggerType = 'SUCCESS' | 'WARNING' | 'DANGER' | 'INFO'

export class Logger {
  interfaces = {
    terminal: false,
    rest: false,
  }

  useIcons = false

  // MARK: Node.js console colors.
  colors = {
    node: {
      fg: {
        black: '\x1b[30m',
        red: '\x1b[31m',
        green: '\x1b[32m',
        yellow: '\x1b[33m',
        blue: '\x1b[34m',
        magenta: '\x1b[35m',
        cyan: '\x1b[36m',
        white: '\x1b[37m',
        clear: '\x1b[0m',
      },
      bg: {
        black: '\x1b[40m',
        red: '\x1b[44m',
        green: '\x1b[44m',
        yellow: '\x1b[43m',
        blue: '\x1b[44m',
        magenta: '\x1b[45m',
        cyan: '\x1b[46m',
        white: '\x1b[47m',
        clear: '',
      },
    },
  }

  icons = {
    success: '🟢',
    warning: '🟠',
    danger: '🔴',
    info: '⚫️',
    default: '⚪️',
  }

  //

  constructor(interfaceIds: string[]) {
    if (interfaceIds.includes('terminal')) {
      this.interfaces.terminal = true
    }

    this.server('SUCCESS', 'CoreLogger has started')
  }

  _getColor(fgColorName = '', bgColorName = '') {
    const fgColor =
      this.colors.node.fg[fgColorName.toLowerCase()] ||
      this.colors.node.fg.white
    const bgColor =
      this.colors.node.bg[bgColorName.toLowerCase()] ||
      this.colors.node.bg.clear

    return `${fgColor}${bgColor}`
  }

  _resetColor = () => {
    return this.colors.node.fg.clear
  }

  //

  log = (type: LoggerType, message: string, payload = null) => {
    if (this.interfaces.terminal) {
      const icon = this.icons[type.toLowerCase()] || this.icons.default

      console.log(`${this.useIcons ? icon + ' ' : ''}[ LOG ]`)
      payload ? console.log('', message, payload) : console.log('', message)
      console.log('')
    }
  }

  //

  server = (type: LoggerType, message: string, payload = null) => {
    if (this.interfaces.terminal) {
      const styling = this._getColor('red', '')
      const icon = this.icons[type.toLowerCase()] || this.icons.default

      console.log(
        styling,
        `${this.useIcons ? icon + ' ' : ''}[ SERVER ]`,
        this._resetColor(),
      )
      payload ? console.log('', message, payload) : console.log('', message)
      console.log('')
    }
  }

  stage = (
    type: LoggerType,
    stageId: string,
    message: string,
    payload = null,
  ) => {
    if (this.interfaces.terminal) {
      const styling = this._getColor('blue', '')
      const icon = this.icons[type.toLowerCase()] || this.icons.default

      console.log(
        styling,
        `${this.useIcons ? icon + ' ' : ''}[ STAGE / ${stageId.toUpperCase()} ]`,
        this._resetColor(),
      )
      payload ? console.log('', message, payload) : console.log('', message)
      console.log('')
    }
  }

  puppet = (
    type: LoggerType,
    puppetId: string,
    message: string,
    payload = null,
  ) => {
    if (this.interfaces.terminal) {
      const styling = this._getColor('magenta', '')
      const icon = this.icons[type.toLowerCase()] || this.icons.default

      console.log(
        styling,
        `${this.useIcons ? icon + ' ' : ''}[ PUPPET / ${puppetId.toUpperCase()} ]`,
        this._resetColor(),
      )
      payload ? console.log('', message, payload) : console.log('', message)
      console.log('')
    }
  }
}
