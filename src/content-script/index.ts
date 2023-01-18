import { createScript } from '@/utils/jsonp'

class ContentScript {
  private currentConnection = true
  private locked = false
  private port: chrome.runtime.Port | null = null

  constructor() {
    this.createScript()
    this.connect()
    this.onMessage()
  }

  get requestAccountUrl() {
    return chrome.runtime.getURL('/popup.html#/login')
  }

  // 注入 content-script.js 配合 dioxide-provide 触发一次 dioxide#initialized
  createScript = () => {
    createScript(chrome.runtime.getURL('inpage.js'), true, () => {
      window.dispatchEvent(new CustomEvent('dioxide#initialized', {}))
    })
  }

  // 由于掉线自动锁屏, background 不能触发 锁屏事件
  // 该事件又 content-script 监听 断连事件后抛出
  autoLockWhenDisconnect = () => {
    // 防止重复断连后重复抛锁屏事件
    if (this.locked !== true) {
      this.locked = true
      console.log('content-script 自行抛出锁屏事件')
      window.postMessage({
        method: 'diox#lockStatusChanged',
        result: true,
      })
    }
  }

  // 连接 background.js
  // 接受 background.js 主动推送的消息，原封不动往 webpage 透传
  connect = () => {
    this.port = chrome.runtime.connect({ name: 'diox-contentscript-port' })
    this.port.onMessage.addListener((message: DioxWallet.MessageData) => {
      // content-script 内部锁屏状态更新
      const { method, result } = message
      if (method === 'diox#lockStatusChanged') {
        this.locked = result
      }
      // 透传消息至inpage
      window.postMessage(message)
    })

    this.port.onDisconnect.addListener(() => {
      // window.postMessage({
      //   method: 'diox#disconnect',
      //   result: false,
      // })
      window.postMessage({
        method: 'diox#operationTimeout',
        result: null,
      })
      this.currentConnection = false
      this.connect()
      this.autoLockWhenDisconnect()
      // window.postMessage({
      //   method: 'diox#connect',
      //   result: true,
      // })
    })
    this.currentConnection = true
  }

  handleInpageMessageComing = (event: MessageEvent) => {
    // We only accept messages from ourselves
    if (event.source != window) {
      console.log('event source not window')
      return
    }

    const { method, from } = event.data
    // 收到 content-script 自己发往 webpage 的消息 直接跳过
    if (method?.startsWith?.('diox#')) {
      return false
    }

    // 监听从 webpage 发来的事件，转发到 background.js, 获得 background 响应再转发给 webpage
    if (method?.startsWith?.('diox_') && from === 'diox-inpage') {
      // console.log('[contentscript receive message come from page]', event.data)

      chrome.runtime.sendMessage(event.data, (response) => {
        response = response || {}
        response.from = 'diox-contentscript'
        // console.log('[contentscript send message to page]', response)
        window.postMessage(response)
      })
    }
  }

  onMessage = () => {
    // 监听来自inpage.js 的消息，过滤后，往background.js 传递
    // 收到bacground.js 的响应后，回传 inpage.js
    window.addEventListener('message', this.handleInpageMessageComing, false)
  }

  // checkConnection = () => {
  //   const payload = { method: 'diox_connection' }
  //   chrome.runtime.sendMessage(
  //     payload,
  //     (response: DioxWallet.MessageData<boolean>) => {
  //       let feedback: any = {}
  //       console.log('content-script connection', response?.result, new Date())
  //       const connection = !!response?.result
  //       // 断线重连
  //       if (!connection) {
  //         feedback.method = 'diox#disconnect'
  //         contentScript.connect()
  //         console.log('content-script do connect again!')
  //       } else {
  //         feedback.method = 'diox#connect'
  //       }
  //       // 已连接
  //       feedback = Object.assign({}, response, feedback)
  //       if (this.currentConnection !== connection) {
  //         this.currentConnection = connection
  //         window.postMessage(feedback)
  //       }
  //     }
  //   )
  // }
}

const contentScript = new ContentScript()

// 轮询连接状态，若 background.js 曾经发生断连(局部变量会别重置)，
// 重新执行 content-script 和 background.js 之间的连接
// setInterval(() => {
//   contentScript.checkConnection()
// }, 10 * 1000)

export default contentScript
