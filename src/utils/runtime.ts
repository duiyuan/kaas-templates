import single from './singleton'

export class RuntimeConnector {
  name = 'popup'
  port: chrome.runtime.Port | null = null

  dependencies: Map<string, (...args: any[]) => any>

  constructor() {
    this.dependencies = new Map()
  }

  connect = () => {
    this.port = chrome.runtime.connect({ name: this.name })
    this.onDisconnect()
    this.onMessage()
  }

  postMessage = (method: string, data: any): Promise<any> => {
    return new Promise((resolve) => {
      const formatedData = JSON.stringify({
        method: method,
        params: data,
      })
      this.dependencies.set(method, resolve)
      this.port!.postMessage(formatedData)
    })
  }

  register = <T = KeyValue<any>>(
    method: string,
    data: T,
    callback: (res: any) => any
  ) => {
    const formatedData = JSON.stringify({
      method: method,
      params: data,
    })
    this.dependencies.set(method, callback)
    return () => {
      this.port!.postMessage(formatedData)
    }
  }

  private onDisconnect = () => {
    this.port!.onDisconnect.addListener(() => {
      console.log('Receive disconnect event in root store')
      this.connect()
    })
  }

  private onMessage = () => {
    this.port!.onMessage.addListener((message: any) => {
      try {
        message = typeof message === 'string' ? JSON.parse(message) : message
        const { method, response } = message
        if (this.dependencies.has(method)) {
          const callback = this.dependencies.get(method)
          if (callback) {
            callback.call(null, response)
          }
        }
      } catch (error) {
        console.error('chrome.onmessage in runtime cause error: ' + error)
      }
    })
  }
}

const connector = single(RuntimeConnector)

export default connector
