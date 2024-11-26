type LoggerType = 'SUCCESS' | 'WARNING' | 'DANGER' | 'INFO' | 'LOG'

export class Logger {
  config = {
    interfaces: {
      console: false,
      rest: false,
    },
    icons: false,
    showUser: false,
  }

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
    info: '🔵',
    default: '⚪️',
  }

  //

  constructor(interfaceIds: string[]) {
    if (interfaceIds.includes('console')) {
      this.config.interfaces.console = true
    }

    this.server('SUCCESS', 'Started CoreLogger')
  }

  _getColor = (fgColorName = '', bgColorName = '') => {
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

  _getIcon = (type: LoggerType) => {
    const icon = this.icons[type.toLowerCase()] || this.icons.default

    if (this.config.icons) {
      return `${icon} `
    } else {
      return ''
    }
  }

  _writeConsoleMessage = (
    type: LoggerType,
    header: string,
    message: string,
    payload: unknown,
    styling: string,
    icon: string,
  ) => {
    console.log(styling, header, this._resetColor(), `${icon}${type}`)
    payload ? console.log('', message, payload) : console.log('', message)
    console.log('')
  }

  //

  log = (type: LoggerType, message: string, payload = null) => {
    if (this.config.interfaces.console) {
      const styling = this._getColor('white', '')
      const icon = this._getIcon(type)

      this._writeConsoleMessage(
        type,
        '[ LOG ]',
        message,
        payload,
        styling,
        icon,
      )
    }
  }

  error = (type: LoggerType, message: string, payload = null) => {
    if (this.config.interfaces.console) {
      const styling = this._getColor('red', '')
      const icon = this._getIcon(type)

      this._writeConsoleMessage(
        type,
        '[ ERROR ]',
        message,
        payload,
        styling,
        icon,
      )
    }
  }

  //

  server = (type: LoggerType, message: string, payload = null) => {
    if (this.config.interfaces.console) {
      const styling = this._getColor('green', '')
      const icon = this._getIcon(type)

      this._writeConsoleMessage(
        type,
        '[ SERVER ]',
        message,
        payload,
        styling,
        icon,
      )
    }
  }

  stage = (
    type: LoggerType,
    stageId: string,
    message: string,
    payload = null,
  ) => {
    if (this.config.interfaces.console) {
      const styling = this._getColor('blue', '')
      const icon = this._getIcon(type)

      this._writeConsoleMessage(
        type,
        `[ STAGE / ${stageId.toUpperCase()} ]`,
        message,
        payload,
        styling,
        icon,
      )
    }
  }

  puppet = (
    type: LoggerType,
    puppetId: string,
    message: string,
    payload = null,
  ) => {
    if (this.config.interfaces.console) {
      const styling = this._getColor('magenta', '')
      const icon = this._getIcon(type)

      this._writeConsoleMessage(
        type,
        `[ PUPPET / ${puppetId.toUpperCase()} ]`,
        message,
        payload,
        styling,
        icon,
      )
    }
  }

  agent = (
    type: LoggerType,
    puppetId: string,
    message: string,
    payload = null,
  ) => {
    if (this.config.interfaces.console) {
      const styling = this._getColor('yellow', '')
      const icon = this._getIcon(type)

      this._writeConsoleMessage(
        type,
        `< ${puppetId.toUpperCase()} >`,
        message,
        payload,
        styling,
        icon,
      )
    }
  }

  play = (
    type: LoggerType,
    stageId: string,
    message: string,
    payload = null,
  ) => {
    if (this.config.interfaces.console) {
      const styling = this._getColor('red', '')
      const icon = this._getIcon(type)

      this._writeConsoleMessage(
        type,
        `< ${stageId.toUpperCase()} >`,
        message,
        payload,
        styling,
        icon,
      )
    }
  }

  user = (
    type: LoggerType,
    userId: string,
    message: string,
    payload = null,
  ) => {
    if (!this.config.showUser) {
      return
    }

    if (this.config.interfaces.console) {
      const styling = this._getColor('cyan', '')
      const icon = this._getIcon(type)

      this._writeConsoleMessage(
        type,
        `< ${userId.toUpperCase()} >`,
        message,
        payload,
        styling,
        icon,
      )
    }
  }
}
