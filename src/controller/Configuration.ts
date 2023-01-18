import Constant from '@/utils/constants'
import Store from '@/utils/session'

type Value = KeyValue<any>

export default class Configuration {
  config: Value

  localStore = new Store<Value>(Constant.configKey, 'local')

  constructor() {
    this.config = {}
    this.init()
  }

  async init() {
    this.config = (await this.localStore.get()) || {}
  }

  setConfig = async (conf: Value): Promise<Value> => {
    const config = Object.assign(this.config, conf)
    this.localStore.set(config)
    return config
  }

  getConfig = async (): Promise<Value> => {
    return this.config
  }

  reset = () => {
    this.localStore.remove()
  }
}
