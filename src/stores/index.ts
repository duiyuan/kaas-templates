import json from 'json-bigint'

import { store as appStore } from './appStore'
import { store as localeStore } from './localeStore'

import getRuntimeConn, { RuntimeConnector } from '@/utils/runtime'

interface Idata {
  [key: string]: any
}

export class RootStore {
  public appStore
  public localeStore
  public runtime: RuntimeConnector

  constructor() {
    this.appStore = appStore
    this.localeStore = localeStore

    this.runtime = getRuntimeConn()
    this.runtime.connect()
    this.runtime.port?.onMessage.addListener((message: any) => {
      const { method, response } = json.parse(message)
      if (method === 'diox_pong') {
        setTimeout(
          () => this.keeplive(this.runtime.port!, response.count),
          30000
        )
      }
    })
    this.keeplive(this.runtime.port!, 0)
  }

  register = <T = KeyValue<any>>(
    method: string,
    data: T,
    callback: (res: any) => any
  ) => {
    return this.runtime.register(method, data, callback)
  }

  postMessage = (method: string, data: any): Promise<any> => {
    return this.runtime.postMessage(method, data)
  }

  keeplive = (port: chrome.runtime.Port, count: number) => {
    const originalData = {
      method: 'diox_ping',
      params: { count },
    }
    const formatedData = json.stringify(originalData)
    port?.postMessage(formatedData)
    // console.log('keeplive ping', new Date(), count)
  }
}

export const rootStore = new RootStore()
