import { SimpleEventEmiter } from '@/utils/emiter'
import Constant from '@/utils/constants'

const PendingConnectWindow = 'pending_connect_window'
const PendingTxWindow = 'pending_tx_window'

export default class WindowManager {
  emiter = new SimpleEventEmiter()

  members = new Map<string, chrome.windows.Window>()

  get connectionPageUrl() {
    return chrome.runtime.getURL('/popup.html#/connect')
  }

  getConfirmTxUrl(requestid = '', route = '/confirm/transfer') {
    const url = chrome.runtime.getURL(
      `/popup.html#${route}?${
        requestid ? Constant.dappRequestId + '=' + requestid : ''
      }`
    )
    return url
  }

  constructor() {
    this.init()
  }

  private init() {
    chrome.windows.onRemoved.addListener(
      (id) => {
        this.emiter.emit(String(id), id)
        for (const [name, window] of this.members) {
          if (window.id === id) {
            this.members.delete(name)
          }
        }
      },
      {
        windowTypes: ['popup'],
      }
    )
  }

  async getWindowOption(
    url: string,
    screenWidth: number
  ): Promise<chrome.windows.CreateData> {
    // windows下打开的窗口会少14px
    const popWidth = navigator.appVersion?.match(/[W|w]indows/) ? 394 : 380
    return chrome.system.display.getInfo().then((display) => {
      const { width } = display[0].bounds
      const left = width - popWidth
      return {
        url,
        top: 0,
        left: left,
        type: 'popup',
        focused: true,
        width: popWidth,
        height: 630,
      }
    })
  }

  private getWindowByName = (
    name: string
  ): chrome.windows.Window | undefined => {
    return this.members.get(name)
  }

  onRemove = (id: number, callback: () => void, once: boolean) => {
    this.emiter.on(id + '', callback, { once })
  }

  closeWindow(id: number) {
    return chrome.windows.remove(id).catch((ex) => {})
  }

  private create = (
    name: string,
    options: chrome.windows.CreateData
  ): Promise<chrome.windows.Window> => {
    return chrome.windows.create(options).then((window) => {
      this.members.set(name, window)
      return window
    })
  }

  createPendingConnectWindow = async (screenWidth: number) => {
    const options = await this.getWindowOption(
      this.connectionPageUrl,
      screenWidth
    )
    return this.create(PendingConnectWindow, options)
  }

  getPendingConnectWindow = (): chrome.windows.Window | undefined => {
    return this.getWindowByName(PendingConnectWindow)
  }

  createPendingTxWindow = async (param: {
    requestid?: string
    screenWidth: number
    route: string
  }) => {
    const { requestid, route, screenWidth } = param
    const options = await this.getWindowOption(
      this.getConfirmTxUrl(requestid, route),
      screenWidth
    )
    return this.create(PendingTxWindow, options)
  }

  getPendingTxWindow = (): chrome.windows.Window | undefined => {
    return this.getWindowByName(PendingTxWindow)
  }

  closeAllWindows = () => {
    for (const [_, window] of this.members) {
      if (typeof window.id !== 'undefined') {
        this.closeWindow(window.id)
      }
    }
  }
}
