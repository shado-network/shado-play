export type PlayInstance = {
  runtime: PlayRuntime
  config: PlayConfig
}

export type PlayRuntime = {
  id: string
  //
  planner?: undefined | unknown
}

export type PlayConfig = {
  id: string
  name: string
  //
  planner: {
    provider: 'shado-planner-htn' | 'shado-planner-sm' | 'shado-planner-bt'
    config: {
      goals?: any[]
      // goals?: HtnGoal[]
      [key: string]: any
    }
  }
}
