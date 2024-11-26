export type PuppetDefinition = {
  id: string
  name: string
  //
  agentProvider: 'shado' | 'eliza'
  modelProvider: 'openai' | 'anthropic'
  //
  bio: string[]
  //
  twitter?: {
    username: string
  }
}
