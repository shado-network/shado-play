export type CoreLog = {
  type: 'SUCCESS' | 'WARNING' | 'ERROR' | 'INFO' | 'LOG'
  source: 'SERVER' | 'STAGE' | 'PUPPET' | 'WORLD' | 'AGENT' | 'USER'
  stageId?: string
  puppetId?: string
  userId?: string
  message: string
  payload?: null | unknown
}

export class CoreLogger {
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
        //
        default: '\x1b[37m',
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
        //
        default: '\x1b[47m',
        clear: '',
      },
    },
  }

  icons = {
    success: '🟢',
    warning: '🟠',
    danger: '🔴',
    info: '🔵',
    //
    default: '⚪️',
  }

  //

  constructor(interfaceIds: string[]) {
    if (interfaceIds.includes('console')) {
      this.config.interfaces.console = true
    }

    this.send({
      type: 'SUCCESS',
      source: 'SERVER',
      message: 'Started CoreLogger',
    })
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

  _getIcon = (type: string) => {
    const icon = this.icons[type.toLowerCase()] || this.icons.default

    if (this.config.icons) {
      return `${icon} `
    } else {
      return ''
    }
  }

  _writeConsoleMessage = ({
    type,
    message,
    payload,
    header,
    styling,
    icon,
  }: {
    type: CoreLog['type']
    message: CoreLog['message']
    payload: CoreLog['payload']
    header: string
    styling: string
    icon: string
  }) => {
    console.log(styling, header, this._resetColor(), `${icon}${type}`)
    payload ? console.log('', message, payload) : console.log('', message)
    console.log('')
  }

  //

  send = ({
    type,
    source,
    stageId,
    puppetId,
    userId,
    message,
    payload = null,
  }: CoreLog) => {
    if (this.config.interfaces.console) {
      let styling: string
      let icon: string
      let header: string

      switch (source) {
        case 'SERVER':
          styling = this._getColor('green', '')
          icon = this._getIcon(type)
          header = '[ SERVER ]'
          break
        case 'STAGE':
          styling = this._getColor('blue', '')
          icon = this._getIcon(type)
          header = `[ STAGE / ${stageId.toUpperCase()} ]`
          break
        case 'PUPPET':
          styling = this._getColor('magenta', '')
          icon = this._getIcon(type)
          header = `[ PUPPET / ${puppetId.toUpperCase()} ]`
          break
        //
        case 'WORLD':
          styling = this._getColor('red', '')
          icon = this._getIcon(type)
          header = `< ${stageId.toUpperCase()} >`
          break
        case 'AGENT':
          styling = this._getColor('yellow', '')
          icon = this._getIcon(type)
          header = `< ${puppetId.toUpperCase()} >`
          break
        case 'USER':
          styling = this._getColor('cyan', '')
          icon = this._getIcon(type)
          header = `< ${userId.toUpperCase()} >`
          break
        //
        default:
          styling = this._getColor('default', '')
          icon = this._getIcon('default')
          header = '[ LOG ]'
          break
      }

      if (type === 'ERROR') {
        styling = this._getColor('black', 'red')
        icon = this._getIcon(type)
        // header = '[ ERROR ]'
      }

      this._writeConsoleMessage({
        type,
        message,
        payload,
        header,
        styling,
        icon,
      })
    }
  }
}
