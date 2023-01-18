import makeError from './ErrorMaker'

export { StandardCode } from './ErrorMaker'

export interface Options {
  message?: string
  code: number
  data?: unknown
}

export default class ProviderError {
  code: number
  data: any
  message?: string
  stack?: string
  name: string

  constructor(option: Options) {
    const { message, code, data } = option
    this.message = message
    this.code = code
    this.data = data
    this.stack = new Error().stack
    this.name = 'ProviderError'
  }

  toString = () => {
    return this.name + ':' + this.message
  }

  toJson = () => {
    return makeError(this.code, null, this.message)
  }
}
