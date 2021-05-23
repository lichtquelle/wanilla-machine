export type Obj = { [key: string]: string }

export interface MiddlewareOptions {
  root: string
  debug?: boolean
  dev?: boolean
}

export interface BracketsOptions {
  layout: string
  debug?: boolean
  markdown?: string
  config?: Obj
  yaml?: Obj
  root: string
}
